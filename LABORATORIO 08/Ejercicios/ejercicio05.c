#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <unistd.h>

int main() {

    int shmid = shmget(IPC_PRIVATE, sizeof(int), IPC_CREAT | 0666);
    if (shmid < 0) {
        perror("shmget");
        exit(1);
    }

    int *ptr = (int *) shmat(shmid, NULL, 0);
    if (ptr == (int *) -1) {
        perror("shmat");
        exit(1);
    }

    *ptr = 10;
    printf("Padre escribió: %d\n", *ptr);

    shmdt(ptr);

    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        exit(1);
    }

    if (pid == 0) {

        int *hijo_ptr = (int *) shmat(shmid, NULL, 0);
        if (hijo_ptr == (int *) -1) {
            perror("shmat hijo");
            exit(1);
        }

        printf("Hijo leyó: %d\n", *hijo_ptr);
        (*hijo_ptr)++;
        printf("Hijo incrementó: %d\n", *hijo_ptr);

        shmdt(hijo_ptr);
        exit(0);
    } else {

        wait(NULL);


        shmctl(shmid, IPC_RMID, NULL);
        printf("Segmento de memoria compartida eliminado.\n");
    }

    return 0;
}
