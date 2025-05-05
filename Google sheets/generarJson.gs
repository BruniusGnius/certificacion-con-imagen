/**
 * @OnlyCurrentDoc
 *
 * Script para generar un archivo JSON con datos de proyectos Gnius Club
 * a partir de una hoja de Google Sheets. V3.1 - Maneja timezone inválido.
 */

// --- Constantes y Configuración ---
const ITEM_SEPARATOR = " | ";
const PROP_SEPARATOR = ";";
const EXPECTED_HEADERS = [
  "projectTitle",
  "projectCategory",
  "studentLevel",
  "projectDate",
  "intro_title",
  "intro_content",
  "coverUrl_url",
  "coverUrl_altText",
  "problemDescription",
  "solutionProposed",
  "innovationProcess",
  "media_type",
  "media_url",
  "media_altText",
  "teamMembers",
  "technologies",
  "additionalResources",
  "imageGallery",
];
const COMPLEX_FIELD_INDICES = {
  teamMembers: 14,
  technologies: 15,
  additionalResources: 16,
  imageGallery: 17,
};
const EVAL_SCORE_PREFIX = "eval_";

// --- Funciones del Menú y UI ---
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Gnius Club Tools")
    .addItem("Generar JSON", "showJsonGeneratorSidebar")
    .addToUi();
}

function showJsonGeneratorSidebar() {
  const html = HtmlService.createTemplateFromFile("Sidebar")
    .evaluate()
    .setTitle("Generador JSON Gnius Club")
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

// --- Función Principal de Generación ---
function generateJson() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    // --- OBTENER Y VALIDAR TIMEZONE --- <<< CAMBIO AQUÍ
    let timezone =
      SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    let timezoneWarning = null;
    if (!timezone || typeof timezone !== "string" || timezone.trim() === "") {
      const defaultTimezone = "Etc/GMT"; // Zona horaria segura por defecto
      Logger.log(
        `WARN: Timezone inválida ('${timezone}'). Usando por defecto: ${defaultTimezone}`
      );
      timezoneWarning = `ADVERTENCIA: No se pudo obtener la zona horaria válida de la hoja. Se usará '${defaultTimezone}' por defecto para formatear fechas. Verifica la configuración de la hoja (Archivo > Configuración).`;
      timezone = defaultTimezone; // Asignar el valor por defecto
    }
    // --- FIN CAMBIO TIMEZONE ---

    if (values.length < 2) {
      return JSON.stringify({
        error: "La hoja está vacía o solo contiene encabezados.",
      });
    }

    const headers = values[0].map((header) => header.trim());
    const dataRows = values.slice(1);

    const headerErrors = validateHeaders(headers);
    if (headerErrors.length > 0) {
      return JSON.stringify({
        error: `Error en encabezados: ${headerErrors.join(", ")}`,
      });
    }

    const headerMap = createHeaderMap(headers);
    const projects = [];
    let validationMessages = [];
    // Añadir advertencia de timezone si existió
    if (timezoneWarning) {
      validationMessages.push(timezoneWarning);
    }

    dataRows.forEach((row, index) => {
      const rowNum = index + 2;
      const projectData = {};
      let hasFatalError = false;

      // --- Mapeo Básico y Slug ---
      headers.forEach((header, colIndex) => {
        if (
          !header.startsWith(EVAL_SCORE_PREFIX) &&
          !Object.values(COMPLEX_FIELD_INDICES).includes(colIndex)
        ) {
          if (header !== "projectDate") {
            projectData[header] =
              row[colIndex] !== undefined && row[colIndex] !== null
                ? String(row[colIndex]).trim()
                : "";
          }
        }
      });

      if (!projectData.projectTitle) {
        validationMessages.push(
          `Fila ${rowNum}: Falta 'projectTitle'. Se omitirá.`
        );
        hasFatalError = true;
      } else {
        projectData.slug = slugify(projectData.projectTitle);
      }

      // --- Manejo de Fechas (projectDate) ---
      const projectDateValue = row[headerMap.projectDate];
      if (projectDateValue) {
        // Pasamos el timezone validado
        const formattedDate = formatDateFromSheet(projectDateValue, timezone);
        if (formattedDate) {
          projectData.projectDate = formattedDate;
        } else {
          validationMessages.push(
            `Fila ${rowNum}, Col 'projectDate': Formato fecha inválido ('${projectDateValue}'). Use DD-MM-YYYY o YYYY-MM-DD.`
          );
        }
      }

      // --- Estructurar Campos Simples (coverUrl) ---
      const coverUrlValue = row[headerMap.coverUrl_url];
      const coverAltValue = row[headerMap.coverUrl_altText];
      if (!coverUrlValue) {
        validationMessages.push(`Fila ${rowNum}: Falta 'coverUrl_url'.`);
        hasFatalError = true;
      } else if (!isValidRelativeUrl(coverUrlValue)) {
        validationMessages.push(
          `Fila ${rowNum}, 'coverUrl_url': URL inválida ('${coverUrlValue}').`
        );
      }
      if (!coverAltValue) {
        validationMessages.push(`Fila ${rowNum}: Falta 'coverUrl_altText'.`);
      }
      projectData.coverUrl = {
        url: String(coverUrlValue || "").trim(),
        altText: String(coverAltValue || "").trim(),
      };

      // --- Estructurar Media ---
      const mediaTypeValue = String(row[headerMap.media_type] || "")
        .trim()
        .toLowerCase();
      const mediaUrlValue = String(row[headerMap.media_url] || "").trim();
      const mediaAltValue = String(row[headerMap.media_altText] || "").trim();
      projectData.media = null;
      if (mediaTypeValue) {
        if (mediaTypeValue !== "video" && mediaTypeValue !== "image") {
          validationMessages.push(
            `Fila ${rowNum}, 'media_type': Valor inválido ('${
              row[headerMap.media_type]
            }').`
          );
        } else {
          if (!mediaUrlValue) {
            validationMessages.push(
              `Fila ${rowNum}: 'media_url' requerido para 'media_type' ${mediaTypeValue}.`
            );
          } else {
            if (
              mediaTypeValue === "image" &&
              !isValidRelativeUrl(mediaUrlValue)
            ) {
              validationMessages.push(
                `Fila ${rowNum}, 'media_url': URL relativa inválida ('${mediaUrlValue}').`
              );
            } else if (
              mediaTypeValue === "video" &&
              !mediaUrlValue.includes("youtube.com/embed/")
            ) {
              validationMessages.push(
                `Fila ${rowNum}, 'media_url': URL video inválida ('${mediaUrlValue}').`
              );
            }
            if (mediaTypeValue === "image" && !mediaAltValue) {
              validationMessages.push(
                `Fila ${rowNum}: 'media_altText' requerido para media tipo imagen.`
              );
            }
            projectData.media = {
              type: mediaTypeValue,
              url: mediaUrlValue,
              altText: mediaTypeValue === "image" ? mediaAltValue : undefined,
            };
          }
        }
      }

      // --- Parseo Campos Complejos ---
      if (!hasFatalError) {
        // Pasamos el timezone validado a parseTeamMember
        projectData.teamMembers = parseComplexField(
          row[headerMap.teamMembers],
          rowNum,
          "teamMembers",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          12,
          (props, r, f) =>
            parseTeamMember(props, r, f, timezone, validationMessages)
        );
        projectData.technologies = parseComplexField(
          row[headerMap.technologies],
          rowNum,
          "technologies",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          3,
          parseTechnology
        );
        projectData.additionalResources = parseComplexField(
          row[headerMap.additionalResources],
          rowNum,
          "additionalResources",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          3,
          parseResource
        );
        projectData.imageGallery = parseComplexField(
          row[headerMap.imageGallery],
          rowNum,
          "imageGallery",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          3,
          parseGalleryImage
        );

        if (!projectData.teamMembers || projectData.teamMembers.length === 0) {
          validationMessages.push(
            `Fila ${rowNum}: 'teamMembers' requerido/inválido.`
          );
          hasFatalError = true;
        }
        if (
          !projectData.technologies ||
          projectData.technologies.length === 0
        ) {
          validationMessages.push(
            `Fila ${rowNum}: 'technologies' requerido/inválido.`
          );
          hasFatalError = true;
        }

        // --- Parseo Puntuaciones ---
        projectData.evaluationScores = {};
        headers.forEach((header, colIndex) => {
          if (header.startsWith(EVAL_SCORE_PREFIX)) {
            const scoreKey = header;
            const scoreValueRaw = row[colIndex];
            if (scoreValueRaw !== null && scoreValueRaw !== "") {
              const scoreValue = Number(scoreValueRaw);
              if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100) {
                projectData.evaluationScores[scoreKey] = scoreValue;
              } else {
                validationMessages.push(
                  `Fila ${rowNum}, Col '${header}': Valor inválido ('${scoreValueRaw}').`
                );
                projectData.evaluationScores[scoreKey] = 0;
              }
            }
          }
        });
        if (Object.keys(projectData.evaluationScores).length === 0) {
          validationMessages.push(
            `Fila ${rowNum}: No se encontraron puntuaciones válidas ('${EVAL_SCORE_PREFIX}*').`
          );
        }
      }

      // --- Añadir si OK ---
      if (!hasFatalError) {
        // Limpiar opcionales
        if (!projectData.media) delete projectData.media;
        if (!projectData.additionalResources)
          delete projectData.additionalResources;
        if (!projectData.imageGallery) delete projectData.imageGallery;
        if (!projectData.innovationProcess)
          delete projectData.innovationProcess;
        if (!projectData.projectCategory) delete projectData.projectCategory;
        if (!projectData.studentLevel) delete projectData.studentLevel;
        if (!projectData.projectDate) delete projectData.projectDate;
        // Limpiar originales
        delete projectData.coverUrl_url;
        delete projectData.coverUrl_altText;
        delete projectData.media_type;
        delete projectData.media_url;
        delete projectData.media_altText;
        projects.push(projectData);
      }
    }); // Fin forEach

    const result = {
      validationMessages: validationMessages,
      projects: projects,
    };
    return JSON.stringify(result, null, 2);
  } catch (e) {
    Logger.log(`Error en generateJson: ${e}\nStack: ${e.stack}`);
    return JSON.stringify({
      error: `Error inesperado: ${e.message}. Revisa Logs.`,
    });
  }
}

// --- Funciones de Parseo y Validación (sin cambios respecto a V3) ---
// (Se mantienen las funciones formatDateFromSheet y parseTeamMember de la V3
//  que ya usan el parámetro 'timezone' que ahora está validado)

function formatDateFromSheet(dateValue, timezone) {
  if (!dateValue) return null;
  let date = null;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === "string") {
    dateValue = dateValue.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const parts = dateValue.split("-");
      const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
      if (
        d &&
        d.getUTCFullYear() == parts[0] &&
        d.getUTCMonth() + 1 == parts[1] &&
        d.getUTCDate() == parts[2]
      )
        return dateValue;
    } else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateValue)) {
      const parts = dateValue.split("-");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const d = new Date(Date.UTC(year, month - 1, day));
        if (
          d &&
          d.getUTCFullYear() === year &&
          d.getUTCMonth() + 1 === month &&
          d.getUTCDate() === day
        )
          date = d;
      }
    }
  }
  if (date && !isNaN(date.getTime())) {
    return Utilities.formatDate(date, timezone, "yyyy-MM-dd");
  }
  Logger.log(
    `No se pudo parsear la fecha: ${dateValue} con timezone ${timezone}`
  );
  return null;
}

function parseTeamMember(
  props,
  rowNum,
  fieldName,
  timezone,
  validationMessages
) {
  const [
    name,
    role,
    sbtLink,
    courseName,
    badgeName,
    level,
    skills,
    criteria,
    college,
    issueDateRaw,
    previewUrl,
    printUrl,
  ] = props;
  let isValid = true;
  const addValidationError = (msg) => {
    validationMessages.push(
      `Fila ${rowNum}, ${fieldName} (${name || "?"}): ${msg}`
    );
    isValid = false;
  };
  if (!name) addValidationError("Falta nombre.");
  if (!role) addValidationError("Falta rol.");
  if (!courseName) addValidationError("Falta curso.");
  if (!badgeName) addValidationError("Falta insignia.");
  if (!level) addValidationError("Falta nivel.");
  if (!college) addValidationError("Falta colegio.");
  let formattedIssueDate = null;
  if (!issueDateRaw) {
    addValidationError("Falta fecha emisión cert.");
  } else {
    formattedIssueDate = formatDateFromSheet(issueDateRaw, timezone);
    if (!formattedIssueDate) {
      addValidationError(`Fecha emisión inválida ('${issueDateRaw}').`);
    }
  }
  if (!previewUrl || !isValidRelativeUrl(previewUrl)) {
    addValidationError(`URL preview cert. inválida ('${previewUrl}').`);
  }
  if (!printUrl || !isValidRelativeUrlOrPdf(printUrl)) {
    addValidationError(`URL print cert. inválida ('${printUrl}').`);
  }
  if (sbtLink && !isValidUrl(sbtLink)) {
    validationMessages.push(
      `Fila ${rowNum}, ${fieldName} (${name}): URL SBT inválida ('${sbtLink}').`
    );
  }
  if (!isValid) return null;
  return {
    name: name,
    role: role,
    sbtLink: sbtLink && isValidUrl(sbtLink) ? sbtLink : undefined,
    certificate_courseName: courseName,
    certificate_badgeName: badgeName,
    certificate_level: level,
    certificate_skills: skills || "",
    certificate_criteria: criteria || "",
    certificate_college: college,
    certificate_issueDate: formattedIssueDate,
    certificate_previewUrl: previewUrl,
    certificate_printUrl: printUrl,
  };
}

// --- Resto de funciones auxiliares (sin cambios desde V3) ---
function validateHeaders(actualHeaders) {
  let errors = [];
  const actualHeaderSet = new Set(actualHeaders);
  EXPECTED_HEADERS.forEach((expected) => {
    if (!actualHeaderSet.has(expected)) {
      errors.push(`Falta columna: '${expected}'`);
    }
  });
  if (!actualHeaders.some((h) => h.startsWith(EVAL_SCORE_PREFIX))) {
    errors.push(`Falta columna puntuación ('${EVAL_SCORE_PREFIX}*')`);
  }
  return errors;
}
function createHeaderMap(headers) {
  const map = {};
  headers.forEach((h, i) => (map[h] = i));
  return map;
}
function parseComplexField(
  cellValue,
  rowNum,
  fieldName,
  itemSep,
  propSep,
  expectedProps,
  parserFn
) {
  if (!cellValue || typeof cellValue !== "string" || cellValue.trim() === "")
    return null;
  const items = cellValue.split(itemSep);
  const result = [];
  let hasErrors = false;
  items.forEach((item, index) => {
    const props = item.split(propSep).map((p) => p.trim());
    if (props.length !== expectedProps) {
      Logger.log(
        `Fila ${rowNum}, ${fieldName}, Item ${
          index + 1
        }: Props ${expectedProps} vs ${props.length}. Item: "${item}"`
      );
      hasErrors = true;
    } else {
      const parsed = parserFn(props, rowNum, fieldName);
      if (parsed) {
        result.push(parsed);
      } else {
        hasErrors = true;
      }
    }
  });
  if (
    hasErrors &&
    result.length === 0 &&
    typeof validationMessages !== "undefined"
  ) {
    Logger.log(
      `Fila ${rowNum}, Campo '${fieldName}': Formato incorrecto, ningún item procesado.`
    );
  }
  return result.length > 0 ? result : null;
}
function parseTechnology(props, rowNum, fieldName) {
  const [name, icon, category] = props;
  const validCats = ["hardware", "software", "tool"];
  if (!name) {
    Logger.log(`Fila ${rowNum}, ${fieldName}: Falta nombre tec.`);
    return null;
  }
  if (!icon) {
    Logger.log(`Fila ${rowNum}, ${fieldName} (${name}): Falta icono.`);
    return null;
  }
  if (!category || !validCats.includes(category.toLowerCase())) {
    Logger.log(
      `Fila ${rowNum}, ${fieldName} (${name}): Categoría inválida ('${category}').`
    );
    return null;
  }
  return { name: name, icon: getFaIconClass(icon), category: category };
}
function parseResource(props, rowNum, fieldName) {
  const [title, url, type] = props;
  if (!title) {
    Logger.log(`Fila ${rowNum}, ${fieldName}: Falta título rec.`);
    return null;
  }
  if (!url || !(isValidUrl(url) || isValidRelativeUrl(url))) {
    Logger.log(
      `Fila ${rowNum}, ${fieldName} ('${title}'): URL inválida ('${url}').`
    );
    return null;
  }
  if (!type) {
    Logger.log(`Fila ${rowNum}, ${fieldName} ('${title}'): Falta tipo rec.`);
    return null;
  }
  return { title: title, url: url, type: type.toLowerCase() };
}
function parseGalleryImage(props, rowNum, fieldName) {
  if (props.length !== 3) {
    Logger.log(`Fila ${rowNum}, ${fieldName}: Props != 3.`);
    return null;
  }
  const [url, altText, caption] = props;
  if (!url || !isValidRelativeUrl(url)) {
    Logger.log(`Fila ${rowNum}, ${fieldName}: URL img inválida ('${url}').`);
    return null;
  }
  if (!altText) {
    Logger.log(`Fila ${rowNum}, ${fieldName} ('${url}'): Falta alt text.`);
    return null;
  }
  const img = { url: url, altText: altText };
  if (caption) {
    img.caption = caption;
  }
  return img;
}
function slugify(text) {
  if (!text) return "";
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrrsssssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
function isValidUrl(str) {
  return (
    typeof str === "string" &&
    (str.startsWith("http://") || str.startsWith("https://"))
  );
}
function isValidRelativeUrl(str) {
  return (
    typeof str === "string" &&
    (str.startsWith("assets/img/") || str.startsWith("assets/docs/"))
  );
}
function isValidRelativeUrlOrPdf(str) {
  return isValidRelativeUrl(str);
}
function getFaIconClass(iconName) {
  if (!iconName) return "fa-solid fa-question-circle";
  const lower = iconName.toLowerCase();
  const brands = [
    "python",
    "node-js",
    "react",
    "angular",
    "vuejs",
    "js",
    "html5",
    "css3",
    "sass",
    "less",
    "bootstrap",
    "java",
    "php",
    "android",
    "apple",
    "windows",
    "linux",
    "ubuntu",
    "github",
    "gitlab",
    "bitbucket",
    "docker",
    "figma",
    "git",
    "git-alt",
    "aws",
    "google",
    "facebook",
    "twitter",
    "linkedin",
    "youtube",
    "wordpress",
    "arduino",
    "raspberry-pi",
  ];
  return brands.includes(lower)
    ? `fa-brands fa-${lower}`
    : `fa-solid fa-${lower}`;
}
