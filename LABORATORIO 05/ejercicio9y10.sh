#!/bin/bash

echo "Ingresa el nombre del archivo:"
read archivo

if [ -f "$archivo" ]; then
    echo "El archivo existe. Contenido:"

    while read linea
    do
        echo "$linea"
    done < "$archivo"
else
    echo "El archivo no existe. Se creara el archivo."
    echo "Escribe el texto:"
    cat > "$archivo"

    echo "Archivo creado."
fi
