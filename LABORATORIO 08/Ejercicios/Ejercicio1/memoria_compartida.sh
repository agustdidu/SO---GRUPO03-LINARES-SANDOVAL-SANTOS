#!/bin/bash

# Archivo temporal en memoria RAM
MEMORIA="/dev/shm/mensaje_ipc.txt"

# Crear proceso hijo
(
    # Espera a que el padre escriba el mensaje
    sleep 1
    echo "Proceso hijo leyendo desde memoria compartida..."
    echo "Mensaje recibido: $(cat "$MEMORIA")"
    # El hijo termina
    exit 0
) &

PID_HIJO=$!

# Proceso padre escribe en la memoria compartida
echo "Proceso padre escribiendo en memoria compartida..."
echo "Hola hijo, este mensaje está en /dev/shm" > "$MEMORIA"

# Esperar al hijo
wait "$PID_HIJO"

# Eliminar archivo compartido
rm "$MEMORIA"

echo "Memoria compartida liberada."
