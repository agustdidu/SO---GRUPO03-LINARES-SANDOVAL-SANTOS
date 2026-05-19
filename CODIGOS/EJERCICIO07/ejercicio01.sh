#!/bin/bash

arreglo=("manzana" "banana" "cereza" "durazno" "uva")

echo "Arreglo original:"
echo "${arreglo[@]}"

indice_penultimo=$((${#arreglo[@]} - 2))

unset arreglo[$indice_penultimo]

arreglo=("${arreglo[@]}")

echo "Arreglo después de eliminar el penúltimo elemento:"
echo "${arreglo[@]}"
