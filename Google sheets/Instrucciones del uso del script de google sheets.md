# Instrucciones de Uso del Script "Generador JSON Gnius Club" (v5.0 - Flujo Automatizado)

Este script de Google Apps Script está diseñado para leer las respuestas del "Formulario de Proyectos", transformarlas al formato JSON requerido por el sitio web, y organizar los archivos de imagen subidos en Google Drive.

## 🚀 Cómo Usar el Script

1.  **Abrir la Hoja de Cálculo:** Abre la Google Sheet que recibe las respuestas de tu formulario.
2.  **Encontrar el Menú Personalizado:** En la barra de menú, busca **"Gnius Club Tools"**. Si acabas de abrir la hoja, puede tardar unos segundos en aparecer.
3.  **Autorización (Solo la Primera Vez):**
    - La **primera vez** que ejecutes cualquier opción del menú, Google te pedirá autorización.
    - Haz clic en **"Continuar"** y selecciona tu cuenta de Google.
    - Google mostrará una advertencia de "aplicación no verificada". Esto es normal. Haz clic en **"Configuración avanzada"** y luego en **"Ir a [Nombre del Script] (no seguro)"**.
    - Finalmente, haz clic en **"Permitir"** para conceder los permisos necesarios (acceso a Hojas de Cálculo y a Google Drive).

## ⚙️ Opciones del Menú

El menú "Gnius Club Tools" tiene dos funciones principales que deben ejecutarse en orden.

### 1. Generar JSON de Proyectos

Esta es la función principal que convierte los datos.

1.  **Ejecución:** Haz clic en `Gnius Club Tools > 1. Generar JSON de Proyectos`.
2.  **Aparecerá una barra lateral** a la derecha titulada "Generador JSON Gnius Club".
3.  **Generar:** Haz clic en el botón azul **"Generar JSON de Nuevos Proyectos"**.
4.  **Proceso:** El script leerá **únicamente las filas nuevas** (aquellas donde la columna `scriptStatus` esté vacía). Realizará todos los cálculos y transformaciones.
5.  **Resultado:**
    - El **JSON** resultante aparecerá en el área de texto grande.
    - Un **mensaje de estado** te indicará cuántas filas nuevas se procesaron.
6.  **Copiar:** Haz clic en el botón **"Copiar al Portapapeles"**.
7.  **Actualizar:** Pega el contenido copiado en el archivo `data/projects.json` de tu repositorio.

> **Importante:** Una vez que una fila se procesa, el script escribe `"Procesado: [fecha]"` en la columna `scriptStatus`. Para volver a procesar un proyecto (por ejemplo, después de corregir un dato), simplemente **borra el contenido de la celda `scriptStatus`** de esa fila y vuelve a ejecutar el generador.

### 2. Organizar Archivos de Drive

Esta función es un paso previo opcional pero **muy recomendado** para organizar las imágenes antes de subirlas al repositorio.

1.  **Ejecución:** Haz clic en `Gnius Club Tools > 2. Organizar Archivos de Drive`.
2.  **Confirmación:** Aparecerá una ventana pidiendo que confirmes la operación. Haz clic en "Sí".
3.  **Proceso:** El script realizará las siguientes acciones para cada fila nueva (aquellas donde la columna `driveStatus` esté vacía):
    - Buscará la carpeta de respuestas de tu formulario (ej. `"Formulario proyectos de innovacion (File responses)"`) en tu "Mi unidad" de Drive.
    - Dentro de ella, creará una carpeta principal llamada `"Project Assets (Formulario)"` (si no existe).
    - Para cada proyecto nuevo, creará una subcarpeta con un nombre `slug` (ej. `mi-proyecto-genial`).
    - Copiará las imágenes de las columnas (`cover`, `media`, `gallery`) a la carpeta del proyecto y las renombrará con nombres estándar (`cover.jpg`, `media.png`, `gallery-01.jpg`, etc.).
4.  **Resultado:** Al finalizar, recibirás una alerta de confirmación. Ahora tendrás una estructura de carpetas limpia en Google Drive, lista para descargar y subir a la carpeta `assets/img/` de tu repositorio.

> **Importante:** Este proceso también utiliza una columna de control, `driveStatus`. Una vez que los archivos de una fila se organizan, el script escribe `"Organizado: [fecha]"` en esa columna para no volver a procesarlos. Para reorganizar los archivos de un proyecto, **borra el contenido de la celda `driveStatus`** de esa fila.

## 📊 ¿Qué Hace el Script Detrás de Escena?

- **`onOpen()`**: Crea el menú personalizado al abrir la hoja.
- **`processFormResponses()`**:
  - Lee las filas nuevas (`scriptStatus` vacío).
  - Mapea las columnas del formulario a una estructura interna.
  - **Calcula la Rúbrica:** Extrae los puntos (1, 2, 3) de las 14 columnas de evaluación.
  - **Aplica Ponderación:** Calcula la calificación final (0-100) usando las ponderaciones definidas.
  - **Convierte a Escala 1-10:** Mapea la calificación final al `finalProjectGrade` que usa el sitio.
  - **Genera Campos Automáticos:** Crea el `projectId`, `slug`, `projectStatus` (basado en la rúbrica), `schooling` y `certificateBadgeName` (basado en el nivel), y más.
  - **Limpia y Formatea:** Convierte las URLs de video al formato `embed`, construye las rutas relativas para las imágenes, y estructura los arrays de `teamMembers`, `technologies`, y `imageGallery`.
  - **Devuelve el JSON** a la barra lateral.
- **`organizeDriveAssets()`**:
  - Lee las filas nuevas (`driveStatus` vacío).
  - Navega por tu Google Drive para encontrar/crear la estructura de carpetas correcta.
  - Utiliza el servicio `DriveApp` para encontrar los archivos de imagen originales por su ID, copiarlos y renombrarlos en la carpeta de destino.

Siguiendo estas instrucciones, el proceso de actualización de proyectos será rápido, consistente y libre de errores de formato manual.
