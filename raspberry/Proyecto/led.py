import RPi.GPIO as GPIO

# Configuraci�n del pin GPIO
PIN_LED = 27  # Cambia este n�mero al pin GPIO que est�s utilizando

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_LED, GPIO.OUT)

def encender_led(estado):
    """
    Enciende o apaga el LED seg�n el estado proporcionado.
    :param estado: True para encender el LED, False para apagarlo.
    """
    GPIO.output(PIN_LED, GPIO.HIGH if estado else GPIO.LOW)

# Ejemplo de uso:
encender_led(True)   # Enciende el LED
# encender_led(False)  # Apaga el LED
