#!/bin/bash

trap 'echo "Solicitud recibida desde otro proceso"' SIGUSR1

echo "Servidor iniciado"
echo "PID del proceso: $$"

while true
do
    echo "Servidor en espera..."
    sleep 3
done
