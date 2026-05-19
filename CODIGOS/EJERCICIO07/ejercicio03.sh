#!/bin/bash

read -p "Ingrese el número de alumnos: " n

if [ "$n" -le 0 ]; then
    echo "Número inválido."
    exit 1
fi

notas=()

for ((i=0; i<n; i++)); do
    read -p "Ingrese la nota del alumno $((i+1)): " nota
    notas+=("$nota")
done

suma=0
for nota in "${notas[@]}"; do
    suma=$(echo "$suma + $nota" | bc)
done

promedio=$(echo "scale=2; $suma / $n" | bc)

echo "Notas ingresadas: ${notas[@]}"
echo "Promedio del salón: $promedio"
