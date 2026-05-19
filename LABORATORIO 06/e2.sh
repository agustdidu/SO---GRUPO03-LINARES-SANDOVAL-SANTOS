#!/bin/bash

while true
do
    read -s -p "Ingrese contraseña: " clave
    echo

    # contar letras
    letras=$(echo "$clave" | grep -o "[A-Za-z]" | wc -l)

    if [[ $clave =~ [0-9] && $clave =~ [@\$] && $letras -ge 3 ]]; then
        echo "Contraseña válida."
        echo "La contraseña ingresada es: $clave"
        break
    else
        echo "Contraseña inválida. Debe tener:"
        echo "- mínimo 1 número"
        echo "- mínimo 3 letras"
        echo "- símbolo @ o $"
        echo "Intente otra vez."
    fi
done
