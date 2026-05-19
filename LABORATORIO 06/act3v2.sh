#!/bin/bash

echo "==============================="
echo " VALIDADOR DE DATOS (BASH)"
echo "==============================="

# Verificar parámetros
if [ "$#" -ne 3 ]; then
  echo "Error: Debes ingresar 3 parámetros"
  echo "Uso: $0 <fechaNacimiento YYYYMMDD> <DNI> <password>"
  exit 1
fi

fecha="$1"
dni="$2"
password="$3"

echo ""
echo "Datos recibidos:"
echo "Fecha: $fecha"
echo "DNI: $dni"
echo "Password: ********"
echo ""

# Regex
fechaRegex='^(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$'
dniRegex='^[0-9]{10}$'

echo "Validando fecha..."
if [[ $fecha =~ $fechaRegex ]]; then
  echo "✔ Fecha válida"
else
  echo "✘ Fecha inválida (formato correcto: YYYYMMDD)"
fi

echo ""
echo "Validando DNI..."
if [[ $dni =~ $dniRegex ]]; then
  echo "✔ DNI válido"
else
  echo "✘ DNI inválido (debe tener exactamente 10 dígitos)"
fi

echo ""
echo "Validando contraseña..."

# Validación paso a paso
valida=true

# Longitud
if [ ${#password} -lt 6 ]; then
  echo "✘ Debe tener al menos 6 caracteres"
  valida=false
fi

# Mayúscula
if [[ ! $password =~ [A-Z] ]]; then
  echo "✘ Debe contener al menos una letra mayúscula"
  valida=false
fi

# Número
if [[ ! $password =~ [0-9] ]]; then
  echo "✘ Debe contener al menos un número"
  valida=false
fi

# Caracteres especiales (mínimo 2)
especiales=$(echo "$password" | grep -o '[^a-zA-Z0-9]' | wc -l)
if [ "$especiales" -lt 2 ]; then
  echo "✘ Debe contener al menos 2 caracteres especiales"
  valida=false
fi

# Resultado final
if [ "$valida" = true ]; then
  echo "✔ Contraseña válida"
else
  echo "✘ Contraseña inválida"
fi

echo ""
echo "Validación finalizada"
