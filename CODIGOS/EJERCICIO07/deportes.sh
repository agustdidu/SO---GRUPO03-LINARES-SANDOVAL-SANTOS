#!/bin/bash

# Declaración correcta del arreglo
declare -a deportes=(
[0]="voley"
[1]="futbol"
[2]="natacion"
[3]="ajedrez"
)

# Mostrar todo el arreglo
echo "Lista de deportes:"
echo "${deportes[@]}"

echo "------------------------"
# Acceder a un elemento específico
echo "Deporte en la posición 1:"
echo "${deportes[1]}"

echo "------------------------"
# Recorrer el arreglo
echo "Recorriendo deportes:"
for deporte in "${deportes[@]}"
do
    echo "- $deporte"
done

echo "------------------------"
# Mostrar tamaño del arreglo
echo "Cantidad de deportes:"
echo "${#deportes[@]}"
