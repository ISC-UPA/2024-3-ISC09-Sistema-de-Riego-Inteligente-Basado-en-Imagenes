import time
import datetime
import Adafruit_ADS1x15
import RPi.GPIO as GPIO
import dht11
from azure.iot.device import IoTHubDeviceClient, Message
from azure.storage.blob import BlobServiceClient
from picamera2 import Picamera2

# Configuración de conexión para Azure IoT Hub y Blob Storage
IOT_HUB_CONNECTION_STRING = "HostName=CropData.azure-devices.net;DeviceId=ras_1;SharedAccessKey=jd2Gc81JRmib4Xi72yQRUcM/n7bwJYHSkLmZJpmJffc="
BLOB_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=datacrop;AccountKey=LAr6eQ7W40a9CZaV1lygm61fGKgpHrl1wpuz609THDTlr7zesmw7GViB451yg+VbuVsSuZsTcju8+AStxV7kFg==;EndpointSuffix=core.windows.net"
CONTAINER_NAME = "cropimage"

# Inicializa cliente para IoT Hub y Blob Storage
iot_client = IoTHubDeviceClient.create_from_connection_string(IOT_HUB_CONNECTION_STRING)
blob_service_client = BlobServiceClient.from_connection_string(BLOB_STORAGE_CONNECTION_STRING)

# Configuración de GPIO y sensor DHT11
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)
sensor = dht11.DHT11(pin=18)

# Configuración de cámara
cam = Picamera2()

 #Configuración de ADC para el sensor de humedad del suelo
adc = Adafruit_ADS1x15.ADS1115(busnum=1)
GAIN = 1
channel = 0

# Valores calibrados para el sensor de humedad del suelo
VALOR_SECO = 17570  # Valor máximo (sensor al aire libre)
VALOR_HUMEDO = 7290  # Valor mínimo (sensor en agua)

# Funci�n para leer la humedad del suelo
def leer_humedad_suelo():
    valor_analogico = adc.read_adc(channel, gain=GAIN)
    print(f"Valor anal�gico crudo del sensor de suelo: {valor_analogico}")

    # Normalizar al rango de 0% (seco) a 100% (humedo)
    if valor_analogico > VALOR_SECO:
        valor_analogico = VALOR_SECO
    elif valor_analogico < VALOR_HUMEDO:
        valor_analogico = VALOR_HUMEDO

    humedad = 100 * (VALOR_SECO - valor_analogico) / (VALOR_SECO - VALOR_HUMEDO)
    return round(humedad, 2)

# Función para capturar y subir una imagen a Azure Blob Storage
def capturar_y_subir_imagen():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"/home/pi/Documents/Proyecto/Images/{timestamp}.jpg"

    cam.configure(cam.create_still_configuration())
    try:
        cam.start()
        time.sleep(1)  # Espera breve para estabilizar la cámara
        cam.capture_file(file_path)
        print(f"Imagen capturada: {file_path}")
    finally:
        cam.stop()

    blob_name = f"{timestamp}.jpg"
    try:
        with open(file_path, "rb") as data:
            blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)
            blob_client.upload_blob(data, overwrite=True)
            print(f"Imagen '{blob_name}' subida exitosamente.")
            return blob_client.url
    except Exception as e:
        print(f"Error al subir la imagen: {e}")
        return None

# Función para enviar datos a Azure IoT Hub
def enviar_datos_a_azure(temperatura, humedad_aire, humedad_suelo, url_imagen, fecha_iso):
    mensaje = Message(f'{{"temperatura": {temperatura}, "humedad_aire": {humedad_aire}, "humedad_suelo": {humedad_suelo}, "url_imagen": "{url_imagen}", "fecha": "{fecha_iso}"}}')
    iot_client.send_message(mensaje)
    print(f"Mensaje enviado a IoT Hub: {mensaje}")

# main
try:
    print("Conectando a Azure IoT Hub...")
    iot_client.connect()
    print("Conexión exitosa. Enviando datos y capturando imágenes...")

    while True:
        # Lee datos del sensor DHT11
        result = sensor.read()
        if result.is_valid():
            temperatura = result.temperature
            humedad_aire = result.humidity
            humedad_suelo = leer_humedad_suelo()
            fecha_iso = datetime.datetime.now().isoformat()

            print("Última lectura válida:", fecha_iso)
            print(f"Temperatura: {temperatura} °C")
            print(f"Humedad del aire: {humedad_aire} %")
            print(f"Humedad del suelo: {humedad_suelo} %")

            # Capturar y subir imagen
            url_imagen = capturar_y_subir_imagen()
            if url_imagen:
                # Enviar datos a Azure IoT Hub
                enviar_datos_a_azure(temperatura, humedad_aire, humedad_suelo, url_imagen, fecha_iso)

        # Espera 5 segundos antes de la siguiente lectura
        time.sleep(2)

except KeyboardInterrupt:
    print("Interrumpido por el usuario.")

finally:
    print("Deteniendo cámara y desconectando...")
    cam.stop()
    iot_client.disconnect()
GPIO.cleanup()