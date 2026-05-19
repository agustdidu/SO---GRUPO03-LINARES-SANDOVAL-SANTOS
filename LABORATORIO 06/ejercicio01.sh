#!/bin/bash

read -p "Ingresa una palabra: " palabra

regex1='m.m'
regex2='^[aA].*[0-9].*L$'
regex3='^.{10}$'
regex4='^[aeiouAEIOU]+$'

if [[ $palabra =~ $regex1 ]]; then
    echo "✔ Tiene dos 'm' separadas por una letra"
else
    echo "✘ No cumple condición de las 'm'"
fi

if [[ $palabra =~ $regex2 ]]; then
    echo "✔ Empieza con a/A, tiene un número y termina en L"
else
    echo "✘ No cumple estructura a...numero...L"
fi

if [[ $palabra =~ $regex3 ]]; then
    echo "✔ Tiene exactamente 10 caracteres"
else
    echo "✘ No tiene 10 caracteres"
fi

if [[ $palabra =~ $regex4 ]]; then
    echo "✔ Contiene solo vocales"
else
    echo "✘ No contiene solo vocales"
fi
