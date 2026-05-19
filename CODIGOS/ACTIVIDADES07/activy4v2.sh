#!/usr/bin/env bash

# Definir arreglo
arreglo=("cero" "uno" "dos" "tres")

echo " Arreglo original:"
echo "${arreglo[@]}"

# Mostrar índices disponibles
echo ""
echo "Índices disponibles:"

for i in "${!arreglo[@]}"
do
    echo "[$i] -> ${arreglo[$i]}"
done

# Pedir índice a eliminar
read -p "Ingrese el índice a eliminar: " indice

# Validar si existe
if [ -z "${arreglo[$indice]}" ]; then
    echo " Índice no válido"
else
    unset arreglo[$indice]
    echo " Elemento eliminado"
fi

# Mostrar arreglo actualizado
echo ""
echo " Arreglo actualizado:"
echo "${arreglo[@]}"

# Mostrar cantidad de elementos
echo ""
echo " Número de elementos restantes: ${#arreglo[@]}"
