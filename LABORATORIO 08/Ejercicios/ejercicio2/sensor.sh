#!/bin/bash

while true
do
    temperatura=$(( RANDOM % 16 + 20 ))

    echo $temperatura > temperatura.txt

    echo "Temperatura generada: $temperatura °C"

    sleep 2
done
