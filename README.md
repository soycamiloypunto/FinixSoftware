# Finix Software - Versión 2.0 (Modernizada)

¡Bienvenido a la nueva arquitectura de Finix Software! Esta versión ha sido completamente refactorizada y modernizada para ofrecer mejor rendimiento, mantenibilidad y escalabilidad.

## 🚀 Tecnologías Principales (Stack)

### Backend (Java / Spring Boot)
El backend ha sido reescrito adoptando las mejores prácticas modernas:
- **Spring WebFlux:** Migración a programación reactiva (Mono) para manejar la concurrencia de forma asíncrona, mejorando el rendimiento de los endpoints y disminuyendo la carga en hilos bloqueantes.
- **MapStruct:** Implementado para el mapeo automático y tipado fuerte entre Entidades (JPA) y DTOs, eliminando código repetitivo.
- **Spring Security + JWT:** Manejo de sesiones y autenticación segura con tokens.

### Frontend (Angular)
- SPA (Single Page Application) construida en Angular.
- Compilación automatizada que se inyecta directamente a la carpeta estática del backend para que un solo .jar pueda servir toda la aplicación.

### Reportes (PHP)
- Módulo independiente creado en PHP puro (finix_php) configurado en el hosting.
- Dashboard nativo y responsive con Bootstrap 5 y Chart.js.
- Conexión directa a base de datos de forma segura para generar gráficos estadísticos sin sobrecargar el servidor Java.

## 📦 Estructura de Módulos

La aplicación está diseñada bajo el modelo de dominio y contiene los siguientes módulos core:
- **Ventas & Detalles de Venta:** Facturación rápida y registro de transacciones.
- **Gestión de Tiempos:** Control preciso para el uso de equipos/consolas por tiempo.
- **Inventario:** Productos, insumos y compras.
- **Ingresos y Egresos:** Control completo de flujo de caja y rentabilidad (Utilidad Neta).
- **Usuarios & Seguridad:** Manejo de administradores/empleados y roles.

## ⚙️ Configuración y Variables de Entorno

**¡Importante sobre la Seguridad!**
Para evitar que las credenciales de la base de datos y la llave secreta JWT queden expuestas en GitHub, se ha implementado un archivo .env en la raíz del proyecto. 

- En tu entorno local de desarrollo, crea un archivo .env en la raíz con lo siguiente:
DB_URL=jdbc:mysql://[HOST]:3306/[BASE_DE_DATOS]?useSSL=false
DB_USER=mi_usuario
DB_PASSWORD=mi_clave
JWT_SECRET=tu_clave_secreta_larga

*(Este archivo ya está ignorado en .gitignore)*.

Al momento de compilar (build), Gradle lee automáticamente este archivo .env e inyecta los valores reales directamente dentro del .jar final, garantizando que puedas desplegar en el hosting sin configuraciones extra.

## 🛠️ Cómo Compilar y Ejecutar

El proyecto usa Node.js y Gradle integrados. El archivo build.gradle está configurado para compilar el frontend en Angular primero, y luego copiar los archivos estáticos hacia el backend.

1. **Compilación Completa (Frontend + Backend):**
   cd finix_backend
   ./gradlew clean build
   
   Esto generará tu ejecutable final en finix_backend/build/libs/finix_backend-1.0.0-SNAPSHOT.jar.

2. **Ejecutar Localmente (Desarrollo):**
   cd finix_backend
   ./gradlew bootRun

## 🏷️ Cómo Publicar Nuevas Versiones (Releases)

El proyecto usa GitHub Actions para generar automáticamente los instaladores nativos (.jar, .deb, .msi, .dmg) y publicarlos como Release en GitHub.

Cada vez que quieras publicar una nueva versión, simplemente crea un tag y súbelo:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Para futuras actualizaciones:

```bash
git tag v1.1.0
git push origin v1.1.0
```

GitHub compilará automáticamente el proyecto y publicará los instaladores en la pestaña **Releases** del repositorio, listos para descargar.
