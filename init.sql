-- Detener la caducidad de la contraseña (opcional, pero buena práctica)
ALTER USER 'finixuser'@'%' IDENTIFIED BY 'finixpassword' PASSWORD EXPIRE NEVER;

-- Eliminar el usuario si existe con un host diferente (ej. '@'localhost')
DROP USER IF EXISTS 'finixuser'@'localhost';

-- Crear o modificar el usuario para que pueda conectarse desde CUALQUIER HOST ('%')
-- La contraseña y el nombre de usuario deben coincidir con tu docker-compose.yml
CREATE USER IF NOT EXISTS 'finixuser'@'%' IDENTIFIED BY 'finixpassword';

-- Otorgar todos los permisos a la base de datos 'finixdb' para el usuario desde cualquier host
GRANT ALL PRIVILEGES ON finixdb.* TO 'finixuser'@'%' WITH GRANT OPTION;

-- Aplicar los cambios
FLUSH PRIVILEGES;
