#!/bin/bash
declare -a nombres
declare -a telefonos

echo "=== Registro de 10 Personas ==="
# Registrar datos
for ((i=0; i<10; i++))
do
    echo ""
    read -p "Ingrese nombre de la persona $((i+1)): " nombres[$i]
    read -p "Ingrese teléfono de ${nombres[$i]}: " telefonos[$i]
done
echo ""
echo "=== Búsqueda de Teléfono ==="
read -p "Ingrese el nombre a buscar: " buscar

encontrado=false

for ((i=0; i<10; i++))
do
    if [ "${nombres[$i]}" = "$buscar" ]; then
        echo "Teléfono de $buscar: ${telefonos[$i]}"
        encontrado=true
        break
    fi
done

if [ "$encontrado" = false ]; then
    echo "Persona no encontrada."
fi
