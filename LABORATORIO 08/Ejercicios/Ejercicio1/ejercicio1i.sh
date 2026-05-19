#!/bin/bash
total=$(ps aux | wc -l)
echo "Total de procesos activos: $total"
echo $total > procesos.txt
echo "Archivo procesos.txt generado correctamente"
