#!/bin/bash

read -p "Ingrese una dirección IP: " ip

# Expresión regular
regex='^([0-9]{1,3}\.){3}[0-9]{1,3}$'

if [[ $ip =~ $regex ]]; then
    echo "IP válida."
else
    echo "IP inválida."
fi
