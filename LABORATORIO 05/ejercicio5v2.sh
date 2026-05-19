#!/bin/bash

echo "Mostrando contenido de tu directorio personal..."

for item in ~/*
do
    if [ -d "$item" ]; then
        echo "Directorio: $(basename "$item")"
    elif [ -f "$item" ]; then
        echo "Archivo: $(basename "$item")"
    fi
done
