#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <pthread.h>

// Función que ejecutará el hilo
void* tarea_hilo(void* arg) {

    for (char c = 'A'; c <= 'E'; c++) {
        printf("Hilo: %c\n", c);
    }
    return NULL;
}
int main() {
    pid_t pid;
    pthread_t hilo;
    printf("PROGRAMA PRINCIPAL\n");
    // Crear proceso hijo
    pid = fork();
    if (pid < 0) {
        printf("Error al crear el proceso hijo.\n");
        return 1;
    } else if (pid == 0) {
        // Código del proceso hijo
        for (int i = 1; i <= 5; i++) {
            printf("Proceso hijo: %d\n", i);
        }
        return 0;
    } else {
        // El padre espera al hijo
        wait(NULL);
        // Crear hilo dentro del proceso padre
        pthread_create(&hilo, NULL, tarea_hilo, NULL);
        // Esperar que termine el hilo
        pthread_join(hilo, NULL);
        printf("Proceso padre finalizado.\n");
    }
    return 0;
}
