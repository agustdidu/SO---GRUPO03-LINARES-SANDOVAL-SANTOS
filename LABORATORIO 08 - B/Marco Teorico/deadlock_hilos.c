#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

// Recursos compartidos
pthread_mutex_t recursoA;
pthread_mutex_t recursoB;

void* hilo1(void* arg) {
    printf("Hilo 1: bloqueando recurso A...\n");
    pthread_mutex_lock(&recursoA);
    printf("Hilo 1: recurso A bloqueado.\n");

    sleep(1);

    printf("Hilo 1: intentando bloquear recurso B...\n");
    pthread_mutex_lock(&recursoB);
    printf("Hilo 1: recurso B bloqueado.\n");

    printf("Hilo 1: usando recurso A y B.\n");

    pthread_mutex_unlock(&recursoB);
    pthread_mutex_unlock(&recursoA);

    return NULL;
}

void* hilo2(void* arg) {
    printf("Hilo 2: bloqueando recurso B...\n");
    pthread_mutex_lock(&recursoB);
    printf("Hilo 2: recurso B bloqueado.\n");

    sleep(1);

    printf("Hilo 2: intentando bloquear recurso A...\n");
    pthread_mutex_lock(&recursoA);
    printf("Hilo 2: recurso A bloqueado.\n");

    printf("Hilo 2: usando recurso B y A.\n");

    pthread_mutex_unlock(&recursoA);
    pthread_mutex_unlock(&recursoB);

    return NULL;
}

int main() {
    pthread_t h1, h2;

    pthread_mutex_init(&recursoA, NULL);
    pthread_mutex_init(&recursoB, NULL);

    pthread_create(&h1, NULL, hilo1, NULL);
    pthread_create(&h2, NULL, hilo2, NULL);

    pthread_join(h1, NULL);
    pthread_join(h2, NULL);

    pthread_mutex_destroy(&recursoA);
    pthread_mutex_destroy(&recursoB);

    printf("Programa finalizado.\n");

    return 0;
}
