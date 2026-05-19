#!/bin/bash

# Mensaje que enviará el proceso padre
mensaje="Hola hijo, mensaje desde el proceso padre"

# Crear una tubería anónima usando echo y read
echo "$mensaje" | (
    # Este bloque representa al proceso hijo
    read buffer
    echo "Proceso hijo recibió: $buffer"
)
