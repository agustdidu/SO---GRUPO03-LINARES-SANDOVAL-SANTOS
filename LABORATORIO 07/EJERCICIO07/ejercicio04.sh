#!/bin/bash

echo "=== Registro de Temperaturas ==="
# Pedir cantidad de días
read -p "Ingrese el número de días: " dias

# Validar
if ! [[ "$dias" =~ ^[0-9]+$ ]] || [ "$dias" -le 0 ]; then
    echo "Cantidad inválida"
    exit 1
fi

declare -a temperaturas
suma=0

# Ingreso de temperaturas
for ((i=0; i<dias; i++))
do
    read -p "Ingrese temperatura del día $((i+1)): " temp
    temperaturas[$i]=$temp
    suma=$((suma + temp))

    # Inicializar min y max
    if [ $i -eq 0 ]; then
        min=$temp
        max=$temp
    else
        [ $temp -lt $min ] && min=$temp
        [ $temp -gt $max ] && max=$temp
    fi
done

# Calcular promedio
promedio=$((suma / dias))

echo ""
echo "Temperaturas registradas: ${temperaturas[@]}"
echo "Temperatura promedio: $promedio"
echo "Temperatura mínima: $min"
echo "Temperatura máxima: $max"
