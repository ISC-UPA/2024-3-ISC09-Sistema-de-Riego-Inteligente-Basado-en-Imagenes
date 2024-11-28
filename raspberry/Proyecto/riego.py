import time
import datetime
import Adafruit_ADS1x15
import RPi.GPIO as GPIO
import dht11
from azure.iot.device import IoTHubDeviceClient, Message
from azure.storage.blob import BlobServiceClient
from picamera2 import Picamera2

# Configuraci�n de pines

PIN_LED = 27   # Pin GPIO conectado al LED

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_LED, GPIO.OUT)


def encender_led(estado):
    GPIO.output(PIN_LED, GPIO.HIGH if estado else GPIO.LOW)

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

# Configuración de ADC para el sensor de humedad del suelo
adc = Adafruit_ADS1x15.ADS1115(busnum=1)
GAIN = 1
channel = 0

# Valores calibrados para el sensor de humedad del suelo
VALOR_SECO = 17570  # Ajusta este valor con pruebas (sensor al aire libre)
VALOR_HUMEDO = 7290  # Ajusta este valor con pruebas (sensor en agua)

# Función para leer la humedad del suelo
def leer_humedad_suelo():
    valor_analogico = adc.read_adc(channel, gain=GAIN)
    if valor_analogico > VALOR_SECO:
        valor_analogico = VALOR_SECO
    elif valor_analogico < VALOR_HUMEDO:
        valor_analogico = VALOR_HUMEDO

    humedad = 100 * (VALOR_SECO - valor_analogico) / (VALOR_SECO - VALOR_HUMEDO)
    return round(humedad, 2)

# Función para leer los datos del sensor DHT11
def leer_datos_aire():
    result = sensor.read()
    if result.is_valid():
        return result.temperature, result.humidity
    return None, None

# Función para activar el riego si la humedad del suelo es baja
def activar_riego(humedad_suelo):
    if humedad_suelo < 20:
        print("Humedad muy baja, activando riego...")
        encender_led(True)  # Encender el LED
    elif humedad_suelo > 60:
        print("Humedad muy alta, desactivando riego...")
        encender_led(True)  # Encender el LED
    else:
        print("Humedad en rango optimo, desactivando riego.")
        encender_led(False)  # Apagar el LED
        

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

# Función para enviar los datos a Azure IoT Hub
def enviar_datos_a_azure(temperatura, humedad_aire, humedad_suelo, url_imagen):
    mensaje = Message(f'{{"id_crop": "cm3t93jz20003132a1t9jyywo", "temperatura": {temperatura}, "humedad_aire": {humedad_aire}, "humedad_suelo": {humedad_suelo}, "url_imagen": "{url_imagen}"}}')
    iot_client.send_message(mensaje)
    print(f"Mensaje enviado a IoT Hub: {mensaje}")

# Programa principal
try:
    print("Conectando a Azure IoT Hub...")
    iot_client.connect()
    print("Conexión exitosa. Enviando datos y controlando riego...")

    while True:
        # Lee los datos de los sensores
        temperatura, humedad_aire = leer_datos_aire()
        humedad_suelo = leer_humedad_suelo()

        if temperatura is not None and humedad_aire is not None:
            print(f"Temperatura: {temperatura} °C")
            print(f"Humedad del aire: {humedad_aire} %")
            print(f"Humedad del suelo: {humedad_suelo} %")

            # Control de riego
            activar_riego(humedad_suelo)

            # Captura y sube la imagen
            url_imagen = capturar_y_subir_imagen()

            if url_imagen:
                # Envía los datos a Azure IoT Hub
                enviar_datos_a_azure(temperatura, humedad_aire, humedad_suelo, url_imagen)

        time.sleep(5)  # Espera 5 segundos antes de la siguiente lectura

except KeyboardInterrupt:
    print("Interrumpido por el usuario.")

except Exception as e:
    print(f"Error inesperado: {e}")

finally:
    print("Apagando cámara y limpiando GPIO...")
    try:
        cam.stop()
    except Exception as e:
        print(f"Error al detener la cámara: {e}")
    try:
        iot_client.disconnect()
    except Exception as e:
        print(f"Error al desconectar IoT Hub: {e}")
    GPIO.cleanup()
