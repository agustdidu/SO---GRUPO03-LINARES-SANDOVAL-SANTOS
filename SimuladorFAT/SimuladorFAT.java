import java.io.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;


public class SimuladorFAT {

    static final String DB_FILE  = "fat_db.txt";
    static final String SEP      = "|";
    static final String ROOT_ID  = "0";

    static final String RESET    = "\u001B[0m";
    static final String BOLD     = "\u001B[1m";
    static final String CYAN     = "\u001B[36m";
    static final String GREEN    = "\u001B[32m";
    static final String YELLOW   = "\u001B[33m";
    static final String RED      = "\u001B[31m";
    static final String BLUE     = "\u001B[34m";
    static final String MAGENTA  = "\u001B[35m";

    static int GPWD = 0;                          // Directorio actual
    static final ReentrantLock fileLock = new ReentrantLock(true); // Lock 

    static class FATEntry {
        int    id;
        String nombre;
        String tipo;     
        int    padre;
        String permisos;
        String tamano;   

        FATEntry(int id, String nombre, String tipo, int padre, String permisos, String tamano) {
            this.id      = id;
            this.nombre  = nombre;
            this.tipo    = tipo;
            this.padre   = padre;
            this.permisos = permisos;
            this.tamano  = tamano;
        }

        String toLine() {
            return id + SEP + nombre + SEP + tipo + SEP + padre + SEP + permisos + SEP + tamano;
        }

        static FATEntry fromLine(String line) {
            String[] p = line.split("\\|");
            if (p.length < 6) return null;
            return new FATEntry(
                Integer.parseInt(p[0].trim()),
                p[1].trim(),
                p[2].trim(),
                Integer.parseInt(p[3].trim()),
                p[4].trim(),
                p[5].trim()
            );
        }

        @Override
        public String toString() {
            return toLine();
        }
    }

    static List<FATEntry> leerDB() throws IOException {
        List<FATEntry> lista = new ArrayList<>();
        File f = new File(DB_FILE);
        if (!f.exists()) return lista;
        try (BufferedReader br = new BufferedReader(new FileReader(f))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty() && !line.startsWith("#")) {
                    FATEntry e = FATEntry.fromLine(line);
                    if (e != null) lista.add(e);
                }
            }
        }
        return lista;
    }

    static void escribirDB(List<FATEntry> entries) throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(DB_FILE, false))) {
            bw.write("# fat_db.txt - Base de datos del Simulador FAT");
            bw.newLine();
            bw.write("# id | nombre | tipo | padre | permisos | tamano");
            bw.newLine();
            for (FATEntry e : entries) {
                bw.write(e.toLine());
                bw.newLine();
            }
        }
    }

    static int nextId(List<FATEntry> entries) {
        return entries.stream().mapToInt(e -> e.id).max().orElse(-1) + 1;
    }

    static Optional<FATEntry> buscarPorId(List<FATEntry> entries, int id) {
        return entries.stream().filter(e -> e.id == id).findFirst();
    }

    static String getRuta(List<FATEntry> entries, int id) {
        if (id == 0) return "/";
        List<String> partes = new ArrayList<>();
        int cur = id;
        while (cur != 0) {
            final int c = cur;
            Optional<FATEntry> opt = entries.stream().filter(e -> e.id == c).findFirst();
            if (opt.isEmpty()) break;
            partes.add(0, opt.get().nombre);
            cur = opt.get().padre;
        }
        return "/" + String.join("/", partes);
    }

    static void mkdir(String nombre) {
        fileLock.lock();
        try {
            List<FATEntry> entries = leerDB();
            // Verificar que no exista ya en el directorio actual
            boolean existe = entries.stream()
                .anyMatch(e -> e.nombre.equals(nombre) && e.padre == GPWD && e.tipo.equals("DIR"));
            if (existe) {
                System.out.println(RED + "  Error: ya existe un directorio llamado '" + nombre + "'." + RESET);
                return;
            }
            int id = nextId(entries);
            entries.add(new FATEntry(id, nombre, "DIR", GPWD, "rwx", "-"));
            escribirDB(entries);
            System.out.println(GREEN + "  Directorio '" + nombre + "' creado correctamente." + RESET);
        } catch (IOException ex) {
            System.out.println(RED + "  Error al crear directorio: " + ex.getMessage() + RESET);
        } finally {
            fileLock.unlock();
        }
    }

    static void cd(String destino) {
        fileLock.lock();
        try {
            List<FATEntry> entries = leerDB();
            if (destino.equals("..")) {
                if (GPWD == 0) {
                    System.out.println(YELLOW + "  Ya estás en el directorio raíz." + RESET);
                    return;
                }
                Optional<FATEntry> actual = buscarPorId(entries, GPWD);
                actual.ifPresent(e -> {
                    GPWD = e.padre;
                    System.out.println(GREEN + "  Directorio actual cambiado a: " + getRuta(entries, GPWD) + RESET);
                });
            } else {
                Optional<FATEntry> dir = entries.stream()
                    .filter(e -> e.nombre.equals(destino) && e.padre == GPWD && e.tipo.equals("DIR"))
                    .findFirst();
                if (dir.isEmpty()) {
                    System.out.println(RED + "  Error: directorio '" + destino + "' no encontrado." + RESET);
                    return;
                }
                GPWD = dir.get().id;
                System.out.println(GREEN + "  Directorio actual cambiado a: " + getRuta(entries, GPWD) + RESET);
            }
        } catch (IOException ex) {
            System.out.println(RED + "  Error: " + ex.getMessage() + RESET);
        } finally {
            fileLock.unlock();
        }
    }

    static void touch(String nombre) {
        fileLock.lock();
        try {
            List<FATEntry> entries = leerDB();
            boolean existe = entries.stream()
                .anyMatch(e -> e.nombre.equals(nombre) && e.padre == GPWD && e.tipo.equals("FILE"));
            if (existe) {
                System.out.println(YELLOW + "  El archivo '" + nombre + "' ya existe." + RESET);
                return;
            }
            int id = nextId(entries);
            entries.add(new FATEntry(id, nombre, "FILE", GPWD, "rw-", "0"));
            escribirDB(entries);
            System.out.println(GREEN + "  Archivo '" + nombre + "' creado correctamente." + RESET);
        } catch (IOException ex) {
            System.out.println(RED + "  Error al crear archivo: " + ex.getMessage() + RESET);
        } finally {
            fileLock.unlock();
        }
    }

    static void ls() {
        fileLock.lock();
        try {
            List<FATEntry> entries = leerDB();
            List<FATEntry> hijos = entries.stream()
                .filter(e -> e.padre == GPWD)
                .sorted(Comparator.comparing(e -> e.nombre))
                .toList();
            if (hijos.isEmpty()) {
                System.out.println(YELLOW + "  (directorio vacío)" + RESET);
            } else {
                for (FATEntry e : hijos) {
                    String icono = e.tipo.equals("DIR") ? BLUE + "📁 " : CYAN + "📄 ";
                    System.out.println("  " + icono + e.nombre + RESET);
                }
            }
        } catch (IOException ex) {
            System.out.println(RED + "  Error: " + ex.getMessage() + RESET);
        } finally {
            fileLock.unlock();
        }
    }

    static void lsLong() {
        fileLock.lock();
        try {
            List<FATEntry> entries = leerDB();
            List<FATEntry> hijos = entries.stream()
                .filter(e -> e.padre == GPWD)
                .sorted(Comparator.comparing(e -> e.nombre))
                .toList();
            System.out.println(BOLD + CYAN +
                String.format("  %-5s %-6s %-10s %-8s %s", "ID", "TIPO", "PERMISOS", "TAMAÑO", "NOMBRE")
                + RESET);
            System.out.println("  " + "─".repeat(42));
            if (hijos.isEmpty()) {
                System.out.println(YELLOW + "  (directorio vacío)" + RESET);
            } else {
                for (FATEntry e : hijos) {
                    String color = e.tipo.equals("DIR") ? BLUE : CYAN;
                    System.out.println(color +
                        String.format("  %-5d %-6s %-10s %-8s %s", e.id, e.tipo, e.permisos, e.tamano, e.nombre)
                        + RESET);
                }
            }
        } catch (IOException ex) {
            System.out.println(RED + "  Error: " + ex.getMessage() + RESET);
        } finally {
            fileLock.unlock();
        }
    }

    static void chmod(String permisos, String nombre) {
        // Validar formato básico rwx
        if (!permisos.matches("[r-][w-][x-]")) {
            System.out.println(RED + "  Error: permisos inválidos. Usa formato rwx (ej: r--, rw-, rwx)." + RESET);
            return;
        }
        fileLock.lock();
        try {
            List<FATEntry> entries = leerDB();
            Optional<FATEntry> target = entries.stream()
                .filter(e -> e.nombre.equals(nombre) && e.padre == GPWD)
                .findFirst();
            if (target.isEmpty()) {
                System.out.println(RED + "  Error: '" + nombre + "' no encontrado en el directorio actual." + RESET);
                return;
            }
            target.get().permisos = permisos;
            escribirDB(entries);
            System.out.println(GREEN + "  Permisos de '" + nombre + "' cambiados a " + permisos + "." + RESET);
        } catch (IOException ex) {
            System.out.println(RED + "  Error: " + ex.getMessage() + RESET);
        } finally {
            fileLock.unlock();
        }
    }

    static void rm(String nombre) {
        fileLock.lock();
        try {
            List<FATEntry> entries = leerDB();
            Optional<FATEntry> target = entries.stream()
                .filter(e -> e.nombre.equals(nombre) && e.padre == GPWD && e.tipo.equals("FILE"))
                .findFirst();
            if (target.isEmpty()) {
                System.out.println(RED + "  Error: archivo '" + nombre + "' no encontrado (rm solo elimina archivos)." + RESET);
                return;
            }
            entries.remove(target.get());
            escribirDB(entries);
            System.out.println(GREEN + "  Archivo '" + nombre + "' eliminado correctamente." + RESET);
        } catch (IOException ex) {
            System.out.println(RED + "  Error: " + ex.getMessage() + RESET);
        } finally {
            fileLock.unlock();
        }
    }

    static void testHilos() {
        System.out.println(MAGENTA + BOLD + "\n  ╔══════════════════════════════════════════╗" + RESET);
        System.out.println(MAGENTA + BOLD +   "  ║   Iniciando prueba concurrente con hilos  ║" + RESET);
        System.out.println(MAGENTA + BOLD +   "  ╚══════════════════════════════════════════╝" + RESET);
        System.out.println(YELLOW  + "  (concurrencia )\n" + RESET);

        int NUM_HILOS = 5;
        CountDownLatch latch = new CountDownLatch(NUM_HILOS); // Barrera de sincronización
        List<Thread> hilos   = new ArrayList<>();

        for (int i = 1; i <= NUM_HILOS; i++) {
            final int num = i;
            Thread t = new Thread(() -> {
                String nombreArchivo = "hilo_" + num + ".txt";
                System.out.println(CYAN + "  [Hilo-" + num + "] intentando crear " + nombreArchivo + "..." + RESET);
                touch(nombreArchivo);           
                latch.countDown();
            }, "Hilo-" + i);
            hilos.add(t);
        }

        for (Thread t : hilos) t.start();

        try {
            latch.await(); 
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println(GREEN + BOLD + "\n   Todos los hilos finalizaron correctamente." + RESET);
        System.out.println(YELLOW + "  El ReentrantLock garantizó escrituras seguras sin IDs duplicados.\n" + RESET);
    }

    static void inicializar() throws IOException {
        File f = new File(DB_FILE);
        if (!f.exists()) {
            List<FATEntry> entries = new ArrayList<>();
            entries.add(new FATEntry(0, "/", "DIR", -1, "rwx", "-"));
            escribirDB(entries);
            System.out.println(GREEN + "  Sistema FAT inicializado correctamente." + RESET);
        } else {
            System.out.println(GREEN + "  Sistema FAT cargado desde " + DB_FILE + "." + RESET);
        }
    }

    static void mostrarHeader() {
        System.out.println(BOLD + CYAN);
        System.out.println("  ╔══════════════════════════════════════════════════╗");
        System.out.println("  ║         SIMULADOR FAT en Java                    ║");
        System.out.println("  ╚══════════════════════════════════════════════════╝");
        System.out.println(RESET);
    }

    static void mostrarAyuda() {
        System.out.println(YELLOW + "\n  Comandos disponibles:" + RESET);
        String[][] cmds = {
            {"mkdir <nombre>",         "Crea un directorio"},
            {"cd <nombre>",            "Entra a un directorio"},
            {"cd ..",                  "Sube al directorio padre"},
            {"touch <archivo>",        "Crea un archivo vacío"},
            {"ls",                     "Lista el contenido actual"},
            {"ls -l",                  "Lista con detalle"},
            {"chmod <permisos> <nom>", "Cambia permisos (ej: r--)"},
            {"rm <archivo>",           "Elimina un archivo"},
            {"test_hilos",             "Prueba de concurrencia real"},
            {"help",                   "Muestra esta ayuda"},
            {"exit",                   "Sale del simulador"},
        };
        for (String[] c : cmds) {
            System.out.printf("  " + CYAN + "  %-28s" + RESET + " %s%n", c[0], c[1]);
        }
        System.out.println();
    }

    public static void main(String[] args) throws IOException {
        mostrarHeader();
        inicializar();
        mostrarAyuda();

        Scanner sc = new Scanner(System.in);

        while (true) {
            fileLock.lock();
            String ruta;
            try {
                ruta = getRuta(leerDB(), GPWD);
            } finally {
                fileLock.unlock();
            }
            System.out.print(BOLD + GREEN + "\n  FAT:" + ruta + " > " + RESET);

            String linea = sc.nextLine().trim();
            if (linea.isEmpty()) continue;

            String[] partes = linea.split("\\s+", 3);
            String cmd = partes[0].toLowerCase();

            switch (cmd) {
                case "mkdir" -> {
                    if (partes.length < 2) { System.out.println(RED + "  Uso: mkdir <nombre>" + RESET); break; }
                    mkdir(partes[1]);
                }
                case "cd" -> {
                    if (partes.length < 2) { System.out.println(RED + "  Uso: cd <nombre> | cd .." + RESET); break; }
                    cd(partes[1]);
                }
                case "touch" -> {
                    if (partes.length < 2) { System.out.println(RED + "  Uso: touch <archivo>" + RESET); break; }
                    touch(partes[1]);
                }
                case "ls" -> {
                    if (partes.length >= 2 && partes[1].equals("-l")) lsLong();
                    else ls();
                }
                case "chmod" -> {
                    if (partes.length < 3) { System.out.println(RED + "  Uso: chmod <permisos> <nombre>" + RESET); break; }
                    chmod(partes[1], partes[2]);
                }
                case "rm" -> {
                    if (partes.length < 2) { System.out.println(RED + "  Uso: rm <archivo>" + RESET); break; }
                    rm(partes[1]);
                }
                case "test_hilos" -> testHilos();
                case "help"       -> mostrarAyuda();
                case "exit", "quit" -> {
                    System.out.println(YELLOW + "\n  Saliendo del simulador FAT... ¡hasta luego!\n" + RESET);
                    sc.close();
                    return;
                }
                default -> System.out.println(RED + "  Comando desconocido: '" + cmd + "'. Escribe 'help' para ver los comandos." + RESET);
            }
        }
    }
}
