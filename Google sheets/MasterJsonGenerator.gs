/**
 * Master JSON Generator & Drive Organizer for Gnius Club (FINAL VERSION)
 * - v1.0: Genera JSON usando 'scriptStatus'.
 * - v2.0: Organiza archivos de Drive usando una columna separada 'driveStatus'.
 */

// =================================================================
// --- 1. CONFIGURACIÓN Y MAPEO ---
// =================================================================

const JSON_STATUS_COLUMN_HEADER = "scriptStatus";
const DRIVE_STATUS_COLUMN_HEADER = "driveStatus";
const ASSETS_PARENT_FOLDER_NAME = "Project Assets (Formulario)";

// ... [ El resto de COLUMN_MAPPINGS y TECHNOLOGY_DICTIONARY no cambia ] ...
const COLUMN_MAPPINGS = {
  projectName: "¿Cuál es el nombre oficial de esta creación?",
  projectLevel: "¿A qué nivel educativo pertenecen los creadores?",
  projectDate: "¿Cuándo se completó o se espera completar el proyecto?",
  ods: "Este proyecto es un agente de cambio.",
  technologies: "Tecnologías empleadas",
  introTitle: "Un subtítulo vibrante para el portafolio.",
  introContent: "En 1-2 párrafos, cuéntanos de qué va el proyecto.",
  problem: "¿Qué situación o necesidad vieron que los motivó a actuar?",
  solution: "¿Cuál es la idea o creación genial que responde a ese desafío?",
  process: "Describan su aventura para llegar a la solución.",
  member1Name: "Nombre completo del Miembro 1",
  member1Role: "Rol del Miembro 1",
  member1Email: "Correo electrónico del Miembro 1",
  member2Name: "Nombre completo del Miembro 2",
  member2Role: "Rol del Miembro 2",
  member2Email: "Correo electrónico del Miembro 2",
  member3Name: "Nombre completo del Miembro 3",
  member3Role: "Rol del Miembro 3",
  member3Email: "Correo electrónico del Miembro 3",
  member4Name: "Nombre completo del Miembro 4",
  member4Role: "Rol del Miembro 4",
  member4Email: "Correo electrónico del Miembro 4",
  member5Name: "Nombre completo del Miembro 5",
  member5Role: "Rol del Miembro 5",
  member5Email: "Correo electrónico del Miembro 5",
  member6Name: "Nombre completo del Miembro 6",
  member6Role: "Rol del Miembro 6",
  member6Email: "Correo electrónico del Miembro 6",
  coverImageUrl: "Sube la imagen cover del proyecto.",
  coverImageAlt: "Describe brevemente la imagen de portada",
  hasExtraMedia:
    "¿Quieres añadir un video de YouTube o una segunda imagen destacada?",
  mediaVideoUrl: "cleanVideoUrl",
  mediaImageUrl: "(3.2) Sube tu archivo media.jpg",
  mediaImageAlt: "Describe brevemente esta imagen adicional",
  galleryImageUrls:
    "¿Tienes más imágenes para mostrar diferentes ángulos o etapas del proyecto?",
  galleryImageDescriptions:
    "Para cada imagen que subiste a la galería, proporciona una breve descripción",
  isNominated: "¿Éste proyecto es nominado por el Colegio",
  rubric_innovation_problem: "Innovación 💡: Definición del problema",
  rubric_innovation_level: "Innovación 💡: Nivel de innovación",
  rubric_innovation_methodology:
    "Innovación 💡: Uso de la Metodología de Innovación",
  rubric_innovation_prototype: "Innovación 💡: Funcionalidad del prototipo",
  rubric_collaboration_methodology:
    "Colaboración 🫱🏻‍🫲🏿: Uso de Metodologías Colaborativas",
  rubric_collaboration_participation:
    "Colaboración 🫱🏻‍🫲🏿: Grado de participación y compromiso",
  rubric_impact_scope: "Impacto 🌱: Alcance",
  rubric_impact_ods: "Impacto 🌱: Alineación con ODS",
  rubric_impact_benefit: "Impacto 🌱: Potencial de beneficio",
  rubric_tech_application:
    "Uso de Tecnología 🦾: Aplicación del conocimiento tecnológico",
  rubric_tech_integration:
    "Uso de Tecnología 🦾: Integración de elementos tecnológicos innovadores",
  rubric_presentation_clarity: "Presentación 🗣️: Claridad y estructura",
  rubric_presentation_argument: "Presentación 🗣️: Argumentación",
  rubric_presentation_communication: "Presentación 🗣️: Comunicación",
};
const TECHNOLOGY_DICTIONARY = {
  "Programación Visual (Scratch, Blockly)": {
    name: "Scratch/Blockly",
    icon: "fa-solid fa-puzzle-piece",
    category: "Software",
  },
  "Programación con Microcontroladores (como micro:bit, Arduino)": {
    name: "Microcontroladores",
    icon: "fa-solid fa-microchip",
    category: "Hardware",
  },
  "Automatización de Tareas (por sensores o microcontroladores)": {
    name: "Automatización",
    icon: "fa-solid fa-robot",
    category: "Tool",
  },
  "Interfaces de Usuario Interactivas (pantallas, botones, controladores)": {
    name: "UI Interactivas",
    icon: "fa-solid fa-display",
    category: "Tool",
  },
  "Sensores de Entrada (movimiento, temperatura, luz, sonido, etc.)": {
    name: "Sensores",
    icon: "fa-solid fa-bullseye",
    category: "Hardware",
  },
  "Actuadores (motores, luces LED, zumbadores, etc.)": {
    name: "Actuadores",
    icon: "fa-solid fa-fan",
    category: "Hardware",
  },
  "Circuitos Electrónicos Básicos": {
    name: "Circuitos Electrónicos",
    icon: "fa-solid fa-sitemap",
    category: "Hardware",
  },
  "Robots Programables (chasis, brazos robóticos, etc.)": {
    name: "Robots Programables",
    icon: "fa-solid fa-robot",
    category: "Hardware",
  },
  "Sistemas Robóticos Autónomos (navegación, detección de obstáculos)": {
    name: "Robótica Autónoma",
    icon: "fa-solid fa-robot",
    category: "Hardware",
  },
  "Dispositivos IoT (Internet de las Cosas)": {
    name: "IoT",
    icon: "fa-solid fa-wifi",
    category: "Hardware",
  },
  "Comunicación entre Dispositivos (Bluetooth, Wi-Fi, etc.)": {
    name: "Conectividad",
    icon: "fa-solid fa-network-wired",
    category: "Tool",
  },
  "Modelado 3D": {
    name: "Modelado 3D",
    icon: "fa-solid fa-cube",
    category: "Software",
  },
  "Simulación de Sistemas (entornos digitales para prueba o predicción)": {
    name: "Simulación de Sistemas",
    icon: "fa-solid fa-project-diagram",
    category: "Software",
  },
  "Realidad Aumentada (AR)": {
    name: "Realidad Aumentada",
    icon: "fa-solid fa-camera",
    category: "Software",
  },
  "Realidad Virtual (VR)": {
    name: "Realidad Virtual",
    icon: "fa-solid fa-vr-cardboard",
    category: "Software",
  },
  "Diseño para Impresión 3D": {
    name: "Diseño 3D",
    icon: "fa-solid fa-pen-ruler",
    category: "Tool",
  },
  "Impresión 3D (prototipado físico)": {
    name: "Impresión 3D",
    icon: "fa-solid fa-print",
    category: "Tool",
  },
  "Modelos de IA (clasificación, reconocimiento, lenguaje natural)": {
    name: "Modelos de IA",
    icon: "fa-solid fa-brain",
    category: "Software",
  },
  "Machine Learning (entrenamiento de modelos simples)": {
    name: "Machine Learning",
    icon: "fa-solid fa-brain",
    category: "Software",
  },
  "Seguridad Digital y Privacidad (uso seguro de contraseñas, protección de datos)":
    {
      name: "Seguridad Digital",
      icon: "fa-solid fa-shield-halved",
      category: "Tool",
    },
};

// =================================================================
// --- 2. INICIALIZACIÓN Y MENÚ ---
// =================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Gnius Club Tools")
    .addItem("1. Generar JSON de Proyectos", "showSidebar")
    .addSeparator()
    .addItem("2. Organizar Archivos de Drive", "organizeDriveAssets")
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("Sidebar")
    .setTitle("Generador JSON Gnius Club")
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

// =================================================================
// --- 3. LÓGICA DE GENERACIÓN DE JSON ---
// =================================================================

function processFormResponses() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const allData = dataRange.getValues();
    const allDisplayData = dataRange.getDisplayValues();

    const headers = allData.shift();
    allDisplayData.shift();

    const headerMap = mapHeaders(headers);

    if (headerMap.jsonStatusCol === -1) {
      throw new Error(
        `La hoja de cálculo no tiene la columna "${JSON_STATUS_COLUMN_HEADER}".`
      );
    }

    let newProjects = [];
    let projectCounter = 0;

    allData.forEach((row, index) => {
      const rowNum = index + 2;
      const displayRow = allDisplayData[index];
      const rowStatus = row[headerMap.jsonStatusCol];

      if (rowStatus && rowStatus.toString().trim().startsWith("Procesado")) {
        return;
      }

      const projectName = getString(row, headerMap.projectName);
      if (
        !projectName ||
        projectName.trim() === "" ||
        projectName.toLowerCase().startsWith("http")
      ) {
        return;
      }

      Logger.log(`Procesando fila ${rowNum} para JSON: "${projectName}"`);
      projectCounter++;

      try {
        const projectObject = transformRowToProjectObject(
          row,
          displayRow,
          headerMap,
          rowNum,
          projectCounter
        );
        newProjects.push(projectObject);
        sheet
          .getRange(rowNum, headerMap.jsonStatusCol + 1)
          .setValue(`Procesado: ${new Date().toLocaleString("es-MX")}`);
      } catch (e) {
        Logger.log(`ERROR en fila ${rowNum}: ${e.message}\n${e.stack}`);
        throw new Error(
          `Error en fila ${rowNum} (${projectName}): ${e.message}`
        );
      }
    });

    const validationMessage =
      projectCounter > 0
        ? `✅ Se procesaron ${projectCounter} nuevas filas.`
        : "✅ No se encontraron nuevas filas para procesar. Todo está al día.";

    return {
      jsonString: JSON.stringify(newProjects, null, 2),
      validationMessages: validationMessage,
    };
  } catch (e) {
    Logger.log(`Error fatal: ${e.stack}`);
    throw new Error(`${e.message}`);
  }
}

function mapHeaders(headers) {
  const map = {};
  const cleanedHeaders = headers.map((h) => (h || "").toString().trim());
  for (const key in COLUMN_MAPPINGS) {
    if (key === "mediaVideoUrl") {
      map[key] = cleanedHeaders.indexOf(COLUMN_MAPPINGS[key]);
      continue;
    }
    const searchText = (COLUMN_MAPPINGS[key] || "")
      .toString()
      .trim()
      .split("(")[0]
      .trim();
    const index = cleanedHeaders.findIndex((header) =>
      header.trim().startsWith(searchText)
    );
    map[key] = index;
  }
  map.jsonStatusCol = cleanedHeaders.indexOf(JSON_STATUS_COLUMN_HEADER);
  map.driveStatusCol = cleanedHeaders.indexOf(DRIVE_STATUS_COLUMN_HEADER);
  if (map.projectName === -1)
    throw new Error("No se encontró la columna del nombre del proyecto.");
  return map;
}

// =================================================================
// --- 4. LÓGICA DE ORGANIZACIÓN DE ARCHIVOS DE DRIVE ---
// =================================================================

function organizeDriveAssets() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    "Confirmación de Organización de Archivos",
    "Este script creará carpetas en Google Drive y COPIARÁ los archivos de imagen de las filas no procesadas. Los originales no se modificarán. ¿Continuar?",
    ui.ButtonSet.YES_NO
  );
  if (response !== ui.Button.YES) {
    ui.alert("Operación cancelada.");
    return;
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const allData = dataRange.getValues();
    const headers = allData.shift();
    const headerMap = mapHeaders(headers);

    if (headerMap.driveStatusCol === -1) {
      throw new Error(
        `La hoja de cálculo no tiene la columna "${DRIVE_STATUS_COLUMN_HEADER}".`
      );
    }

    const rootFolder = DriveApp.getRootFolder();
    const formResponsesFolderName =
      "Formulario proyectos de innovacion (File responses)";
    const formResponsesFolders = rootFolder.getFoldersByName(
      formResponsesFolderName
    );
    if (!formResponsesFolders.hasNext()) {
      throw new Error(
        `No se encontró la carpeta "${formResponsesFolderName}" en "Mi unidad".`
      );
    }
    const baseFolder = formResponsesFolders.next();
    const assetsFolder = getOrCreateFolder(
      baseFolder,
      ASSETS_PARENT_FOLDER_NAME
    );

    let projectsProcessed = 0;
    let filesCopied = 0;

    allData.forEach((row, index) => {
      const rowNum = index + 2;
      const rowStatus = row[headerMap.driveStatusCol];
      if (rowStatus && rowStatus.toString().trim().startsWith("Organizado")) {
        return;
      }

      const projectName = getString(row, headerMap.projectName);
      if (
        !projectName ||
        projectName.trim() === "" ||
        projectName.toLowerCase().startsWith("http")
      ) {
        return;
      }

      Logger.log(`Organizando archivos para fila ${rowNum}: "${projectName}"`);
      const slug = slugify(projectName);
      const projectFolder = getOrCreateFolder(assetsFolder, slug);

      let filesProcessedForRow = 0;
      filesProcessedForRow += processAndCopyFile(
        getString(row, headerMap.coverImageUrl),
        "cover",
        projectFolder
      );

      const hasExtraMedia = getString(row, headerMap.hasExtraMedia) || "";
      if (hasExtraMedia.toLowerCase().includes("imagen")) {
        filesProcessedForRow += processAndCopyFile(
          getString(row, headerMap.mediaImageUrl),
          "media",
          projectFolder
        );
      }

      const galleryUrls = (getString(row, headerMap.galleryImageUrls) || "")
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);
      galleryUrls.forEach((url, i) => {
        filesProcessedForRow += processAndCopyFile(
          url,
          `gallery-${String(i + 1).padStart(2, "0")}`,
          projectFolder
        );
      });

      if (filesProcessedForRow > 0) {
        filesCopied += filesProcessedForRow;
      }
      // Marcar como organizado solo si se procesó la fila
      sheet
        .getRange(rowNum, headerMap.driveStatusCol + 1)
        .setValue(`Organizado: ${new Date().toLocaleString("es-MX")}`);
      projectsProcessed++;
    });

    ui.alert(
      "Proceso de Organización Completado",
      `Se procesaron ${projectsProcessed} nuevos proyectos.\nSe copiaron ${filesCopied} archivos en total.\n\nBusca la carpeta "${ASSETS_PARENT_FOLDER_NAME}" dentro de la carpeta "${baseFolder.getName()}" en tu Google Drive.`,
      ui.ButtonSet.OK
    );
  } catch (e) {
    Logger.log(`Error fatal en organizeDriveAssets: ${e.stack}`);
    ui.alert(
      "Error Fatal",
      `Ocurrió un error: ${e.message}. Revisa los registros para más detalles.`,
      ui.ButtonSet.OK
    );
  }
}

function getOrCreateFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function processAndCopyFile(url, baseName, destinationFolder) {
  if (!url) return 0;
  const fileId = extractIdFromUrl(url);
  if (!fileId) {
    Logger.log(`  > URL inválida o sin ID para "${baseName}": ${url}`);
    return 0;
  }
  try {
    const originalFile = DriveApp.getFileById(fileId);
    const extension = getFileExtension(originalFile.getName(), true);
    const newName = `${baseName}${extension}`;

    if (!destinationFolder.getFilesByName(newName).hasNext()) {
      originalFile.makeCopy(newName, destinationFolder);
      Logger.log(
        `  > COPIADO: ${newName} en carpeta "${destinationFolder.getName()}"`
      );
      return 1;
    } else {
      Logger.log(`  > OMITIDO (ya existe): ${newName}`);
      return 0;
    }
  } catch (e) {
    Logger.log(
      `  > ERROR al procesar archivo para "${baseName}" (URL: ${url}): ${e.message}`
    );
    return 0;
  }
}

function extractIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const regex = /drive\.google\.com\/(?:open\?id=|file\/d\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : null;
}

// =================================================================
// --- 5. FUNCIÓN DE TRANSFORMACIÓN ---
// =================================================================

function transformRowToProjectObject(
  row,
  displayRow,
  headerMap,
  rowNum,
  projectCounter
) {
  const projectTitle = getString(row, headerMap.projectName);
  if (!projectTitle) throw new Error(`La fila ${rowNum} no tiene título.`);

  const slug = slugify(projectTitle);
  const projectDateRaw = getDate(displayRow, headerMap.projectDate);
  const projectDate = projectDateRaw
    ? Utilities.formatDate(new Date(projectDateRaw), "GMT", "yyyy-MM-dd")
    : null;
  const { schooling, badgeName, category } = parseProjectLevel(
    getString(row, headerMap.projectLevel)
  );
  const rubricResult = calculateRubric(row, headerMap);

  const coverUrl = getString(row, headerMap.coverImageUrl);

  const hasExtraMedia = getString(row, headerMap.hasExtraMedia) || "";
  const videoUrl = getString(row, headerMap.mediaVideoUrl);
  const imageUrl = getString(row, headerMap.mediaImageUrl);

  let mediaObject = { type: null, url: null, altText: null };
  if (hasExtraMedia.toLowerCase().includes("video")) {
    const formattedUrl = formatYoutubeUrl(videoUrl);
    if (formattedUrl) {
      mediaObject.type = "video";
      mediaObject.url = formattedUrl;
    }
  } else if (hasExtraMedia.toLowerCase().includes("imagen") && imageUrl) {
    mediaObject.type = "image";
    mediaObject.url = `assets/img/${slug}/media${getFileExtension(imageUrl)}`;
    mediaObject.altText = getString(row, headerMap.mediaImageAlt);
  }

  const memberEmails = Array.from({ length: 6 }, (_, i) =>
    getString(row, headerMap[`member${i + 1}Email`])
  );
  const collegeName = extractCollegeFromEmails(memberEmails);
  const { skills, criteria } = generateCertificateSkillsAndCriteria(
    rubricResult.rubricScores
  );

  const project = {
    projectTitle: projectTitle,
    slug: slug,
    projectId: generateProjectId(projectTitle, projectDateRaw, projectCounter),
    projectCategory: category,
    schooling: schooling,
    projectDate: projectDate,
    sdgIds: parseOds(getString(row, headerMap.ods)),
    introTitle: getString(row, headerMap.introTitle),
    introContent: getString(row, headerMap.introContent),
    coverImage: {
      url: coverUrl
        ? `assets/img/${slug}/cover${getFileExtension(coverUrl)}`
        : "",
      altText: getString(row, headerMap.coverImageAlt),
    },
    problemDescription: getString(row, headerMap.problem),
    solutionProposed: getString(row, headerMap.solution),
    innovationProcess: getString(row, headerMap.process),
    media: mediaObject,
    teamMembers: [],
    technologies: parseTechnologies(getString(row, headerMap.technologies)),
    additionalResources: [],
    imageGallery: parseImageGallery(
      getString(row, headerMap.galleryImageUrls),
      getString(displayRow, headerMap.galleryImageDescriptions),
      slug
    ),
    projectRubricScores: rubricResult.rubricScores,
    finalProjectGrade: rubricResult.finalGrade,
    projectStatus: getProjectStatus(
      rubricResult.rawScores.innovation_prototype
    ),
    isNominated:
      getString(row, headerMap.isNominated)?.toLowerCase().trim() === "sí",
  };

  for (let i = 1; i <= 6; i++) {
    const name = getString(row, headerMap[`member${i}Name`]);
    if (name) {
      project.teamMembers.push({
        name: name,
        role: getString(row, headerMap[`member${i}Role`]),
        sbtLink: null,
        certificateCourseName: project.projectTitle,
        certificateBadgeName: badgeName,
        certificateLevel: getCertificateLevel(rubricResult.finalGrade),
        certificateSkills: skills,
        certificateCriteria: criteria,
        certificateCollege: collegeName,
        certificateIssueDate: project.projectDate,
        certificatePreviewUrl: `assets/img/certificado.png`,
        certificatePrintUrl: `assets/img/certificado.png`,
      });
    }
  }

  return project;
}

// =================================================================
// --- 6. FUNCIONES AUXILIARES ---
// =================================================================

function getString(row, index) {
  return index > -1 && row && row[index] && row[index] !== ""
    ? row[index].toString().trim()
    : null;
}
function getDate(row, index) {
  const val = getString(row, index);
  if (!val) return null;
  try {
    return new Date(val);
  } catch (e) {
    return null;
  }
}

function calculateRubric(row, headerMap) {
  const rawScores = {};
  const rubricKeys = Object.keys(COLUMN_MAPPINGS).filter((k) =>
    k.startsWith("rubric_")
  );

  rubricKeys.forEach((key) => {
    const internalKey = key.replace("rubric_", "");
    const cellValue = getString(row, headerMap[key]);
    rawScores[internalKey] = cellValue
      ? parseInt(cellValue.match(/^\d/)?.[0] || "0", 10)
      : 0;
  });

  const rubricScores = {
    innovation:
      rawScores.innovation_problem +
      rawScores.innovation_level +
      rawScores.innovation_methodology +
      rawScores.innovation_prototype,
    techUse: rawScores.tech_application + rawScores.tech_integration,
    impact:
      rawScores.impact_scope + rawScores.impact_ods + rawScores.impact_benefit,
    collaboration:
      rawScores.collaboration_methodology +
      rawScores.collaboration_participation,
    presentation:
      rawScores.presentation_clarity +
      rawScores.presentation_argument +
      rawScores.presentation_communication,
  };

  const weightedScores = {
    innovation: (rubricScores.innovation / 12) * 35,
    techUse: (rubricScores.techUse / 6) * 25,
    impact: (rubricScores.impact / 9) * 20,
    collaboration: (rubricScores.collaboration / 6) * 10,
    presentation: (rubricScores.presentation / 9) * 10,
  };

  const finalScore100 = Object.values(weightedScores).reduce(
    (sum, score) => sum + score,
    0
  );

  let finalGrade;
  if (finalScore100 >= 95) finalGrade = 10;
  else if (finalScore100 >= 90) finalGrade = 9;
  else if (finalScore100 >= 80) finalGrade = 8;
  else if (finalScore100 >= 70) finalGrade = 7;
  else if (finalScore100 >= 60) finalGrade = 6;
  else if (finalScore100 >= 55) finalGrade = 5;
  else if (finalScore100 >= 50) finalGrade = 4;
  else if (finalScore100 >= 40) finalGrade = 3;
  else if (finalScore100 >= 30) finalGrade = 2;
  else finalGrade = 1;

  return { rawScores, rubricScores, finalGrade };
}

function getProjectStatus(prototypeScore) {
  return prototypeScore > 1 ? "Prototipo" : "Idea";
}

function parseProjectLevel(levelString) {
  if (!levelString) return { schooling: null, badgeName: null, category: null };
  const match = levelString.match(/Nivel (\d+):\s*(.*)/);
  if (!match) return { schooling: null, badgeName: null, category: null };
  const levelNum = parseInt(match[1], 10);
  const badgeName = match[2].trim();
  let schooling = "Preparatoria";
  if (levelNum <= 6) schooling = "Primaria";
  else if (levelNum <= 9) schooling = "Secundaria";
  return { schooling, badgeName, category: badgeName };
}

function generateProjectId(title, date, counter) {
  const year = date ? new Date(date).getFullYear().toString().slice(-2) : "XX";
  const initials = (title || "XXX")
    .replace(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .filter(
      (word) => word.length > 2 && !/^(de|la|el|y|un|una|con)$/i.test(word)
    )
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join("");
  const ttt = (initials + "XXX").slice(0, 3);
  const nnn = String(counter).padStart(3, "0");
  return `G${year}-${ttt}-${nnn}`;
}

function parseOds(odsString) {
  if (!odsString) return [];
  return (odsString.match(/\d+/g) || []).map(Number);
}

function parseTechnologies(techString) {
  if (!techString) return [];
  const foundTechs = [];
  const cleanTechString = techString.replace(/[🔹🟡🤖🌐🧩🎮🖨️🧠🔐]/g, "");
  for (const key in TECHNOLOGY_DICTIONARY) {
    const cleanKey = key
      .replace(/[🔹🟡🤖🌐🧩🎮🖨️🧠🔐]/g, "")
      .split("(")[0]
      .trim();
    if (cleanTechString.includes(cleanKey)) {
      foundTechs.push(TECHNOLOGY_DICTIONARY[key]);
    }
  }
  return foundTechs;
}

function formatYoutubeUrl(url) {
  if (!url || typeof url !== "string" || !url.toLowerCase().includes("http")) {
    return null;
  }
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function parseImageGallery(urlsString, descriptionsString, slug) {
  if (!urlsString) return [];
  const urls = urlsString
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  const descriptions = (descriptionsString || "")
    .split(/\r?\n/)
    .map((d) => d.trim())
    .filter(Boolean);
  return urls.map((url, index) => {
    const descLine = descriptions[index] || "";
    const firstCommaIndex = descLine.indexOf(",");
    let altText = descLine;
    let caption = "";
    if (firstCommaIndex !== -1) {
      altText = descLine.substring(0, firstCommaIndex).trim();
      caption = descLine.substring(firstCommaIndex + 1).trim();
    }
    altText = altText.replace(/^\d+\.\s*/, "");
    return {
      url: `assets/img/${slug}/gallery-${String(index + 1).padStart(
        2,
        "0"
      )}${getFileExtension(url)}`,
      altText: altText || `Galería de ${slug} - Imagen ${index + 1}`,
      caption: caption,
    };
  });
}

function extractCollegeFromEmails(emails) {
  const commonDomains = [
    "gmail",
    "hotmail",
    "outlook",
    "yahoo",
    "gnius",
    "icloud",
    "aol",
    "me",
    "mac",
  ];
  const specialMappings = {
    colegiowexford: "Colegio Wexford",
    modernotepeyac: "Moderno Tepeyac",
    greenvalley: "Greenvalley School",
  };

  for (const email of emails) {
    if (email && email.includes("@")) {
      const domain = email.split("@")[1];
      const schoolPart = domain.split(".")[0];

      if (specialMappings[schoolPart.toLowerCase()]) {
        return specialMappings[schoolPart.toLowerCase()];
      }

      if (!commonDomains.includes(schoolPart.toLowerCase())) {
        let formattedName = schoolPart
          .replace(/-/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim();
        formattedName = formattedName
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
        return formattedName;
      }
    }
  }
  return "Institución Educativa";
}

function generateCertificateSkillsAndCriteria(rubricScores) {
  const skills = new Set();
  const criteria = new Set();
  if (rubricScores.innovation / 12 >= 0.8) {
    skills.add("Pensamiento Innovador");
    criteria.add("Solución Creativa");
  }
  if (rubricScores.techUse / 6 >= 0.8) {
    skills.add("Uso Estratégico de Tecnología");
    criteria.add("Aplicación Tecnológica");
  }
  if (rubricScores.impact / 9 >= 0.8) {
    skills.add("Visión de Impacto");
    criteria.add("Alineación con ODS");
  }
  if (rubricScores.collaboration / 6 >= 0.8) {
    skills.add("Colaboración Efectiva");
    criteria.add("Trabajo en Equipo");
  }
  if (rubricScores.presentation / 9 >= 0.8) {
    skills.add("Comunicación de Alto Impacto");
    criteria.add("Argumentación Sólida");
  }
  if (skills.size === 0) {
    skills.add("Participación en Proyecto");
    criteria.add("Finalización de Etapas");
  }
  return {
    skills: Array.from(skills).join(","),
    criteria: Array.from(criteria).join(","),
  };
}

function getCertificateLevel(finalGrade) {
  if (finalGrade >= 9) return "Hacker";
  if (finalGrade >= 7) return "Master";
  return "Rookie";
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
    .replace(/\(SoulBondTokens\)/gi, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function getFileExtension(url, useFileName = false) {
  if (!url || typeof url !== "string") return ".jpg";

  if (useFileName) {
    const parts = url.split(".");
    if (parts.length > 1) return `.${parts.pop().toLowerCase()}`;
  }

  let fileId;
  const regex1 = /drive\.google\.com\/(?:open\?id=|file\/d\/)([a-zA-Z0-9_-]+)/;
  let match = url.match(regex1);
  if (match && match[1]) fileId = match[1];

  if (fileId) {
    try {
      const fileName = DriveApp.getFileById(fileId).getName();
      const parts = fileName.split(".");
      if (parts.length > 1) return `.${parts.pop().toLowerCase()}`;
    } catch (e) {
      Logger.log(
        `No se pudo acceder a Drive para la URL: ${url}. Usando fallback. Error: ${e.message}`
      );
    }
  }

  const parts = url.split("?")[0].split("/").pop().split(".");
  if (parts.length > 1) {
    const ext = parts.pop().toLowerCase();
    if (ext.length <= 4 && /^[a-z0-9]+$/.test(ext)) {
      return `.${ext}`;
    }
  }
  return ".jpg";
}
