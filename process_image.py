import sys
import base64
from PIL import Image
import io

def process_image(image_data):
    # Aquí debes implementar la lógica para procesar la imagen.
    # Por ejemplo, puedes aplicar filtros, reconocimiento de objetos, etc.
    image = Image.open(io.BytesIO(image_data))
    #SOLO PRUEBAS#
    # Obtén los datos de la imagen en bytes
    image_bytes = io.BytesIO()
    image.save(image_bytes, format=image.format)
    image_bytes = image_bytes.getvalue()

    # Convierte los bytes a una cadena hexadecimal
    hex_string = image_bytes.hex()

    # Obtener los primeros 7 caracteres de la cadena hexadecimal
    first_7_chars = hex_string[:7]
    # Realiza el procesamiento de la imagen aquí
    result = "Processed Image{}".format(first_7_chars)
    return result

if __name__ == '__main__':
    temp_file_path = sys.argv[1]
    with open(temp_file_path, 'r') as file:
        base64_data = file.read()
    image_data = base64.b64decode(base64_data)
    result = process_image(image_data)
    print(result)
