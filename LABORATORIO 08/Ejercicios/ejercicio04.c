#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main() {
    int fd[2];
    pid_t pid;
    char nombre[50];

    pipe(fd);
    pid = fork();

    if (pid > 0) {

        close(fd[0]);

        printf("Ingresa tu nombre: ");
        fgets(nombre, sizeof(nombre), stdin);

        write(fd[1], nombre, strlen(nombre) + 1);

        close(fd[1]);
    } else {

        char buffer[50];

        close(fd[1]);

        read(fd[0], buffer, sizeof(buffer));

        printf("Hola, %sSoy el proceso hijo.\n", buffer);

        close(fd[0]);
    }

    return 0;
}
