(Inicio del Prompt Definitivo - Versión 3.0)
Prompt: Generador de Portafolios y Certificados Web Estáticos para Gnius Club (v3.0 - ODS & Rúbrica)

1.  🧩 **Contexto**
    Somos Gnius Club, una institución educativa que certifica proyectos de innovación, tecnología o impacto social desarrollados por estudiantes (primaria a preparatoria) mediante Soulbound Tokens (SBTs). Cada proyecto necesita un portafolios web individual y responsivo, vinculado a los certificados digitales de los estudiantes participantes. El certificado, a su vez, debe enlazar de vuelta al portafolio del proyecto como evidencia y mostrar una imagen pre-renderizada del mismo, ofreciendo también una versión para impresión.

2.  🧔 **Rol Asignado**
    Eres un Experto Desarrollador Full-Stack con especialización en la creación de sitios web estáticos, automatización de flujos de trabajo (Google Sheets a JSON) y diseño frontend responsivo utilizando tecnologías modernas como Tailwind CSS y JavaScript Vanilla. Tienes experiencia en la interpretación de requisitos complejos, la generación de código limpio, modular, bien comentado y fácil de mantener, con un buen ojo para la estética futurista y cyberpunk-light, prestando atención meticulosa a los detalles de layout, UX y manejo de datos solicitados.

3.  🎯 **Objetivo Principal**
    Tu tarea es generar el código fuente completo (HTML, CSS con Tailwind y clases personalizadas, JavaScript Vanilla), la estructura de datos inicial (Tabla para Google Sheets en formato CSV con 14 ejemplos y archivo JSON correspondiente), el script de automatización (Google Apps Script con validaciones y cálculo de calificación), y las instrucciones necesarias para crear un sitio web estático alojable en GitHub Pages. Este sitio mostrará portafolios de proyectos estudiantiles (con ODS y evaluación por rúbrica) y certificados digitales asociados (con imágenes de insignia/nivel y previsualización de certificado), cargando dinámicamente la información desde un único archivo JSON.

4.  🔑 **Principios Clave del Proyecto**

    - **Simplicidad:** La solución debe ser lo más sencilla posible de entender, usar y mantener.
    - **Fuente Única de Datos:** Toda la información se gestionará desde UNA única Google Sheet y se consolidará en UN único archivo `data/projects.json`.
    - **Automatización Parcial:** El proceso de conversión Sheets -> JSON será automatizado vía Apps Script. La generación y subida de imágenes (proyecto, certificados, ODS, insignias, niveles) y la actualización del JSON en el repositorio son pasos manuales.
    - **Mantenibilidad:** Usuarios sin conocimientos técnicos (asistidos por IA) deben poder actualizar contenido editando la Google Sheet.
    - **Compatibilidad:** Desplegable exclusivamente en GitHub Pages.
    - **Tecnología Definida:**
      - HTML5 Semántico y Accesible.
      - CSS3: Tailwind CSS v3+ (vía CDN) + `css/style.css` para personalizaciones (variables de color, estilos de componentes específicos, fuentes).
      - JavaScript Vanilla (ES6+, moderno, modular, bien comentado, robusto ante datos faltantes, con manejo de errores y carga asíncrona de datos).
      - Chart.js v4+ (vía CDN) para gráficos Gauge y Barras de Rúbrica.
      - Font Awesome 6 Free (vía CDN) para iconos.
      - Google Fonts: 'Saira Semi Condensed' (principal, usar pesos 500, 600, 700, 800, 900) y 'Saira Condensed' (secundaria, usar pesos 400, 600, 700, 900). **No usar la fuente 'Saira' simple.**
      - Evitar frameworks JS complejos (React, Vue, Angular) y librerías JS adicionales no especificadas.
    - **Enrutador Simple:** URLs basadas en parámetros (`project.html?slug=...`, `certificate.html?slug=...&memberIndex=...`).
    - **Código Completo:** Para cada archivo solicitado, se debe entregar el código completo, sin omitir secciones con comentarios como "sin cambios" o "igual que antes".

5.  📤 **Entregables Esperados**

    - **Código HTML:** Archivos `index.html`, `project.html`, `certificate.html`. Incluir `<template id="project-card-template">` en `index.html`.
    - **Código CSS:** Un único archivo `css/style.css` consolidado.
    - **Código JavaScript:** Archivos `js/main.js`, `js/project.js`, `js/certificate.js`, y `js/ods-data.js`.
    - **Archivo de Datos JSON (`data/projects.json`):** Poblado con **14 proyectos de ejemplo** diversos y realistas.
      - **Imágenes:** 3 proyectos usarán rutas relativas a `assets/img/[slug]/` para `coverImageUrl`, `mediaUrl` (si imagen), e `imageGallery`. Los 11 restantes usarán URLs de `picsum.photos/seed/nombre-unico/ancho/alto` (asegurar proporción 16:9 para `coverImageUrl` y `mediaUrl` tipo imagen; usar otras proporciones como 800x600 o 1024x768 para `imageGallery`).
      - **Certificados:** 2 de los proyectos con rutas reales tendrán rutas de certificado individuales para sus miembros (ej. `assets/img/[slug]/alumno-slug-cert-preview.png`). Los miembros de los otros 12 proyectos usarán `assets/img/certificado.png` como placeholder.
      - **Videos:** Al menos 3-4 proyectos con `mediaType: 'video'` deben usar URLs de YouTube funcionales y temáticamente variadas (reutilizar las 3 que funcionan: `https://www.youtube.com/embed/Z1RJmh_OqeA`, `https://www.youtube.com/embed/QZQEUdalseI`, `https://www.youtube.com/embed/bMiwLs0pCB8`).
    - **Estructura para Google Sheets (Formato CSV):** Un archivo `Google sheets/datos_ejemplo_14_proyectos.csv` con encabezados `camelCase` en inglés y los 14 proyectos de ejemplo.
    - **Código Google Apps Script:** `Google sheets/generarJson.gs` y `Google sheets/Sidebar.html`, actualizados para la estructura de datos final.
    - **Documentación (Archivos Markdown en `Google sheets/` y raíz):**
      - `README.md` (actualizado al estado final del proyecto).
      - `Google sheets/Instrucciones de llenado tabla google sheets.md` (detallado, con formatos y valores permitidos).
      - `Google sheets/Instrucciones del uso del script de google sheets.md`.
      - `Google sheets/Instrucciones para asistente IA sobre el llenado de tabla.md` (prompts actualizados).

6.  📊 **Estructura de Datos Final (Google Sheets & JSON)**

    - **6.1. Google Sheets (Encabezados CSV):**
      `projectTitle,projectCategory,schooling,projectDate,sdgIds,introTitle,introContent,coverImageUrl,coverImageAltText,problemDescription,solutionProposed,innovationProcess,mediaType,mediaUrl,mediaAltText,teamMembers,technologies,additionalResources,imageGallery,rubricInnovation,rubricCollaboration,rubricImpact,rubricTechUse,rubricPresentation`
    - **6.2. Formato Campos Complejos (en Celdas de Sheets):**
      - Separador de Múltiples Items: `|` (espacio, barra vertical, espacio).
      - Separador de Propiedades dentro de un Item: `;` (punto y coma, SIN espacios alrededor).
    - **6.3. Detalle del Campo `teamMembers` (Valores que ingresa el usuario en la celda):**
      - **Orden Estricto de 12 Valores por Miembro (separados por `;`):**
        1.  Nombre Completo del Estudiante
        2.  Rol en el Proyecto
        3.  Enlace SBT (URL o vacío)
        4.  Nombre del Curso del Certificado
        5.  Nombre de la Insignia del Certificado (**Valor Predefinido EXACTO** de la lista provista)
        6.  Nivel del Certificado (**Valor Predefinido EXACTO** de la lista provista)
        7.  Habilidades Demostradas (lista separada por **COMA SIN ESPACIOS**)
        8.  Criterios de Evaluación Clave (lista separada por **COMA SIN ESPACIOS**)
        9.  Nombre del Colegio
        10. Fecha de Emisión del Certificado (DD-MM-YYYY o YYYY-MM-DD)
        11. Ruta Relativa a Imagen Preview Certificado (ej: `assets/img/slug-proyecto/nombre-slug-cert-preview.png`)
        12. Ruta Relativa a Archivo Impresión Certificado (ej: `assets/img/slug-proyecto/nombre-slug-cert-print.pdf`)
      - **Valores Permitidos (Insignia):** `Code Explorer`, `Algorithm Seeker`, `Micro Programmer`, `Robot Navigator`, `Tech Voyager`, `Network Pioneer`, `Design Architect`, `Reality Master`, `Expert Roboteer`, `Prompt Sage`, `App Maverick`, `AI Paragon`.
      - **Valores Permitidos (Nivel):** `Rookie`, `Master`, `Hacker`.
    - **6.4. Detalle del Campo `technologies` (Valores):** NombreTec;IconoFA;Categoría (`Hardware`/`Software`/`Tool`).
    - **6.5. Detalle del Campo `additionalResources` (Valores):** Titulo;URL;TipoRecurso.
    - **6.6. Detalle del Campo `imageGallery` (Valores):** URLImagen;TextoAlt;CaptionOpcional.
    - **6.7. Detalle del Campo `sdgIds` (Valores):** Números 1-17 separados por coma SIN ESPACIOS (ej. `4,9,17`).
    - **6.8. Detalle Campos `rubric*` (Valores):** Número 1, 2, o 3.
    - **6.9. JSON (`data/projects.json`) - Estructura Principal por Proyecto:**
      ```json
      {
        "projectTitle": "string", "slug": "string", "projectCategory": "string", "schooling": "string",
        "projectDate": "string (YYYY-MM-DD)", "sdgIds": [Number],
        "introTitle": "string", "introContent": "string",
        "coverImage": {"url": "string", "altText": "string"},
        "problemDescription": "string", "solutionProposed": "string", "innovationProcess": "string/html",
        "media": {"type": "string", "url": "string", "altText": "string?"},
        "teamMembers": [{
            "name": "string", "role": "string", "sbtLink": "string?",
            "certificateCourseName": "string", "certificateBadgeName": "string", "certificateLevel": "string",
            "certificateSkills": "string", "certificateCriteria": "string", "certificateCollege": "string",
            "certificateIssueDate": "string (YYYY-MM-DD)",
            "certificatePreviewUrl": "string", "certificatePrintUrl": "string"
        }],
        "technologies": [{"name": "string", "icon": "string", "category": "string"}],
        "additionalResources": [{"title": "string", "url": "string", "type": "string"}],
        "imageGallery": [{"url": "string", "altText": "string", "caption": "string?"}],
        "projectRubricScores": {
            "innovation": Number, "collaboration": Number, "impact": Number,
            "techUse": Number, "presentation": Number
        },
        "finalProjectGrade": Number (1-10) // Calculado por Apps Script
      }
      ```

7.  🏗️ **Estructura y Contenido del Sitio Web**

    - **7.1. Estructura de Archivos y Carpetas `assets/`:**
      - `assets/img/gnius_logo_placeholder.png` (Reemplazar)
      - `assets/img/certificado.png` (Placeholder para certificados de miembros si no tienen imagen individual)
      - `assets/img/ods/`: `ods-1.png` ... `ods-17.png` (logos individuales, 256x256px rec.), `SDG-ONU-LOGO.png` (logo general).
      - `assets/img/badges/`: 12 imágenes PNG (ej. `code-explorer.png`, 40x40px o 60x60px).
      - `assets/img/levels/`: 3 imágenes PNG (ej. `rookie.png`, 40x40px o 60x60px).
      - `assets/img/[project-slug]/`: Carpetas por proyecto con `cover.jpg`, `media.jpg` (opc.), `gallery-XX.jpg`, `[alumno-slug]-cert-preview.png`, `[alumno-slug]-cert-print.pdf`.
    - **7.2. `index.html` (Página Principal):**
      - **Header:** Logo.
      - **Filtros:** Texto (título/estudiante), Selects para Categoría, Escolaridad (`schooling`), Tecnología, **ODS**. Botón Limpiar. Layout responsivo.
      - **Listado de Proyectos:** Grid responsivo. Usar `<template id="project-card-template">`.
      - **Card de Proyecto:** Imagen 16:9. Título truncado (Saira Semi Condensed Bold). **Chips ODS** (pequeños cuadrados con número, color ODS, tooltip con nombre, máx. 3-4 visibles). Chips Metadata (Categoría - `chip-cyan-muted-border`, Escolaridad - `chip-red-muted-border`, ambos Saira Condensed Medium 12px). Descripción corta. **Chips Estudiantes** (Saira Condensed Semibold 12px, gris, mostrar hasta 4 nombres, luego "+X más"). Enlace "Ver Detalles" (alineado abajo derecha). Hover `scale-[1.02]`. **Todas las cards deben tener la misma altura** (usar flexbox o grid para igualar).
      - **Paginación:** Controles y Página X de Y.
      - **Modal Leyenda ODS:** Botón flotante para abrir modal con los 17 ODS (logo, número, título completo), enlazando a UN.org.
      - **Footer:** Copyright.
    - **7.3. `project.html` (Detalle de Proyecto):**
      - **Header:** Logo, Volver.
      - **Sección Hero:** 2 columnas, `items-center`.
        - Col Izquierda: Contenedor `relative`. **Badges ODS** (`div#hero-sdg-badges`) posicionados `absolute top-0 right-0` dentro de esta columna, horizontales (32px alto, número + icono, fondo color ODS). Contenido principal de texto con `padding-top` adecuado (ej. `pt-14 md:pt-0`) para no solapar: Título Proyecto (Saira Semi Condensed Black, Gnius Cyan), Chips Metadata (Categoría/Escolaridad), Título Intro (Saira Semi Condensed Bold, Gnius Yellow), Contenido Intro (Prose).
        - Col Derecha: Media Principal 16:9 (Video Embed o Imagen).
      - **Sección 1 (Evaluación y ODS):** 2 columnas (`lg:grid-cols-3`, `items-stretch`).
        - Col Izq (2/3): Sección "Evaluación del Proyecto" (`bg-gnius-dark-2`). Título (Saira Semi Condensed Bold, Gnius Yellow). Grid interno 1 o 2 cols:
          - Gauge: `canvas#gaugeChart` (media dona Chart.js, `max-w-[300px] h-[150px]`), score (`text-7xl font-black`, blanco, centrado/debajo), label "Calificación Final" (`text-xl font-semibold`). Colores semáforo (Verde >=8, Amarillo >=5, Rojo <5).
          - Rúbrica: 5 Barras de Progreso (`div#rubric-criteria-container`). Cada una con nombre criterio y barra (`h-4`) con score (1-3) y color (Rojo/Amarillo/Verde). Leyenda global.
        - Col Der (1/3): Sección "ODS Abordados". Título (Saira Semi Condensed Bold, Gnius Yellow). Panel (`div#sdg-details-grid`): `grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 justify-items-center`. Mostrar los 17 ODS como tiles (`.sdg-panel-item`, `height: 75px`, solo Número y Título en mayúsculas). Activos con color ODS, inactivos atenuados. Logo General ODS (`SDG-ONU-LOGO.png`) al final, ocupando `md:col-span-3` (o el necesario para llenar fila de 5).
      - **Layout Inferior (Contenido + Aside):** `grid grid-cols-1 lg:grid-cols-3`.
        - Contenido Principal (2/3, `lg:order-1`): Problema, Solución, Proceso Innovación (`bg-gnius-dark-2`), Evidencia Adicional, Galería.
        - Aside (1/3, `lg:order-2`, `bg-gnius-dark-2` en cada sección interna): Equipo (enlace "Ver Certificado" estilo respaldo), Tecnologías, Recursos.
      - **Modal Galería:** Estándar.
      - **Footer:** Copyright.
    - **7.4. `certificate.html` (Página de Certificado):**
      - **Header:** Logo, Volver al Proyecto.
      - **Título Principal.**
      - **Contenedor Certificado (2 cols):**
        - Col Izq (2/3): Imagen Preview Certificado (`aspect-1200/926`). Botones "Descargar" y "Ver Proyecto" (estilo `link-action underline`).
        - Col Der (Aside 1/3, `bg-gnius-dark-2`): Nombre Estudiante, Curso.
          - **Píldora Insignia:** `div#badge-container.certificate-info-pill`. Imagen (`#badge-image`, 60x60px) "flotando" a la izquierda. Píldora con `border-radius` solo a la derecha. Borde de color dinámico (según insignia, desde `badgeBorderColors` en JS). Fondo transparente. Texto (`#badge-name`, claro, `font-weight: 800`).
          - **Píldora Nivel:** `div#level-container.certificate-info-pill`. Imagen (`#level-image`, 60x60px) "flotando". Borde violáceo sólido (`--gnius-violet`). Fondo transparente. Texto (`#level`, claro, `font-weight: 800`). JS añadirá clase `level-padding-[slug]` para ajustar `margin-left` del texto.
          - Habilidades/Criterios (chips outline `text-xs`), Enlace SBT, Info Emisión.
      - **Footer:** Copyright.

8.  🎨 **Diseño Visual y UX**

    - **Fuentes Google:** 'Saira Semi Condensed' (Pesos: 500(Medium/Base), 600(Semibold), 700(Bold), 800(ExtraBold), 900(Black)). 'Saira Condensed' (Pesos: 400(Normal), 600(Semibold), 700(Bold), 900(Black)).
    - **Paleta:** Fondos `#0F0F0F` / `#1F1F1F`. Texto principal `#F0F0F0`. Acentos: Amarillo `#FFD700`, Cian `#00FFFF`, Rojo `#FF0000`, Verde `#4CAF50`, Violeta `#8731fa`.
    - **No usar Bordes Glow** en el Aside de `project.html`.
    - **Chips:** (Definidos en CSS) `.chip` base, `.chip-metadata` (Saira Condensed), `.student-chip` (Saira Condensed), `.tech-chip-container` (Saira Condensed).
    - **Responsividad:** Mobile-First, Tailwind breakpoints.
    - **Visibilidad Contenido Opcional:** Ocultar rigurosamente secciones/elementos si datos faltan.

9.  🔧 **Requisitos Técnicos Específicos**

    - **Google Apps Script (`generarJson.gs`):** Validar encabezados, parsear campos complejos (incluyendo comas en Habilidades/Criterios de `teamMembers`), generar slugs, **calcular `finalProjectGrade`**, validar `schooling`, `sdgIds`, `rubric*`, Insignias/Niveles. Asignar prefijos FontAwesome.
    - **JavaScript:** Modular. Manejo de errores y carga asíncrona. Parseo URL Params.

10. 🔁 **Flujo de Trabajo de Actualización** (Documentar detalladamente).

11. ✍️ **Instrucciones para Llenar Google Sheets y Prompt para IA Asistente** (Actualizar con todos los detalles, formatos, valores permitidos y ejemplos para `teamMembers`, `sdgIds`, `rubric*`).

12. 🚀 **Ejecución**
    Genera **TODOS** los entregables especificados, asegurando que cada archivo de código sea **completo y autocontenido**, sin referencias como "sin cambios". El código debe ser funcional, seguir todas las directrices actualizadas y cumplir con todos los requisitos de este prompt v3.0.
