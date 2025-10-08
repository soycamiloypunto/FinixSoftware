# --- Etapa 1: Construcción con Gradle ---
FROM gradle:8.5-jdk21-alpine AS build

WORKDIR /home/gradle/src

# --- CORRECCIÓN AQUÍ ---
# Usamos un comodín (*) para que funcione tanto con .gradle como con .gradle.kts
COPY build.gradle* settings.gradle* gradlew ./
COPY gradle ./gradle

COPY src ./src

RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon

# --- Etapa 2: Ejecución ---
FROM eclipse-temurin:21-jre-jammy

COPY --from=build /home/gradle/src/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]

