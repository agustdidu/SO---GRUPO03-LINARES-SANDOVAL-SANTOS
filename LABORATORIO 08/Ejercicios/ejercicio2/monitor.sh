#!/bin/bash

while true
do
    if [ -f temperatura.txt ]; then
        temp=$(cat temperatura.txt)
        echo "Temperatura actual: $temp °C"
    else
        echo "Archivo no encontrado"
    fi

    sleep 2
done

