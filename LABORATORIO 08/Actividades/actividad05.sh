#!/bin/bash

# Archivo ubicado en memoria RAM
MEMORIA="/dev/shm/mensaje_compartido.txt"

# ------------------------------------
# Proceso lector / hijo
# ------------------------------------
(
    echo "Proceso lector iniciado..."
    echo "Esperando mensaje del proceso escritor..."

    # Espera hasta que el archivo exista
    while [ ! -f "$MEMORIA" ]; do
        sleep 1
    done

    # Lee el mensaje desde la memoria compartida
    mensaje=$(cat "$MEMORIA")

    echo "Proceso lector recibió: $mensaje"
) &

PID_LECTOR=$!

# ------------------------------------
# Proceso escritor / padre
# ------------------------------------
echo "Proceso escritor preparando mensaje..."
sleep 2

echo "Hola, este mensaje fue escrito en memoria compartida" > "$MEMORIA"

echo "Proceso escritor envió el mensaje."

# Esperar a que el lector termine
wait "$PID_LECTOR"

# Liberar memoria compartida
rm "$MEMORIA"

echo "Memoria compartida liberada."
