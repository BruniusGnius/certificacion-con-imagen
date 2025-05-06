1. Estructura para Google Sheets (Formato CSV)
   Este bloque representa cómo debería verse la hoja de Google Sheets si la exportaras como CSV. La primera línea son los encabezados exactos que el script de Google Apps esperará. La segunda línea es un ejemplo completo y realista.
   Importante: Al pegar esto en un editor de texto o importarlo a Sheets, asegúrate de que el delimitador sea la coma (,) y que los campos que contienen comas, saltos de línea, o los caracteres | o ; estén encapsulados entre comillas dobles (").

2. Instrucciones para Llenar Google Sheets v3 - Íntegro
   Instrucciones Detalladas para Llenar y Mantener Google Sheets - Gnius Club
   ¡Bienvenido/a a la gestión de proyectos y certificados de Gnius Club!
   Esta hoja de cálculo es la única fuente de verdad para alimentar los portafolios y certificados en el sitio web. Es crucial mantenerla ordenada y seguir los formatos indicados para que la automatización funcione correctamente.
   Flujo de Trabajo General:
   Añadir/Editar Proyecto: Rellena o modifica una fila en esta hoja siguiendo las instrucciones de cada columna. Presta especial atención a los formatos complejos.
   Preparar Archivos:
   Crea las imágenes y/o videos necesarios para el proyecto (portada, galería, media opcional). Asegúrate de que tengan buena calidad y un tamaño adecuado para la web.
   MUY IMPORTANTE (Certificados): Si añades o actualizas certificados, genera dos archivos de imagen para cada estudiante certificado:
   Uno para previsualización web (ej. juan-perez-cert-preview.jpg - tamaño moderado, formato JPG o PNG).
   Uno para impresión (ej. juan-perez-cert-print.pdf o .jpg/.png de alta resolución - formato carta horizontal).
   Subir Archivos al Repositorio:
   Crea una carpeta específica para el proyecto dentro de assets/img/ en tu copia local del repositorio de GitHub. El nombre de esta carpeta debe ser el slug del proyecto (generado a partir del título: minúsculas, sin acentos/especiales, espacios por guiones. Ej: robot-educativo-autonomo-rea).
   Sube TODOS los archivos generados (portada, galería, media, imágenes de certificado) a esta carpeta específica (assets/img/[slug-del-proyecto]/).
   Convención de Nombres de Archivo (Dentro de assets/img/[slug-del-proyecto]/):
   Portada: cover.jpg (o .png, .webp)
   Imagen/Video Principal (si media*type es 'image'): media.jpg (o .png, .webp)
   Galería: gallery-01.jpg, gallery-02.jpg, etc.
   Certificado Preview: [nombre-apellido-del-alumno]-cert-preview.jpg (ej. juan-perez-cert-preview.jpg)
   Certificado Impresión: [nombre-apellido-del-alumno]-cert-print.pdf (o .jpg, .png en alta resolución)
   Actualizar Rutas en Sheets: En la hoja de cálculo, asegúrate de que las columnas que contienen URLs de archivos (coverUrl_url, media_url si es imagen, teamMembers para certificados, imageGallery) tengan la ruta relativa correcta apuntando a los archivos que acabas de subir. La ruta debe empezar desde la raíz del sitio. Ejemplo: assets/img/robot-rea/cover.jpg.
   Generar JSON: En Google Sheets, ve al menú personalizado Gnius Club Tools > Generar JSON.
   Validar (Automático): El script revisará errores básicos (campos requeridos, formato de campos complejos, URLs relativas, formato de fechas). Si hay errores, te avisará en la barra lateral. Corrige los errores en la hoja y vuelve a generar el JSON.
   Copiar JSON: Si no hay errores graves (solo advertencias quizás), copia TODO el texto JSON que aparece en el área de texto de la barra lateral usando el botón "Copiar al Portapapeles".
   Actualizar Repositorio: Abre el archivo data/projects.json en tu copia local del repositorio. Borra TODO su contenido actual y pega el JSON que acabas de copiar. Guarda el archivo projects.json.
   Commit & Push: Usando tu herramienta de Git (GitHub Desktop, terminal, etc.), haz "commit" de los cambios (el archivo projects.json modificado y TODOS los nuevos archivos de imagen que subiste a assets/img/) y luego haz "push" a GitHub.
   Despliegue: GitHub Pages detectará los cambios y actualizará el sitio web automáticamente en unos minutos.
   Descripción Detallada de las Columnas:
   projectTitle (Texto, Requerido): Título principal del proyecto. Debe ser claro, descriptivo y preferiblemente único para evitar confusiones. Se usará para generar el slug (la parte de la URL). Evita caracteres especiales complejos si es posible.
   projectCategory (Texto, Opcional): Categoría general del proyecto. Ejemplos: "Robótica Educativa", "Desarrollo Web", "Impacto Social", "Inteligencia Artificial", "Multimedia", "IoT". Mantén la consistencia en los nombres.
   studentLevel (Texto, Opcional): Nivel educativo de los participantes. Ejemplos: "Primaria", "Secundaria", "Preparatoria".
   projectDate (Fecha, Opcional): Fecha de finalización o presentación principal del proyecto. Formato Aceptado: Puedes escribirlo como DD-MM-YYYY (ej: 15-11-2024) o YYYY-MM-DD (ej: 2024-11-15). Formatear la columna en Sheets como Fecha (dd-mm-yyyy) ayuda. El JSON final siempre usará YYYY-MM-DD.
   intro_title (Texto, Requerido): Título corto y llamativo para la sección de introducción en la página detallada del proyecto.
   intro_content (Texto, Requerido): Párrafo introductorio que describe de forma concisa y atractiva de qué trata el proyecto.
   coverUrl_url (Texto, Requerido): Ruta relativa a la imagen de portada principal del proyecto. Debe seguir la convención: assets/img/[slug-del-proyecto]/cover.jpg (o .png, .webp).
   coverUrl_altText (Texto, Requerido): Texto descriptivo claro y conciso de la imagen de portada. Es crucial para accesibilidad (lectores de pantalla) y SEO. Describe lo que se ve en la imagen.
   problemDescription (Texto, Requerido): Describe de forma clara cuál es el problema, necesidad u oportunidad que el proyecto aborda.
   solutionProposed (Texto, Requerido): Describe la solución que el equipo desarrolló o propuso para abordar el problema. ¿Qué hace el proyecto?
   innovationProcess (Texto/HTML, Opcional): Descripción más detallada del proceso que siguió el equipo (investigación, diseño, desarrollo, pruebas, etc.). Puedes usar etiquetas HTML básicas como <p> (párrafo), <strong> (negrita), <em> (cursiva), <ul> y <li> (listas) para darle formato. Si dejas esta celda vacía, la sección no aparecerá en la página del proyecto.
   media_type (Texto, Opcional): Indica si quieres destacar un video o una imagen principal adicional en la sección "Hero" de la página del proyecto. Opciones válidas (escribe una): video o image. Si dejas esta celda vacía, no se mostrará este elemento destacado.
   media_url (Texto, Requerido si media_type no está vacío):
   Si media_type es video: Pega aquí la URL de embed de YouTube. La obtienes desde YouTube > Compartir > Incorporar (copia solo la URL dentro del src="..."). Ejemplo: https://www.youtube.com/embed/TUCODIGOVIDEO.
   Si media_type es image: Escribe la ruta relativa a la imagen que quieres destacar. Sigue la convención: assets/img/[slug-del-proyecto]/media.jpg (o .png, .webp).
   media_altText (Texto, Requerido si media_type es image): Texto descriptivo de la imagen destacada (si usaste media_type='image').
   teamMembers (Texto, Requerido - Formato MUY Complejo): Lista detallada de los miembros del equipo y la información para sus certificados. ¡Máxima atención a este formato!
   Cada miembro del equipo está separado del siguiente por | (espacio, barra vertical, espacio).
   Dentro de la información de cada miembro, hay 12 propiedades principales, y cada una está separada de la siguiente por punto y coma (;). NO pongas espacios antes o después del punto y coma.
   Orden EXACTO de las 12 propiedades (separadas por ;):
   NombreCompleto (Nombre y apellidos del estudiante)
   RolEnElProyecto (Ej: Programador, Diseñadora, Investigador)
   LinkSBT (URL completa del Soulbound Token si existe, si no, déjalo vacío)
   NombreCursoCertificado (Nombre del curso o taller asociado)
   NombreInsigniaCertificado (Nombre específico de la insignia obtenida)
   NivelCertificado (Ej: Básico, Intermedio, Avanzado, Explorador, Curioso)
   HabilidadesDemostradas (Lista de habilidades clave demostradas, separadas entre sí por coma (,). Ej: HTML,CSS,JavaScript,Trabajo en equipo)
   CriteriosEvaluacion (Lista de criterios principales por los que se evaluó, separados entre sí por coma (,). Ej: Originalidad,Funcionalidad,Presentación)
   NombreColegio (Nombre de la institución educativa del estudiante)
   FechaEmisionCertificado (Fecha en que se emite el certificado. Formato DD-MM-YYYY o YYYY-MM-DD)
   RutaImagenPrevisualizacionCertificado (Ruta relativa a la imagen del certificado para mostrar en la web. Ej: assets/img/[slug]/nombre-cert-preview.jpg)
   RutaImagenImpresionCertificado (Ruta relativa al archivo PDF o imagen de alta resolución para descargar/imprimir. Ej: assets/img/[slug]/nombre-cert-print.pdf)
   Ejemplo Corto (1 miembro): Ana García;Diseñadora UX;;Diseño Interfaces;Prototipadora Digital;Intermedio;Figma,User Research,Prototipado;Claridad interfaz,Usabilidad;Colegio Creativo;15-11-2024;assets/img/proyecto-ux/ana-garcia-preview.jpg;assets/img/proyecto-ux/ana-garcia-print.pdf
   Ejemplo Largo (2 miembros, todo en una celda): Ana García;...;print.pdf | Luis Méndez;Programador;;Curso Python;Desarrollador Backend;Intermedio;Python,Flask,API REST;Código limpio,Funcionalidad API,Pruebas unitarias;Colegio Creativo;15-11-2024;assets/img/proyecto-ux/luis-mendez-preview.jpg;assets/img/proyecto-ux/luis-mendez-print.pdf
   Recomendación: Usa el Prompt para IA Asistente (ver abajo) para generar esta cadena compleja sin errores, proporcionándole los datos de cada miembro. Es la parte más propensa a errores manuales. Evita usar ; y | dentro de los nombres, roles, etc. Evita usar , en nombres, roles, cursos, etc., ya que se usa para separar habilidades/criterios.
   technologies (Texto, Requerido - Formato Complejo): Lista de las tecnologías, herramientas o metodologías clave utilizadas en el proyecto.
   Separador entre tecnologías: | (espacio, barra, espacio).
   Separador de propiedades dentro de cada tecnología: ; (punto y coma).
   Orden EXACTO (3 propiedades): NombreTecnologia;NombreIconoFontAwesome;Categoria
   NombreTecnologia: Nombre legible (ej: Arduino UNO, Python, Figma, Scrum).
   NombreIconoFontAwesome: El nombre del icono de Font Awesome Free v6 que mejor represente la tecnología. Escribe solo el nombre, sin prefijos como fa- o fa-solid. Ejemplos: microchip, python, figma, database, react, lightbulb, users. El script añadirá el prefijo correcto (fa-solid o fa-brands) automáticamente.
   Categoria: Clasifica la tecnología. Debe ser una de estas tres opciones (escribe una): Hardware, Software, Tool.
   Ejemplo: Arduino UNO;microchip;Hardware | Python;python;Software | Figma;figma;Tool
   additionalResources (Texto, Opcional - Formato Complejo): Lista de enlaces externos o documentos relevantes (código fuente, prototipos, artículos, manuales, etc.).
   Separador entre recursos: |.
   Separador de propiedades dentro de cada recurso: ;.
   Orden EXACTO (3 propiedades): TituloRecurso;URLRecurso;TipoRecurso
   TituloRecurso: Texto descriptivo del enlace (ej: "Código Fuente", "Ver Prototipo", "Manual PDF").
   URLRecurso: La URL completa (si es web, ej: https://github.com/...) o la ruta relativa (si es un archivo dentro del proyecto, ej: assets/docs/manual.pdf).
   TipoRecurso: Palabra clave que indica el tipo de recurso (ayuda a poner un icono). Sugerencias: github, link, pdf, doc, website, video, paper, figma, code. Escríbelo en minúsculas.
   Ejemplo: Código en GitHub;https://github.com/...;github | Prototipo Figma;https://figma.com/...;figma | Manual de Usuario;assets/docs/manual.pdf;pdf
   imageGallery (Texto, Opcional - Formato Complejo): Lista de imágenes adicionales para mostrar en una galería en la página del proyecto.
   Separador entre imágenes: |.
   Separador de propiedades dentro de cada imagen: ;.
   Orden EXACTO (3 propiedades): URLImagen;TextoAlternativo;Caption(Opcional)
   URLImagen: Ruta relativa a la imagen. Sigue la convención: assets/img/[slug-del-proyecto]/gallery-01.jpg, gallery-02.png, etc.
   TextoAlternativo: Descripción concisa de la imagen para accesibilidad.
   Caption (Opcional): Un título o descripción breve que se mostrará junto a la imagen en el modal (ventana emergente). Si no quieres caption, deja este espacio vacío, pero mantén el punto y coma final para que haya 3 propiedades.
   Ejemplo: assets/img/mi-proy/g1.jpg;Equipo trabajando;Foto del equipo | assets/img/mi-proy/g2.png;Diagrama de flujo; | assets/img/mi-proy/g3.jpg;Prototipo final;Versión 2.0
   Columnas eval*\* (Numérico, Requerido): Todas las columnas cuyo nombre empieza con eval* (ej: eval_Impacto Potencial, eval_Creatividad Solucion, eval_Innovacion Tecnica, etc.).
   Introduce la puntuación numérica obtenida por el proyecto en esa métrica específica.
   El valor debe ser un número entre 0 y 100.
   Estas puntuaciones se usarán para generar el gráfico radar en la página del proyecto. Asegúrate de rellenar todas las columnas eval* definidas.
   ¡Revisa dos veces los formatos complejos antes de generar el JSON! Un error pequeño (un punto y coma de más, un separador incorrecto) puede impedir que el proyecto se muestre correctamente. Usa el Prompt de IA si es necesario.
   (Fin - Instrucciones para Llenar Google Sheets v3 - Íntegro)
