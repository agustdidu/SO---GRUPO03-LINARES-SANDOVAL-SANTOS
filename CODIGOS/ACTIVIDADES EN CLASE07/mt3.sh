#!/bin/bash

# Declaración con declare
declare -a arreglo=("EPICS" "UCSM" "Arequipa")

echo  "Ejemplo 2"
for elemento in "${arreglo[@]}"
do
echo "$elemento"
done 

