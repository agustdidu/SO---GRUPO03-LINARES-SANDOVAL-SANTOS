#include <stdio.h>
#include <pthread.h>

int contador = 0;
pthread_mutex_t bloqueo;

void* incrementar(void* arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&bloqueo);
        contador++;
        pthread_mutex_unlock(&bloqueo);
    }
    return NULL;
}

int main() {
    pthread_t h1, h2;

    pthread_mutex_init(&bloqueo, NULL);

    pthread_create(&h1, NULL, incrementar, NULL);
    pthread_create(&h2, NULL, incrementar, NULL);

    pthread_join(h1, NULL);
    pthread_join(h2, NULL);

    pthread_mutex_destroy(&bloqueo);

    printf("Valor final del contador: %d\n", contador);

    return 0;
}
