import time
import Adafruit_ADS1x15

# Crear un objeto ADC
adc = Adafruit_ADS1x15.ADS1115(busnum=1)

# Definir la ganancia (opcional, ajusta dependiendo del rango de voltaje de tu sensor)
GAIN = 1  # Puedes probar con 1, 2, 4, 8, 16 dependiendo del rango de voltaje

# Canal donde est� conectado el sensor (puedes elegir A0, A1, A2, A3)
channel = 0  # A0

# Funci�n para leer el valor anal�gico y convertirlo a porcentaje
def leer_humedad():
    # Lee el valor en el canal deseado
    valor_analogico = adc.read_adc(channel, gain=GAIN)
    
    # Imprimir el valor crudo
    print(f"Valor anal�gico crudo: {valor_analogico}")

    # Convertir el valor a un rango de 0 a 100 (ajusta seg�n los valores de tu sensor)
    # Dependiendo de tu sensor y pruebas de calibraci�n, ajusta los valores m�nimo y m�ximo.
    # A continuaci�n se hace una normalizaci�n b�sica, el rango puede variar.
    humedad = (valor_analogico / 32767.0) * 100
    
    return humedad

# Bucle principal para leer la humedad cada 2 segundos
try:
    while True:
        humedad = leer_humedad()
        print(f"Humedad del suelo: {humedad:.2f}%")
        time.sleep(2)  # Espera de 2 segundos antes de la siguiente lectura

except KeyboardInterrupt:
    print("Lectura interrumpida por el usuario.")