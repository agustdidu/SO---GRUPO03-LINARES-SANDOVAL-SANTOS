#!/bin/bash

echo "=== MENÚ DE OPCIONES ==="
echo "1. cp"
echo "2. cat"
echo "3. mv"
read -p "Elija una opción (1-3): " opcion

# Pedir contraseña oculta
read -s -p "Ingrese contraseña: " clave
echo

# Contar letras
letras=$(echo "$clave" | grep -o "[A-Za-z]" | wc -l)

# Validar contraseña
if [[ $clave =~ [0-9] && $clave =~ [@\$] && $letras -ge 3 ]]; then
    echo "Contraseña válida."
    case $opcion in
        1)
            read -p "Archivo origen: " origen
            read -p "Archivo destino: " destino
            cp "$origen" "$destino"
            echo "Archivo copiado."
            ;;
        2)
            read -p "Nombre del archivo: " archivo
            cat "$archivo"
            ;;
        3)
            read -p "Archivo origen: " origen
            read -p "Nuevo nombre o destino: " destino
            mv "$origen" "$destino"
            echo "Archivo movido/renombrado."
            ;;
        *)
            echo "Opción inválida."
            ;;
    esac
else
    echo "Contraseña inválida."
fi
