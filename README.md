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
      - La píldora de **Insignia** tiene un **borde de color dinámico** (basado en la insignia) y **fondo transparente** (o amarillo si se usa la clase `bg-gnius-yellow` en el HTML). El texto es claro por defecto, o oscuro sobre fondo amarillo.
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
  - Sección Hero con título, metadata, intro y **badges ODS horizontales** (pequeños, con número e icono) en la columna de texto.
  - Nueva sección dedicada a los **"ODS Abordados"** mostrando un panel/rejilla (CSS Grid, 5 columnas en desktop) con todos los 17 ODS (mostrando número y título, sin icono individual), resaltando los que aplican al proyecto. Un tile final muestra el logo general de los ODS y ocupa 3 columnas para completar la rejilla.
  - **Sección de Evaluación Revisada:**
    - Gráfico **Gauge** (media dona) visualizando la `finalProjectGrade` (1-10) con colores semáforo (Rojo/Amarillo/Verde).
    - **Barras de Progreso** para los 5 criterios de la rúbrica (`rubricInnovation`, `rubricCollaboration`, `rubricImpact`, `rubricTechUse`, `rubricPresentation`), mostrando la puntuación (1, 2, o 3) y coloreadas según el desempeño.
  - Galería de imágenes con modal, información del equipo, tecnologías y recursos.
- **Página de Certificado (`certificate.html`):** (Detalles como en la Descripción General).
- **Gestión de Datos:** Toda la información se centraliza en una única Google Sheet.
- **Automatización:** El Google Apps Script (`generarJson.gs`) valida datos y genera el `projects.json`, incluyendo el cálculo de `finalProjectGrade`.
- **Diseño y UX:** Responsivo, con las fuentes Saira especificadas, paleta de colores Gnius Club, y animaciones sutiles.

## 🔧 Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, CSS3 (Tailwind CSS v3 vía CDN + `css/style.css` para personalizaciones), JavaScript Vanilla (ES6+, modular).
- **Librerías Frontend (CDN):**
  - Chart.js v4+ (para Gauge y barras de rúbrica).
  - Font Awesome 6 Free (para iconos).
  - Google Fonts (Saira Semi Condensed, Saira Condensed).
- **Gestión de Datos y Automatización:** Google Sheets, Google Apps Script.
- **Despliegue:** GitHub Pages.

## 📁 Estructura del Proyecto Actualizada

(Se mantiene igual que la versión anterior que te di, v4.0 del README)
...

## 🚀 Configuración Inicial

(Se mantiene igual, enfatizando el uso de los nuevos documentos de instrucciones)
...

## 🛠️ Uso y Flujo de Trabajo para Actualizar Contenido

(Se mantiene igual, refiriendo a las `Instrucciones de llenado tabla google sheets.md`)
...

## 📊 Gestión de Datos (Google Sheets)

(Se mantiene igual, refiriendo a las `Instrucciones de llenado tabla google sheets.md`)
...

## 🎨 Personalización y Desarrollo Frontend

(Se mantiene igual)
...

## 🚀 Despliegue en GitHub Pages

(Se mantiene igual)
...

## 🌟 Créditos

Este proyecto fue desarrollado como una colaboración para **Gnius Club**.

- **Arquitectura de la Solución y Desarrollo Principal:** Asistente IA Experto Full-Stack Gemini 2.5 PRO
- **Dirección del Proyecto, Especificaciones Detalladas, Pruebas Exhaustivas y Ajustes Finos:** [Bruno Pérez | "Brunius" / "Equipo Gnius Club"]

Un agradecimiento especial a Gnius Club por la visión y la oportunidad de colaborar en esta innovadora herramienta.

---

¡Este proyecto proporciona una solución completa y robusta para Gnius Club!
