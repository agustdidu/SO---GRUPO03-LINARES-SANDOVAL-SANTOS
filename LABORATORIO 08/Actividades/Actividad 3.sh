#!/bin/bash

trap 'echo "Señal recibida: terminando correctamente"; exit' SIGTERM

echo "Proceso receptor iniciado"
echo "PID del proceso: $$"

while true
do
    echo "Esperando señal..."
    sleep 3
done
