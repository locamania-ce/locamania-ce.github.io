# Administración de contenido con Sanity

## Qué administra cada sección

- **Piezas:** nombre, categoría, precio, foto y disponibilidad.
- **Diseños:** nombre, foto, fecha de realización y si se puede elegir al comprar.

La portada toma automáticamente los tres diseños con la fecha de realización más reciente como **Últimos trabajos**. La tienda solo muestra piezas disponibles y el selector solo muestra diseños disponibles para elegir.

## Activación

1. Crear un proyecto y un dataset `production` en Sanity.
2. Copiar `.env.example` como `.env` y completar el identificador del proyecto.
3. Ejecutar `npm.cmd run sanity:dev` para abrir el panel local y cargar contenidos.
4. Ejecutar `npm.cmd run dev` para ver la web conectada.
