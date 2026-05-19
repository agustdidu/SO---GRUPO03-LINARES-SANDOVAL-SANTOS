#!/bin/bash

# Expresiones regulares
identificacionRegex='^[0-9]{10}$'

# Solo permite EC, CO o US
paisRegex='^(EC|CO|US|PER)$'

# Fecha en formato yyyyMMdd (validación básica)
fechaNacimientoRegex='^(19|20)[0-9]{2}((0[1-9])|(1[0-2]))(([0][1-9])|([12][0-9])|(3[01]))$'

echo "Expresiones Regulares"

read -p "Ingresar una identificación: " identificacion
read -p "Ingresar las iniciales de un país [EC, CO, US, PER]: " pais
read -p "Ingresar la fecha de nacimiento [yyyyMMdd]: " fechaNacimiento

# Validación identificación
if [[ $identificacion =~ $identificacionRegex ]]; then
    echo "Identificación válida ✅"
else
    echo "Identificación inválida ❌"
fi

# Validación país
if [[ $pais =~ $paisRegex ]]; then
    echo "País válido ✅"
else
    echo "País inválido ❌"
fi

# Validación fecha
if [[ $fechaNacimiento =~ $fechaNacimientoRegex ]]; then
    echo "Fecha válida ✅"
else
    echo "Fecha inválida ❌"
fi
