#include <stdio.h>
#include <pthread.h>

// Función que ejecutará el hilo
void* mensaje(void* arg) {
    printf("Soy un hilo creado en C\n");
    return NULL;
}

int main() {

    // Variable para identificar el hilo
    pthread_t hilo;

    // Crear el hilo
    pthread_create(&hilo, NULL, mensaje, NULL);

    // Esperar a que el hilo termine
    pthread_join(hilo, NULL);

    // Mensaje final del programa principal
    printf("Fin del programa principal\n");

    return 0;
}
