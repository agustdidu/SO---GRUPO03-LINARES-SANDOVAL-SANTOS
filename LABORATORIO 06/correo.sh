#!/bin/bash
# Variable de prueba (simula lo que ingresa el usuario)
correo="maferLinares@ucsm.com"

# Expresión regular completa
regex="^[a-zA-Z0-9._%+-]+@empresa\.com$"
# Evaluación usando Bash
if [[ $correo =~ $regex ]]; then
   echo "Correo válido "
else
   echo "Correo inválido "
fi
