#include <stdio.h>
#include <pthread.h>

void* tarea_hilo(void* arg) {
printf("Hola, soy un hilo ejecutándose dentro del proceso.\n");
return NULL;
}
int main() {
pthread_t hilo;
pthread_create(&hilo, NULL, tarea_hilo, NULL);
pthread_join(hilo, NULL);
printf("Programa principal finalizado.\n");
return 0;
}
