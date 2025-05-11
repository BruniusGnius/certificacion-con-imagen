# Generador de Portafolios y Certificados Estáticos - Gnius Club (vFinal - ODS & Rúbrica Detallada) 🚀

Este proyecto genera un sitio web estático para mostrar portafolios de proyectos estudiantiles y certificados digitales asociados para **Gnius Club**. Utiliza Google Sheets como fuente única de datos, Google Apps Script para automatizar la conversión a JSON, y tecnologías web estándar (HTML, CSS con Tailwind, JavaScript Vanilla) para el frontend. El sitio está optimizado para desplegarse fácilmente en GitHub Pages e incluye la visualización de Objetivos de Desarrollo Sostenible (ODS), una nueva estructura de evaluación por rúbrica, y certificados con imágenes distintivas de insignia y nivel.

## ✨ Descripción General

Gnius Club certifica proyectos de innovación, tecnología o impacto social desarrollados por estudiantes (primaria a preparatoria). Este sistema web estático permite:

1.  **Gestionar Centralizadamente:** Toda la información de los proyectos, detalles de los miembros del equipo, Objetivos de Desarrollo Sostenible (ODS) asociados, y la evaluación detallada por rúbrica se manejan desde una **única Hoja de Cálculo de Google**.
2.  **Automatizar Parcialmente:** Un **Google Apps Script** convierte los datos de la hoja de cálculo en un archivo `data/projects.json`. El script también realiza validaciones básicas y calcula la calificación final del proyecto. La generación y subida de imágenes (proyecto, certificados, ODS, insignias, niveles) son procesos manuales.
3.  **Mostrar Portafolios Detallados:** Cada proyecto tiene una página individual responsiva que incluye:
    - Descripción del proyecto, problema y solución.
    - Proceso de innovación.
    - Media principal (video o imagen).
    - Panel visual de los **ODS** que aborda el proyecto, mostrando todos los 17 ODS y destacando los activos.
    - Sección de **Evaluación** con un gráfico **Gauge** para la calificación final y barras de progreso para los 5 criterios de la rúbrica.
    - Galería de imágenes con modal.
    - Información del equipo con enlaces a sus certificados digitales.
    - Tecnologías utilizadas y recursos adicionales.
4.  **Mostrar Certificados Digitales:** Cada miembro participante tiene una página de certificado individual que muestra:
    - Información del estudiante, curso y proyecto.
    - **Insignia y Nivel** obtenidos, presentados como "píldoras" con una imagen PNG de 60x60px que "flota" a la izquierda.
      - La píldora de **Insignia** tiene un **borde de color dinámico** (basado en la insignia) y un fondo amarillo (`bg-gnius-yellow`). El texto es oscuro.
      - La píldora de **Nivel** tiene un **borde violáceo sólido** y **fondo transparente**. El texto es claro.
    - Habilidades y criterios clave.
    - Una imagen de **previsualización del certificado** (proporción ~1200x926px) y un enlace para **descargar una versión para imprimir**.
    - Enlace opcional a la transacción SBT.
5.  **Interfaz Moderna y Responsiva:** Diseño con estética futurista "cyberpunk-light", adaptado a móviles, tablets y escritorio usando Tailwind CSS.

## 🌟 Características Principales Implementadas

- **Página Principal (`index.html`):**
  - Listado paginado de proyectos con diseño de tarjeta renovado.
  - Filtros funcionales por: Título/Estudiante, Categoría, Nivel de Escolaridad (`schooling`), Tecnología y **Objetivo de Desarrollo Sostenible (ODS)**.
  - Tarjetas de proyecto mostrando: imagen de portada, título, chips de metadata (Categoría, Escolaridad), **indicadores visuales de los ODS cubiertos**, descripción corta, y chips de los miembros del equipo (mostrando +X si son muchos).
  - Modal de leyenda ODS accesible desde un botón flotante.
- **Página de Detalles del Proyecto (`project.html`):**
  - Sección Hero con título, metadata, intro y **badges ODS horizontales** (pequeños, con número e icono) en la columna de texto, posicionados arriba a la derecha de dicha columna.
  - Nueva sección dedicada a los **"ODS Abordados"** mostrando un panel/rejilla (CSS Grid, 5 columnas en desktop) con todos los 17 ODS (mostrando número y título, sin icono individual), resaltando los que aplican al proyecto. Un tile final muestra el logo general de los ODS y ocupa 3 columnas para completar la rejilla.
  - **Sección de Evaluación Revisada:**
    - Gráfico **Gauge** (media dona) visualizando la `finalProjectGrade` (1-10) con colores semáforo (Rojo/Amarillo/Verde).
    - **Barras de Progreso** para los 5 criterios de la rúbrica (`rubricInnovation`, `rubricCollaboration`, `rubricImpact`, `rubricTechUse`, `rubricPresentation`), mostrando la puntuación (1, 2, o 3) y coloreadas según el desempeño (Rojo/Amarillo/Verde).
  - Galería de imágenes con modal, información del equipo (enlace "Ver Certificado" con estilo visual del respaldo), tecnologías y recursos.
  - Layout general con sección de Evaluación y ODS en la parte superior (Evaluación 2/3, ODS 1/3), y debajo el contenido principal a la izquierda (2/3) y el aside a la derecha (1/3).
- **Página de Certificado (`certificate.html`):** (Detalles como en la Descripción General, con los botones "Descargar" y "Ver Proyecto" alineados a la derecha).
- **Gestión de Datos:** Toda la información se centraliza en una única Google Sheet.
- **Automatización:** El Google Apps Script (`generarJson.gs`) valida datos y genera el `projects.json`, incluyendo el cálculo de `finalProjectGrade`.
- **Diseño y UX:** Responsivo, con las fuentes Saira Semi Condensed y Saira Condensed, paleta de colores Gnius Club, y animaciones sutiles. Sin bordes "glow" en el aside.

## 🔧 Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, CSS3 (Tailwind CSS v3 vía CDN + `css/style.css` para personalizaciones), JavaScript Vanilla (ES6+, modular).
- **Librerías Frontend (CDN):**
  - Chart.js v4+ (para Gauge y barras de rúbrica).
  - Font Awesome 6 Free (para iconos).
  - Google Fonts (Saira Semi Condensed, Saira Condensed).
- **Gestión de Datos y Automatización:** Google Sheets, Google Apps Script.
- **Despliegue:** GitHub Pages.

## 📁 Estructura del Proyecto Actualizada

```
.
├── index.html
├── project.html
├── certificate.html
├── css/
│   └── style.css             # Hoja de estilos consolidada
├── js/
│   ├── main.js               # Lógica para index.html
│   ├── project.js            # Lógica para project.html
│   ├── certificate.js        # Lógica para certificate.html
│   └── ods-data.js           # Mapeo de datos e imágenes ODS
├── data/
│   └── projects.json         # Archivo JSON con datos de proyectos (GENERADO)
├── assets/
│   ├── img/
│   │   ├── gnius_logo_placeholder.png  # Reemplazar con logo real
│   │   ├── certificado.png             # Placeholder para certificados genéricos
│   │   ├── ods/                        # Logos ODS
│   │   │   ├── ods-1.png               # (o E_SDG_PRINT-01.png, etc.)
│   │   │   ├── ...
│   │   │   ├── ods-17.png
│   │   │   └── SDG-ONU-LOGO.png        # Logo general ODS para el panel
│   │   ├── badges/                     # Imágenes de Insignias (~40x40px o 60x60px)
│   │   │   ├── code-explorer.png
│   │   │   └── ... (11 más)
│   │   └── levels/                     # Imágenes de Niveles (~40x40px o 60x60px)
│   │       ├── rookie.png
│   │       └── ... (2 más)
│   │   └── [project-slug]/             # Carpetas por proyecto para sus imágenes
│   │       ├── cover.jpg
│   │       ├── media.jpg (opcional)
│   │       ├── gallery-01.jpg
│   │       └── [nombre-alumno-slug]-cert-preview.png
│   │       └── [nombre-alumno-slug]-cert-print.pdf
│   │       └── ...
│   └── docs/                           # (Opcional, para PDFs de recursos adicionales)
├── Google sheets/                      # Documentación y ejemplos para Google Sheets
│   ├── datos_ejemplo_14_proyectos.csv  # Ejemplo CSV con 14 proyectos
│   ├── estructura tabla.csv            # Solo encabezados
│   ├── generarJson.gs                  # Script de Google Apps
│   ├── Sidebar.html                    # UI para el script en Sheets
│   ├── Instrucciones de llenado tabla google sheets.md # Guía detallada
│   ├── Instrucciones del uso del script de google sheets.md
│   └── Instrucciones para asistente IA sobre el llenado de tabla.md
└── README.md                           # Este archivo
```

## 🚀 Configuración Inicial

1.  **Clonar Repositorio:** Obtén una copia local del proyecto.
2.  **Google Sheet:**
    - Crea una nueva Hoja de Cálculo de Google.
    - Copia los encabezados exactos de `Google sheets/estructura tabla.csv` en la primera fila.
    - Consulta `Google sheets/Instrucciones de llenado tabla google sheets.md` para una guía detallada sobre cómo rellenar cada columna, especialmente los formatos complejos y los valores permitidos. Puedes usar `Google sheets/datos_ejemplo_14_proyectos.csv` como base para tus primeros proyectos.
3.  **Google Apps Script:**
    - En tu Google Sheet, ve a `Extensiones > Apps Script`.
    - Copia el contenido de `Google sheets/generarJson.gs` y pégalo en el editor (reemplazando el código por defecto en `Código.gs`).
    - Crea un nuevo archivo HTML (`Archivo > Nuevo > Archivo HTML`), nómbralo `Sidebar.html` (respetando mayúsculas/minúsculas) y copia el contenido de `Google sheets/Sidebar.html` en él.
    - Guarda ambos archivos en el editor de Apps Script.
    - Recarga tu Google Sheet. Debería aparecer un nuevo menú "Gnius Club Tools". Autoriza el script la primera vez que uses "Generar JSON" (sigue las indicaciones, incluyendo "Configuración avanzada" si es necesario).
4.  **Assets:**
    - Reemplaza `assets/img/gnius_logo_placeholder.png` con el logo oficial de Gnius Club.
    - Asegúrate de tener todas las imágenes de ODS (17 individuales + 1 general), Insignias (12) y Niveles (3) en sus respectivas carpetas (`assets/img/ods/`, `assets/img/badges/`, `assets/img/levels/`) con los nombres de archivo correctos (ver "Convención de Nombres de Archivos" en las instrucciones de llenado).
    - Para probar, crea las carpetas e imágenes de ejemplo para los proyectos que usarán rutas relativas (según `datos_ejemplo_14_proyectos.csv`) en `assets/img/[project-slug]/`.
5.  **Pruebas Locales:** Utiliza una extensión como "Live Server" en VS Code, o ejecuta un servidor Python simple (`python -m http.server` en la raíz del proyecto) o Node.js (`npx serve`) para visualizar el sitio localmente, ya que las solicitudes `fetch` al archivo JSON lo requieren.

## 🛠️ Uso y Flujo de Trabajo para Actualizar Contenido

El flujo de trabajo detallado se encuentra en el archivo `Google sheets/Instrucciones de llenado tabla google sheets.md`. Los pasos esenciales son:

1.  **Editar Google Sheet:** Añade o modifica los datos de los proyectos siguiendo las directrices.
2.  **Preparar/Generar Imágenes:** Crea todas las imágenes necesarias para el proyecto (portada, galería, media) y, fundamentalmente, las dos imágenes (previsualización y impresión) para el certificado de cada miembro.
3.  **Subir Imágenes de Proyecto:** Sube estas imágenes a la carpeta correcta `assets/img/[slug-del-proyecto]/` en tu repositorio local.
4.  **Actualizar Rutas en Sheets:** Ingresa las rutas relativas exactas a estas imágenes en las columnas correspondientes de la hoja de cálculo.
5.  **Generar JSON:** Ejecuta el script `Gnius Club Tools > Generar JSON` desde la Google Sheet.
6.  **Copiar JSON:** Copia el JSON resultante de la barra lateral.
7.  **Actualizar `data/projects.json`:** Reemplaza el contenido del archivo `data/projects.json` en tu copia local con el JSON copiado.
8.  **Commit & Push:** Sube todos los cambios (el `projects.json` actualizado y cualquier nueva imagen en `assets/img/`) a tu repositorio de GitHub.
9.  **Despliegue:** GitHub Pages se encargará de actualizar el sitio web automáticamente.

## 📊 Gestión de Datos (Google Sheets)

Consulta el documento `Google sheets/Instrucciones de llenado tabla google sheets.md` para una descripción exhaustiva de cada columna, el formato exacto que se debe usar para los campos complejos (como `teamMembers`, `technologies`, `sdgIds`, y las columnas `rubric*`), y las listas de valores predefinidos para campos como Insignias y Niveles.

**Puntos Clave de la Estructura de Datos:**

- Encabezados de columna en `camelCase` en inglés.
- Campo `schooling` para "Primaria", "Secundaria", "Preparatoria".
- Campo `sdgIds` para una lista de números ODS separados por coma (ej. `4,9,17`).
- Cinco columnas de rúbrica: `rubricInnovation`, `rubricCollaboration`, `rubricImpact`, `rubricTechUse`, `rubricPresentation`, cada una con un valor de 1, 2 o 3.
- El campo `finalProjectGrade` (calificación de 1-10) es **calculado automáticamente** por el script de Google Apps y no se debe llenar manualmente en la hoja.
- Para `teamMembers`:
  - La Propiedad 5 (`NombreInsigniaCertificado`) debe ser uno de los 12 nombres de insignia predefinidos.
  - La Propiedad 6 (`NivelCertificado`) debe ser uno de los 3 nombres de nivel predefinidos.
  - Las Propiedades 7 (Habilidades) y 8 (Criterios) son listas de elementos separados por **coma SIN ESPACIOS**.

## 🎨 Personalización y Desarrollo Frontend

- **Estilos:** Todos los estilos personalizados y overrides de Tailwind se encuentran en `css/style.css`. Las variables de color principales de Gnius Club (`--gnius-*`) están definidas al inicio de este archivo.
- **Lógica JavaScript:** Los archivos `js/main.js`, `js/project.js`, y `js/certificate.js` manejan la interactividad de las páginas y la carga dinámica de datos desde `projects.json`.
- **Datos ODS:** La información detallada de cada uno de los 17 Objetivos de Desarrollo Sostenible (título completo, color oficial, URL de la imagen del logo, y enlace a la página de la ONU) está centralizada en el archivo `js/ods-data.js`.

## 🚀 Despliegue en GitHub Pages

1.  Asegúrate de que tu repositorio del proyecto esté en GitHub.
2.  En tu repositorio de GitHub, ve a la pestaña `Settings`.
3.  En el menú lateral, selecciona `Pages`.
4.  En la sección "Build and deployment", bajo "Source", asegúrate de que esté seleccionado `Deploy from a branch`.
5.  Configura la rama (usualmente `main` o `master`) y la carpeta (`/ (root)`) desde donde se desplegará el sitio.
6.  Haz clic en `Save`.
7.  GitHub Actions construirá y desplegará tu sitio. La URL de tu sitio publicado estará disponible en esta misma sección de configuración de Pages (puede tardar unos minutos en aparecer la primera vez o después de una actualización). Cada vez que hagas `push` a la rama configurada, GitHub Pages intentará reconstruir y actualizar el sitio automáticamente.

## 🌟 Créditos

Este proyecto fue desarrollado como una colaboración para **Gnius Club**.

- **Arquitectura de la Solución y Desarrollo Principal:** Asistente IA Experto Full-Stack Gemini 2.5 PRO
- **Dirección del Proyecto, Especificaciones Detalladas, Pruebas Exhaustivas y Ajustes Finos:** [Bruno Pérez "Brunius" / "Equipo Gnius Club"]

Un agradecimiento especial a Gnius Club por la visión y la oportunidad de colaborar en esta innovadora herramienta.

---

¡Este proyecto proporciona una solución completa y robusta para Gnius Club!
