# Generador de Portafolios y Certificados Estáticos - Gnius Club (v4.0 - ODS & Rúbrica) 🚀

    Este proyecto genera un sitio web estático para mostrar portafolios de proyectos estudiantiles y certificados digitales asociados para **Gnius Club**. Utiliza Google Sheets como fuente única de datos, Google Apps Script para automatizar la conversión a JSON, y tecnologías web estándar (HTML, CSS con Tailwind, JavaScript Vanilla) para el frontend. El sitio está optimizado para desplegarse fácilmente en GitHub Pages e incluye la visualización de Objetivos de Desarrollo Sostenible (ODS) y una nueva estructura de evaluación por rúbrica.

    ## ✨ Descripción General

    Gnius Club certifica proyectos de innovación estudiantiles. Este sistema permite:

    1.  **Gestionar** toda la información (proyectos, miembros, ODS, evaluación por rúbrica) desde una **única Hoja de Cálculo de Google**.
    2.  **Automatizar** (parcialmente) la actualización del sitio mediante un **Google Apps Script** que convierte los datos de la hoja en `data/projects.json`, calculando la calificación final del proyecto.
    3.  **Mostrar** portafolios de proyectos con detalles, ODS asociados, nueva visualización de evaluación (Gauge + Criterios), galería, tecnologías y equipo.
    4.  **Mostrar** certificados digitales por miembro, con insignias y niveles predefinidos, enlazando de vuelta al proyecto.
    5.  **Ofrecer** una interfaz web responsiva con estética moderna.

    ## 🌟 Características Principales (v4.0)

    *   **Página Principal (`index.html`):**
        *   Listado paginado de proyectos.
        *   Filtros por título/estudiante, categoría, escolaridad (`schooling`), tecnología y **ODS**.
        *   Cards de proyecto mostrando **chips ODS** distintivos, categoría, escolaridad, descripción, y **+4 miembros**.
    *   **Página de Detalles del Proyecto (`project.html`):**
        *   Vista completa del proyecto.
        *   **Badges ODS** en la sección Hero.
        *   Nueva sección "Objetivos de Desarrollo Sostenible" con **mosaico visual de ODS**.
        *   **Sección de Evaluación Revisada:**
            *   **Gráfico Gauge** mostrando calificación final del proyecto (1-10).
            *   **Chips/Visualización** para los 5 criterios de la rúbrica (puntuación 1-3 cada uno).
        *   Galería de imágenes con modal, información del equipo, tecnologías, recursos.
    *   **Página de Certificado (`certificate.html`):**
        *   Muestra información del miembro.
        *   **Insignias y Niveles predefinidos** (`Code Explorer`, `Master`, etc.).
        *   **Visualización de imagen PNG** asociada a la insignia/nivel.
        *   Previsualización de certificado y enlace de descarga.
    *   **Gestión Centralizada:** Google Sheet como fuente única.
    *   **Automatización Parcial:** Script Apps Script (`generarJson.gs`) para validación y generación JSON (incluye cálculo de nota).
    *   **Diseño Responsivo:** Mobile-first con Tailwind CSS.
    *   **Despliegue Sencillo:** GitHub Pages.

    ## 🔧 Tecnologías Utilizadas

    *   **Frontend:** HTML5, CSS3 (Tailwind CSS v3 CDN + `style.css`), JavaScript Vanilla (ES6+), Chart.js v4+ (CDN), Font Awesome 6 Free (CDN), Google Fonts (Saira family).
    *   **Gestión de Datos y Automatización:** Google Sheets, Google Apps Script.
    *   **Despliegue:** GitHub Pages.

    ## 📁 Estructura del Proyecto (v4.0)

    ```
    .
    ├── index.html
    ├── project.html
    ├── certificate.html
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── main.js
    │   ├── project.js
    │   ├── certificate.js
    │   └── ods-data.js         # NUEVO: Mapeo de datos ODS
    ├── data/
    │   ├── projects.json       # GENERADO: Datos principales
    │   └── projectsLoremPicsum.json # GENERADO: Con placeholders Lorem Picsum
    ├── assets/
    │   ├── img/
    │   │   ├── gnius_logo_placeholder.png
    │   │   ├── ods/            # NUEVO: Logos ODS (ods-1.png ... ods-17.png)
    │   │   ├── badges/         # NUEVO: Imágenes Insignias (code-explorer.png ...)
    │   │   ├── levels/         # NUEVO: Imágenes Niveles (rookie.png ...)
    │   │   └── [project-slug]/ # Carpetas por proyecto
    │   │       ├── cover.jpg
    │   │       ├── gallery-01.jpg
    │   │       └── [nombre-alumno]-cert-preview.jpg
    │   │       └── [nombre-alumno]-cert-print.pdf
    │   │       └── ...
    │   └── docs/               # (Opcional, para PDFs de recursos)
    ├── Google sheets/          # NUEVO/ACTUALIZADO: Documentación y ejemplos
    │   ├── estructura tabla.csv
    │   ├── datos inventados usando lorem picsum.csv
    │   ├── generarJson.gs
    │   ├── Sidebar.html
    │   ├── Instrucciones de llenado tabla google sheets.md
    │   ├── Instrucciones del uso del script de google sheets.md
    │   └── Instrucciones para asistente IA sobre el llenado de tabla.md
    └── README.md               # Este archivo
    ```

    ## 🚀 Configuración Inicial

    1.  **Clonar Repositorio.**
    2.  **Google Sheet:**
        *   Crea una Hoja de Cálculo.
        *   Copia los **nuevos encabezados** de `Google sheets/estructura tabla.csv`.
        *   **MUY IMPORTANTE:** Sigue las **nuevas** [Instrucciones de Llenado](Google%20sheets/Instrucciones%20de%20llenado%20tabla%20google%20sheets.md), especialmente para `teamMembers`, `technologies`, `sdgIds` y los campos `rubric*`.
    3.  **Google Apps Script:**
        *   Abre `Extensiones > Apps Script` en tu Sheet.
        *   Copia el contenido de `Google sheets/generarJson.gs` al editor (reemplazando `Código.gs`).
        *   Crea un archivo HTML (`Archivo > Nuevo > Archivo HTML`), nómbralo `Sidebar.html` y copia el contenido de `Google sheets/Sidebar.html`.
        *   Guarda ambos. Recarga la Sheet. Autoriza el script la primera vez que uses `Gnius Club Tools > Generar JSON`.
    4.  **Assets:**
        *   Reemplaza `assets/img/gnius_logo_placeholder.png` con el logo real.
        *   **IMPORTANTE:** Asegúrate de tener las imágenes PNG para los 17 ODS, 12 Insignias y 3 Niveles en las carpetas `assets/img/ods/`, `assets/img/badges/`, `assets/img/levels/` con los nombres de archivo correctos (ej. `ods-1.png`, `code-explorer.png`, `rookie.png`).
    5.  **Pruebas Locales:** Usa "Live Server" (VS Code), `python -m http.server`, o `npx serve`.

    ## 🛠️ Uso y Flujo de Trabajo para Actualizar Contenido (v4.0)

    1.  **📝 Editar Google Sheet:** Añade/modifica una fila siguiendo las **nuevas instrucciones**. Rellena los IDs de ODS (`sdgIds`) y las 5 columnas de rúbrica (`rubric*` con valores 1, 2 o 3). Asegúrate de usar los valores predefinidos para Insignia/Nivel en `teamMembers`.
    2.  **🖼️ Preparar/Subir Imágenes:**
        *   Prepara imágenes de portada, galería, media.
        *   Genera las **dos** imágenes de certificado (`*-cert-preview.jpg`, `*-cert-print.pdf/.jpg`) para cada miembro.
        *   Crea la carpeta `assets/img/[slug-del-proyecto]/`.
        *   Sube **TODAS** las imágenes del proyecto (cover, gallery, media, certificados) a esa carpeta en tu repositorio local.
        *   (Las imágenes de ODS/Insignias/Niveles ya deberían estar en sus carpetas raíz).
    3.  **✍️ Actualizar Rutas/IDs en Sheets:** Verifica que `coverImageUrl`, `mediaUrl` (si imagen), `teamMembers` (rutas cert.) y `imageGallery` tengan las rutas relativas correctas. Asegúrate de que `sdgIds` tenga los números correctos.
    4.  **⚙️ Generar JSON:** Usa `Gnius Club Tools > Generar JSON`. Revisa advertencias/errores en la barra lateral y corrige la hoja si es necesario.
    5.  **📋 Copiar JSON:** Copia el JSON generado usando el botón.
    6.  **🔄 Actualizar `data/projects.json`:** Reemplaza el contenido del archivo local con el JSON copiado y guarda.
    7.  **⬆️ Commit & Push:** Confirma (`commit`) y sube (`push`) los cambios (`projects.json` y **nuevas imágenes** en `assets/img/[slug]/`) a GitHub.
    8.  **🌐 Despliegue:** GitHub Pages se actualiza automáticamente.

    ## 📊 Gestión de Datos (Google Sheets - v4.0)

    *   **Nuevos Encabezados:** Usa `camelCase` en inglés (ver `estructura tabla.csv`).
    *   **`schooling`:** Reemplaza `studentLevel`. Valores: "Primaria", "Secundaria", "Preparatoria".
    *   **`sdgIds`:** Lista de números (1-17) separados por coma.
    *   **`rubric*`:** 5 columnas (`rubricInnovation`, `rubricCollaboration`, etc.) con valor 1, 2 o 3 cada una.
    *   **`finalProjectGrade`:** **No se introduce manualmente.** El script la calcula (1-10) a partir de las 5 columnas `rubric*` y la guarda en el JSON.
    *   **`teamMembers`:**
        *   Formato `;` y `|` sin cambios, pero usa comas `,` para separar habilidades/criterios internos.
        *   **Insignia (Propiedad 5):** Debe ser uno de los 12 valores predefinidos.
        *   **Nivel (Propiedad 6):** Debe ser uno de los 3 valores predefinidos.
    *   **Consulta las [Instrucciones de Llenado](Google%20sheets/Instrucciones%20de%20llenado%20tabla%20google%20sheets.md) detalladas y usa los [Prompts para IA](Google%20sheets/Instrucciones%20para%20asistente%20IA%20sobre%20el%20llenado%20tabla.md) si necesitas ayuda.**

    ## 🤖 Google Apps Script (`generarJson.gs` - v4.0)

    *   Adaptado a la nueva estructura de encabezados (`camelCase`).
    *   Parsea `sdgIds`.
    *   Lee las 5 puntuaciones `rubric*`.
    *   **Calcula y añade `finalProjectGrade` (1-10) al JSON.**
    *   Valida valores de `schooling`, `sdgIds`, `rubric*`, Insignias y Niveles.
    *   Muestra resultado/validaciones en la barra lateral.

    ## 🎨 Personalización y Desarrollo Frontend

    *   **Estilos:** Modifica `css/style.css`. Variables de color `--gnius-*` definidas al inicio.
    *   **Lógica:** Adapta los archivos `js/main.js`, `js/project.js`, `js/certificate.js`.
    *   **Datos ODS:** La información (título, color, imagen) de cada ODS se encuentra en `js/ods-data.js`.

    ## 🚀 Despliegue en GitHub Pages

    (Sin cambios en el proceso)

    1.  Repositorio en GitHub.
    2.  `Settings > Pages`.
    3.  `Build and deployment` > Source: `Deploy from a branch`.
    4.  Branch: `main` (o tu rama principal), Folder: `/root`.
    5.  `Save`.
    6.  La URL estará disponible allí. Pushes a la rama actualizan el sitio.

    ---

    ¡Esperamos que esta versión actualizada sea aún más útil para Gnius Club!
