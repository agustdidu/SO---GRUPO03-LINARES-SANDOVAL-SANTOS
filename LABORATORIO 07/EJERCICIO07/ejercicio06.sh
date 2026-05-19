#!/bin/bash
declare -a ventas
filas=2
columnas=2
totalGeneral=0

echo "=== Registro de Ventas ==="
# Ingreso de datos
for ((i=0; i<filas; i++))
do
    for ((j=0; j<columnas; j++))
    do
        read -p "Ingrese venta de Sucursal $((i+1)) Día $((j+1)): " valor
        ventas[$((i*columnas+j))]=$valor
    done
done
echo "=== Matriz de Ventas ==="
# Mostrar matriz y total por sucursal
for ((i=0; i<filas; i++))
do
    totalSucursal=0
    for ((j=0; j<columnas; j++))
    do
        dato=${ventas[$((i*columnas+j))]}
        echo -n "$dato  "
        totalSucursal=$((totalSucursal + dato))
    done

    echo " | Total Sucursal $((i+1)): $totalSucursal"
    totalGeneral=$((totalGeneral + totalSucursal))
done
echo ""
echo "Total General de Ventas: $totalGeneral"
