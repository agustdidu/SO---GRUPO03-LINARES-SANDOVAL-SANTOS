#!/bin/bash

> numeros.txt

echo "Se generan numeros aleatorios"

for i in $(seq 1 10)
do
    num=$((RANDOM % 100 + 1))
    echo $num >> numeros.txt
done

echo "Numeros generados:"
cat numeros.txt

mayor=0

while read linea
do
    if [ $linea -gt $mayor ]; then
        mayor=$linea
    fi
done < numeros.txt

echo "El numero mayor es: $mayor"
