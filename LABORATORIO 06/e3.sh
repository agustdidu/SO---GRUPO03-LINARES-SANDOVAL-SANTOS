#!/bin/bash

read -p "Ingrese una URL: " url

# Expresión regular
regex='^https?:\/\/[a-zA-Z][a-zA-Z\/]*$'

if [[ $url =~ $regex ]]; then
    echo "URL válida."
else
    echo "URL inválida."
fi
