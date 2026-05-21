#include <stdio.h>
#include <pthread.h>
// Función del primer hilo
void* imprimir_numeros(void* arg) {
    for (int i = 1; i <= 5; i++) {
        printf("Número: %d\n", i);
    }
    return NULL;
}
// Función del segundo hilo
void* imprimir_letras(void* arg) {

    for (char c = 'A'; c <= 'E'; c++) {
        printf("Letra: %c\n", c);
    }

    return NULL;
}

int main() {
    // Variables para los hilos
    pthread_t h1, h2;
    // Crear los dos hilos
    pthread_create(&h1, NULL, imprimir_numeros, NULL);
    pthread_create(&h2, NULL, imprimir_letras, NULL);
    // Esperar que ambos terminen
    pthread_join(h1, NULL);
    pthread_join(h2, NULL);
    printf("Tareas finalizadas.\n");
    return 0;
}
