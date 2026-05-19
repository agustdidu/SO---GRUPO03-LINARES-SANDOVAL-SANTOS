#!/bin/bash

read -p "Ingrese código de producto: " codigo

# Expresión regular
regex='^[A-Z]{3}-[0-9]{4}[A-Z]?$'

if [[ $codigo =~ $regex ]]; then
    echo "Código válido."
else
    echo "Código inválido."
fi
