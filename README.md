# Inventario de Kiosco

Aplicación web para administrar el inventario de un kiosco: productos organizados por categorías, con alerta de stock bajo. Desarrollada con React, Node.js, Express y MySQL, con autenticación mediante JWT.

## Tecnologías utilizadas

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS

### Backend
- Node.js
- Express
- MySQL
- mysql2
- bcrypt
- jsonwebtoken (JWT)

### Base de datos
- MySQL 8 en Docker
- DBeaver

## Funcionalidades

- Registro e inicio de sesión de usuarios con JWT.
- Cada usuario ve y modifica solo sus propios datos.
- Listar, crear, editar y eliminar categorías.
- Listar, crear, editar y eliminar productos.
- Alerta de stock bajo: muestra los productos con menos unidades que el mínimo configurado.
- No permite eliminar una categoría que todavía tiene productos.
- Validación de formularios en el cliente (con mensaje por campo) y en la API.
- Rutas protegidas: sin sesión, la aplicación redirige al login.

## Estructura del proyecto

```
kiosco/
├── docker-compose.yml
├── kiosco-api/
│   ├── database/
│   │   └── schema.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── kiosco-web/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Requisitos

- Node.js
- npm
- Docker Desktop
- Un cliente para administrar la base de datos (por ejemplo, DBeaver).

## Configuración de la base de datos

1. Abrir Docker Desktop.
2. Desde la carpeta `kiosco`, levantar el contenedor de MySQL:

```bash
docker compose up -d
```

3. Verificar que el contenedor `kiosco-mysql` esté corriendo:

```bash
docker ps
```

4. Conectarse desde DBeaver con estos datos:

| Dato       | Valor       |
|------------|-------------|
| Host       | localhost   |
| Puerto     | 3306        |
| Usuario    | root        |
| Contraseña | root1234    |

En **Driver properties** configurar `allowPublicKeyRetrieval = true` y `useSSL = false`.

5. Abrir el archivo `kiosco-api/database/schema.sql` y ejecutarlo completo (Alt + X).

Base de datos: `kiosco`

Tablas:

- `usuarios`: usuarios registrados (la contraseña se guarda hasheada con bcrypt).
- `categorias`: categorías de cada usuario.
- `productos`: productos, relacionados con su categoría y su usuario.

Relaciones:

- `categorias.usuario_id` → `usuarios.id`
- `productos.usuario_id` → `usuarios.id`
- `productos.categoria_id` → `categorias.id` (`ON DELETE RESTRICT`: no se puede borrar una categoría que tiene productos)

## Configuración del backend

Ingresar a la carpeta:

```bash
cd kiosco-api
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` (se puede copiar de `.env.example`) con los datos de conexión.

Ejemplo:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD
DB_NAME=kiosco
FRONTEND_URL=http://localhost:5173
STOCK_MINIMO=5
JWT_SECRET=una_frase_larga_y_secreta
JWT_EXPIRES_IN=2h
```

| Variable         | Descripción                                          |
|------------------|------------------------------------------------------|
| `PORT`           | Puerto en el que corre la API                        |
| `DB_HOST`        | Host de MySQL                                        |
| `DB_PORT`        | Puerto de MySQL                                      |
| `DB_USER`        | Usuario de MySQL                                     |
| `DB_PASSWORD`    | Contraseña de MySQL                                  |
| `DB_NAME`        | Nombre de la base de datos                           |
| `FRONTEND_URL`   | Dirección del frontend, permitida por CORS           |
| `STOCK_MINIMO`   | Por debajo de este número, un producto tiene stock bajo |
| `JWT_SECRET`     | Clave para firmar los tokens (mantenerla en secreto) |
| `JWT_EXPIRES_IN` | Duración del token de sesión                         |

Iniciar el servidor:

```bash
npm start
```

Para desarrollo (se reinicia al guardar cambios):

```bash
npm run dev
```

Servidor: http://localhost:3000

## Configuración del frontend

Ingresar a la carpeta:

```bash
cd kiosco-web
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Iniciar la aplicación:

```bash
npm run dev
```

Aplicación: http://localhost:5173

## Rutas de la aplicación

| Ruta               | Página                                  | Protegida |
|--------------------|-----------------------------------------|-----------|
| `/`                | Inicio                                  | No        |
| `/login`           | Iniciar sesión                          | No        |
| `/registro`        | Crear cuenta                            | No        |
| `/productos`       | Lista de productos y alerta de stock bajo | Sí      |
| `/productos/nuevo` | Crear un producto                       | Sí        |
| `/productos/:id`   | Editar o eliminar un producto           | Sí        |
| `/categorias`      | Crear, editar y eliminar categorías     | Sí        |
| `*`                | Página no encontrada                    | No        |

## API REST

Todas las rutas, excepto las de `/api/auth`, requieren el encabezado:

```
Authorization: Bearer <token>
```

### Autenticación

| Método | Ruta                 | Descripción                         |
|--------|----------------------|-------------------------------------|
| POST   | /api/auth/registro   | Crear un usuario y obtener el token |
| POST   | /api/auth/login      | Iniciar sesión y obtener el token   |

### Categorías

| Método | Ruta                | Descripción                                      |
|--------|---------------------|--------------------------------------------------|
| GET    | /api/categorias     | Obtener las categorías del usuario               |
| GET    | /api/categorias/:id | Obtener una categoría                            |
| POST   | /api/categorias     | Crear una categoría                              |
| PUT    | /api/categorias/:id | Actualizar una categoría                         |
| DELETE | /api/categorias/:id | Eliminar una categoría (si no tiene productos)   |

### Productos

| Método | Ruta                      | Descripción                                |
|--------|---------------------------|--------------------------------------------|
| GET    | /api/productos            | Obtener los productos del usuario          |
| GET    | /api/productos/stock-bajo | Obtener los productos con stock bajo       |
| GET    | /api/productos/:id        | Obtener un producto                        |
| POST   | /api/productos            | Crear un producto                          |
| PUT    | /api/productos/:id        | Actualizar un producto                     |
| DELETE | /api/productos/:id        | Eliminar un producto                       |
| PATCH  | /api/productos/:id/stock  | Sumar o restar unidades al stock           |

### Códigos de respuesta

| Código | Significado                                                    |
|--------|----------------------------------------------------------------|
| 200    | Operación correcta                                             |
| 201    | Recurso creado                                                 |
| 204    | Recurso eliminado                                              |
| 400    | Datos inválidos                                                |
| 401    | Falta el token, es inválido o las credenciales son incorrectas |
| 404    | El recurso no existe o pertenece a otro usuario                |
| 409    | Email ya registrado, o categoría con productos                 |
| 500    | Error interno del servidor                                     |

## Importante

Los archivos `.env` contienen configuraciones y credenciales privadas. No deben subirse a GitHub. Para saber qué variables hay que completar, usar los archivos `.env.example`.
