#!/bin/bash

# Declaración directa
arreglo=("EPIS" "Linux Mint" "Bash")

echo "=== Ejemplo 3 ==="
#el # antes del arreglo es para obtener la longitud del arreglo
echo "Cantidad de elementos: ${#arreglo[@]}"

#el ! es para obtener la lista de indices 
for i in "${!arreglo[@]}"
do
    echo "Posicion $i: ${arreglo[$i]}"
done
