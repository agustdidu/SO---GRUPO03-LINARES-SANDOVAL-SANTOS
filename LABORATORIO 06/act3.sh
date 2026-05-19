#!/bin/bash

# Verificar que se pasen los 3 parámetros
if [ "$#" -ne 3 ]; then
  echo "Uso: $0 <fechaNacimiento YYYYMMDD> <DNI> <password>"
  exit 1
fi

fecha="$1"
dni="$2"
password="$3"

# Regex
fechaRegex='^(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$'
dniRegex='^[0-9]{10}$'
passwordRegex='^(?=(.*[A-Z]))(?=(.*[0-9]))(?=(.*[^a-zA-Z0-9].*[^a-zA-Z0-9])).{6,}$'

# Validación fecha
if [[ $fecha =~ $fechaRegex ]]; then
  echo "Fecha válida"
else
  echo "Fecha inválida"
fi

# Validación DNI
if [[ $dni =~ $dniRegex ]]; then
  echo "DNI válido"
else
  echo "DNI inválido"
fi

# Validación contraseña
if [[ $password =~ $passwordRegex ]]; then
  echo "Contraseña válida"
else
  echo "Contraseña inválida"
fi

