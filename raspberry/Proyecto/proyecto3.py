import time
import datetime
import Adafruit_ADS1x15
import RPi.GPIO as GPIO
import dht11
from azure.iot.device import IoTHubDeviceClient, Message
from azure.storage.blob import BlobServiceClient
from picamera2 import Picamera2

IOT_HUB_CONNECTION_STRING = "HostName=CropData.azure-devices.net;DeviceId=ras_1;SharedAccessKey=jd2Gc81JRmib4Xi72yQRUcM/n7bwJYHSkLmZJpmJffc="
BLOB_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=datacrop;AccountKey=LAr6eQ7W40a9CZaV1lygm61fGKgpHrl1wpuz609THDTlr7zesmw7GViB451yg+VbuVsSuZsTcju8+AStxV7kFg==;EndpointSuffix=core.windows.net"
CONTAINER_NAME = "cropimage"


# IDs estaticos
ID_RANCHO = "cm3t8vdck0000132acstlekuj"
ID_CROP = "cm3t93jz20003132a1t9jyywo"

# Configuracion de ADC para sensor de humedad del suelo
VALOR_SECO = 17570  # Ajustar segun pruebas
VALOR_HUMEDO = 7290  # Ajustar segun pruebas
GAIN = 1
CHANNEL = 0

def inicializar_gpio():
    """Configura los pines GPIO."""
    GPIO.setwarnings(True)
    GPIO.setmode(GPIO.BCM)

def inicializar_adc():
    """Devuelve una instancia configurada del ADC."""
    return Adafruit_ADS1x15.ADS1115(busnum=1)

def inicializar_azure():
    """Inicializa los clientes de Azure IoT Hub y Blob Storage."""
    iot_client = IoTHubDeviceClient.create_from_connection_string(IOT_HUB_CONNECTION_STRING)
    blob_service_client = BlobServiceClient.from_connection_string(BLOB_STORAGE_CONNECTION_STRING)
    return iot_client, blob_service_client

def configurar_camara():
    """Configura y devuelve una instancia de la camara."""
    cam = Picamera2()
    cam.configure(cam.create_still_configuration())
    cam.start()
    return cam

def leer_humedad_suelo(adc):
    """Lee la humedad del suelo y la normaliza a un porcentaje."""
    valor_analogico = adc.read_adc(CHANNEL, gain=GAIN)
    valor_analogico = min(max(valor_analogico, VALOR_HUMEDO), VALOR_SECO)
    humedad = 100 * (VALOR_SECO - valor_analogico) / (VALOR_SECO - VALOR_HUMEDO)
    return round(humedad, 2)

def capturar_imagen(cam, ruta_imagen):
    """Captura una imagen usando la camara y la guarda en la ruta especificada."""
    cam.capture_file(ruta_imagen)
    print(f"Imagen capturada: {ruta_imagen}")

def subir_imagen(blob_service_client, ruta_imagen):
    """Sube la imagen a Azure Blob Storage y devuelve la URL."""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    blob_name = f"{timestamp}.jpg"
    try:
        with open(ruta_imagen, "rb") as data:
            blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)
            blob_client.upload_blob(data, overwrite=True)
            print(f"Imagen '{blob_name}' subida exitosamente.")
            return blob_client.url
    except Exception as e:
        print(f"Error al subir la imagen: {e}")
        return None

def enviar_datos_a_azure(iot_client, temperatura, humedad_aire, humedad_suelo, url_imagen):
    """Envia los datos a Azure IoT Hub."""
    mensaje = Message(f'{{"id_rancho": "{ID_RANCHO}", "id_crop": "{ID_CROP}", "temperatura": {temperatura}, "humedad_aire": {humedad_aire}, "humedad_suelo": {humedad_suelo}, "url_imagen": "{url_imagen}"}}')
    iot_client.send_message(mensaje)
    print(f"Mensaje enviado a IoT Hub: {mensaje}")

# Programa principal
try:
    print("Iniciando sistema...")
    inicializar_gpio()
    adc = inicializar_adc()
    iot_client, blob_service_client = inicializar_azure()
    cam = configurar_camara()

    print("Conectando a Azure IoT Hub...")
    iot_client.connect()
    print("Conexion exitosa.")

    sensor = dht11.DHT11(pin=18)
    while True:
        result = sensor.read()
        if result.is_valid():
            temperatura = result.temperature
            humedad_aire = result.humidity
            humedad_suelo = leer_humedad_suelo(adc)

            print("Lectura valida:")
            print(f"Temperatura: {temperatura} °C, Humedad del aire: {humedad_aire} %, Humedad del suelo: {humedad_suelo} %")

            # Capturar imagen
            ruta_imagen = f"/home/pi/Documents/Proyecto/Images/{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            capturar_imagen(cam, ruta_imagen)

            # Subir imagen a Azure Blob Storage
            url_imagen = subir_imagen(blob_service_client, ruta_imagen)
            if url_imagen:
                enviar_datos_a_azure(iot_client, temperatura, humedad_aire, humedad_suelo, url_imagen)

        time.sleep(5)  # Ciclo de lectura cada 5 segundos

except KeyboardInterrupt:
    print("Interrumpido por el usuario.")

finally:
    print("Apagando camara y limpiando GPIO...")
    cam.stop()
    iot_client.disconnect()
    GPIO.cleanup()
