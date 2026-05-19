#!/bin/bash

arreglo=("rojo" "azul" "verde" "amarillo" "negro" "blanco")

echo "Arreglo original:"
echo "${arreglo[@]}"


inicio=2
longitud=3

subarreglo=("${arreglo[@]:inicio:longitud}")

echo "Subarreglo extraído:"
echo "${subarreglo[@]}"
