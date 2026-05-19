#!/bin/bash

# Expresiones regulares corregidas
identificacionRegex='^[0-9]{10}$'

# Solo permite EC, CO o US (no cualquier combinación tipo AE o CU)
paisRegex='^(PER|EC|CO|US)$'

# Fecha en formato yyyyMMdd (validación básica de estructura)
fechaNacimientoRegex='^(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$'

echo "Expresiones Regulares"

read -p "Ingresar una identificación: " identificacion
read -p "Ingresar las iniciales de un país [PER|EC, CO, US]: " pais
read -p "Ingresar la fecha de nacimiento [yyyyMMdd]: " fechaNacimiento

# Validaciones
if [[ $identificacion =~ $identificacionRegex ]]; then
    echo "Identificación válida ✅"
else
    echo "Identificación inválida ❌"
fi

if [[ $pais =~ $paisRegex ]]; then
    echo "País válido ✅"
else
    echo "País inválido ❌"
fi

if [[ $fechaNacimiento =~ $fechaNacimientoRegex ]]; then
    echo "Fecha válida ✅"
else
    echo "Fecha inválida ❌"
fi
