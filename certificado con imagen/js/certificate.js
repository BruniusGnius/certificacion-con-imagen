// js/certificate.js - v4.2 (Bordes Dinámicos y Estilo Píldora Final)

/**
 * Convierte un string a formato slug (lowercase, guiones).
 */
function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Mapeo de Insignias a colores de borde (HEX sin #)
const badgeBorderColors = {
  "Code Explorer": "808080", // Gris
  "Algorithm Seeker": "c98442", // Naranja quemado/Bronce
  "Micro Programmer": "646f78", // Gris azulado
  "Robot Navigator": "da9824", // Oro/Amarillo oscuro
  "Tech Voyager": "6dbc35", // Verde
  "Network Pioneer": "6dbc35", // Verde
  "Design Architect": "5c9bfc", // Azul claro
  "Reality Master": "5c9bfc", // Azul claro
  "Expert Roboteer": "5c9bfc", // Azul claro
  "Prompt Sage": "c70000", // Rojo oscuro
  "App Maverick": "500085", // Púrpura oscuro
  "AI Paragon": "c70000", // Rojo oscuro
};

/**
 * Función principal para cargar y mostrar los detalles del certificado.
 */
async function loadCertificateDetails() {
  const loadingMessage = document.getElementById("loading-message");
  const errorMessageElement = document.getElementById("error-message");
  const certificateDetailsContainer = document.getElementById(
    "certificate-details"
  );

  certificateDetailsContainer.classList.add("hidden");
  errorMessageElement.style.display = "none";
  loadingMessage.style.display = "block";

  try {
    const params = new URLSearchParams(window.location.search);
    const projectSlug = params.get("slug");
    const memberIndex = parseInt(params.get("memberIndex"), 10);

    if (!projectSlug || isNaN(memberIndex)) {
      throw new Error(
        "Faltan parámetros (slug o memberIndex) en la URL o son inválidos."
      );
    }

    const response = await fetch("data/projects.json");
    if (!response.ok) {
      throw new Error(
        `Error al cargar projects.json: ${response.statusText} (Status: ${response.status})`
      );
    }
    const projects = await response.json();
    const project = projects.find((p) => p.slug === projectSlug);

    if (!project) {
      throw new Error(`Proyecto con slug "${projectSlug}" no encontrado.`);
    }

    if (
      !project.teamMembers ||
      memberIndex < 0 ||
      memberIndex >= project.teamMembers.length
    ) {
      throw new Error(
        `Índice de miembro "${memberIndex}" inválido para el proyecto "${projectSlug}".`
      );
    }
    const member = project.teamMembers[memberIndex];

    populateCertificateData(project, member);

    certificateDetailsContainer.classList.remove("hidden");
    loadingMessage.style.display = "none";
  } catch (error) {
    console.error("Error al cargar detalles del certificado:", error);
    errorMessageElement.textContent = `Error: ${error.message}`;
    errorMessageElement.style.display = "block";
    loadingMessage.style.display = "none";
    certificateDetailsContainer.classList.add("hidden");
  }

  const currentYearElement = document.getElementById("current-year-footer");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Puebla los elementos HTML con los datos del certificado.
 * @param {object} project - El objeto del proyecto.
 * @param {object} member - El objeto del miembro del equipo.
 */
function populateCertificateData(project, member) {
  const backToProjectLink = document.getElementById("back-to-project-link");
  if (backToProjectLink) {
    backToProjectLink.href = `project.html?slug=${project.slug}`;
  }

  const previewImage = document.getElementById("certificate-preview-image");
  const downloadLink = document.getElementById("certificate-download-link");
  if (previewImage && member.certificatePreviewUrl) {
    previewImage.src = member.certificatePreviewUrl;
    previewImage.alt = `Certificado de ${member.name} para el proyecto ${project.projectTitle}`;
  } else if (previewImage) {
    previewImage.alt =
      "Imagen de previsualización del certificado no disponible.";
  }
  if (downloadLink && member.certificatePrintUrl) {
    downloadLink.href = member.certificatePrintUrl;
  } else if (downloadLink) {
    downloadLink.classList.add("hidden");
  }

  setTextContent("student-name", member.name);
  setTextContent("course-name", member.certificateCourseName);

  // Insignia con Imagen y Borde Dinámico
  const badgePillContainer = document.getElementById("badge-container");
  const badgeNameElement = document.getElementById("badge-name");
  const badgeImageElement = document.getElementById("badge-image");

  if (badgeNameElement)
    badgeNameElement.textContent = member.certificateBadgeName || "N/A";
  if (badgePillContainer && member.certificateBadgeName) {
    const borderColorHex = badgeBorderColors[member.certificateBadgeName];
    if (borderColorHex) {
      badgePillContainer.style.borderColor = `#${borderColorHex}`;
    } else {
      badgePillContainer.style.borderColor = "var(--gnius-gray-light)"; // Fallback
    }
    // El background-color (bg-gnius-yellow) se aplica desde el HTML
  }
  if (badgeImageElement && member.certificateBadgeName) {
    const badgeSlug = slugify(member.certificateBadgeName);
    badgeImageElement.src = `assets/img/badges/${badgeSlug}.png`;
    badgeImageElement.alt = member.certificateBadgeName;
    badgeImageElement.classList.remove("hidden");
    badgeImageElement.onerror = () => {
      badgeImageElement.classList.add("hidden");
      console.warn(
        `Imagen no encontrada para insignia: ${badgeImageElement.src}`
      );
    };
  } else if (badgeImageElement) {
    badgeImageElement.classList.add("hidden");
  }

  // Nivel con Imagen y Borde Violáceo Sólido
  const levelPillContainer = document.getElementById("level-container");
  const levelNameElement = document.getElementById("level");
  const levelImageElement = document.getElementById("level-image");

  if (levelNameElement)
    levelNameElement.textContent = member.certificateLevel || "N/A";
  if (levelPillContainer && member.certificateLevel) {
    levelPillContainer.style.borderColor = "var(--gnius-violet)"; // Color violáceo definido en CSS vars
    levelPillContainer.style.backgroundColor = "transparent"; // Fondo transparente
    // El texto ya es claro por defecto o por la clase text-gnius-light-text en el HTML
  }
  if (levelImageElement && member.certificateLevel) {
    const levelSlug = slugify(member.certificateLevel);
    levelImageElement.src = `assets/img/levels/${levelSlug}.png`;
    levelImageElement.alt = member.certificateLevel;
    levelImageElement.classList.remove("hidden");
    levelImageElement.onerror = () => {
      levelImageElement.classList.add("hidden");
      console.warn(`Imagen no encontrada para nivel: ${levelImageElement.src}`);
    };
  } else if (levelImageElement) {
    levelImageElement.classList.add("hidden");
  }

  populateChips(
    "skills-list",
    member.certificateSkills,
    "chip-cyan-outline text-xs"
  );
  populateChips(
    "criteria-list",
    member.certificateCriteria,
    "chip-yellow-outline text-xs"
  );

  const sbtLinkContainer = document.getElementById("sbt-link-container");
  const sbtLink = document.getElementById("sbt-link");
  if (sbtLinkContainer && sbtLink && member.sbtLink) {
    sbtLink.href = member.sbtLink;
    sbtLinkContainer.style.display = "block";
  } else if (sbtLinkContainer) {
    sbtLinkContainer.style.display = "none";
  }

  setTextContent(
    "college-name",
    member.certificateCollege || "Institución no especificada"
  );
  setTextContent(
    "issue-date",
    member.certificateIssueDate || "Fecha no especificada"
  );

  const viewProjectButton = document.getElementById("view-project-button");
  if (viewProjectButton) {
    viewProjectButton.href = `project.html?slug=${project.slug}`;
  }
}

function setTextContent(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text || "";
  } else {
    console.warn(`Elemento con ID "${id}" no encontrado para setTextContent.`);
  }
}
function populateChips(containerId, dataString, chipClasses) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Contenedor de chips con ID "${containerId}" no encontrado.`);
    return;
  }
  container.innerHTML = "";
  if (dataString && dataString.trim() !== "") {
    const items = dataString
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    items.forEach((itemText) => {
      const chip = document.createElement("span");
      chip.className = `chip ${chipClasses}`;
      chip.textContent = itemText;
      container.appendChild(chip);
    });
  }
}

document.addEventListener("DOMContentLoaded", loadCertificateDetails);
