#!/bin/bash

for item in /home/*
do
    if [ -d "$item" ]; then
        echo "Directorio: $(basename "$item")"
    elif [ -f "$item" ]; then
        echo "Archivo: $(basename "$item")"
    fi
done
