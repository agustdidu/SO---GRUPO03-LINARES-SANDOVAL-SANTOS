#!/bin/bash

echo "Ingrese un número entero positivo:"
read num

factorial=1

for ((i=1; i<=num; i++))
do
    factorial=$((factorial * i))
done

echo "El factorial de $num es: $factorial" > factorial.txt

echo "Resultado guardado en factorial.txt"
