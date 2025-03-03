# Aplicacion de Tienda de Articulos Deportivos

## Descripción

Esta aplicación es un sistema de gestión de carritos de compras para una tienda de artículos deportivos. La aplicación es responsive y permite a los usuarios gestionar su perfil, explorar un catálogo de productos y manejar un carrito de compras. La arquitectura está basada en microservicios, lo que permite una escalabilidad y mantenimiento eficientes.

## Tecnologías Utilizadas

- **Frontend**: React JS
- **Backend**: Java 21 con Spring Boot
- **Base de Datos**: MySQL
- **API Gateway**: Para centralizar las solicitudes y mejorar la seguridad
- **Autenticación**: JWT (JSON Web Tokens) para la autenticación de usuarios

## Funcionalidades

### Gestión de Usuarios
- Registro de nuevos usuarios con los siguientes campos obligatorios:
  - Nombres
  - Apellidos
  - Dirección de envío
  - Email
  - Fecha de nacimiento
  - Contraseña
- Inicio de sesión para usuarios existentes
- Consulta del perfil del usuario

### Catálogo de Productos
- Listado de productos con imagen, descripción y precio
- Uso de URLs fijas para las imágenes de los productos

### Carrito de Compras
- Gestión de un carrito de compras por usuario
- Posibilidad de eliminar artículos del carrito
- Finalización de pedidos con visualización del ID de la orden

## Instalación

### Prerrequisitos

- **Java 21**: Asegúrate de tener Java 21 instalado en tu sistema.
- **Node.js y npm**: Necesarios para ejecutar la aplicación React.
- **Docker**: Opcional, para ejecutar la base de datos y otros servicios en contenedores.

### Instrucciones de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/AnotherEngineerHere/MicroservicesJavaAndReact
   cd sports-shop-cart
   ```

2. **Configurar la base de datos**:
   - Asegúrate de tener una instancia de MariaDB/MySQL en funcionamiento.
   - Crea una base de datos para la aplicación.
   - Configura las credenciales de la base de datos en el archivo `application.yml` del backend.

3. **Backend**:
   - Navega al directorio del backend:
     ```bash
     cd backend
     ```
   - Compila y ejecuta el backend:
     ```bash
     ./mvnw clean install
     ./mvnw spring-boot:run
     ```

4. **Frontend**:
   - Navega al directorio del frontend:
     ```bash
     cd frontend
     ```
   - Instala las dependencias y ejecuta la aplicación:
     ```bash
     npm install
     npm start
     ```

## Ejecución

- **API Gateway**: Asegúrate de que el API Gateway esté configurado y en ejecución para manejar las solicitudes del frontend(To be implemented).
- **Acceso a la aplicación**: Una vez que el frontend y el backend estén en ejecución, accede a la aplicación a través de `http://localhost:3000`.

## Contribución

Si deseas contribuir a este proyecto, por favor sigue los pasos a continuación:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tus cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

