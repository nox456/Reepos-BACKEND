<h1 align="center">Reepos Backend</h1>

# Introducción 🚀

Este es el repositorio del backend del proyecto **Repos** (una **webapp** basada en [Github](https://github.com)) que 
incluye API, **Autenticación con JWT** y conexión con la **base de datos**.

## Tecnologías 💻️

- **[Express.js](https://expressjs.com)** - Framework Backend
- **[PostgreSQL](https://www.postgresql.org/)** - Base de Datos
- **[JWT](https://jwt.io/)** - Autenticación con Tokens
- **[Supabase](https://supabase.com)** - Almacenamiento en la Nube
- **[Zod](https://zod.dev/)** - Validación de datos
- **[Simple-Git](https://www.npmjs.com/package/simple-git)** - Operaciones internas con Git
- **[Achiver](https://www.npmjs.com/package/archiver)** - Compresión en formato ZIP

# Documentación de la API 📔

Lista de recursos disponibles por la API junto a sus **endpoints**, **métodos HTTP**, **objeto de respuesta** y 
**objeto de petición**.

## Recursos

- **[Auth](#auth)**
- **[Users](#users)**
- **[Repositories](#repositories)**
- **[Files](#files)**

### Auth

**URL base:** `/auth/`

<table>
    <th>Método</th>
    <th>Endpoint</th>
    <th>Body</th>
    <th>Descripción</th>
    <tr>
        <td><code>POST</code></td>
        <td><code>/signup</code></td>
        <td>
            <code>{ "username": "string", "password": "string" }</code>
        </td>
        <td>Registrar un usuario</td>
    </tr>
    <tr>
        <td><code>POST</code></td>
        <td><code>/signin</code></td>
        <td>
            <code>{ "username": "string", "password": "string"}</code>
        </td>
        <td>Autenticar un usuario</td>
    </tr>
    <tr>
        <td><code>POST</code></td>
        <td><code>/signinToken</code></td>
        <td>
            <code>{ "token": "string" }</code>
        </td>
        <td>Autenticar un usuario con Token</td>
    </tr>
</table>

---

### Users

**URL base:** `/users/`

<table>
    <th>Método</th>
    <th>Endpoint</th>
    <th>Body / Query</th>
    <th>Descripción</th>
    <tr>
        <td><code>DELETE</code></td>
        <td><code>/delete</code></td>
        <td><code>{ "id": "string", "password": "string" }</code></td>
        <td>Eliminar un usuario</td>
    </tr>
    <tr>
        <td><code>PUT</code></td>
        <td><code>/change-username</code></td>
        <td><code>{ "newUsername": "string", "id": "string", "password": "string" }</code></td>
        <td>Cambiar nombre de usuario</td>
    </tr>
    <tr>
        <td><code>PUT</code></td>
        <td><code>/change-password</code></td>
        <td><code>{ "newPassword": "string", "id": "string", "password": "string" }</code></td>
        <td>Cambiar contraseña</td>
    </tr>
    <tr>
        <td><code>PUT</code></td>
        <td><code>/change-description</code></td>
        <td><code>{ "newDescription": "string", "id": "string" }</code></td>
        <td>Cambiar Descripción/Biografia</td>
    </tr>
    <tr>
        <td><code>POST</code></td>
        <td><code>/upload-image</code></td>
        <td><code>{ "user_img": "image", "user_id": "string" }</code></td>
        <td>Actualizar imagen de usuario</td>
    </tr>
    <tr>
        <td><code>POST</code></td>
        <td><code>/follow-user</code></td>
        <td><code>{ "userFollowerId": "string", "userFollowedId": "string" }</code></td>
        <td>Seguir a un usuario</td>
    </tr>
    <tr>
        <td><code>GET</code></td>
        <td><code>/search</code></td>
        <td><code>?username="string"</code></td>
        <td>Buscar usuarios por nombre de usuario</td>
    </tr>
    <tr>
        <td><code>GET</code></td>
        <td><code>/followers</code></td>
        <td><code>?id="string"</code></td>
        <td>Obtener seguidores de un usuario</td>
    </tr>
    <tr>
        <td><code>GET</code></td>
        <td><code>/profile</code></td>
        <td><code>?id="string"</code></td>
        <td>Obtener información sobre el perfil del usuario</td>
    </tr>
</table>

---

### Repositories

**URL base:** `/repositories/`

<table>
    <th>Método</th>
    <th>Endpoint</th>
    <th>Body / Query</th>
    <th>Descripción</th>
    <tr>
        <td><code>POST</code></td>        
        <td><code>/create</code></td>
        <td><code>{ "repoData": { "name": "string", "description": "string", "user_owner": "string", "languages": "string[]" }, "projecName": "string" }</code></td>
        <td>Registrar información del repositorio</td>
    </tr>
    <tr>
        <td><code>POST</code></td>
        <td><code>/upload</code></td>
        <td><code>{ "repoName": "string" }</code></td>
        <td>Subir archivos del repositorio a la nube (Supabase)</td>
    </tr>
    <tr>
        <td><code>GET</code></td>
        <td><code>/download</code></td>
        <td><code>?repoName="string"</code></td>
        <td>Obtener la url pública de un repositorio comprimido en zip</td>
    </tr>
</table>

### Files

<table>
    <th>Método</th>
    <th>Endpoint</th>
    <th>Body / Query</th>
    <th>Descripción</th>
    <tr>
        <td><code>GET</code></td>
        <td><code>/download</code></td>
        <td><code>?id="string"&repoName="string"</code></td>
        <td>Obtener url pública de un archivo</td>
    </tr>
</table>
