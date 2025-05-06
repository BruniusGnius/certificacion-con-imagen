(Inicio del Prompt Actualizado - Versión 2.1)
Prompt: Generador de Portafolios y Certificados Web Estáticos para Gnius Club (v2.1 - Refinado)
🧩 Contexto
Somos Gnius Club, una institución educativa que certifica proyectos de innovación, tecnología o impacto social desarrollados por estudiantes (primaria a preparatoria) mediante Soulbound Tokens (SBTs). Cada proyecto necesita un portafolio web individual y responsivo, vinculado a los certificados digitales de los estudiantes participantes. El certificado, a su vez, debe enlazar de vuelta al portafolio del proyecto como evidencia y mostrar una imagen pre-renderizada del mismo, ofreciendo también una versión para impresión.
🧔 Rol Asignado
Eres un Experto Desarrollador Full-Stack con especialización en la creación de sitios web estáticos, automatización de flujos de trabajo (Google Sheets a JSON) y diseño frontend responsivo utilizando tecnologías modernas como Tailwind CSS y JavaScript Vanilla. Tienes experiencia en la interpretación de requisitos complejos, la generación de código limpio, modular y fácil de mantener, con un buen ojo para la estética futurista y cyberpunk-light, prestando atención meticulosa a los detalles de layout, UX y manejo de datos solicitados.
🎯 Objetivo Principal
Tu tarea es generar el código fuente completo (HTML, CSS con Tailwind y clases personalizadas, JavaScript Vanilla), la estructura de datos inicial (Tabla para Google Sheets en formato CSV y archivo JSON con ejemplos realistas y variados), el script de automatización (Google Apps Script con validaciones básicas) y las instrucciones necesarias para crear un sitio web estático alojable en GitHub Pages. Este sitio mostrará portafolios de proyectos estudiantiles y certificados digitales asociados (mostrando imágenes pre-generadas), cargando dinámicamente la información desde un único archivo JSON generado a partir de una hoja de cálculo de Google Sheets.
🔑 Principios Clave del Proyecto
Simplicidad: La solución debe ser lo más sencilla posible de entender, usar y mantener, dado el flujo de datos elegido.
Fuente Única de Datos: Toda la información de proyectos y certificados asociados se gestionará desde UNA única hoja de cálculo y se consolidará en UN único archivo data/projects.json.
Automatización Parcial: El proceso de conversión Sheets -> JSON debe ser automatizado vía Apps Script. La generación y subida de imágenes (incluyendo las de certificado) y la actualización del JSON en el repositorio son pasos manuales.
Mantenibilidad: Usuarios sin conocimientos técnicos (posiblemente asistidos por una IA como ChatGPT) deben poder actualizar el contenido editando la hoja de Google Sheets, siguiendo instrucciones detalladas.
Compatibilidad: La solución debe ser desplegable exclusivamente en GitHub Pages.
Tecnología Definida: Usar solo HTML, CSS (Tailwind vía CDN + style.css para personalizaciones), JavaScript Vanilla (ES6+, modular), Chart.js v4+ (vía CDN), y Font Awesome v6 Free (vía CDN). Evitar frameworks JS complejos (React, Vue, Angular) y librerías JS adicionales no especificadas. Incluir fuentes 'Saira Semi Condensed', 'Saira Condensed' y 'Saira' de Google Fonts.
Enrutador Simple: URLs basadas en parámetros (project.html?slug=..., certificate.html?slug=...&memberIndex=...).
Convención de Nombres de Archivos: Se establecerá y documentará una lógica clara para nombrar los archivos de imagen subidos a assets/img/[project-slug]/.
📤 Entregables Esperados
Código HTML: Archivos index.html, project.html, certificate.html. Incluir <template> en index.html para la tarjeta de proyecto. Semántica y accesible.
Código CSS: Archivo css/style.css (utilizando clases de Tailwind CSS vía CDN y definiciones CSS estándar para estilos personalizados como border-glow-\*, tipografías específicas y ajustes finos).
Código JavaScript: Archivos js/main.js, js/project.js, js/certificate.js (código Vanilla JS, ES6+, modular, comentado, robusto ante datos faltantes, con manejo de errores y carga asíncrona de datos).
Archivo de Datos JSON: data/projects.json poblado con 5 proyectos de ejemplo diversos y realistas.
Usar URLs de picsum.photos/seed/nombre-unico/ancho/alto para imágenes placeholder solo en el ejemplo inicial. La estructura final usará rutas relativas como assets/img/[slug]/cover.jpg.
Proporciones: 16:9 para coverUrl (ej. 640x360), tamaños más grandes para imageGallery (ej. 800x450).
Incluir URLs de videos reales del canal de Gnius Club en media para al menos 2 proyectos.
Generar evaluationScores con valores aleatorios y contrastantes (0-100) para probar el gráfico dinámico.
Completar todos los campos requeridos, incluyendo los nuevos certificate_previewUrl y certificate_printUrl para cada miembro, apuntando a placeholders o rutas de ejemplo según la convención.
Estructura para Google Sheets (Formato CSV): Bloque de texto CSV con encabezado exacto (incluyendo nuevas columnas para URLs de certificados) y una fila de ejemplo, usando coma (,) como delimitador y comillas dobles (") para encapsular campos complejos.
Código Google Apps Script: Script generarJson.gs para leer la hoja activa, generar projects.json según la estructura definida, manejar correctamente campos complejos (|, ;), generar slugs automáticamente, incluir validaciones básicas de formato en celdas complejas y URLs, y devolver el JSON en diálogo/sidebar con menú personalizado.
Instrucciones y Prompt IA: Instrucciones claras y detalladas (en español) para:
Llenar y mantener la hoja de Google Sheets, explicando cada columna y el formato |;` para campos complejos.
La convención de nombres para archivos de imagen (cover.jpg, media.jpg, gallery-01.jpg, certificate-preview.jpg, certificate-print.jpg/.pdf) y cómo construir las rutas relativas (assets/img/[slug]/...).
El proceso completo de actualización (Editar Sheets -> Generar JSON -> Generar/Subir Imágenes -> Copiar/Pegar JSON -> Commit/Push).
Incluir un prompt de ejemplo para IA asistente (como ChatGPT) para ayudar a formatear los datos para las celdas complejas de Sheets.
📊 Estructura de Datos (Google Sheets & JSON)

1. Google Sheets: Estructura de la Hoja (Representada en CSV)
   Encabezados de Columna: projectTitle, projectCategory, studentLevel, projectDate, intro_title, intro_content, coverUrl_url, coverUrl_altText, problemDescription, solutionProposed, innovationProcess, media_type, media_url, media_altText, teamMembers, technologies, additionalResources, imageGallery, eval_Impacto Potencial, eval_Creatividad Solucion, eval_Innovacion Tecnica, eval_Ejecucion Tecnica, eval_Colaboracion Equipo, eval_Sostenibilidad Diseño.
   Formato Campos Complejos (en celda CSV, entre " si es necesario):
   Separador Elementos: | (espacio, barra vertical, espacio).
   Separador Propiedades: ; (punto y coma).
   teamMembers: Nombre;Rol;LinkSBT(o vacío);NombreCursoCertificado;NombreInsigniaCertificado;NivelCertificado;HabilidadesSeparadasPorPuntoyComa;CriteriosSeparadosPorPuntoyComa;ColegioCertificado;FechaEmisionCertificado(YYYY-MM-DD);RutaImagenPrevisualizacionCertificado;RutaImagenImpresionCertificado (Las dos últimas son las rutas relativas, ej: assets/img/mi-proyecto/juan-perez-cert-preview.jpg)
   technologies: NombreTecnologia;NombreIconoFontAwesome(sin prefijo fa-, ej: 'microchip', 'python');Categoria(Hardware/Software/Tool)
   additionalResources: TituloRecurso;URLRecurso;TipoRecurso(github/link/pdf/doc/website/etc)
   imageGallery: URLImagen;TextoAlternativo;Caption(Opcional) (URL es ruta relativa)
   Slug: Generado automáticamente por Apps Script desde projectTitle.
   Validación de Datos (Sugerencia en Sheets): Usar validación para categorías, niveles, tipos de media, tipos de recursos, categorías de tecnología.
2. JSON: Estructura del Archivo projects.json
   [

{

    "projectTitle": "string (Requerido)",

    "slug": "string (Generado Automáticamente)",

    "projectCategory": "string (Opcional)",

    "studentLevel": "string (Opcional)",

    "projectDate": "string (Formato YYYY-MM-DD, Opcional)",

    "intro_title": "string (Requerido)",

    "intro_content": "string (Requerido)",

    "coverUrl": { // Requerido

      "url": "string (Ruta relativa, ej: assets/img/slug/cover.jpg, Requerido)",

      "altText": "string (Requerido)"

    },

    "problemDescription": "string (Requerido)",

    "solutionProposed": "string (Requerido)",

    "innovationProcess": "string/html (Opcional)",

    "media": { // Opcional

      "type": "string ('video' o 'image')",

      "url": "string (URL YouTube Embed o ruta relativa imagen)",

      "altText": "string (Requerido si type='image')"

    },

    "teamMembers": [ // Requerido (al menos uno)

      {

        "name": "string (Requerido)",

        "role": "string (Requerido)",

        "sbtLink": "string (URL, Opcional)",

        "certificate_courseName": "string (Requerido)",

        "certificate_badgeName": "string (Requerido)",

        "certificate_level": "string (Requerido)",

        "certificate_skills": "string (Lista separada por ';')",

        "certificate_criteria": "string (Lista separada por ';')",

        "certificate_college": "string (Requerido)",

        "certificate_issueDate": "string (Formato YYYY-MM-DD)",

        "certificate_previewUrl": "string (Ruta relativa, ej: assets/img/slug/member-cert-preview.jpg, Requerido)",

        "certificate_printUrl": "string (Ruta relativa, ej: assets/img/slug/member-cert-print.jpg o .pdf, Requerido)"

      }

      // ... más miembros

    ],

    "technologies": [ // Requerido

      {

        "name": "string (Requerido)",

        "icon": "string (Nombre icono Font Awesome, ej: 'microchip', 'python')", // Apps Script añadirá 'fa-' o 'fa-brands fa-'

        "category": "string (Requerido - Hardware/Software/Tool)"

      }

      // ... más tecnologías

    ],

    "additionalResources": [ // Opcional

      {

        "title": "string (Requerido)",

        "url": "string (URL, Requerido)",

        "type": "string (ej. github, link, pdf, doc, Requerido)"

      }

      // ... más recursos

    ],

    "imageGallery": [ // Opcional

      {

        "url": "string (Ruta relativa, Requerido)",

        "altText": "string (Requerido)",

        "caption": "string (Opcional)"

      }

      // ... más imágenes

    ],

    "evaluationScores": { // Requerido (objeto con claves como en Sheets, ej. "eval_Impacto Potencial": 85)

      // ... métricas ... : number (0-100)

    }

}

// ... más proyectos

] 3. Texto Base del Certificado (Usado para generar las imágenes, no directamente en HTML)
"Este certificado es expedido por parte de Gnius Club y [certificate_college]. La persona que obtuvo esta insignia presentó de manera exitosa el proyecto que realizó durante el curso [certificate_courseName], demostrando que es capaz de: Identificar un problema real relacionado con el uso de la tecnología y la información y construir una solución pertinente y significativa para resolverlo. También demuestra que puede aplicar las herramientas aprendidas para desarrollar proyectos de [certificate_badgeName] a nivel [certificate_level]."

(Este texto es una guía para quien cree las imágenes certificate-preview.jpg y certificate-print.jpg/.pdf)
🏗️ Estructura y Contenido del Sitio Web

1. Estructura de Archivos y Carpetas
   .

├── index.html

├── project.html

├── certificate.html

├── css/

│ └── style.css

├── js/

│ ├── main.js

│ ├── project.js

│ └── certificate.js

│ └── utils.js # (Opcional, para funciones comunes como fetch, slugify, etc.)

├── data/

│ └── projects.json

└── assets/

    └── img/

        └── gnius_logo_placeholder.png # (Reemplazar con logo real)

        └── [project-slug-1]/

        │   ├── cover.jpg

        │   ├── gallery-01.jpg

        │   ├── student1-cert-preview.jpg

        │   ├── student1-cert-print.pdf

        │   └── ...

        └── [project-slug-2]/

            └── ...

2. Contenido index.html (Página Principal)
   Header: Logo Gnius Club.
   Zona de Filtros/Búsqueda: Contenedor flex (#filters), responsivo (Móvil: apilados; Tablet+: en línea). Inputs: Texto (título/estudiante), Select Categoría, Select Nivel, Select Tecnología. Botón Limpiar (rojo).
   Listado de Proyectos: Grid (#project-list), responsivo. Usar <template id="project-card-template">.
   Card: Imagen 16:9 (coverUrl.url), Título truncado, Chips Metadata (Categoría-Cyan, Nivel-Rojo), Descripción corta, Chips Estudiantes (gris, pequeños), Enlace "Ver Detalles" (discreto, alineado derecha). Hover scale-103.
   Paginación: Controles Anterior/Siguiente, info Página X de Y.
   Footer: Copyright Gnius Club, año dinámico.
3. Contenido project.html (Detalle de Proyecto)
   Header: Logo izquierda, enlace "Volver" derecha.
   Sección Hero (2 cols): Izq: Título (Cyan), Metadata, Intro Título (Amarillo), Intro Contenido. Der: Contenido Dinámico Principal (media video/imagen si existe, sino coverUrl). Ocultar si no hay media ni cover.
   Sección Principal (2 cols, items-start): Izq (Evidencia Adicional): Título "Evidencia" (Rojo). Contenido Dinámico Secundario (si media se usó en Hero, mostrar coverUrl; si coverUrl se usó en Hero, mostrar 1ª imagen de imageGallery). Ocultar si no aplica. Der (Gráfico): Título "Puntuaciones" (Amarillo). Canvas #radarChart (Chart.js Radar, rejilla circular, curvas tension: 0.3, color dinámico amarillo-verde basado en promedio 0-100, relleno 40%, borde 100%, tooltips/etiquetas legibles, Saira Condensed).
   Secciones Contenido: Problema (Rojo)/Solución (Cyan) (2 cols), Proceso Innovación (Amarillo, contenido HTML, ocultar si vacío).
   Sección Galería: Título (Amarillo). Grid responsivo (.gallery-grid). Items (.gallery-item) clickeables -> Modal. Ocultar si vacío.
   Modal (#imageModal): Overlay oscuro. Contenido (.modal-content.modal-content-wide, borde Cyan). Imagen (#modalImage, object-contain), Caption (#modalCaption), Botón Cierre (#modalCloseBtn, rojo, fuera esquina sup-der). Proporción aprox 16:10. Animación fade-in.
   Aside (Barra Lateral):
   Equipo: Título (Cyan), Borde Glow Cyan. Lista (ul#team-list). Item: Flex (Info izq: Nombre, Rol; Enlace der: icono premio + "Ver Certificado").
   Tecnologías: Título (Amarillo), Borde Glow Amarillo. Contenedor flex-wrap (div#tech-list). Chip (.tech-chip-container: Saira Condensed, icono color HW/SW/Tool, nombre, chip anidado categoría).
   Recursos: Título (Rojo), Borde Glow Rojo. Lista enlaces (ul#resources-list) con icono tipo. Ocultar si vacío.
   Footer: Copyright.
4. Contenido certificate.html (Página de Certificado)
   Recibe slug y memberIndex vía URL Params. Busca el proyecto y miembro correctos en projects.json.
   Layout Principal: Ancho consistente con index/project.
   Header: Logo Gnius Club, Enlace "Volver al Proyecto".
   Título Principal: "Certificado de Proyecto de Innovación" (o similar).
   Contenedor Certificado (flex, posible wrap en móvil):
   Zona Visualización (Izquierda/Arriba):
   Imagen de previsualización (img#certificate-preview-image) cargada desde member.certificate_previewUrl. Alt text descriptivo.
   Botón/Enlace "Descargar Certificado para Imprimir" (a#certificate-download-link) que apunta a member.certificate_printUrl. Estilo claro (botón primario o destacado).
   Zona de Datos/Metadatos (Derecha/Abajo - tipo Aside):
   Nombre del Estudiante: (h2#student-name).
   Curso: (p#course-name) con member.certificate_courseName.
   Insignia: Chip Amarillo (span.chip.chip-yellow) con member.certificate_badgeName.
   Nivel: Chip Cian (span.chip.chip-cyan) con member.certificate_level.
   Habilidades Demostradas: Título + Lista/Chips (div#skills-list, chips cyan) con member.certificate_skills (separados por ';').
   Criterios de Evaluación Clave: Título + Lista/Chips (div#criteria-list, chips amarillos) con member.certificate_criteria (separados por ';').
   Enlace Transacción SBT (Opcional): Si member.sbtLink existe, mostrar un enlace claro "Ver Transacción SBT" con icono blockchain/link.
   Información de Emisión: Párrafo (p#issuance-info) "Emitido por Gnius Club y [college] el [date]".
   Footer Simple: Copyright.
   🎨 Diseño Visual y Experiencia de Usuario (UX)
   Inspiración: gnius.club, futurista/cyberpunk-light, tecnológico, limpio.
   Fuentes Google: Saira Semi Condensed (Principal), Saira Condensed (Secundaria, ej. Tech Chips, Gráfico), Saira (Terciaria/Base). Incluir pesos necesarios (ej. 400, 600, 700).
   Paleta: Fondos #0F0F0F / #1F1F1F. Texto principal #F0F0F0. Acentos: Amarillo #FFD700, Cian #00FFFF, Rojo #FF0000. Usar grises intermedios (#333, #555, etc.) para elementos secundarios o bordes sutiles.
   Bordes Glow: Clases CSS personalizadas (.border-glow-cyan, .border-glow-yellow, .border-glow-red) usando box-shadow aplicadas a contenedores del Aside en project.html.
   Chips: .chip (base, padding, Saira Semi Condensed), .chip-yellow, .chip-cyan, .chip-red, .chip-gray (discreto, fondo gris oscuro, texto claro). .tech-chip-container (Saira Condensed, estructura anidada).
   Responsividad: Mobile-First estricto, Tailwind breakpoints (sm, md, lg, xl).
   Accesibilidad: Contraste adecuado, semántica HTML, atributos alt, aria-labels donde sea pertinente.
   Animaciones: Sutiles: Hover cards (transform: scale(1.03)), Modal (opacity fade-in/out).
   Iconos: Font Awesome 6 Free CDN (usar <i> tags con clases fa-solid, fa-brands, etc.). El Apps Script ayudará a determinar el prefijo para iconos de tecnología.
   Gráfica: Chart.js Radar (v4+): Responsiva, rejilla circular, líneas curvas (tension: 0.3), color borde/relleno dinámico (amarillo -> verde vibrante según promedio 0-100), relleno opacidad ~40%, etiquetas claras (Saira Condensed, posible multi-línea).
   Visibilidad Contenido Opcional: Ocultar rigurosamente secciones/elementos (display: none) si los datos correspondientes (innovationProcess, media, additionalResources, imageGallery, sbtLink) están vacíos o no son válidos, incluyendo sus títulos y contenedores wrappers.
   🔧 Requisitos Técnicos Específicos
   JavaScript Vanilla: ES6+, moderno, modular (main.js, project.js, certificate.js, opcional utils.js). Usar async/await para fetch. Manejo errores (try/catch, mostrar mensajes de error amigables al usuario en la UI). Manipulación DOM segura (verificar existencia de elementos). Parseo de URL Params para project.html y certificate.html.
   Tailwind CSS: Vía CDN (última versión v3+). Configuración básica si es necesaria (improbable con CDN).
   CSS Personalizado (css/style.css): Definiciones para fuentes (@import Google Fonts), clases border-glow-\*, estilos específicos de chips (.tech-chip-container), ajustes finos de layout o tipografía no cubiertos por Tailwind, estilos del modal.
   Chart.js: Vía CDN (v4+). Implementación limpia en project.js.
   Font Awesome: Vía CDN (v6 Free).
   Google Apps Script (generarJson.gs):
   Leer hoja activa.
   Mapear headers a claves JSON.
   Parsear celdas complejas (|, ;), trimando espacios.
   Validación básica: verificar número esperado de props en campos complejos, alertar si falta projectTitle, chequear formato YYYY-MM-DD en fechas, validar URLs relativas (inicio con assets/).
   Generar slug (lowercase, guiones, único si es posible - aunque la unicidad la debe garantizar el usuario en el título).
   Añadir prefijo Font Awesome (fa-solid fa- o fa-brands fa- basado en heurística o un mapeo simple si es necesario) al icono de tecnología.
   Construir JSON válido.
   Presentar JSON en diálogo/sidebar con botón "Copiar" y añadir menú "Gnius Club Tools > Generar JSON" en la UI de Sheets.
   Fuente Google Fonts: Incluir los @import necesarios en style.css para 'Saira Semi Condensed', 'Saira Condensed', 'Saira'.
   🔁 Flujo de Trabajo de Actualización
   Edición: Usuario/IA edita Google Sheet.
   (Nuevo) Generación Imágenes: Usuario genera las imágenes personalizadas (certificate-preview.jpg, certificate-print.jpg/.pdf) para cada nuevo miembro/certificado.
   (Nuevo) Subida Imágenes: Usuario sube todas las imágenes nuevas/actualizadas (cover, gallery, media, certificados) a la carpeta correcta (assets/img/[slug]/) en su repositorio local/GitHub.
   (Actualizado) Actualización Rutas en Sheets: Usuario introduce/corrige las rutas relativas exactas a las imágenes (incluyendo las de certificado) en las columnas correspondientes de Google Sheets.
   Generación JSON: Usuario ejecuta Apps Script desde menú "Gnius Club Tools > Generar JSON". Script valida datos básicos.
   Copia: Usuario copia el JSON generado del diálogo/sidebar.
   Actualización Repo: Usuario reemplaza contenido de data/projects.json en su copia local del repositorio.
   Commit & Push: Sube los cambios (código, projects.json, nuevas imágenes en assets/img/) a GitHub.
   Despliegue: GitHub Pages se actualiza automáticamente.
   ✍️ Instrucciones para Llenar Google Sheets y Prompt para IA Asistente
   Instrucciones Detalladas:
   Explicar cada columna del CSV/Sheets.
   Detallar minuciosamente el formato Prop1;Prop2;... | Prop1;Prop2;... para teamMembers, technologies, additionalResources, imageGallery. Enfatizar orden exacto, uso de ; sin espacios alrededor, uso de | (con espacios) entre elementos.
   Explicar uso obligatorio de comillas dobles (") en el CSV si el contenido de una celda compleja contiene comas, saltos de línea o punto y coma. (Aunque es mejor evitar estos caracteres en los datos).
   Especificar la convención de nombres de archivo: assets/img/[project-slug]/cover.jpg, gallery-01.jpg, [nombre-alumno]-cert-preview.jpg, [nombre-alumno]-cert-print.pdf, etc. donde [project-slug] se deriva del projectTitle.
   Aclarar que las rutas en Sheets deben ser relativas al raíz del sitio (ej. assets/img/mi-robot/cover.png).
   Incluir el flujo de trabajo completo.
   Prompt IA Ejemplo:
   Proporcionar un prompt claro para que un usuario lo dé a una IA (como ChatGPT) junto con los datos brutos de un miembro, tecnología, recurso o galería, y la IA devuelva el string exactamente formateado para pegar en la celda correspondiente de Sheets.
   Ejemplo para teamMembers: "Formatea los siguientes datos de miembro de equipo para la celda 'teamMembers' de Google Sheets usando ';' como separador de propiedades y ' | ' como separador si hay múltiples miembros (aunque solo necesito uno ahora): Nombre='Ana García', Rol='Diseñadora UX', Link SBT='', Curso='Diseño Interfaces Web', Insignia='Diseño Prototipos', Nivel='Intermedio', Habilidades='Figma;Prototipado;User Research', Criterios='Claridad interfaz;Usabilidad;Estética', Colegio='Colegio Creativo', Fecha='2024-09-15', Preview URL='assets/img/proyecto-x/ana-garcia-cert-preview.jpg', Print URL='assets/img/proyecto-x/ana-garcia-cert-print.pdf'. Asegúrate de seguir el orden exacto."
   🧪 Datos de Ejemplo (data/projects.json)
   Generar 5 proyectos diversos.
   Usar picsum.photos solo como placeholder inicial si no se tienen rutas de ejemplo. Las rutas finales deben seguir el patrón assets/img/[slug]/....
   Incluir media con type: 'video' (URLs YouTube Embed reales) y type: 'image' (ruta relativa ejemplo).
   evaluationScores: Valores 0-100 variados.
   Completar todos los campos requeridos, incluyendo rutas de ejemplo para certificate_previewUrl y certificate_printUrl.
   🚀 Ejecución
   Genera todos los entregables especificados (HTML, CSS, JS, JSON, Estructura CSV Sheets, Apps Script, Instrucciones + Prompt IA) basándote en este prompt v2.1 refinado. Asegúrate de que el código sea funcional, siga todas las directrices actualizadas, y cumpla con todos los requisitos. Implementa la lógica de contenido condicional, el gráfico radar dinámico y el manejo de las imágenes de certificado según lo acordado.

(Fin del Prompt Actualizado - Versión 2.1)
