import time
import Adafruit_ADS1x15

# Crear un objeto ADC
adc = Adafruit_ADS1x15.ADS1115(busnum=1)

# Definir la ganancia (ajustar seg�n el rango de voltaje del sensor)
GAIN = 1

# Canal donde est� conectado el sensor (A0)
channel = 0

# Valores calibrados para tu sensor
<<<<<<< Updated upstream
VALOR_SECO = 17570  
VALOR_HUMEDO = 7290  
=======
VALOR_SECO = 17570  # Ajusta este valor con pruebas (sensor al aire libre)
VALOR_HUMEDO = 7290  # Ajusta este valor con pruebas (sensor en agua)
>>>>>>> Stashed changes

# Funci�n para leer el valor anal�gico y convertirlo a porcentaje
def leer_humedad():
    # Lee el valor en el canal deseado
    valor_analogico = adc.read_adc(channel, gain=GAIN)
    print(f"Valor anal�gico crudo: {valor_analogico}")

    # Normalizar al rango de 0% (seco) a 100% (h�medo)
    if valor_analogico > VALOR_SECO:
        valor_analogico = VALOR_SECO  # Limitar al m�ximo seco
    elif valor_analogico < VALOR_HUMEDO:
        valor_analogico = VALOR_HUMEDO  # Limitar al m�nimo h�medo

    humedad = 100 * (VALOR_SECO - valor_analogico) / (VALOR_SECO - VALOR_HUMEDO)
    return humedad

# Bucle principal para leer la humedad cada 2 segundos
try:
    while True:
        humedad = leer_humedad()
        print(f"Humedad del suelo: {humedad:.2f}%")
        time.sleep(2)

except KeyboardInterrupt:
    print("Lectura interrumpida por el usuario.")
