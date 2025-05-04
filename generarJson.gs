javascript;
/**
 * @OnlyCurrentDoc // Restringe el script a solo afectar la hoja actual
 */

const SHEET_NAME = "Proyectos"; // Nombre esperado de la hoja que contiene los datos
const HEADER_ROW = 1; // La fila 1 contiene los encabezados

/**
 * Se ejecuta cuando la hoja de cálculo se abre.
 * Agrega un menú personalizado para ejecutar la generación del JSON.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Gnius Club Tools")
    .addItem("Generar JSON de Proyectos", "showJsonOutput")
    .addToUi();
}

/**
 * Función principal que lee la hoja, procesa los datos y devuelve el JSON.
 * @returns {string} Una cadena de texto formateada como JSON.
 * @throws {Error} Si la hoja 'Proyectos' no se encuentra o está vacía.
 */
function generateProjectsJsonString() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(
      `No se encontró la hoja con el nombre "${SHEET_NAME}". Asegúrate de que la hoja exista y tenga ese nombre exacto.`
    );
  }

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  if (values.length <= HEADER_ROW) {
    throw new Error(
      `La hoja "${SHEET_NAME}" está vacía o solo contiene encabezados. Añade datos de proyectos para generar el JSON.`
    );
  }

  const headers = values[HEADER_ROW - 1].map((header) => header.trim());
  const projectsData = values.slice(HEADER_ROW); // Datos desde la segunda fila

  const projectsArray = [];

  // Obtener índices de columnas basado en encabezados (más robusto que posiciones fijas)
  const headerMap = {};
  headers.forEach((header, index) => {
    headerMap[header] = index;
  });

  // --- Validar que las columnas esenciales existen ---
  const essentialHeaders = [
    "projectTitle",
    "intro_title",
    "intro_content",
    "coverUrl_url",
    "coverUrl_altText",
    "problemDescription",
    "solutionProposed",
    "teamMembers",
    "technologies",
    "eval_Impacto Potencial",
  ]; // Añade otras requeridas aquí
  const missingHeaders = essentialHeaders.filter((h) => !(h in headerMap));
  if (missingHeaders.length > 0) {
    throw new Error(
      `Faltan las siguientes columnas requeridas en la hoja "${SHEET_NAME}": ${missingHeaders.join(
        ", "
      )}`
    );
  }
  // --- Fin Validación ---

  projectsData.forEach((row, rowIndex) => {
    // Ignorar filas completamente vacías
    if (row.every((cell) => cell === "")) return;

    const project = {};
    const projectTitle = getStringValue(row, headerMap, "projectTitle");

    // Saltar fila si el título del proyecto está vacío (dato esencial)
    if (!projectTitle) {
      Logger.log(
        `Fila ${
          rowIndex + HEADER_ROW + 1
        } ignorada: Falta el título del proyecto (projectTitle).`
      );
      return; // Saltar esta fila
    }

    project.projectTitle = projectTitle;
    project.slug = generateSlug(projectTitle); // Generar slug

    // Mapeo de campos simples (String, Date)
    addStringValue(project, row, headerMap, "projectCategory");
    addStringValue(project, row, headerMap, "studentLevel");
    addStringValue(project, row, headerMap, "projectDate"); // Mantener como string YYYY-MM-DD
    addStringValue(project, row, headerMap, "intro_title", true); // Requerido
    addStringValue(project, row, headerMap, "intro_content", true); // Requerido
    addStringValue(project, row, headerMap, "problemDescription", true); // Requerido
    addStringValue(project, row, headerMap, "solutionProposed", true); // Requerido
    addStringValue(project, row, headerMap, "innovationProcess"); // Opcional, podría tener saltos de línea

    // Campos Objeto (coverUrl, media)
    project.coverUrl = {
      url: getStringValue(row, headerMap, "coverUrl_url", true), // Requerido
      altText: getStringValue(row, headerMap, "coverUrl_altText", true), // Requerido
    };

    const mediaType = getStringValue(row, headerMap, "media_type");
    const mediaUrl = getStringValue(row, headerMap, "media_url");
    if (mediaType && mediaUrl) {
      // Solo añadir si type y url existen
      project.media = {
        type: mediaType,
        url: mediaUrl,
        altText:
          getStringValue(row, headerMap, "media_altText") ||
          `Media for ${projectTitle}`, // Alt text opcional, default
      };
    }

    // Campos Array de Objetos (teamMembers, technologies, additionalResources, imageGallery)
    project.teamMembers = parseComplexList(
      getStringValue(row, headerMap, "teamMembers", true), // Requerido
      [
        "name",
        "role",
        "sbtLink",
        "certificate_courseName",
        "certificate_badgeName",
        "certificate_level",
        "certificate_skills",
        "certificate_criteria",
        "certificate_college",
        "certificate_issueDate",
      ]
    );
    // Validar que al menos un miembro tenga datos de certificado
    if (
      !project.teamMembers ||
      project.teamMembers.length === 0 ||
      !project.teamMembers.some(
        (m) =>
          m.certificate_courseName &&
          m.certificate_badgeName &&
          m.certificate_level &&
          m.certificate_skills &&
          m.certificate_criteria &&
          m.certificate_college &&
          m.certificate_issueDate
      )
    ) {
      Logger.log(
        `Advertencia Fila ${
          rowIndex + HEADER_ROW + 1
        } (${projectTitle}): Campo 'teamMembers' está vacío o incompleto (faltan datos de certificado obligatorios).`
      );
      // Decidir si saltar la fila o continuar con advertencia. Por ahora, continuar.
    }

    project.technologies = parseComplexList(
      getStringValue(row, headerMap, "technologies", true), // Requerido
      ["name", "icon", "category"]
    );
    if (!project.technologies || project.technologies.length === 0) {
      Logger.log(
        `Advertencia Fila ${
          rowIndex + HEADER_ROW + 1
        } (${projectTitle}): Campo 'technologies' está vacío.`
      );
      // Continuar
    }

    project.additionalResources = parseComplexList(
      getStringValue(row, headerMap, "additionalResources"),
      ["title", "url", "type"]
    ); // Opcional

    project.imageGallery = parseComplexList(
      getStringValue(row, headerMap, "imageGallery"),
      ["url", "altText", "caption"] // Caption es opcional dentro del objeto
    ); // Opcional

    // Campo Objeto (evaluationScores) - Nombres deben coincidir EXACTAMENTE
    project.evaluationScores = {};
    const evalPrefix = "eval_";
    headers.forEach((header, index) => {
      if (header.startsWith(evalPrefix)) {
        const metricName = header
          .substring(evalPrefix.length)
          .replace(/_/g, " "); // Reemplazar _ con espacio si se usa como separador
        const score = getNumericValue(row, headerMap, header);
        if (score !== null) {
          // Solo añadir si el valor es numérico válido
          project.evaluationScores[metricName] = score;
        } else {
          Logger.log(
            `Advertencia Fila ${
              rowIndex + HEADER_ROW + 1
            } (${projectTitle}): Valor no numérico o vacío para la métrica '${metricName}'. Se omitirá.`
          );
        }
      }
    });
    // Validar que haya al menos una puntuación si el objeto existe
    if (Object.keys(project.evaluationScores).length === 0) {
      Logger.log(
        `Advertencia Fila ${
          rowIndex + HEADER_ROW + 1
        } (${projectTitle}): No se encontraron puntuaciones de evaluación válidas.`
      );
      // Decidir si eliminar el objeto vacío o dejarlo. Lo dejamos vacío por ahora.
    }

    projectsArray.push(project);
  });

  // Convertir el array de objetos a una cadena JSON formateada
  return JSON.stringify(projectsArray, null, 2); // Indentación de 2 espacios para legibilidad
}

/**
 * Muestra el JSON generado en un diálogo en la interfaz de Google Sheets.
 */
function showJsonOutput() {
  const ui = SpreadsheetApp.getUi();
  try {
    const jsonString = generateProjectsJsonString();

    // Usar un diálogo HTML para mostrar texto preformateado y seleccionable
    const htmlOutput = HtmlService.createHtmlOutput(
      `<style> pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f4f4f4; border: 1px solid #ccc; padding: 10px; max-height: 400px; overflow-y: auto; } </style>
         <p>Copia el siguiente JSON y pégalo en el archivo 'data/projects.json' de tu proyecto:</p>
         <pre>${escapeHtml(jsonString)}</pre>`
    )
      .setWidth(600)
      .setHeight(500);
    ui.showModalDialog(htmlOutput, "JSON Generado para Proyectos");
  } catch (error) {
    Logger.log(
      "Error al generar JSON: " + error.message + "\nStack: " + error.stack
    );
    ui.alert(
      "Error al Generar JSON",
      `Ocurrió un error: ${error.message}\n\nConsulta los registros (Ver > Registros) para más detalles. Asegúrate de que la hoja "${SHEET_NAME}" existe, tiene los encabezados correctos y datos válidos.`,
      ui.ButtonSet.OK
    );
  }
}

// --- Funciones Auxiliares ---

/**
 * Genera un slug amigable para URL a partir de un texto.
 * @param {string} text El texto a convertir.
 * @returns {string} El slug generado.
 */
function generateSlug(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Separar acentos y caracteres base
    .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos (acentos)
    .replace(/\s+/g, "-") // Reemplazar espacios con -
    .replace(/[^\w\-]+/g, "") // Eliminar caracteres no alfanuméricos (excepto -)
    .replace(/\-\-+/g, "-") // Reemplazar múltiples - con uno solo
    .replace(/^-+/, "") // Quitar - del inicio
    .replace(/-+$/, ""); // Quitar - del final
}

/**
 * Obtiene el valor de una celda como string, asegurándose de que no sea nulo/vacío si es requerido.
 * @param {Array} row La fila de datos.
 * @param {object} headerMap Mapa de encabezados a índices.
 * @param {string} headerName Nombre del encabezado de la columna.
 * @param {boolean} [isRequired=false] Si el campo es obligatorio.
 * @returns {string} El valor de la celda como string, o string vacío si es opcional y está vacío.
 * @throws {Error} Si el campo es requerido y está vacío o la columna no existe.
 */
function getStringValue(row, headerMap, headerName, isRequired = false) {
  if (!(headerName in headerMap)) {
    if (isRequired)
      throw new Error(
        `La columna requerida "${headerName}" no se encontró en la hoja.`
      );
    return ""; // Columna opcional no encontrada
  }
  const index = headerMap[headerName];
  const value =
    index < row.length && row[index] !== null && row[index] !== undefined
      ? String(row[index]).trim()
      : "";

  if (isRequired && value === "") {
    throw new Error(
      `El campo requerido "${headerName}" está vacío en una de las filas.`
    );
  }
  return value;
}

/**
 * Añade un valor string a un objeto si el valor no está vacío.
 * @param {object} obj El objeto al que añadir el valor.
 * @param {Array} row La fila de datos.
 * @param {object} headerMap Mapa de encabezados a índices.
 * @param {string} headerName Nombre del encabezado/clave.
 * @param {boolean} [isRequired=false] Si el campo es obligatorio.
 */
function addStringValue(obj, row, headerMap, headerName, isRequired = false) {
  const value = getStringValue(row, headerMap, headerName, isRequired);
  // Añadir solo si es requerido o si es opcional pero tiene valor
  if (isRequired || value !== "") {
    obj[headerName] = value;
  }
}

/**
 * Obtiene el valor numérico de una celda.
 * @param {Array} row La fila de datos.
 * @param {object} headerMap Mapa de encabezados a índices.
 * @param {string} headerName Nombre del encabezado.
 * @returns {number|null} El valor numérico o null si no es un número válido o la celda está vacía.
 */
function getNumericValue(row, headerMap, headerName) {
  if (!(headerName in headerMap)) return null; // Columna no encontrada

  const index = headerMap[headerName];
  const value =
    index < row.length && row[index] !== null && row[index] !== undefined
      ? row[index]
      : null;

  if (value === null || value === "" || isNaN(Number(value))) {
    return null; // No es un número válido o está vacío
  }
  return Number(value);
}

/**
 * Parsea una cadena de texto de una celda que contiene una lista compleja.
 * Formato esperado: "val1A;val2A;val3A | val1B;val2B;val3B | ..."
 * @param {string} cellValue El valor de la celda.
 * @param {Array<string>} propertyNames Los nombres de las propiedades para cada objeto.
 * @returns {Array<object>} Un array de objetos parseados. Devuelve array vacío si cellValue es vacío.
 */
function parseComplexList(cellValue, propertyNames) {
  if (!cellValue || cellValue.trim() === "") {
    return []; // Devuelve array vacío si no hay valor
  }

  const items = cellValue.split("|"); // Separador de elementos
  const result = [];

  items.forEach((item) => {
    const properties = item.split(";"); // Separador de propiedades
    const obj = {};
    let hasData = false; // Flag para saber si el item tiene algún dato

    propertyNames.forEach((propName, index) => {
      // Usar trim() para limpiar espacios alrededor de los valores
      const value = index < properties.length ? properties[index].trim() : "";
      if (value !== "") {
        hasData = true; // Marcamos que este item tiene datos
      }
      // Asignar incluso si está vacío, para mantener la estructura,
      // a menos que sea una propiedad interna opcional como 'caption'
      // Nota: Ajustar si alguna propiedad interna es opcional y no debe aparecer si está vacía.
      obj[propName] = value;
    });

    // Añadir el objeto al resultado solo si tiene algún dato relevante
    // Esto evita añadir objetos vacíos si hay separadores extra (ej. " | | ")
    if (hasData) {
      result.push(obj);
    }
  });

  return result;
}

/**
 * Escapa caracteres HTML para mostrarlos de forma segura en HtmlService.
 * @param {string} str La cadena a escapar.
 * @returns {string} La cadena escapada.
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
