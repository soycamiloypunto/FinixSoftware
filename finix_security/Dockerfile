# --- Etapa 1: Construcción con Gradle ---
FROM gradle:8.5-jdk21-alpine AS build

WORKDIR /home/gradle/src

# Copia los archivos de configuración de Gradle
# Usamos un comodín (*) para que funcione con .gradle (Groovy) o .gradle.kts (Kotlin DSL)
COPY build.gradle* settings.gradle* gradlew ./
COPY gradle ./gradle

# Copia el código fuente de la aplicación
COPY src ./src

# Dar permisos de ejecución y construir la aplicación
RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon -x test

# --- Etapa 2: Ejecución ---
# Usamos un JRE ligero basado en Debian (Jammy) para reducir el tamaño final de la imagen
FROM eclipse-temurin:21-jre-jammy

# Copia el JAR construido de la etapa 'build' al contenedor de ejecución
COPY --from=build /home/gradle/src/build/libs/*.jar app-security.jar

# El puerto por defecto para una aplicación Spring Boot
EXPOSE 8081

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "/app-security.jar"]
