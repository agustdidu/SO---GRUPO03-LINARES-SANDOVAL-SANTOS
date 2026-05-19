#!/bin/bash
archivo="ciudades.txt"
temp="temp.txt"
peruanas="Lima Arequipa Cusco Trujillo Piura"

> $temp

while read ciudad
do
    encontrada=0

    for c in $peruanas
    do
        if [ "$ciudad" = "$c" ]; then
            echo "$ciudad se encuentra en Perú" >> $temp
            encontrada=1
            break
        fi
    done

    if [ $encontrada -eq 0 ]; then
        echo "Se encontró la ciudad: $ciudad" >> $temp
    fi
done < $archivo
cat $temp >> $archivo
rm $temp
