import time
import datetime
import Adafruit_ADS1x15
import RPi.GPIO as GPIO
import dht11
from azure.iot.device import IoTHubDeviceClient, Message
from azure.storage.blob import BlobServiceClient
from picamera2 import Picamera2
import requests


# ConfiguraciÃ³n de conexiÃ³n para Azure IoT Hub y Blob Storage
IOT_HUB_CONNECTION_STRING = "HostName=CropData.azure-devices.net;DeviceId=ras_1;SharedAccessKey=jd2Gc81JRmib4Xi72yQRUcM/n7bwJYHSkLmZJpmJffc="
BLOB_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=datacrop;AccountKey=LAr6eQ7W40a9CZaV1lygm61fGKgpHrl1wpuz609THDTlr7zesmw7GViB451yg+VbuVsSuZsTcju8+AStxV7kFg==;EndpointSuffix=core.windows.net"
CONTAINER_NAME = "cropimage"

#credenciales de custom vision
CUSTOM_VISION_URL = "https://hectorvision-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/ed973681-2567-40e4-af2e-ce2ebd54edd5/classify/iterations/Iteration1/url"
CUSTOM_VISION_PREDICTION_KEY = "NGXld6gHxi8tCjucc35X3sGKevOw86ITB1HcqxVsUQWEQkp6gbhQJQQJ99AKACYeBjFXJ3w3AAAIACOGLjMj"

# Inicializa cliente para IoT Hub y Blob Storage
iot_client = IoTHubDeviceClient.create_from_connection_string(IOT_HUB_CONNECTION_STRING)
blob_service_client = BlobServiceClient.from_connection_string(BLOB_STORAGE_CONNECTION_STRING)


# Configuracion de pines
PIN_LED = 27  # Pin GPIO conectado al LED

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_LED, GPIO.OUT)

def encender_led(estado):
    GPIO.output(PIN_LED, GPIO.HIGH if estado else GPIO.LOW)

# Configuracion de GPIO y sensor DHT11
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)
sensor = dht11.DHT11(pin=18)

# Configuracion de camara
cam = Picamera2()

# Configuracion de ADC para el sensor de humedad del suelo
adc = Adafruit_ADS1x15.ADS1115(busnum=1)
GAIN = 1
channel = 0

# Valores calibrados para el sensor de humedad del suelo
VALOR_SECO = 17570  # Ajusta este valor con pruebas (sensor al aire libre)
VALOR_HUMEDO = 7290  # Ajusta este valor con pruebas (sensor en agua)

def leer_humedad_suelo():
    valor_analogico = adc.read_adc(channel, gain=GAIN)
    if valor_analogico > VALOR_SECO:
        valor_analogico = VALOR_SECO
    elif valor_analogico < VALOR_HUMEDO:
        valor_analogico = VALOR_HUMEDO

    humedad = 100 * (VALOR_SECO - valor_analogico) / (VALOR_SECO - VALOR_HUMEDO)
    return round(humedad, 2)


def leer_datos_aire():
    result = sensor.read()
    if result.is_valid():
        return result.temperature, result.humidity
    return None, None

def activar_riego(humedad_suelo):
    if humedad_suelo < 20:
        print("Humedad muy baja, activando riego...")
        encender_led(True)
    elif humedad_suelo > 60:
        print("Humedad muy alta, desactivando riego...")
        encender_led(False)
    else:
        print("Humedad en rango optimo, desactivando riego.")
        encender_led(False)

def capturar_y_subir_imagen():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"/home/pi/Documents/Proyecto/Images/{timestamp}.jpg"

    cam.configure(cam.create_still_configuration())
    try:
        cam.start()
        time.sleep(1)
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


def analizar_imagen_custom_vision(url_imagen):
    headers = {
        "Prediction-Key": CUSTOM_VISION_PREDICTION_KEY,
        "Content-Type": "application/json"
    }
    body = {
        "Url": url_imagen
    }

    try:
        response = requests.post(
            f"{CUSTOM_VISION_URL}",
            headers=headers,
            json=body
        )
        response.raise_for_status()
        predictions = response.json()["predictions"]
        return predictions
    except Exception as e:
        print(f"Error al analizar la imagen: {e}")
        return None

def enviar_datos_a_azure(temperatura, humedad_aire, humedad_suelo, url_imagen, mensaje_cultivo, estado_riego):
    mensaje = Message(
        f'{{"id_crop": "cm41yvt5d00024yg6h986dzh2", '
        f'"temperatura": {temperatura}, '
        f'"humedad_aire": {humedad_aire}, '
        f'"humedad_suelo": {humedad_suelo}, '
        f'"url_imagen": "{url_imagen}", '
        f'"estado_cultivo": "{mensaje_cultivo}", '
        f'"estado_riego": "{estado_riego}"}}'
    )
    iot_client.send_message(mensaje)
    print(f"Mensaje enviado a IoT Hub: {mensaje}")

# Codigo con el flujo principal
try:
    print("Conectando a Azure IoT Hub...")
    iot_client.connect()
    print("ConexiÃ³n exitosa. Enviando datos y controlando riego...")

    while True:
        temperatura, humedad_aire = leer_datos_aire()
        humedad_suelo = leer_humedad_suelo()

        if temperatura is not None and humedad_aire is not None:
            print(f"Temperatura: {temperatura} °C")
            print(f"Humedad del aire: {humedad_aire} %")
            print(f"Humedad del suelo: {humedad_suelo} %")

            activar_riego(humedad_suelo)

            # Determinar el estado del riego segÃºn el LED
            estado_riego = "true" if GPIO.input(PIN_LED) else "false"

            url_imagen = capturar_y_subir_imagen()

            mensaje_cultivo = "Sin datos de cultivo."  # Valor predeterminado
            if url_imagen:
                predicciones = analizar_imagen_custom_vision(url_imagen)
                if predicciones:
                    for prediccion in predicciones:
                        etiqueta = prediccion['tagName']
                        probabilidad = prediccion['probability']
                        print(f"Etiqueta: {etiqueta}, Probabilidad: {probabilidad:.2f}")

                        if etiqueta == "Cultivo seco" and probabilidad > 0.5:
                            mensaje_cultivo = "Necesita riego."
                            break
                        elif etiqueta == "Cultivo sano" and probabilidad > 0.5:
                            mensaje_cultivo = "Condiciones optimas."
                            break

                enviar_datos_a_azure(temperatura, humedad_aire, humedad_suelo, url_imagen, mensaje_cultivo, estado_riego)

        time.sleep(5)

except KeyboardInterrupt:
    print("Interrumpido por el usuario.")

except Exception as e:
    print(f"Error inesperado: {e}")

finally:
    print("Apagando cÃ¡mara y limpiando GPIO...")
    try:
        cam.stop()
    except Exception as e:
        print(f"Error al detener la cÃ¡mara: {e}")
    try:
        iot_client.disconnect()
    except Exception as e:
        print(f"Error al desconectar IoT Hub: {e}")
    GPIO.cleanup()
