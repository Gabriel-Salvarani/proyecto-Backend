# 🚀 PROYECTO BACKEND - API REST E-COMMERCE UTN

Este proyecto implementa una API RESTful robusta para un sistema de e-commerce, desarrollada en Node.js, Express y TypeScript. Cumple con la arquitectura **MVC (Modelo-Vista-Controlador)** y se enfoca en la seguridad, la estabilidad y la validación de datos.

El proyecto está desplegado en Render y es accesible a través de la URL de producción.

## 🔗 URL de Producción

**Base URL:** https://proyecto-backend-96gw.onrender.com/

## ⚙️ Configuración y Ejecución Local

### 1. Requisitos

* Node.js (v18+)
* MongoDB Atlas (o instancia local)
* Git


### Descripción de la Funcionalidad por Endpoint (R2)

* **POST /api/auth/register:** Crea una nueva cuenta de usuario. La ruta está protegida por **Rate Limit** para evitar registros masivos.
* **POST /api/auth/login:** Permite a un usuario iniciar sesión usando credenciales válidas. Devuelve un **JSON Web Token (JWT)**, necesario para acceder a rutas de escritura.
* **GET /api/products:** Lista todos los productos disponibles. Acepta **Query Parameters (R6)** para filtrar por `category`, `name`, `minPrice` y `maxPrice`.
* **GET /api/products/:id:** Recupera los detalles de un producto específico utilizando su identificador único.
* **POST /api/products:** Permite la creación de nuevos productos. Esta ruta **requiere autenticación JWT (R5)** y aplica **Validación (R7)** a los datos de entrada.
* **PUT /api/products/:id:** Actualiza completamente un producto existente. Requiere token JWT válido.
* **DELETE /api/products/:id:** Elimina un producto de la base de datos. Requiere un token JWT válido.
