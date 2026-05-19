#!/bin/bash

read -p "Ingrese una palabra: " palabra

echo "---- RESULTADOS ----"

# 1. Dos letras m separadas por una letra cualquiera
if [[ $palabra =~ m.m ]]; then
    echo "1) Sí tiene dos letras m separadas por un carácter."
else
    echo "1) No cumple."
fi

# 2. Empieza con a o A, tiene al menos un dígito y termina en L
if [[ $palabra =~ ^[aA].*[0-9].*L$ ]]; then
    echo "2) Cumple  condición a/A + número + termina en L."
else
    echo "2) No cumple."
fi

# 3. Tiene exactamente 10 caracteres
if [[ $palabra =~ ^.{10}$ ]]; then
    echo "3) Tiene 10 caracteres."
else
    echo "3) No tiene 10 caracteres."
fi

# 4. Solo vocales
if [[ $palabra =~ ^[aeiouAEIOU]+$ ]]; then
    echo "4) Contiene solo vocales."
else
    echo "4) No contiene solo vocales."
fi
