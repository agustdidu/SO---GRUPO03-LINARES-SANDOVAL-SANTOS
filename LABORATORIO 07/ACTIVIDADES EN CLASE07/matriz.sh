#!/bin/bash

# Matriz 2x3 -> 2 filas, 3 columnas
filas=2
columnas=3

# Arreglo plano
matriz=(1 2 3 4 5 6)

echo "Matriz:"

for ((i=0; i<filas; i++))
do
    for ((j=0; j<columnas; j++))
    do
        indice=$((i*columnas + j))
        echo -n "${matriz[$indice]} "
    done
    echo ""
done
