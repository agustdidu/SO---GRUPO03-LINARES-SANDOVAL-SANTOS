#!/bin/bash

edadRegex='^(1[8-9]|[2-6][0-9]|70)$'

dniRegex='^[0-9]{8}$'

listaRegex='^([1-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|250)$'


read -p "Ingrese edad (18-70): " edad
read -p "Ingrese DNI: " dni
read -p "Ingrese número de orden (1-250): " lista


if [[ $edad =~ $edadRegex ]] && [[ $dni =~ $dniRegex ]] && [[ $lista =~ $listaRegex ]]; then
    echo "apto para votar "
else
    echo "no apto para votar"
    
    if [[ ! $edad =~ $edadRegex ]]; then
        echo "- Edad fuera del rango obligatorio (18-70 años)."
    fi
    if [[ ! $dni =~ $dniRegex ]]; then
        echo "- El DNI debe tener exactamente 8 dígitos."
    fi
    if [[ ! $lista =~ $listaRegex ]]; then
        echo "- El número de lista debe estar entre 1 y 250."
    fi
fi
