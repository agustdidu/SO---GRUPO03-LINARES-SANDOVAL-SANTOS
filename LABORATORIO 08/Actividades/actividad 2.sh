#!/bin/bash

echo "Proceso escritor: generando mensaje..."
echo "Hola, soy el proceso A enviando información" > mensaje_ipc.txt

echo "Proceso lector: leyendo mensaje..."
cat mensaje_ipc.txt
