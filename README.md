# Generador de Portafolios y Certificados Estáticos - Gnius Club 🚀

Este proyecto genera un sitio web estático para mostrar portafolios de proyectos estudiantiles y certificados digitales asociados para **Gnius Club**. Utiliza Google Sheets como fuente única de datos, Google Apps Script para automatizar la conversión a JSON, y tecnologías web estándar (HTML, CSS con Tailwind, JavaScript Vanilla) para el frontend. El sitio está optimizado para desplegarse fácilmente en GitHub Pages.

## ✨ Descripción General

Gnius Club certifica proyectos de innovación estudiantiles mediante SBTs (Soulbound Tokens). Este sistema permite:

1.  **Gestionar** toda la información de los proyectos y los detalles de los certificados de los miembros del equipo desde una **única Hoja de Cálculo de Google**.
2.  **Automatizar** (parcialmente) la actualización del sitio web mediante un **Google Apps Script** que convierte los datos de la hoja en un archivo `data/projects.json`.
3.  **Mostrar** los portafolios de proyectos individuales en una página de detalles con información completa, galería de imágenes, gráfico de evaluación y tecnologías utilizadas.
4.  **Mostrar** los certificados digitales asociados a cada miembro, enlazando de vuelta al proyecto como evidencia.
5.  **Ofrecer** una interfaz web responsiva y con una estética moderna inspirada en Gnius Club.

## 🌟 Características Principales

*   **Página Principal (`index.html`):** Listado de proyectos paginado con filtros por título/estudiante, categoría, nivel y tecnología.
*   **Página de Detalles del Proyecto (`project.html`):** Vista completa de un proyecto, incluyendo:
    *   Descripción del problema y solución.
    *   Proceso de innovación.
    *   Evidencia principal (video o imagen).
    *   Evidencia secundaria.
    *   Gráfico Radar interactivo (Chart.js) con puntuaciones de evaluación.
    *   Galería de imágenes con modal para ampliación.
    *   Información del equipo con enlaces a certificados.
    *   Tecnologías utilizadas con iconos.
    *   Recursos adicionales.
*   **Página de Certificado (`certificate.html`):** Muestra la información específica del certificado de un miembro (curso, insignia, nivel, habilidades, criterios), una imagen pre-renderizada del certificado y un enlace de descarga/impresión.
*   **Gestión Centralizada:** Toda la información se maneja desde una única Google Sheet.
*   **Automatización Parcial:** Script para generar el archivo JSON de datos.
*   **Diseño Responsivo:** Adaptado a móviles, tablets y escritorio usando Tailwind CSS.
*   **Despliegue Sencillo:** Listo para desplegar en GitHub Pages.

## 🔧 Tecnologías Utilizadas

*   **Frontend:**
    *   HTML5 Semántico
    *   CSS3 (con [Tailwind CSS v3](https://tailwindcss.com/) vía CDN)
    *   JavaScript Vanilla (ES6+)
    *   [Chart.js v4+](https://www.chartjs.org/) (vía CDN) para gráficos radar.
    *   [Font Awesome 6 Free](https://fontawesome.com/) (vía CDN) para iconos.
    *   [Google Fonts](https://fonts.google.com/) (Saira Semi Condensed, Saira Condensed, Saira)
*   **Gestión de Datos y Automatización:**
    *   [Google Sheets](https://www.google.com/sheets/about/)
    *   [Google Apps Script](https://developers.google.com/apps-script)
*   **Despliegue:**
    *   [GitHub Pages](https://pages.github.com/)

## 📁 Estructura del Proyecto

```
.
├── index.html              # Página principal (listado de proyectos)
├── project.html            # Plantilla para detalles de proyecto
├── certificate.html        # Plantilla para mostrar certificados
├── css/
│   └── style.css           # Estilos CSS personalizados y overrides
├── js/
│   ├── main.js             # Lógica para index.html (filtros, paginación, renderizado cards)
│   ├── project.js          # Lógica para project.html (carga datos, gráfico, galería, modal)
│   └── certificate.js      # Lógica para certificate.html (carga datos certificado)
├── data/
│   └── projects.json       # Archivo JSON con datos de proyectos (GENERADO POR SCRIPT)
├── assets/
│   └── img/
│       ├── gnius_logo_placeholder.png # Reemplazar con el logo real
│       ├── certificado.png     # Imagen base (o placeholder) para certificados
│       └── [project-slug]/     # Carpetas por proyecto para sus imágenes
│           ├── cover.jpg
│           ├── gallery-01.jpg
│           └── nombre-alumno-cert-preview.jpg
│           └── nombre-alumno-cert-print.pdf
│           └── ...
└── README.md               # Este archivo
└── (Archivos Google Apps Script - gestionados en Google Drive)
    ├── generarJson.gs      # Script principal para convertir Sheets a JSON
    └── Sidebar.html        # Interfaz HTML para el script en Sheets
```

## 🚀 Configuración Inicial

1.  **Clonar Repositorio:** Clona este repositorio en tu máquina local.
    ```bash
    git clone [URL-DEL-REPOSITORIO]
    cd [NOMBRE-DEL-REPOSITORIO]
    ```
2.  **Google Sheet:**
    *   Crea una nueva Hoja de Cálculo de Google.
    *   Copia la estructura de encabezados definida (ver [Instrucciones Detalladas](#-gestión-de-datos-google-sheets)). Puedes usar el CSV de ejemplo proporcionado para empezar.
    *   **Importante:** Sigue las instrucciones de formato detalladas para las columnas complejas (`teamMembers`, `technologies`, etc.).
3.  **Google Apps Script:**
    *   Dentro de tu Google Sheet, ve a `Extensiones` > `Apps Script`.
    *   Copia el contenido de `generarJson.gs` y pégalo en el editor de scripts (reemplazando el contenido por defecto).
    *   Crea un nuevo archivo HTML (`Archivo > Nuevo > Archivo HTML`) y nómbralo `Sidebar.html` (respetando mayúsculas/minúsculas).
    *   Copia el contenido del `Sidebar.html` proporcionado y pégalo en este nuevo archivo.
    *   Guarda ambos archivos en el editor de Apps Script.
    *   Recarga tu Google Sheet. Debería aparecer un nuevo menú "Gnius Club Tools". La primera vez que uses "Generar JSON", te pedirá autorización para acceder a la hoja. Concédela.
4.  **Assets:**
    *   Reemplaza `assets/img/gnius_logo_placeholder.png` con el logo oficial de Gnius Club.
    *   Coloca la imagen base del certificado (si usas una genérica) como `assets/img/certificado.png` o ajusta las rutas según tu necesidad.
5.  **Pruebas Locales:** Para probar el sitio localmente, necesitas un servidor web simple debido a las solicitudes `fetch` al archivo JSON. Puedes usar:
    *   La extensión "Live Server" en VS Code.
    *   Python: `python -m http.server` (Python 3) en la raíz del proyecto.
    *   Node.js: `npx serve`

## 🛠️ Uso y Flujo de Trabajo para Actualizar Contenido

Este es el proceso **esencial** para añadir o modificar proyectos:

1.  **📝 Editar Google Sheet:** Añade una nueva fila para un nuevo proyecto o modifica una existente. Rellena **todas** las columnas siguiendo estrictamente las **[Instrucciones Detalladas](#-gestión-de-datos-google-sheets)** (especialmente el formato `Prop1;Prop2 | ...` y el uso de comas dentro de Habilidades/Criterios).
2.  **🖼️ Generar/Subir Imágenes:**
    *   Prepara las imágenes necesarias: portada (`cover.jpg`), galería (`gallery-XX.jpg`), imagen/video principal (`media.jpg` si aplica).
    *   **Certificados:** Genera los **dos** archivos de imagen/PDF (`*-cert-preview.jpg`, `*-cert-print.pdf`) para **cada** miembro que reciba certificado.
    *   Crea la carpeta del proyecto en `assets/img/[slug-del-proyecto]/` (el slug es el título en minúsculas con guiones).
    *   Sube **todas** estas imágenes a esa carpeta en tu copia local del repositorio.
3.  **✍️ Actualizar Rutas en Sheets:** Vuelve a la Google Sheet y asegúrate de que las columnas `coverUrl_url`, `media_url` (si es imagen), `teamMembers` (rutas de certificados) y `imageGallery` contengan las **rutas relativas correctas** a los archivos que acabas de subir (ej: `assets/img/mi-proyecto-slug/cover.jpg`).
4.  **⚙️ Generar JSON:** En la Google Sheet, ve a `Gnius Club Tools > Generar JSON`. El script validará formatos básicos. Si hay errores, corrígelos en la hoja y vuelve a generar.
5.  **📋 Copiar JSON:** Copia **todo** el texto JSON que aparece en la barra lateral usando el botón "Copiar".
6.  **🔄 Actualizar `data/projects.json`:** Abre el archivo `data/projects.json` en tu editor de código local. **Borra todo su contenido** y pega el JSON que copiaste. Guarda el archivo.
7.  **⬆️ Commit & Push:** Usa Git para confirmar (`commit`) todos los cambios (el `projects.json` modificado y las **nuevas imágenes** añadidas en `assets/img/`) y súbelos (`push`) a tu repositorio en GitHub.
8.  **🌐 Despliegue:** GitHub Pages detectará los cambios y actualizará el sitio web automáticamente en unos minutos.

## 📊 Gestión de Datos (Google Sheets)

La clave de este sistema es la hoja de cálculo única.

*   **Estructura:** La primera fila contiene los encabezados exactos que espera el script. Cada fila subsiguiente es un proyecto.
*   **Formato Complejo:** Columnas como `teamMembers`, `technologies`, `additionalResources`, y `imageGallery` contienen múltiples piezas de información estructurada:
    *   **Elementos separados por:** ` | ` (espacio, barra, espacio)
    *   **Propiedades dentro de un elemento separadas por:** `;` (punto y coma, sin espacios)
    *   **IMPORTANTE (Team Members):** Las listas internas de Habilidades y Criterios deben ir separadas por **coma (`,`)**.
*   **Instrucciones Detalladas:** Consulta el documento de **Instrucciones para Llenar Google Sheets** proporcionado por separado para una descripción completa de cada columna, el orden exacto de las propiedades en los campos complejos y ejemplos detallados.
*   **Asistente IA:** Usa el **Prompt para IA Asistente** proporcionado para ayudarte a formatear correctamente los datos para las celdas complejas si es necesario.

## 🤖 Google Apps Script (`generarJson.gs`)

*   **Función:** Lee la hoja activa, valida datos básicos, parsea campos complejos, genera slugs, estructura el JSON final.
*   **Uso:** Se ejecuta desde el menú `Gnius Club Tools > Generar JSON` dentro de la hoja de cálculo. Muestra el resultado en una barra lateral para copiar.
*   **Permisos:** Requiere autorización para acceder a la hoja de cálculo la primera vez que se ejecuta.

## 🎨 Personalización (Opcional)

*   **Estilos Visuales:** Modifica `css/style.css` para ajustar colores, fuentes o añadir estilos personalizados. Puedes sobrescribir clases de Tailwind o añadir nuevas. Las variables de color están definidas al inicio del CSS.
*   **Configuración Tailwind (CDN):** Puedes ajustar la configuración básica de Tailwind directamente en el `<script>` dentro del `<head>` de los archivos HTML, aunque se recomienda usar `style.css` para cambios mayores.
*   **Comportamiento JS:** Modifica los archivos en la carpeta `js/` para cambiar la lógica de filtrado, paginación, renderizado, etc.

## 🚀 Despliegue en GitHub Pages

1.  Asegúrate de que tu repositorio esté en GitHub.
2.  Ve a la configuración de tu repositorio (`Settings` > `Pages`).
3.  En la sección "Build and deployment", bajo "Source", selecciona `Deploy from a branch`.
4.  Elige la rama donde está tu código (normalmente `main` o `master`).
5.  Selecciona la carpeta raíz (`/root`) como fuente.
6.  Haz clic en `Save`.
7.  GitHub construirá y desplegará tu sitio. La URL estará disponible en la misma sección de configuración de Pages (puede tardar unos minutos la primera vez).

Cada vez que hagas `push` a la rama configurada, GitHub Pages actualizará el sitio automáticamente.

---

¡Esperamos que esta herramienta sea de gran utilidad para Gnius Club!
