#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <pthread.h>

void* tarea_hilo(void* arg) {
    printf("HILO: ejecutándose dentro del mismo proceso.\n");
    printf("HILO: PID del proceso que contiene al hilo: %d\n",
getpid());
    return NULL;
}
int main() {
    pid_t pid;
    pthread_t hilo;

    printf("PROGRAMA PRINCIPAL\n");
    printf("PID del proceso principal: %d\n\n", getpid());

    // Crear un proceso hijo
    pid = fork();

    if (pid < 0) {
        printf("Error al crear el proceso hijo.\n");
        return 1;
    }
    if (pid == 0) {
        // Código del proceso hijo
        printf("PROCESO HIJO: soy un proceso independiente.\n");
        printf("PROCESO HIJO: mi PID es: %d\n", getpid());
        printf("PROCESO HIJO: el PID de mi padre es: %d\n\n",
getppid());
        return 0;
    } else {
        // Código del proceso padre
        wait(NULL);
	// crear un hilo dentro del proceso padre
	pthread_create(&hilo, NULL, tarea_hilo, NULL);
	pthread_join(hilo, NULL);
	printf("\nPROCESO PADRE: finalizando ejecución.\n");
	}
	return 0;
}
