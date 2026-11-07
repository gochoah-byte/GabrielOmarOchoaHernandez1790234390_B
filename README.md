# Catálogo de recetas

Aplicación web para consultar recetas, buscar por nombre, cambiar de página y ver ingredientes e instrucciones.

## Instalación

Requiere Node.js y npm.

```bash
npm install
npm run dev
```

## Compilación

```bash
npm run build
npm run preview
```

## Tecnologías

React, TypeScript, Vite, TailwindCSS, React Router, Axios, TanStack Query, Zustand, React Hook Form y Zod.

## Funcionalidades

- Inicio y cierre de sesión, sesión persistente y renovación de tokens.
- Rutas protegidas.
- Listado y búsqueda con paginación y filtros en la URL.
- Detalle de recetas y descarga de imagen y ficha de texto.
- Mensajes de error, reintento y página 404.
- Creación de recetas con validación de campos y envío de formulario.
- Eliminación de recetas con confirmación.
- Validación de imágenes JPG y PNG de hasta 1 MB, con vista previa.
- Cuadrícula adaptable a móvil, tableta y escritorio.

## Acceso de prueba

Usuario: `emilys`. Contraseña: `emilyspass`.

La API utilizada es https://dummyjson.com. Puede configurarse otra dirección mediante `VITE_API_URL`.

## Estado

La API simula crear y eliminar; los cambios no se conservan al consultar nuevamente. El despliegue y las capturas de pantalla no están incluidos.

