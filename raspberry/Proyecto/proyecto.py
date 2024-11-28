import RPi.GPIO as GPIO
import dht11
import time
import datetime
from azure.iot.device import IoTHubDeviceClient, Message
from azure.storage.blob import BlobServiceClient
from picamera2 import Picamera2

# Configuraci�n de conexi�n para Azure IoT Hub y Blob Storage
IOT_HUB_CONNECTION_STRING = "HostName=CropData.azure-devices.net;DeviceId=ras_1;SharedAccessKey=jd2Gc81JRmib4Xi72yQRUcM/n7bwJYHSkLmZJpmJffc="
BLOB_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=datacrop;AccountKey=LAr6eQ7W40a9CZaV1lygm61fGKgpHrl1wpuz609THDTlr7zesmw7GViB451yg+VbuVsSuZsTcju8+AStxV7kFg==;EndpointSuffix=core.windows.net"
CONTAINER_NAME = "cropimage"

# Inicializa cliente para IoT Hub y Blob Storage
iot_client = IoTHubDeviceClient.create_from_connection_string(IOT_HUB_CONNECTION_STRING)
blob_service_client = BlobServiceClient.from_connection_string(BLOB_STORAGE_CONNECTION_STRING)

# Configuraci�n de GPIO y sensor DHT11
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)
sensor = dht11.DHT11(pin=18)

# Configuraci�n de c�mara
cam = Picamera2()

# Funci�n para enviar datos de temperatura, humedad, fecha y URL de imagen a Azure IoT Hub
def enviar_datos_a_azure(temperatura, humedad, url_imagen, fecha_iso):
    mensaje = Message(f'{{"temperatura": {temperatura}, "humedad": {humedad}, "url_imagen": "{url_imagen}", "fecha": "{fecha_iso}"}}')
    iot_client.send_message(mensaje)
    print(f"Mensaje enviado a IoT Hub: {mensaje}")

# Funci�n para capturar y subir una imagen a Azure Blob Storage
def capturar_y_subir_imagen():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"/home/pi/Documents/Proyecto/Images/{timestamp}.jpg"

    # Configura la c�mara para capturar im�genes
    cam.configure(cam.create_still_configuration())

    try:
        cam.start()
        time.sleep(1)  # Espera breve para estabilizar la c�mara
        cam.capture_file(file_path)
        print(f"Imagen capturada: {file_path}")
    finally:
        cam.stop()

    # Sube la imagen a Blob Storage y retorna la URL
    blob_name = f"{timestamp}.jpg"
    try:
        with open(file_path, "rb") as data:
            blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)
            blob_client.upload_blob(data, overwrite=True)
            print(f"Imagen '{blob_name}' subida exitosamente.")
            print(f"URL de la imagen: {blob_client.url}")
            return blob_client.url  # Retorna la URL de la imagen
    except Exception as e:
        print(f"Error al subir la imagen: {e}")
        return None

# Programa principal
try:
    print("Conectando a Azure IoT Hub...")
    iot_client.connect()
    print("Conexi�n exitosa. Enviando datos y capturando im�genes...")

    while True:
        # Lee datos del sensor DHT11
        result = sensor.read()
        if result.is_valid():
            temperatura = result.temperature
            humedad = result.humidity
            fecha_iso = datetime.datetime.now().isoformat()
            print("�ltima lectura v�lida:", fecha_iso)
            print(f"Temperatura: {temperatura} �C")
            print(f"Humedad: {humedad} %")
            
            # Capturar y subir imagen
            url_imagen = capturar_y_subir_imagen()
            if url_imagen:
                # Enviar datos de sensor, URL de imagen y fecha a IoT Hub
                enviar_datos_a_azure(temperatura, humedad, url_imagen, fecha_iso)
        
        # Espera 5 segundos antes de la siguiente lectura
        time.sleep(5)

except KeyboardInterrupt:
    print("Interrumpido por el usuario.")

finally:
    print("Deteniendo c�mara y desconectando...")
    cam.stop()
    iot_client.disconnect()
    GPIO.cleanup()
