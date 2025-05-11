# Instrucciones de Uso del Script "Generador JSON Gnius Club" (v4.0)

Este script de Google Apps Script está diseñado para leer los datos de los proyectos desde la hoja de cálculo activa, validarlos y convertirlos al formato JSON requerido por el sitio web de portafolios y certificados de Gnius Club.

## 🚀 Cómo Usar el Script

1.  **Abrir la Hoja de Cálculo:** Abre la Google Sheet que contiene los datos de los proyectos. Asegúrate de estar en la hoja correcta que deseas procesar.
2.  **Encontrar el Menú Personalizado:** En la barra de menú de Google Sheets, busca el menú llamado **"Gnius Club Tools"**.
    - _Nota: Si acabas de abrir la hoja o de instalar el script, puede tardar unos segundos en aparecer este menú._
3.  **Ejecutar el Generador de JSON:**
    - Haz clic en `Gnius Club Tools`.
    - Selecciona la opción **"Generar JSON"** del submenú.
4.  **Autorización (Solo la Primera Vez):**
    - La **primera vez** que ejecutes el script en una hoja de cálculo (o después de una actualización mayor del script), Google te pedirá autorización para que el script pueda acceder a tus datos de Google Sheets.
    - Aparecerá un diálogo de "Se requiere autorización". Haz clic en **"Continuar"**.
    - Selecciona tu cuenta de Google cuando se te solicite.
    - Es posible que Google muestre una pantalla de advertencia indicando "Google no ha verificado esta aplicación". Esto es normal para scripts que no están publicados en el Marketplace de Google Workspace.
      - Para continuar, haz clic en **"Configuración avanzada"** (o un enlace similar como "Ir a [Nombre de tu script] (no seguro)").
      - Luego, haz clic en **"Permitir"** para conceder los permisos necesarios al script. El script solo necesita acceso para leer la hoja activa y mostrar una barra lateral.
5.  **Ver la Barra Lateral del Generador:**
    - Una vez autorizado (si fue necesario) y ejecutado, aparecerá una **barra lateral** a la derecha de tu hoja de cálculo, titulada "Generador JSON Gnius Club".
6.  **Generar el JSON:**
    - Dentro de la barra lateral, haz clic en el botón azul **"Generar JSON"**.
7.  **Revisar Resultados y Mensajes de Validación:**
    - **Estado:** Un pequeño texto debajo del botón te indicará el progreso: "Generando..." y luego "¡Generación completada!" o un mensaje de error.
    - **Mensajes de Validación:** Justo debajo del título "Resultado:", aparecerá una sección de "Mensajes de Validación".
      - Si todo está perfecto, verás un mensaje como "Validación completada sin advertencias."
      - Si hay problemas leves (advertencias ⚠️) o errores de formato que el script pudo identificar (errores ❗️), se listarán aquí. **Es crucial que revises estos mensajes.** Indicarán la fila de la hoja y el problema específico (ej. "Fila 5, Col 'sdgIds': Contiene valores inválidos...").
      - **Corrige los datos directamente en tu Google Sheet** según los mensajes de validación. Luego, vuelve a hacer clic en "Generar JSON" en la barra lateral.
    - **Salida JSON:** El código JSON resultante se mostrará en el área de texto grande. Si hubo errores graves que impidieron la generación completa (ej. falta de `projectTitle` en muchas filas, o errores en encabezados), el área JSON podría mostrar un mensaje de error o estar vacía.
8.  **Copiar el JSON al Portapapeles:**
    - Si el JSON se generó correctamente (incluso con advertencias leves), el botón **"Copiar al Portapapeles"** se habilitará.
    - Haz clic en este botón para copiar **todo** el contenido del área de texto JSON. Aparecerá un mensaje "¡Copiado!".
9.  **Actualizar el Archivo `data/projects.json` en tu Repositorio:**
    - Abre el archivo `data/projects.json` en tu editor de código local (en la raíz de la carpeta `data/` de tu proyecto).
    - **Selecciona todo el contenido actual de este archivo y bórralo.**
    - **Pega el nuevo JSON** que copiaste desde la barra lateral de Google Sheets.
    - Guarda el archivo `projects.json`.
10. **Cerrar la Barra Lateral:**
    - Puedes cerrar la barra lateral en cualquier momento haciendo clic en la 'X' en su esquina superior derecha.

## ⚙️ ¿Qué Hace el Script `generarJson.gs` Detrás de Escena?

- **Añade el Menú:** La función `onOpen()` crea el menú "Gnius Club Tools".
- **Muestra la Interfaz:** La función `showJsonGeneratorSidebar()` crea y muestra la barra lateral HTML (`Sidebar.html`).
- **Procesa los Datos (`generateJson()`):**
  - Obtiene la hoja de cálculo activa y todos sus datos.
  - Verifica que los **encabezados de columna** coincidan con los esperados (definidos en la constante `EXPECTED_HEADERS` del script).
  - Itera sobre cada fila de datos (saltando la fila de encabezados):
    - Extrae valores de cada celda.
    - Limpia espacios en blanco al inicio y final de cada valor.
    - Genera un `slug` (identificador para URL) a partir del `projectTitle`, convirtiéndolo a minúsculas y reemplazando espacios y caracteres especiales por guiones.
    - **Valida y formatea** campos específicos:
      - `projectDate`: Intenta convertir a formato YYYY-MM-DD.
      - `schooling`: Valida que sea uno de los valores permitidos ("Primaria", "Secundaria", "Preparatoria").
      - `sdgIds`: Convierte la cadena de texto separada por comas en un array de números (ej. "1,5,10" -> `[1, 5, 10]`), validando que los IDs estén entre 1 y 17.
      - `rubric*` (las 5 columnas de rúbrica): Valida que las puntuaciones sean números válidos (1, 2 o 3).
      - **Calcula `finalProjectGrade`:** Suma las 5 puntuaciones de la rúbrica (rango total de 5-15) y aplica una tabla de conversión interna para obtener una calificación final del proyecto de 1 a 10.
    - **Parsea Campos Complejos:** Convierte las cadenas de texto de `teamMembers`, `technologies`, `additionalResources`, y `imageGallery` (que usan `|` para separar items y `;` para separar propiedades dentro de cada item) en arrays de objetos JSON estructurados.
      - Dentro de `teamMembers`, valida que `NombreInsigniaCertificado` y `NivelCertificado` coincidan con las listas de valores predefinidos (`VALID_BADGES`, `VALID_LEVELS`). También formatea la fecha de emisión del certificado.
      - Dentro de `technologies`, valida la categoría y asigna la clase de icono Font Awesome correcta.
      - Valida formatos de URL para recursos, imágenes de galería y certificados.
  - **Construye el Objeto JSON Final:** Agrupa todos los proyectos procesados y válidos en un array JSON.
  - **Devuelve Resultados:** Envía el string JSON generado y la lista acumulada de mensajes de validación (errores o advertencias) a la barra lateral para ser mostrados al usuario.

## ⚠️ Posibles Problemas y Soluciones Comunes

- **Menú "Gnius Club Tools" no aparece:**
  - **Solución:** Recarga la hoja de cálculo (F5 o Cmd+R). Espera unos segundos. Si sigue sin aparecer, ve a `Extensiones > Apps Script`. Asegúrate de que el script (`generarJson.gs` y `Sidebar.html`) esté guardado correctamente y no muestre errores obvios (como líneas rojas subrayadas) en el editor de Apps Script.
- **Error de Autorización Persistente:**
  - **Solución:** Intenta quitar los permisos del script para tu cuenta y volver a autorizar. Ve a tu Cuenta de Google > Seguridad > "Gestionar el acceso de terceros" (o similar) > Busca el nombre de tu proyecto de Apps Script (o "Generador JSON Gnius Club") y revoca el acceso. Luego, intenta ejecutar el script de nuevo desde la hoja de cálculo para pasar por el flujo de autorización.
- **Mensajes de Error/Advertencia en la Barra Lateral:**
  - **Solución:** ¡Léelos con atención! Usualmente indican la **fila de la hoja** y la **columna o campo específico** que tiene el problema. Los errores más comunes son:
    - Formatos incorrectos en campos complejos (ej. falta un `;` o un `|` donde se espera, o se usaron espacios incorrectos alrededor de estos separadores).
    - Valores inválidos (ej. un valor en una columna `rubric*` que no sea 1, 2 o 3; un `sdgId` fuera de 1-17; una Insignia o Nivel no permitido en `teamMembers`).
    - URLs mal formadas o rutas relativas incorrectas (ej. no empiezan con `assets/`).
    - Campos requeridos vacíos (especialmente `projectTitle`).
  - **Corrige los datos directamente en la Google Sheet y vuelve a generar el JSON.**
- **JSON Vacío o con Error Grave en la Barra Lateral:**
  - Esto generalmente ocurre si hay errores críticos como encabezados de columna faltantes o incorrectos en la primera fila de tu hoja, o si la hoja está prácticamente vacía o tiene errores muy generalizados que impiden el procesamiento. Revisa los mensajes de validación (si los hay) y los datos de tu hoja, especialmente la **fila de encabezados**.

---

Siguiendo estas instrucciones y las "Instrucciones de Llenado de Google Sheets" cuidadosamente, el proceso de actualización del contenido de Gnius Club será mucho más fluido.
