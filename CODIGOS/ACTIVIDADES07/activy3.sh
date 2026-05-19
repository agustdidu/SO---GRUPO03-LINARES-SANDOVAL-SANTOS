#!/bin/bash
# Definir arreglo
arreglo=("Python" "Java" "C++" "Go" "Rust")
echo " Elementos del arreglo:"
echo "${arreglo[@]}"
# Obtener número de elementos
cantidad=${#arreglo[@]}
echo ""
echo " El número de elementos del arreglo es: $cantidad"
