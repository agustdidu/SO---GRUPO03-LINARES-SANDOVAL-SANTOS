#!/bin/bash
declare -a lenguajes
echo "=== Registro de Lenguajes de Programación ==="
contador=0
while [ $contador -lt 5 ]
do
 read -p "Ingrese lenguaje $((contador+1)): " leng
 # Validar vacío
 if [ -z "$leng" ]; then
 echo " No se permiten valores vacíos"
 continue
 fi
 # Validar repetidos
 repetido=false
 for l in "${lenguajes[@]}"
 do
 if [ "$l" == "$leng" ]; then
 repetido=true
 break
 fi
 done
 if [ "$repetido" = true ]; then
 echo " Lenguaje repetido, intenta otro"
 continue
 fi
 # Guardar en el arreglo
 lenguajes[$contador]=$leng
 ((contador++))
done
echo ""
echo " Lenguajes ingresados:"
for l in "${lenguajes[@]}"
do
 echo "- $l"
done
echo ""
echo " Total de lenguajes: ${#lenguajes[@]}"
echo ""
echo " Lenguajes ordenados alfabéticamente:"
printf "%s\n" "${lenguajes[@]}" | sort

