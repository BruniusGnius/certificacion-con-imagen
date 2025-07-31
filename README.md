# Generador de Portafolios y Certificados Estáticos - Gnius Club (v5.0 - Flujo de Formulario Automatizado) 🚀

Este proyecto genera un sitio web estático para mostrar portafolios de proyectos estudiantiles y certificados digitales asociados para **Gnius Club**. El sistema ha sido rediseñado para utilizar un **Formulario de Google** como única fuente de entrada de datos, automatizando la mayor parte del proceso de transformación de datos a través de un potente script de Google Apps Script. El frontend utiliza tecnologías web estándar (HTML, CSS con Tailwind, JavaScript Vanilla) y está optimizado para un despliegue sencillo en GitHub Pages.

## ✨ Descripción General

Gnius Club certifica proyectos de innovación desarrollados por estudiantes. Este sistema permite:

1.  **Gestionar Centralizadamente:** Toda la información de los proyectos, incluyendo detalles, miembros, ODS y la evaluación por rúbrica, se captura a través de un **único Formulario de Google**, cuyas respuestas se centralizan en una Hoja de Cálculo.
2.  **Automatizar la Transformación de Datos:** Un **único y robusto script de Google Apps Script (`MasterJsonGenerator.gs`)** se encarga de:
    - Leer las nuevas respuestas del formulario.
    - Validar, limpiar y transformar los datos.
    - Calcular la calificación final del proyecto basándose en una rúbrica ponderada.
    - Generar un **ID de proyecto único** (ej. `G25-PXX-001`).
    - Determinar automáticamente el **estado del proyecto** (`Idea` o `Prototipo`) y si es **nominado** (`isNominated`).
    - Producir el archivo `data/projects.json` final, listo para producción.
3.  **Organizar Archivos:** Una función separada dentro del mismo script permite organizar automáticamente las imágenes subidas a través del formulario, creando carpetas por proyecto y renombrando los archivos de forma estandarizada en Google Drive.
4.  **Mostrar Portafolios Detallados:** Cada proyecto tiene una página individual con descripción, ODS, sección de evaluación con gráficos, galería de imágenes, equipo, tecnologías y más.
5.  **Mostrar Certificados Digitales:** Cada miembro del equipo tiene una página de certificado individual con su insignia, nivel, habilidades y enlaces de descarga.

## 🌟 Características Principales

- **Página Principal (`index.html`):** Listado paginado de proyectos con filtros funcionales por Título, **ID de Proyecto**, Categoría, Escolaridad, Tecnología, ODS y **Estado del Proyecto** (`Idea`/`Prototipo`).
- **Tarjetas de Proyecto Mejoradas:** Muestran visualmente el estado del proyecto y una insignia especial para los proyectos **nominados**.
- **Página de Detalles del Proyecto (`project.html`):** Vista completa del proyecto con sección Hero, panel de ODS, sección de Evaluación, galería, equipo y tecnologías. Muestra de forma prominente el estado y si el proyecto es nominado.
- **Página de Certificado (`certificate.html`):** Certificado digital individual para cada estudiante.
- **Gestión de Datos Simplificada:** El flujo de trabajo se inicia con un simple Formulario de Google, eliminando la necesidad de formatear datos complejos manualmente.
- **Automatización Robusta:** El script de Google Apps maneja la lógica compleja, incluyendo el estado de procesamiento de cada proyecto para evitar duplicados (`scriptStatus` y `driveStatus`).

## 🔧 Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, CSS3 (Tailwind CSS v3 vía CDN + `css/style.css`), JavaScript Vanilla (ES6+, modular).
- **Librerías Frontend (CDN):** Chart.js, Font Awesome 6, Google Fonts.
- **Gestión de Datos y Automatización:** Google Forms, Google Sheets, Google Apps Script.
- **Despliegue:** GitHub Pages.

## 📁 Estructura del Proyecto Actualizada

```

.
├── index.html
├── project.html
├── certificate.html
├── css/
│ └── style.css
├── js/
│ ├── main.js
│ ├── project.js
│ ├── certificate.js
│ └── ods-data.js
├── data/
│ └── projects.json # Archivo JSON con datos (GENERADO POR EL SCRIPT)
├── assets/
│ ├── img/
│ │ ├── gnius_logo_placeholder.png
│ │ ├── certificado.png
│ │ ├── ods/
│ │ ├── badges/
│ │ ├── levels/
│ │ └── [project-slug]/ # Carpetas por proyecto (DESCARGADAS DE DRIVE)
│ │ ├── cover.jpg
│ │ ├── media.jpg (opcional)
│ │ └── gallery-01.jpg ...
│ └── docs/
├── Google Apps Script/ # Documentación y código del script
│ ├── MasterJsonGenerator.gs # El único script necesario
│ └── Sidebar.html # UI para el script en Sheets
├── Documentacion/
│ ├── Guia de Llenado del Formulario.md
│ ├── Instrucciones de Uso del Script.md
│ └── Prompts de Ayuda para IA.md
└── README.md # Este archivo

```

## 🚀 Configuración Inicial y Flujo de Trabajo

Para una guía detallada sobre cómo configurar el sistema y el flujo de trabajo completo (desde llenar el formulario hasta hacer push a GitHub), consulta los siguientes documentos:

- **`Documentacion/Guia de Llenado del Formulario.md`**: Explica cómo llenar el formulario correctamente.
- **`Documentacion/Instrucciones de Uso del Script.md`**: Detalla el funcionamiento de las opciones del menú y el proceso de automatización.

---

````

---

### **Archivo 2 (Revisado): `Instrucciones de Uso del Script.md` (Versión Final con Nuevos Campos)**

Aquí he añadido una sección específica que explica qué hace el script con los nuevos campos, para que el usuario entienda la "magia" que ocurre detrás de escena.

```markdown
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
2.  **Aparecerá una barra lateral** a la derecha.
3.  **Generar:** Haz clic en el botón azul **"Generar JSON de Nuevos Proyectos"**.
4.  **Proceso:** El script leerá **únicamente las filas nuevas** (donde la columna `scriptStatus` esté vacía).
5.  **Resultado:** El **JSON** resultante aparecerá en el área de texto grande.
6.  **Copiar y Actualizar:** Usa el botón "Copiar" y pega el contenido en el archivo `data/projects.json` de tu repositorio.

> **Reprocesar un Proyecto:** Para volver a generar el JSON de un proyecto (ej. después de corregir un dato), simplemente **borra el contenido de la celda `scriptStatus`** de esa fila y vuelve a ejecutar el generador.

### 2. Organizar Archivos de Drive

Esta función prepara tus imágenes para que las puedas descargar y subir al repositorio.

1.  **Ejecución:** Haz clic en `Gnius Club Tools > 2. Organizar Archivos de Drive`.
2.  **Confirmación:** Acepta la ventana de confirmación.
3.  **Proceso:** El script buscará las filas nuevas (donde la columna `driveStatus` esté vacía) y:
    - Creará una carpeta `"Project Assets (Formulario)"` dentro de la carpeta de respuestas del formulario en tu Drive.
    - Dentro, creará una subcarpeta para cada proyecto nuevo (ej. `mi-proyecto-genial/`).
    - Copiará y renombrará las imágenes a `cover.jpg`, `media.png`, etc., dentro de la carpeta del proyecto.
4.  **Resultado:** Tendrás una estructura de carpetas limpia en Google Drive, lista para descargar y subir a la carpeta `assets/img/` de tu repositorio.

> **Reorganizar Archivos:** Para volver a procesar los archivos de un proyecto, **borra el contenido de la celda `driveStatus`** de esa fila.

## 📊 ¿Qué Hace el Script Detrás de Escena?

El script es el cerebro del sistema. Realiza varias tareas automáticas para asegurar que los datos sean consistentes y correctos:

- **`onOpen()`**: Crea el menú personalizado.
- **`processFormResponses()`**:
  - **Lee y Transforma:** Mapea las columnas del formulario a la estructura JSON.
  - **Calcula la Rúbrica:** Extrae los puntos (1, 2, 3) de las 14 columnas de evaluación y calcula la calificación final ponderada (escala 1-10) que se muestra en el sitio.
  - **Genera Campos Automáticos:**
    - **`projectId`**: Crea un ID único y legible (ej. `G25-PXX-001`) para cada proyecto.
    - **`projectStatus`**: Determina si el proyecto es una **"Idea"** o un **"Prototipo"** basándose en la puntuación de la rúbrica sobre la funcionalidad del prototipo.
    - **`isNominated`**: Lee la respuesta del formulario para marcar si un proyecto es nominado (`true`) o no (`false`).
    - **`schooling` y `certificateBadgeName`**: Los deriva automáticamente de la respuesta de "Nivel Educativo".
  - **Limpia y Formatea:** Convierte URLs de video, construye rutas relativas para imágenes y estructura los datos del equipo y tecnologías.
- **`organizeDriveAssets()`**:
  - Utiliza el servicio `DriveApp` para navegar por tu Google Drive, crear carpetas y gestionar las copias de los archivos de imagen.

Siguiendo estas instrucciones, el proceso de actualización de proyectos será rápido, consistente y libre de errores.
````
