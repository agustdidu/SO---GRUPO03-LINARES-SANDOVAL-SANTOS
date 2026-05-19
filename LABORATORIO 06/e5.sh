#!/bin/bash

read -p "Ingrese declaración de variable: " linea

regex='^(int|float|char|String)[[:space:]]+[a-zA-Z][a-zA-Z0-9_]*([[:space:]]*=[[:space:]]*[a-zA-Z0-9]+)?;$'

if [[ $linea =~ $regex ]]; then
    echo "Declaración válida."
else
    echo "Declaración inválida."
fi
