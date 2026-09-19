# Guia Paso a Paso: Ejecutar Finix Unificado sin Docker

Como ya no tienes Docker, este es el proceso exacto que debes seguir para correr tu aplicacion desde cero y dejarla lista en el hosting.

## PASO 1: Preparar la Base de Datos en LatinoamericaHosting

1. Abre tu cPanel o la herramienta donde manejas las bases de datos en LatinoamericaHosting.
2. Abre **phpMyAdmin** y selecciona tu base de datos grupoin6_finixsoftware.
3. Busca la pestana **"SQL"** en phpMyAdmin.
4. Abre el archivo \init_latinoamerica.sql\ que se encuentra en la carpeta principal de tu proyecto. Copia todo su contenido y pegalo en phpMyAdmin.
5. Haz clic en **Ejecutar** (Go).
   *Esto creara las 3 tablas de seguridad (usuarios, roles, usuario_roles) y dejara listo el administrador (superadmin).*
6. **MUY IMPORTANTE (Whitelist IP):** En el cPanel de LatinoamericaHosting busca la opcion "MySQL Remoto" (o "Remote MySQL"). Ahi debes agregar la IP publica actual de tu conexion de internet local (la puedes ver en https://www.cual-es-mi-ip.net/). Si no agregas tu IP ahi, el hosting bloqueara la conexion desde tu Java local. Si usas No-IP, puedes agregar tu dominio de No-IP si el hosting lo permite.

## PASO 2: Construir (Empaquetar) Todo Localmente

Con la base de datos lista y conectada, vamos a compilar Angular y Java en un solo paso:

1. Abre una terminal (PowerShell o CMD) y navega a la carpeta principal de tu backend:
   \cd D:\CCTV\Projects\FinixSoftware\finix_backend\
2. Ejecuta el comando magico de Gradle:
   \./gradlew build\ o \gradlew build\ (en Windows)
3. Espera unos minutos. Veras en la consola como se descarga Node, luego Angular empieza a decir "Building..." y finalmente Java empaqueta todo y dice "BUILD SUCCESSFUL".

## PASO 3: Ejecutar y Disfrutar (Opcion Produccion Local)

1. Una vez haya terminado de compilar exitosamente, navega a la carpeta de salida desde tu terminal:
   \cd build\libs\
2. Ahi veras un archivo llamado \inix_backend-1.0.0-SNAPSHOT.jar\. Ejecutalo con el comando de Java:
   \java -jar finix_backend-1.0.0-SNAPSHOT.jar\
3. Veras el logo de Spring Boot aparecer en la consola. ¡El sistema de la cafeteria esta corriendo! (Se conectara a la BD en la nube de forma automatica ya que actualice tus credenciales en el archivo application.properties).
4. Abre tu navegador y ve a \http://localhost:8080\. Deberias ver la pantalla de Login de Angular.

## NOTA SOBRE CAMBIOS FUTUROS
- Cada vez que hagas un cambio de diseno en Angular (\inix_frontend\), solo repite el PASO 2.
- Si solo quieres programar rapido en local sin empacar todo el JAR a cada rato, abre dos terminales:
  - En \inix_backend\: ejecuta \gradlew bootRun\ (Levanta el Java conectado a la nube).
  - En \inix_frontend\: ejecuta \
g serve\ (Levanta el frontend en el puerto 4200 y se conectara directo al 8080).
