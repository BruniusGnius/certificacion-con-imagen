# Prompts de Ejemplo para IA Asistente (ChatGPT, etc.) - Gnius Club v4.0

    Usa estos prompts como plantilla para que una IA te ayude a formatear correctamente los datos para las celdas complejas de Google Sheets. Copia el prompt, **reemplaza los datos de ejemplo entre [corchetes] con los tuyos reales**, y pídele a la IA que genere la cadena de texto exacta para pegar en la celda correspondiente.

    ---

    ## Prompt para `teamMembers` (Generar para UN miembro a la vez):

    ```text
    Necesito formatear los datos de un miembro del equipo para una celda de Google Sheets ('teamMembers'). El formato requiere que las 12 propiedades principales estén separadas por punto y coma (;). Si hubiera múltiples miembros en la celda, se separarían por " | ", pero solo necesito el formato para ESTE miembro individual.

    **Importante:**
    1. Dentro de la propiedad 7 (Habilidades) y la propiedad 8 (Criterios), los elementos individuales deben separarse por COMA (,).
    2. La propiedad 5 (Insignia) y la propiedad 6 (Nivel) DEBEN usar uno de los valores predefinidos exactos listados abajo.

    **Orden de las 12 Propiedades Principales (separadas por ';'):**
    1.  NombreCompleto
    2.  RolEnElProyecto
    3.  LinkSBT (dejar vacío si no hay)
    4.  NombreCursoCertificado
    5.  NombreInsigniaCertificado (¡Usar valor predefinido exacto!)
    6.  NivelCertificado (¡Usar valor predefinido exacto!)
    7.  HabilidadesDemostradas (elementos separados por coma ',')
    8.  CriteriosEvaluacion (elementos separados por coma ',')
    9.  NombreColegio
    10. FechaEmisionCertificado (Formato DD-MM-YYYY o YYYY-MM-DD)
    11. RutaImagenPrevisualizacionCertificado (ruta relativa ej: assets/img/[slug]/nombre-preview.jpg)
    12. RutaImagenImpresionCertificado (ruta relativa ej: assets/img/[slug]/nombre-print.pdf)

    **Valores Permitidos para Insignia (Propiedad 5):**
    Code Explorer, Algorithm Seeker, Micro Programmer, Robot Navigator, Tech Voyager, Network Pioneer, Design Architect, Reality Master, Expert Roboteer, Prompt Sage, App Maverick, AI Paragon

    **Valores Permitidos para Nivel (Propiedad 6):**
    Rookie, Master, Hacker

    **Datos del Miembro:**
    - Nombre: [Escribe aquí el nombre completo del estudiante]
    - Rol: [Escribe aquí el rol del estudiante en el proyecto]
    - SBT Link: [Pega aquí la URL del SBT si existe, si no, déjalo vacío]
    - Curso: [Nombre del curso asociado al certificado]
    - Insignia: [Elige UNO de los valores permitidos de la lista de arriba]
    - Nivel: [Elige UNO de los valores permitidos de la lista de arriba]
    - Habilidades: [Lista las habilidades separadas por coma, ej: Python, Lógica, Trabajo en equipo]
    - Criterios: [Lista los criterios separados por coma, ej: Funcionalidad, Creatividad, Colaboración]
    - Colegio: [Nombre del colegio del estudiante]
    - Fecha Certificado: [Fecha de emisión, ej: 15-11-2024]
    - Preview URL: [Ruta relativa a la imagen preview, ej: assets/img/mi-proyecto/nombre-preview.jpg]
    - Print URL: [Ruta relativa al archivo de impresión, ej: assets/img/mi-proyecto/nombre-print.pdf]

    Genera la cadena de texto EXACTA para pegar en la celda 'teamMembers' de Google Sheets para este miembro, usando ';' para separar las 12 propiedades principales y ',' para separar las habilidades y criterios internos. Asegúrate de seguir el orden exacto y usar los valores predefinidos para Insignia y Nivel.
    ```

    ---

    ## Prompt para `technologies` (Puedes listar varias tecnologías):

    ```text
    Necesito formatear una lista de tecnologías para la celda 'technologies' de Google Sheets. Cada tecnología se separa de la siguiente por " | " (espacio, barra, espacio). Dentro de cada tecnología, las 3 propiedades (Nombre, Icono Font Awesome, Categoría) se separan por punto y coma (;).

    **Orden de Propiedades por Tecnología (separadas por ';'):**
    1.  NombreTecnologia
    2.  NombreIconoFontAwesome (solo el nombre del icono de Font Awesome v6 Free, sin prefijos como "fa-" o "fa-solid". Ej: 'python', 'microchip', 'react', 'lightbulb', 'database', 'network-wired')
    3.  Categoria (**Valores Exactos Permitidos:** Hardware, Software, Tool)

    **Tecnologías Usadas:**
    - Tecnología 1: Nombre=[Nombre Tec 1], Icono=[Nombre Icono FA 1], Categoría=[Hardware/Software/Tool]
    - Tecnología 2: Nombre=[Nombre Tec 2], Icono=[Nombre Icono FA 2], Categoría=[Hardware/Software/Tool]
    - Tecnología 3: Nombre=[Nombre Tec 3], Icono=[Nombre Icono FA 3], Categoría=[Hardware/Software/Tool]
    - (Añade más filas si es necesario)

    Genera la cadena de texto EXACTA para pegar en la celda 'technologies' de Google Sheets.
    ```

    ---

    ## Prompt para `additionalResources` (Puedes listar varios recursos):

    ```text
    Necesito formatear una lista de recursos adicionales para la celda 'additionalResources' de Google Sheets. Cada recurso se separa del siguiente por " | ". Dentro de cada recurso, las 3 propiedades (Título, URL, Tipo) se separan por punto y coma (;).

    **Orden de Propiedades por Recurso (separadas por ';'):**
    1.  TituloRecurso (Texto descriptivo del enlace)
    2.  URLRecurso (URL completa https://... o ruta relativa assets/...)
    3.  TipoRecurso (Palabra clave en minúsculas, ej: github, link, pdf, doc, website, video, paper, figma, code, data)

    **Recursos:**
    - Recurso 1: Título=[Título Recurso 1], URL=[URL o Ruta Recurso 1], Tipo=[Tipo Recurso 1]
    - Recurso 2: Título=[Título Recurso 2], URL=[URL o Ruta Recurso 2], Tipo=[Tipo Recurso 2]
    - (Añade más filas si es necesario)

    Genera la cadena de texto EXACTA para pegar en la celda 'additionalResources' de Google Sheets.
    ```

    ---

    ## Prompt para `imageGallery` (Puedes listar varias imágenes):

    ```text
    Necesito formatear una lista de imágenes para la galería en la celda 'imageGallery' de Google Sheets. Cada imagen se separa de la siguiente por " | ". Dentro de cada imagen, las 3 propiedades (URL, Texto Alternativo, Caption) se separan por punto y coma (;). El Caption (propiedad 3) es opcional; si no hay, se deja vacío pero **se mantiene el último punto y coma**.

    **Orden de Propiedades por Imagen (separadas por ';'):**
    1.  URLImagen (Ruta relativa obligatoria, ej: assets/img/mi-proyecto/galeria-1.jpg)
    2.  TextoAlternativo (Descripción concisa de la imagen para accesibilidad)
    3.  Caption (Opcional: título corto para mostrar en el modal. Dejar vacío si no hay)

    **Imágenes:**
    - Imagen 1: URL=[Ruta Relativa Imagen 1], Alt=[Texto Alternativo 1], Caption=[Caption Opcional 1]
    - Imagen 2: URL=[Ruta Relativa Imagen 2], Alt=[Texto Alternativo 2], Caption=[Caption Opcional 2]
    - Imagen 3: URL=[Ruta Relativa Imagen 3], Alt=[Texto Alternativo 3], Caption=[Dejar Vacío si no hay]
    - (Añade más filas si es necesario)

    Genera la cadena de texto EXACTA para pegar en la celda 'imageGallery' de Google Sheets. Asegúrate de que cada imagen tenga sus 3 propiedades separadas por ';', incluso si el caption está vacío.
    ```
