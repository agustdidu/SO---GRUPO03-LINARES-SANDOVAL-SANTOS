# Crear archivo de texto con números del 1 al 1 000 000

archivo = open("numeros.txt", "w")

for i in range(1, 1000001):
    archivo.write(f"{i};{i}\n")

archivo.close()

print("YUPPI SE HA GENERADO EL ARCHIVO.")
