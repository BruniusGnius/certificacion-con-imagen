# Prompts de Ejemplo para IA Asistente (ChatGPT, etc.) - Gnius Club (v4.1)

Usa estos prompts como plantilla para que una IA (como ChatGPT, Claude, etc.) te ayude a formatear correctamente los datos para las celdas complejas de Google Sheets. Copia el prompt, **reemplaza los datos de ejemplo entre [corchetes] con los tuyos reales**, y pídele a la IA que genere la cadena de texto exacta para pegar en la celda correspondiente de la hoja de cálculo.

**Nota Importante:** Los encabezados de las columnas en tu Google Sheet deben estar en `camelCase` en inglés (ej. `projectTitle`, `teamMembers`). Sin embargo, para facilitar la comunicación con la IA, las descripciones de los datos que le proporcionas a continuación están en español. El script de Google Apps se encarga de la conversión final a la estructura JSON con claves en inglés.

---

## ✏️ Prompt para la Celda `teamMembers` (Generar para UN miembro a la vez)

**Instrucción para la IA:**
"Necesito formatear los datos de un miembro del equipo para la celda 'teamMembers' de una hoja de Google Sheets. El formato requiere que las **12 piezas de información** para este miembro estén en un orden estricto, separadas por punto y coma (**;**) SIN ESPACIOS alrededor del punto y coma. Si hubiera múltiples miembros en la celda, se separarían por el delimitador ' **|** ' (espacio, barra vertical, espacio), pero por ahora solo necesito la cadena formateada para **este miembro individual**.

**Detalles CRUCIALES para el formato:**

1.  La séptima pieza de información (Habilidades Demostradas) debe ser una lista de habilidades separadas por **COMA (,) SIN ESPACIOS** entre ellas.
2.  La octava pieza de información (Criterios de Evaluación Clave) debe ser una lista de criterios separada por **COMA (,) SIN ESPACIOS** entre ellos.
3.  La quinta pieza de información (Nombre de la Insignia del Certificado) DEBE ser **exactamente uno** de los valores de la lista de 'Valores Permitidos para Insignia'.
4.  La sexta pieza de información (Nivel del Certificado) DEBE ser **exactamente uno** de los valores de la lista de 'Valores Permitidos para Nivel'.

**Orden EXACTO de los Valores para cada Miembro (separados por ';'):**

1.  Nombre Completo del Estudiante
2.  Rol en el Proyecto
3.  Enlace SBT (URL completa o dejar vacío si no aplica)
4.  Nombre del Curso del Certificado
5.  Nombre de la Insignia del Certificado (Elegir de la lista de abajo)
6.  Nivel del Certificado (Elegir de la lista de abajo)
7.  Habilidades Demostradas (separadas por COMA SIN ESPACIOS)
8.  Criterios de Evaluación Clave (separados por COMA SIN ESPACIOS)
9.  Nombre del Colegio
10. Fecha de Emisión del Certificado (Formato DD-MM-YYYY o YYYY-MM-DD)
11. Ruta Relativa a Imagen Preview Certificado (ej: `assets/img/[slug-proyecto]/nombre-slug-cert-preview.png`)
12. Ruta Relativa a Archivo Impresión Certificado (ej: `assets/img/[slug-proyecto]/nombre-slug-cert-print.pdf`)

**Valores Permitidos para Insignia (Propiedad 5):**
`Code Explorer`, `Algorithm Seeker`, `Micro Programmer`, `Robot Navigator`, `Tech Voyager`, `Network Pioneer`, `Design Architect`, `Reality Master`, `Expert Roboteer`, `Prompt Sage`, `App Maverick`, `AI Paragon`

**Valores Permitidos para Nivel (Propiedad 6):**
`Rookie`, `Master`, `Hacker`

**Datos del Miembro a Formatear:**

- Nombre Completo del Estudiante: **[Ej: Ana Valeria García López]**
- Rol en el Proyecto: **[Ej: Desarrolladora Principal y Diseñadora UX]**
- Enlace SBT: **[Ej: https://polygonscan.com/token/0xVALIDTOKENADDRESSFORANA o dejar vacío]**
- Nombre del Curso del Certificado: **[Ej: Desarrollo Avanzado de Proyectos de Innovación]**
- Nombre de la Insignia del Certificado: **[Ej: AI Paragon]**
- Nivel del Certificado: **[Ej: Hacker]**
- Habilidades Demostradas (separadas por coma): **[Ej: Python,InteligenciaArtificial,DiseñoUX,GestiónDeProyectos]**
- Criterios de Evaluación Clave (separados por coma): **[Ej: InnovaciónAlgorítmica,ImpactoSolución,ColaboraciónEfectiva,PresentaciónImpactante]**
- Nombre del Colegio: **[Ej: Instituto Tecnológico Gnius]**
- Fecha de Emisión del Certificado: **[Ej: 2024-12-01]**
- Ruta Relativa a Imagen Preview Certificado: **[Ej: assets/img/super-proyecto-x/ana-garcia-cert-preview.png]**
- Ruta Relativa a Archivo Impresión Certificado: **[Ej: assets/img/super-proyecto-x/ana-garcia-cert-print.pdf]**

Genera la cadena de texto EXACTA que debo pegar en la celda 'teamMembers' de Google Sheets para este miembro, siguiendo todas las reglas de formato especificadas."

```

---

## 🔧 Prompt para la Celda `technologies` (Puedes listar varias tecnologías)

**Instrucción para la IA:**
"Necesito formatear una lista de tecnologías para la celda 'technologies' de Google Sheets. Cada tecnología individual se separa de la siguiente por el delimitador ' **|** ' (espacio, barra vertical, espacio). Dentro de cada tecnología, hay 3 propiedades que deben separarse por punto y coma (**;**) SIN ESPACIOS alrededor del punto y coma.

**Orden EXACTO de Propiedades por Tecnología (separadas por ';'):**
1.  `NombreTecnologia` (Nombre legible, ej: Arduino UNO, Python, Figma)
2.  `NombreIconoFontAwesome` (Solo el nombre del icono de Font Awesome v6 Free, sin prefijos como 'fa-' o 'fa-solid'. Ej: `microchip`, `python`, `react`, `lightbulb`, `database`, `network-wired`)
3.  `Categoria` (**Valores Exactos Permitidos:** `Hardware`, `Software`, o `Tool`)

**Tecnologías Usadas:**
*   Tecnología 1: Nombre=**[Ej: ESP32]**, Icono=**[Ej: microchip]**, Categoría=**[Ej: Hardware]**
*   Tecnología 2: Nombre=**[Ej: TensorFlow.js]**, Icono=**[Ej: robot]**, Categoría=**[Ej: Software]**
*   Tecnología 3: Nombre=**[Ej: Figma]**, Icono=**[Ej: figma]**, Categoría=**[Ej: Tool]**
*   (Añade más si es necesario)

Genera la cadena de texto EXACTA para pegar en la celda 'technologies' de Google Sheets."
```

---

## 🔗 Prompt para la Celda `additionalResources` (Puedes listar varios recursos)

**Instrucción para la IA:**
"Necesito formatear una lista de recursos adicionales para la celda 'additionalResources' de Google Sheets. Cada recurso se separa del siguiente por ' **|** '. Dentro de cada recurso, las 3 propiedades (Título, URL, Tipo) se separan por punto y coma (**;**) SIN ESPACIOS alrededor.

**Orden EXACTO de Propiedades por Recurso (separadas por ';'):**

1.  `TituloRecurso` (Texto descriptivo del enlace)
2.  `URLRecurso` (URL completa `https://...` o ruta relativa `assets/...`)
3.  `TipoRecurso` (Palabra clave en minúsculas, ej: `github`, `link`, `pdf`, `doc`, `website`, `video`, `paper`, `figma`, `code`, `data`)

**Recursos:**

- Recurso 1: Título=**[Ej: Código Fuente Principal]**, URL=**[Ej: https://github.com/usuario/proyecto-genial]**, Tipo=**[Ej: github]**
- Recurso 2: Título=**[Ej: Documentación Detallada]**, URL=**[Ej: assets/docs/mi-proyecto-doc.pdf]**, Tipo=**[Ej: pdf]**
- (Añade más si es necesario)

Genera la cadena de texto EXACTA para pegar en la celda 'additionalResources' de Google Sheets."

```

---

## 🖼️ Prompt para la Celda `imageGallery` (Puedes listar varias imágenes)

**Instrucción para la IA:**
"Necesito formatear una lista de imágenes para la galería en la celda 'imageGallery' de Google Sheets. Cada imagen se separa de la siguiente por ' **|** '. Dentro de cada imagen, las 3 propiedades (URL, Texto Alternativo, Caption) se separan por punto y coma (**;**) SIN ESPACIOS alrededor. El Caption (propiedad 3) es opcional; si no hay, se deja vacío pero **se mantiene el último punto y coma**.

**Orden EXACTO de Propiedades por Imagen (separadas por ';'):**
1.  `URLImagen` (Ruta relativa obligatoria, ej: `assets/img/mi-proyecto/galeria-01.jpg`)
2.  `TextoAlternativo` (Descripción concisa de la imagen para accesibilidad)
3.  `Caption` (Opcional: título corto para mostrar en el modal. Dejar vacío si no hay)

**Imágenes:**
*   Imagen 1: URL=**[Ej: assets/img/mi-proyecto-x/vista-robot.jpg]**, Alt=**[Ej: Robot explorador en acción]**, Caption=**[Ej: Prototipo funcional V2]**
*   Imagen 2: URL=**[Ej: assets/img/mi-proyecto-x/equipo-trabajando.png]**, Alt=**[Ej: Equipo colaborando en el diseño]**, Caption=**[Ej: Sesión de brainstorming]**
*   Imagen 3: URL=**[Ej: assets/img/mi-proyecto-x/diagrama-circuito.jpg]**, Alt=**[Ej: Diagrama del circuito principal]**, Caption=**[]** (Sin caption, pero mantener el punto y coma)
*   (Añade más si es necesario)

Genera la cadena de texto EXACTA para pegar en la celda 'imageGallery' de Google Sheets. Asegúrate de que cada imagen tenga sus 3 propiedades separadas por ';', incluso si el caption está vacío."
```

---

## 🌍 Prompt para la Celda `sdgIds`

**Instrucción para la IA:**
"Necesito formatear una lista de números de Objetivos de Desarrollo Sostenible (ODS) para la celda 'sdgIds' de Google Sheets. Los números deben estar separados por una **COMA (,) SIN ESPACIOS** entre ellos.

**Números de ODS para el proyecto:** **[Escribe aquí los números de ODS, ej: 1, 5, 10, 13]**

Genera la cadena de texto EXACTA para pegar en la celda 'sdgIds'."

```

---

## 📝 Recordatorio para las 5 Columnas de Rúbrica
(Este no es para generar una cadena, sino para ayudar al usuario a recordar el formato)

"Recuerda que para las siguientes columnas, el valor debe ser un número: **1** (Insuficiente), **2** (Satisfactorio), o **3** (Excelente):
*   `rubricInnovation`
*   `rubricCollaboration`
*   `rubricImpact`
*   `rubricTechUse`
*   `rubricPresentation`"

```
