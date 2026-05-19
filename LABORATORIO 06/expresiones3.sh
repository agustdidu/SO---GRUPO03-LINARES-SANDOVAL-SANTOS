#!/bin/bash

# Pedir datos
read -p "Ingrese fecha (YYYYMMDD): " fecha
read -p "Ingrese DNI (10 dígitos): " dni
read -p "Ingrese password: " password

# Regex
fechaRegex='^(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$'
dniRegex='^[0-9]{10}$'

echo ""
echo "Validando..."

# Fecha
[[ $fecha =~ $fechaRegex ]] && echo "Fecha OK" || echo "Fecha MAL"

# DNI
[[ $dni =~ $dniRegex ]] && echo "DNI OK" || echo "DNI MAL"

# Password
if [[ ${#password} -ge 6 &&
      $password =~ [A-Z] &&
      $password =~ [0-9] &&
      $(echo "$password" | grep -o '[^a-zA-Z0-9]' | wc -l) -ge 2 ]]; then
  echo "Password OK"
else
  echo "Password MAL"
fi

