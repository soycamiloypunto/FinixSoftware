# --- Etapa 1: Construcción con Gradle ---
# Usamos una imagen de Gradle con JDK 21 para construir el proyecto.
FROM gradle:8.5-jdk21-alpine AS build

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /home/gradle/src

# Copiamos los archivos de configuración de Gradle para descargar dependencias.
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY gradle ./gradle

# Copiamos el código fuente de la aplicación.
COPY src ./src

# Hacemos que el script de Gradle sea ejecutable.
RUN chmod +x ./gradlew

# Ejecutamos el build de Gradle para compilar y empaquetar la aplicación.
RUN ./gradlew build --no-daemon

# --- Etapa 2: Ejecución ---
# Usamos una imagen ligera de Java 21 JRE para ejecutar la aplicación.
FROM eclipse-temurin:21-jre-jammy

# Copiamos el archivo .jar compilado desde la etapa de construcción a la raíz del nuevo contenedor.
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar

# Exponemos el puerto 8080, que es el puerto por defecto de Spring Boot.
EXPOSE 8080

# El comando que se ejecutará cuando el contenedor se inicie.
ENTRYPOINT ["java", "-jar", "/app.jar"]
