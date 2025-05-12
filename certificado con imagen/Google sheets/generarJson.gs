/**
 * @OnlyCurrentDoc
 *
 * Script para generar un archivo JSON con datos de proyectos Gnius Club
 * a partir de una hoja de Google Sheets. V4.3 - Corrige pase de 'timezone'.
 */

// --- Constantes y Configuración ---
const ITEM_SEPARATOR = " | ";
const PROP_SEPARATOR = ";";
const EXPECTED_HEADERS = [
  "projectTitle",
  "projectCategory",
  "schooling",
  "projectDate",
  "sdgIds",
  "introTitle",
  "introContent",
  "coverImageUrl",
  "coverImageAltText",
  "problemDescription",
  "solutionProposed",
  "innovationProcess",
  "mediaType",
  "mediaUrl",
  "mediaAltText",
  "teamMembers",
  "technologies",
  "additionalResources",
  "imageGallery",
  "rubricInnovation",
  "rubricCollaboration",
  "rubricImpact",
  "rubricTechUse",
  "rubricPresentation",
];
const COMPLEX_FIELD_INDICES = {
  teamMembers: 15,
  technologies: 16,
  additionalResources: 17,
  imageGallery: 18,
};
const VALID_BADGES = [
  "Code Explorer",
  "Algorithm Seeker",
  "Micro Programmer",
  "Robot Navigator",
  "Tech Voyager",
  "Network Pioneer",
  "Design Architect",
  "Reality Master",
  "Expert Roboteer",
  "Prompt Sage",
  "App Maverick",
  "AI Paragon",
];
const VALID_LEVELS = ["Rookie", "Master", "Hacker"];

// Variable global para mensajes (se reinicia en cada ejecución)
let validationMessages = [];
// Variable global para timezone (se asigna en cada ejecución)
let scriptTimezone = "Etc/GMT"; // Default seguro

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
  // Reiniciar mensajes y obtener timezone
  validationMessages = [];
  scriptTimezone =
    SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(); // Asignar a la global
  let timezoneWarning = null;

  if (
    !scriptTimezone ||
    typeof scriptTimezone !== "string" ||
    scriptTimezone.trim() === ""
  ) {
    scriptTimezone = "Etc/GMT"; // Reasignar global si es inválida
    Logger.log(
      `WARN: Timezone inválida. Usando por defecto: ${scriptTimezone}`
    );
    timezoneWarning = `ADVERTENCIA: No se pudo obtener zona horaria válida de la hoja. Se usará '${scriptTimezone}' por defecto para formatear fechas. Verifica la configuración de la hoja (Archivo > Configuración).`;
    validationMessages.push(timezoneWarning);
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    if (values.length < 2) {
      return JSON.stringify({
        error: "La hoja está vacía o solo contiene encabezados.",
      });
    }

    const headers = values[0].map((header) => header.trim());
    const dataRows = values.slice(1);

    const headerErrors = validateHeaders(headers, validationMessages);
    if (headerErrors.length > 0) {
      return JSON.stringify({
        error: `Error en encabezados. ${headerErrors.join(
          " "
        )} Consulta los mensajes de validación.`,
        validationMessages: validationMessages,
      });
    }

    const headerMap = createHeaderMap(headers);
    const projects = [];

    dataRows.forEach((row, index) => {
      const rowNum = index + 2;
      const projectData = {};
      let hasFatalError = false;

      // Mapeo Básico y Slug
      headers.forEach((header, colIndex) => {
        if (
          !Object.values(COMPLEX_FIELD_INDICES).includes(colIndex) &&
          !header.startsWith("rubric") &&
          header !== "projectDate" &&
          header !== "sdgIds"
        ) {
          projectData[header] =
            row[colIndex] !== undefined && row[colIndex] !== null
              ? String(row[colIndex]).trim()
              : "";
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

      // Validar Schooling
      const validSchooling = ["Primaria", "Secundaria", "Preparatoria"];
      if (
        projectData.schooling &&
        !validSchooling.includes(projectData.schooling)
      ) {
        validationMessages.push(
          `Fila ${rowNum}, Col 'schooling': Valor inválido ('${
            projectData.schooling
          }'). Permitidos: ${validSchooling.join(", ")}.`
        );
        projectData.schooling = ""; // Omitir valor inválido
      }

      // Manejo de Fechas
      const projectDateValue = row[headerMap.projectDate];
      projectData.projectDate = null; // Default a null
      if (projectDateValue) {
        const formattedDate = formatDateFromSheet(
          projectDateValue,
          scriptTimezone
        ); // USA scriptTimezone
        if (formattedDate) {
          projectData.projectDate = formattedDate;
        } else {
          validationMessages.push(
            `Fila ${rowNum}, Col 'projectDate': Formato fecha inválido ('${projectDateValue}'). Use DD-MM-YYYY o YYYY-MM-DD.`
          );
        }
      }

      // Parsear SDG IDs
      const sdgIdsRaw = row[headerMap.sdgIds]
        ? String(row[headerMap.sdgIds]).trim()
        : "";
      projectData.sdgIds = [];
      if (sdgIdsRaw) {
        const ids = sdgIdsRaw
          .split(/[\s,]+/)
          .map((id) => Number(id.trim()))
          .filter((id) => !isNaN(id));
        const validIds = ids.filter((id) => id >= 1 && id <= 17);
        if (validIds.length !== ids.length) {
          validationMessages.push(
            `Fila ${rowNum}, Col 'sdgIds': Contiene valores inválidos o fuera del rango 1-17 ('${sdgIdsRaw}'). Se usarán solo los válidos.`
          );
        }
        projectData.sdgIds =
          validIds.length > 0
            ? [...new Set(validIds)].sort((a, b) => a - b)
            : [];
      }

      // Estructurar Cover Image
      projectData.coverImage = {
        url: String(projectData.coverImageUrl || "").trim(),
        altText: String(projectData.coverImageAltText || "").trim(),
      };
      if (!projectData.coverImage.url) {
        validationMessages.push(`Fila ${rowNum}: Falta 'coverImageUrl'.`);
        hasFatalError = true;
      } else if (
        !isValidRelativeUrl(projectData.coverImage.url) &&
        !isValidPicsumUrl(projectData.coverImage.url)
      ) {
        validationMessages.push(
          `Fila ${rowNum}, 'coverImageUrl': URL inválida ('${projectData.coverImage.url}'). Debe ser relativa (assets/...) o de Picsum.`
        );
        hasFatalError = true;
      }
      if (!projectData.coverImage.altText) {
        validationMessages.push(`Fila ${rowNum}: Falta 'coverImageAltText'.`);
      }
      delete projectData.coverImageUrl;
      delete projectData.coverImageAltText;

      // Estructurar Media
      const mediaTypeValue = String(projectData.mediaType || "")
        .trim()
        .toLowerCase();
      const mediaUrlValue = String(projectData.mediaUrl || "").trim();
      const mediaAltValue = String(projectData.mediaAltText || "").trim();
      projectData.media = null;
      if (mediaTypeValue) {
        if (mediaTypeValue !== "video" && mediaTypeValue !== "image") {
          validationMessages.push(
            `Fila ${rowNum}, 'mediaType': Valor inválido ('${projectData.mediaType}'). Debe ser 'video' o 'image'.`
          );
        } else {
          if (!mediaUrlValue) {
            validationMessages.push(
              `Fila ${rowNum}: 'mediaUrl' requerido si 'mediaType' es '${mediaTypeValue}'.`
            );
          } else {
            if (
              mediaTypeValue === "image" &&
              !isValidRelativeUrl(mediaUrlValue) &&
              !isValidPicsumUrl(mediaUrlValue)
            ) {
              validationMessages.push(
                `Fila ${rowNum}, 'mediaUrl': URL relativa/Picsum inválida para imagen ('${mediaUrlValue}').`
              );
            } else if (
              mediaTypeValue === "video" &&
              !mediaUrlValue.includes("youtube.com/embed/")
            ) {
              validationMessages.push(
                `Fila ${rowNum}, 'mediaUrl': URL video YouTube Embed inválida ('${mediaUrlValue}').`
              );
            }
            if (mediaTypeValue === "image" && !mediaAltValue) {
              validationMessages.push(
                `Fila ${rowNum}: 'mediaAltText' requerido para media tipo imagen.`
              );
            }
            if (
              (mediaTypeValue === "image" &&
                (isValidRelativeUrl(mediaUrlValue) ||
                  isValidPicsumUrl(mediaUrlValue)) &&
                mediaAltValue) ||
              (mediaTypeValue === "video" &&
                mediaUrlValue.includes("youtube.com/embed/"))
            ) {
              projectData.media = {
                type: mediaTypeValue,
                url: mediaUrlValue,
                altText: mediaTypeValue === "image" ? mediaAltValue : undefined,
              };
            }
          }
        }
      }
      delete projectData.mediaType;
      delete projectData.mediaUrl;
      delete projectData.mediaAltText;

      // Parseo Rúbrica y Calificación Final
      projectData.projectRubricScores = {};
      let rubricSum = 0;
      let validRubricScoresCount = 0;
      const rubricKeys = [
        "rubricInnovation",
        "rubricCollaboration",
        "rubricImpact",
        "rubricTechUse",
        "rubricPresentation",
      ];
      rubricKeys.forEach((key) => {
        const scoreRaw = row[headerMap[key]];
        const score = Number(scoreRaw);
        const jsonKey =
          key.substring(6).charAt(0).toLowerCase() + key.substring(7);
        if (scoreRaw === "" || scoreRaw === null || scoreRaw === undefined) {
          validationMessages.push(
            `Fila ${rowNum}, Col '${key}': Falta puntuación (1-3).`
          );
          projectData.projectRubricScores[jsonKey] = null;
        } else if (isNaN(score) || ![1, 2, 3].includes(score)) {
          validationMessages.push(
            `Fila ${rowNum}, Col '${key}': Valor inválido ('${scoreRaw}'). Debe ser 1, 2 o 3.`
          );
          projectData.projectRubricScores[jsonKey] = null;
        } else {
          projectData.projectRubricScores[jsonKey] = score;
          rubricSum += score;
          validRubricScoresCount++;
        }
      });
      if (validRubricScoresCount !== 5) {
        validationMessages.push(
          `Fila ${rowNum}: Faltan o son inválidas ${
            5 - validRubricScoresCount
          } puntuaciones de la rúbrica. Calificación final no se calculará.`
        );
        projectData.finalProjectGrade = null;
      } else {
        projectData.finalProjectGrade = calculateFinalGrade(rubricSum);
      }

      // Parseo Campos Complejos
      if (!hasFatalError) {
        projectData.teamMembers = parseComplexField(
          row[headerMap.teamMembers],
          rowNum,
          "teamMembers",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          12,
          parseTeamMember,
          scriptTimezone,
          validationMessages
        );
        projectData.technologies = parseComplexField(
          row[headerMap.technologies],
          rowNum,
          "technologies",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          3,
          parseTechnology,
          scriptTimezone,
          validationMessages
        );
        projectData.additionalResources = parseComplexField(
          row[headerMap.additionalResources],
          rowNum,
          "additionalResources",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          3,
          parseResource,
          scriptTimezone,
          validationMessages
        );
        projectData.imageGallery = parseComplexField(
          row[headerMap.imageGallery],
          rowNum,
          "imageGallery",
          ITEM_SEPARATOR,
          PROP_SEPARATOR,
          3,
          parseGalleryImage,
          scriptTimezone,
          validationMessages
        );

        if (!projectData.teamMembers || projectData.teamMembers.length === 0) {
          validationMessages.push(
            `Fila ${rowNum}: 'teamMembers' es requerido y debe tener al menos un miembro válido.`
          );
          hasFatalError = true;
        }
        if (
          !projectData.technologies ||
          projectData.technologies.length === 0
        ) {
          validationMessages.push(
            `Fila ${rowNum}: 'technologies' es requerido y debe tener al menos una tecnología válida.`
          ); /* No fatal */
        }
      }

      // Añadir proyecto si OK
      if (!hasFatalError) {
        if (!projectData.media) delete projectData.media;
        if (!projectData.additionalResources)
          delete projectData.additionalResources;
        if (!projectData.imageGallery) delete projectData.imageGallery;
        if (!projectData.innovationProcess)
          delete projectData.innovationProcess;
        if (!projectData.projectCategory) delete projectData.projectCategory;
        if (!projectData.schooling) delete projectData.schooling;
        if (projectData.projectDate === null) delete projectData.projectDate;
        if (projectData.sdgIds.length === 0) delete projectData.sdgIds;
        if (projectData.finalProjectGrade === null)
          delete projectData.finalProjectGrade;
        projects.push(projectData);
      }
    }); // Fin forEach

    const result = {
      validationMessages: validationMessages,
      projects: projects,
    };
    return JSON.stringify(result, null, 2);
  } catch (e) {
    Logger.log(`Error en generateJson: ${e.message}\nStack: ${e.stack}`);
    return JSON.stringify({
      error: `Error inesperado: ${e.message}. Revisa Logs.`,
      validationMessages: validationMessages,
    });
  }
}

// --- Funciones Auxiliares ---

function validateHeaders(actualHeaders, validationMessages) {
  let errors = [];
  const actualHeaderSet = new Set(actualHeaders);
  EXPECTED_HEADERS.forEach((expected) => {
    if (!actualHeaderSet.has(expected)) {
      const msg = `Falta columna requerida: '${expected}'`;
      errors.push(msg);
      validationMessages.push(`Error Encabezado: ${msg}`);
    }
  });
  return errors;
}
function createHeaderMap(headers) {
  const map = {};
  headers.forEach((h, i) => (map[h.trim()] = i));
  return map;
}
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
    try {
      return Utilities.formatDate(date, timezone, "yyyy-MM-dd");
    } catch (e) {
      Logger.log(
        `Error formateando fecha ${dateValue} con timezone ${timezone}: ${e}`
      );
      return null;
    }
  }
  Logger.log(
    `No se pudo parsear la fecha: ${dateValue} con timezone ${timezone}`
  );
  return null;
}

function parseComplexField(
  cellValue,
  rowNum,
  fieldName,
  itemSep,
  propSep,
  expectedProps,
  parserFn,
  timezone,
  validationMessages
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
        }: Propiedades esperadas ${expectedProps} vs ${
          props.length
        }. Item: "${item}"`
      );
      validationMessages.push(
        `Fila ${rowNum}, Campo '${fieldName}', Item ${
          index + 1
        }: Número incorrecto de propiedades (esperadas ${expectedProps}, encontradas ${
          props.length
        }).`
      );
      hasErrors = true;
    } else {
      const parsed = parserFn(
        props,
        rowNum,
        fieldName,
        timezone,
        validationMessages
      );
      if (parsed) {
        result.push(parsed);
      } else {
        hasErrors = true;
      }
    }
  });
  if (hasErrors && result.length === 0) {
    Logger.log(
      `Fila ${rowNum}, Campo '${fieldName}': Formato incorrecto, ningún item válido procesado.`
    );
  }
  return result.length > 0 ? result : null;
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
      `Fila ${rowNum}, ${fieldName} (Miembro: ${name || "?"}): ${msg}`
    );
    isValid = false;
  };
  if (!name) addValidationError("Falta nombre.");
  if (!role) addValidationError("Falta rol.");
  if (!courseName) addValidationError("Falta nombre del curso.");
  if (!college) addValidationError("Falta nombre del colegio.");
  if (!badgeName) {
    addValidationError("Falta insignia.");
  } else if (!VALID_BADGES.includes(badgeName)) {
    addValidationError(
      `Insignia inválida ('${badgeName}'). Permitidas: ${VALID_BADGES.join(
        ", "
      )}.`
    );
  }
  if (!level) {
    addValidationError("Falta nivel.");
  } else if (!VALID_LEVELS.includes(level)) {
    addValidationError(
      `Nivel inválido ('${level}'). Permitidos: ${VALID_LEVELS.join(", ")}.`
    );
  }
  let formattedIssueDate = null;
  if (!issueDateRaw) {
    addValidationError("Falta fecha de emisión del certificado.");
  } else {
    formattedIssueDate = formatDateFromSheet(issueDateRaw, timezone);
    if (!formattedIssueDate) {
      addValidationError(
        `Fecha de emisión inválida ('${issueDateRaw}'). Use DD-MM-YYYY o YYYY-MM-DD.`
      );
    }
  }
  // Usar assets/img/certificado.png como placeholder si las URLs están vacías o inválidas en los datos de ejemplo
  const finalPreviewUrl =
    previewUrl && isValidRelativeUrl(previewUrl)
      ? previewUrl
      : "assets/img/certificado.png";
  const finalPrintUrl =
    printUrl && isValidRelativeUrlOrPdf(printUrl)
      ? printUrl
      : "assets/img/certificado.png";
  if (finalPreviewUrl !== previewUrl && previewUrl) {
    validationMessages.push(
      `Fila ${rowNum}, ${fieldName} (${name}): URL preview inválida ('${previewUrl}'), usando placeholder.`
    );
  }
  if (finalPrintUrl !== printUrl && printUrl) {
    validationMessages.push(
      `Fila ${rowNum}, ${fieldName} (${name}): URL print inválida ('${printUrl}'), usando placeholder.`
    );
  }

  if (sbtLink && !isValidUrl(sbtLink)) {
    validationMessages.push(
      `Fila ${rowNum}, ${fieldName} (${name}): URL SBT inválida ('${sbtLink}'), se omitirá.`
    );
  }
  if (!isValid) return null;
  return {
    name: name,
    role: role,
    sbtLink: sbtLink && isValidUrl(sbtLink) ? sbtLink : undefined,
    certificateCourseName: courseName,
    certificateBadgeName: badgeName,
    certificateLevel: level,
    certificateSkills: skills || "",
    certificateCriteria: criteria || "",
    certificateCollege: college,
    certificateIssueDate: formattedIssueDate,
    certificatePreviewUrl: finalPreviewUrl,
    certificatePrintUrl: finalPrintUrl,
  };
}
function parseTechnology(
  props,
  rowNum,
  fieldName,
  timezone,
  validationMessages
) {
  // Timezone no se usa pero se recibe
  const [name, icon, category] = props;
  const validCats = ["Hardware", "Software", "Tool"];
  if (!name) {
    Logger.log(`Fila ${rowNum}, ${fieldName}: Falta nombre tec.`);
    return null;
  }
  if (!icon) {
    Logger.log(`Fila ${rowNum}, ${fieldName} (${name}): Falta icono.`);
    return null;
  }
  if (
    !category ||
    !validCats.some(
      (validCat) => validCat.toLowerCase() === category.toLowerCase()
    )
  ) {
    validationMessages.push(
      `Fila ${rowNum}, Campo '${fieldName}' (${name}): Categoría inválida ('${category}'). Debe ser Hardware, Software o Tool.`
    );
    return null;
  }
  const matchedCategory = validCats.find(
    (validCat) => validCat.toLowerCase() === category.toLowerCase()
  );
  return { name: name, icon: getFaIconClass(icon), category: matchedCategory };
}
function parseResource(props, rowNum, fieldName, timezone, validationMessages) {
  // Timezone no se usa pero se recibe
  const [title, url, type] = props;
  if (!title) {
    Logger.log(`Fila ${rowNum}, ${fieldName}: Falta título rec.`);
    return null;
  }
  if (!url || !(isValidUrl(url) || isValidRelativeUrl(url))) {
    validationMessages.push(
      `Fila ${rowNum}, Campo '${fieldName}' (${title}): URL inválida ('${url}').`
    );
    return null;
  }
  if (!type) {
    validationMessages.push(
      `Fila ${rowNum}, Campo '${fieldName}' (${title}): Falta el tipo de recurso.`
    );
    return null;
  }
  return { title: title, url: url, type: type.toLowerCase() };
}
function parseGalleryImage(
  props,
  rowNum,
  fieldName,
  timezone,
  validationMessages
) {
  // Timezone no se usa pero se recibe
  const [url, altText, caption] = props;
  if (!url || !(isValidRelativeUrl(url) || isValidPicsumUrl(url))) {
    validationMessages.push(
      `Fila ${rowNum}, Campo '${fieldName}': URL de imagen inválida ('${url}').`
    );
    return null;
  }
  if (!altText) {
    validationMessages.push(
      `Fila ${rowNum}, Campo '${fieldName}' (URL: ${url}): Falta texto alternativo.`
    );
    return null;
  }
  const img = { url: url, altText: altText };
  if (caption) {
    img.caption = caption;
  }
  return img;
}

function calculateFinalGrade(rubricSum) {
  if (rubricSum >= 15) return 10;
  if (rubricSum >= 13) return 9;
  if (rubricSum >= 12) return 8;
  if (rubricSum >= 11) return 7;
  if (rubricSum >= 10) return 6;
  if (rubricSum >= 9) return 5;
  if (rubricSum >= 8) return 4;
  if (rubricSum >= 7) return 3;
  if (rubricSum >= 6) return 2;
  if (rubricSum >= 5) return 1;
  return 0;
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
    (str.startsWith("assets/img/") || str.startsWith("assets/docs/")) &&
    !str.includes("..")
  );
}
function isValidRelativeUrlOrPdf(str) {
  return isValidRelativeUrl(str) && /\.(jpg|jpeg|png|pdf)$/i.test(str);
}
function isValidPicsumUrl(str) {
  return (
    typeof str === "string" && str.startsWith("https://picsum.photos/seed/")
  );
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
  if (brands.includes(lower)) {
    return `fa-brands fa-${lower}`;
  } else {
    return `fa-solid fa-${lower}`;
  }
}
