#!/bin/bash

echo "Ingresa una palabra o frase:"
read texto

contador=0

texto=$(echo "$texto" | tr 'A-Z' 'a-z')

for ((i=0; i<${#texto}; i++))
do
    letra=${texto:$i:1}
    if [[ "$letra" == "a" || "$letra" == "e" || "$letra" == "i" || "$letra" == "o" || "$letra" == "u" ]]; then
        contador=$((contador+1))
    fi
done

echo "Cantidad de vocales: $contador"

echo "Cantidad de vocales: $contador" > vocales.txt
echo "Guardado en vocales.txt"

