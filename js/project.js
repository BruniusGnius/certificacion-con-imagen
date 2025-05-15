// js/project.js - v4.14 (Corregir Hero ODS Badges, Mantener Panel ODS Num+Título)

let gaugeChartInstance = null;

async function loadProjectDetails() {
  const loadingMessage = document.getElementById("loading-message");
  const errorMessage = document.getElementById("error-message");
  const projectDetailsContainer = document.getElementById("project-details");

  projectDetailsContainer.classList.add("hidden");
  errorMessage.style.display = "none";
  loadingMessage.style.display = "block";

  try {
    const params = new URLSearchParams(window.location.search);
    const projectSlug = params.get("slug");
    if (!projectSlug)
      throw new Error("No se especificó un slug de proyecto en la URL.");

    const response = await fetch("data/projects.json");
    if (!response.ok)
      throw new Error(
        `Error al cargar projects.json: ${response.statusText} (Status: ${response.status})`
      );
    const projects = await response.json();

    const project = projects.find((p) => p.slug === projectSlug);
    if (!project) {
      console.warn(
        `Proyecto con slug "${projectSlug}" no encontrado. Slugs disponibles:`,
        projects.map((p) => p.slug)
      );
      throw new Error(`Proyecto con slug "${projectSlug}" no encontrado.`);
    }

    populateProjectData(project);

    projectDetailsContainer.classList.remove("hidden");
    loadingMessage.style.display = "none";
  } catch (error) {
    console.error("Error al cargar detalles del proyecto:", error);
    errorMessage.textContent = `Error: ${error.message}`;
    errorMessage.style.display = "block";
    loadingMessage.style.display = "none";
    projectDetailsContainer.classList.add("hidden");
  }

  setupImageModal();

  const currentYearElement = document.getElementById("current-year-footer");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
}

function populateProjectData(project) {
  setTextContent("project-title", project.projectTitle);
  setTextContent("intro-title", project.introTitle);
  setHTMLContent("intro-content", project.introContent);
  setHTMLContent("problem-description", project.problemDescription);
  setHTMLContent("solution-proposed", project.solutionProposed);

  const metadataContainer = document.getElementById("project-metadata");
  metadataContainer.innerHTML = "";
  if (project.projectCategory) {
    metadataContainer.innerHTML += createChip(
      project.projectCategory,
      "chip-cyan-muted-border",
      ["chip-metadata", "font-condensed", "font-medium", "text-[12px]"]
    );
  }
  if (project.schooling) {
    metadataContainer.innerHTML += createChip(
      project.schooling,
      "chip-red-muted-border",
      ["chip-metadata", "font-condensed", "font-medium", "text-[12px]"]
    );
  }

  // --- HERO ODS BADGES (ESTRUCTURA RESTAURADA: NÚMERO + ICONO) ---
  const heroSdgBadgesContainer = document.getElementById("hero-sdg-badges");
  heroSdgBadgesContainer.innerHTML = "";
  if (
    project.sdgIds &&
    project.sdgIds.length > 0 &&
    typeof odsData !== "undefined"
  ) {
    project.sdgIds.slice(0, 4).forEach((id) => {
      // Mostrar hasta 4 badges
      const ods = odsData[id];
      if (ods) {
        const badgeLink = document.createElement("a");
        badgeLink.href = ods.url || "#";
        badgeLink.target = "_blank";
        badgeLink.rel = "noopener noreferrer";
        badgeLink.classList.add("sdg-hero-badge"); // Estilos principales en CSS
        badgeLink.setAttribute("aria-label", `ODS ${id}: ${ods.title}`);
        badgeLink.title = `ODS ${id}: ${ods.title}`;
        badgeLink.style.backgroundColor = ods.color; // Color de fondo del ODS
        // Variable para que CSS pueda usar el color de contraste calculado
        badgeLink.style.setProperty(
          "--sdg-contrast-color",
          getContrastYIQ(ods.color)
        );

        // Estructura interna: Número a la izquierda, Icono a la derecha
        badgeLink.innerHTML = `
                    <div class="sdg-hero-badge-inner">
                        <span class="sdg-hero-badge-number">${id}</span>
                        <img src="${ods.imageUrl}" alt="${ods.title}" class="sdg-hero-badge-icon">
                    </div>
                `;
        heroSdgBadgesContainer.appendChild(badgeLink);
      }
    });
  }

  const heroMediaContainer = document.getElementById("hero-media");
  const secondaryEvidenceSection = document.getElementById(
    "secondary-evidence-section"
  );
  const secondaryEvidenceMediaContainer = document.getElementById(
    "secondary-evidence-media"
  );
  heroMediaContainer.innerHTML = "";
  secondaryEvidenceMediaContainer.innerHTML = "";
  secondaryEvidenceSection.style.display = "none";
  let secondaryMediaData = null;

  if (project.media && project.media.url) {
    if (project.media.type === "video") {
      heroMediaContainer.innerHTML = createVideoEmbed(project.media.url);
    } else if (project.media.type === "image") {
      heroMediaContainer.innerHTML = createImageElement(
        project.media.url,
        project.media.altText || project.projectTitle,
        true
      );
    }
    if (project.coverImage && project.coverImage.url) {
      secondaryMediaData = {
        url: project.coverImage.url,
        alt: project.coverImage.altText || "Imagen de portada",
        type: "image",
      };
    }
  } else if (project.coverImage && project.coverImage.url) {
    heroMediaContainer.innerHTML = createImageElement(
      project.coverImage.url,
      project.coverImage.altText || project.projectTitle,
      false
    );
    if (project.imageGallery && project.imageGallery.length > 0) {
      secondaryMediaData = {
        url: project.imageGallery[0].url,
        alt: project.imageGallery[0].altText || "Evidencia adicional",
        type: "image",
      };
    }
  } else {
    heroMediaContainer.innerHTML = `<span class="text-gnius-gray-light italic text-base font-medium">No hay media principal disponible</span>`;
  }

  if (secondaryMediaData) {
    secondaryEvidenceMediaContainer.innerHTML = createImageElement(
      secondaryMediaData.url,
      secondaryMediaData.alt,
      true
    );
    secondaryEvidenceSection.style.display = "block";
  }

  const evaluationSection = document.getElementById("evaluation-section");
  if (
    project.projectRubricScores &&
    typeof project.finalProjectGrade === "number" &&
    project.finalProjectGrade >= 0
  ) {
    evaluationSection.style.display = "block";
    renderGaugeChart(project.finalProjectGrade);
    renderRubricBars(project.projectRubricScores);
  } else {
    evaluationSection.style.display = "none";
    console.warn(
      "Datos de evaluación incompletos o inválidos para el proyecto:",
      project.slug
    );
  }

  const innovationSection = document.getElementById(
    "innovation-process-section"
  );
  if (project.innovationProcess && project.innovationProcess.trim() !== "") {
    setHTMLContent("innovation-process-content", project.innovationProcess);
    innovationSection.style.display = "block";
  } else {
    innovationSection.style.display = "none";
  }

  // --- SECCIÓN DETALLES ODS (PANEL CON TODOS LOS ODS - SOLO NÚMERO Y TÍTULO) ---
  const sdgDetailsSection = document.getElementById("sdg-details-section");
  const sdgDetailsGrid = document.getElementById("sdg-details-grid");
  sdgDetailsGrid.innerHTML = "";

  if (typeof odsData !== "undefined") {
    for (let id = 1; id <= 17; id++) {
      const ods = odsData[id];
      if (ods) {
        const isActive = project.sdgIds && project.sdgIds.includes(id);
        const tileLink = document.createElement("a");
        tileLink.href = ods.url || "#";
        tileLink.target = "_blank";
        tileLink.rel = "noopener noreferrer";
        tileLink.classList.add("sdg-panel-item");
        if (isActive) {
          tileLink.classList.add("active");
          tileLink.style.backgroundColor = ods.color;
        } else {
          tileLink.classList.add("inactive");
        }
        tileLink.style.setProperty(
          "--sdg-contrast-color",
          getContrastYIQ(ods.color)
        );
        tileLink.style.setProperty("--sdg-base-color", ods.color);

        // Estructura solo número y título para los 17 ODS
        tileLink.innerHTML = `
                    <div class="sdg-panel-item-text-container">
                        <span class="sdg-panel-item-number">${id}</span>
                        <span class="sdg-panel-item-title">${ods.title.toUpperCase()}</span>
                    </div>
                `;
        sdgDetailsGrid.appendChild(tileLink);
      }
    }

    const generalOdsLogoTile = document.createElement("a");
    generalOdsLogoTile.href =
      "https://www.un.org/sustainabledevelopment/es/objetivos-de-desarrollo-sostenible/";
    generalOdsLogoTile.target = "_blank";
    generalOdsLogoTile.rel = "noopener noreferrer";
    generalOdsLogoTile.classList.add("sdg-panel-item", "general-ods-logo-tile");
    generalOdsLogoTile.classList.add(
      "col-span-full",
      "sm:col-span-full",
      "md:col-span-3"
    );
    generalOdsLogoTile.style.backgroundColor = "var(--gnius-dark-2)";
    generalOdsLogoTile.style.borderColor = "var(--gnius-gray-dark)";
    generalOdsLogoTile.innerHTML = `
            <div class="sdg-panel-item-icon-container" style="height: 100%; margin-bottom: 0; width:100%; display:flex; justify-content:center; align-items:center;">
                <img src="assets/img/ods/SDG-ONU-LOGO.png" alt="Objetivos de Desarrollo Sostenible Gnius Club" class="sdg-panel-item-icon" style="max-height: 80%; max-width: 80%;">
            </div>
        `;
    sdgDetailsGrid.appendChild(generalOdsLogoTile);

    sdgDetailsSection.style.display = "block";
  } else {
    sdgDetailsSection.style.display = "none";
    console.warn("odsData no está definido, no se pueden renderizar los ODS.");
  }

  const gallerySection = document.getElementById("gallery-section");
  const galleryGrid = document.getElementById("gallery-grid");
  galleryGrid.innerHTML = "";
  if (project.imageGallery && project.imageGallery.length > 0) {
    project.imageGallery.forEach((img) => {
      const galleryItem = document.createElement("div");
      galleryItem.classList.add(
        "gallery-item",
        "cursor-pointer",
        "rounded-lg",
        "overflow-hidden",
        "bg-gnius-dark-2",
        "relative",
        "group"
      );
      galleryItem.innerHTML = `
                <img src="${img.url}" alt="${img.altText}" data-caption="${
        img.caption || ""
      }" class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>`;
      galleryItem.addEventListener("click", () =>
        openImageModal(img.url, img.altText, img.caption)
      );
      galleryGrid.appendChild(galleryItem);
    });
    gallerySection.style.display = "block";
  } else {
    gallerySection.style.display = "none";
  }

  const teamList = document.getElementById("team-list");
  teamList.innerHTML = "";
  if (project.teamMembers && project.teamMembers.length > 0) {
    project.teamMembers.forEach((member, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "flex",
        "justify-between",
        "items-center",
        "py-2",
        "border-b",
        "border-gnius-gray-dark/50"
      );
      listItem.innerHTML = `
                <div class="flex-grow mr-4">
                    <p class="font-semibold text-base text-gnius-light">${member.name}</p>
                    <p class="text-sm text-gnius-light/70 font-medium">${member.role}</p>
                </div>
                <a href="certificate.html?slug=${project.slug}&memberIndex=${index}" class="certificate-link flex-shrink-0">
                    <i class="fa-solid fa-award"></i> Ver Certificado
                </a>`;
      teamList.appendChild(listItem);
    });
  }

  const techListContainer = document.getElementById("tech-list");
  techListContainer.innerHTML = "";
  if (project.technologies && project.technologies.length > 0) {
    project.technologies.forEach((tech) => {
      techListContainer.innerHTML += createTechChip(tech);
    });
  }

  const resourcesSection = document.getElementById("resources-section");
  const resourcesList = document.getElementById("resources-list");
  resourcesList.innerHTML = "";
  if (project.additionalResources && project.additionalResources.length > 0) {
    project.additionalResources.forEach((resource) => {
      const iconClass = getResourceIcon(resource.type);
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm font-semibold hover:text-gnius-yellow transition-colors duration-150 group">
                    <i class="${iconClass} fa-fw mr-2 text-gnius-cyan text-base"></i>
                    <span class="underline decoration-transparent group-hover:decoration-gnius-yellow transition">${resource.title}</span>
                    <i class="fa-solid fa-arrow-up-right-from-square fa-xs ml-2 opacity-60"></i>
                </a>`;
      resourcesList.appendChild(listItem);
    });
    resourcesSection.style.display = "block";
  } else {
    resourcesSection.style.display = "none";
  }
}

function setTextContent(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text || "";
  else console.warn(`Elemento con ID "${id}" no encontrado.`);
}
function setHTMLContent(id, html) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = html || "";
  else console.warn(`Elemento con ID "${id}" no encontrado.`);
}
function createChip(text, colorClass, additionalClasses = []) {
  const classes = ["chip", colorClass, ...additionalClasses].join(" ");
  return `<span class="${classes}">${text}</span>`;
}
function createTechChip(tech) {
  const validCategories = ["Hardware", "Software", "Tool"];
  const categoryClean =
    validCategories.find(
      (c) => c.toLowerCase() === tech.category?.toLowerCase()
    ) || "Tool";
  const categoryClass = `tech-inner-chip-${categoryClean}`;
  const iconColorClass = `tech-icon-${categoryClean}`;
  const iconClass = tech.icon || "fa-solid fa-question-circle";
  return `<div class="tech-chip-container"><i class="${iconClass} ${iconColorClass} tech-icon"></i><span class="tech-name">${
    tech.name || "Desconocido"
  }</span><span class="tech-inner-chip ${categoryClass}">${categoryClean}</span></div>`;
}
function createImageElement(src, alt, useContain = true) {
  const objectFitClass = useContain ? "object-contain" : "object-cover";
  return `<img src="${src || ""}" alt="${
    alt || "Imagen descriptiva"
  }" class="w-full h-full ${objectFitClass}">`;
}
function createVideoEmbed(url) {
  if (!url)
    return '<span class="text-gnius-gray-light italic text-base font-medium">URL de video no válida</span>';
  let embedUrl = url;
  try {
    if (url.includes("youtu.be/")) {
      const videoId = new URL(url).pathname.substring(1);
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/watch?v=")) {
      const videoId = new URL(url).searchParams.get("v");
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {
    console.warn("URL de YouTube no parseable:", url, e);
  }
  return `<iframe class="absolute top-0 left-0 w-full h-full border-0" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}
function getResourceIcon(type) {
  if (!type) return "fa-solid fa-file-lines";
  switch (type.toLowerCase()) {
    case "github":
      return "fa-brands fa-github";
    case "pdf":
      return "fa-solid fa-file-pdf";
    case "doc":
    case "docx":
      return "fa-solid fa-file-word";
    case "link":
      return "fa-solid fa-link";
    case "website":
      return "fa-solid fa-globe";
    case "video":
      return "fa-solid fa-video";
    case "paper":
      return "fa-solid fa-newspaper";
    case "figma":
      return "fa-brands fa-figma";
    case "code":
      return "fa-solid fa-code";
    case "data":
      return "fa-solid fa-database";
    default:
      return "fa-solid fa-file-lines";
  }
}

function setupImageModal() {
  const modal = document.getElementById("imageModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  if (!modal || !closeBtn) return;
  closeBtn.onclick = closeImageModal;
  modal.onclick = function (event) {
    if (event.target === modal) closeImageModal();
  };
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden"))
      closeImageModal();
  });
}
function openImageModal(src, alt, caption) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  if (!modal || !modalImage || !modalCaption) return;
  modalImage.src = src || "";
  modalImage.alt = alt || "Imagen ampliada";
  modalCaption.textContent = caption || "";
  modal.classList.remove("hidden");
  void modal.offsetWidth;
  modal.classList.add("opacity-100");
  modal
    .querySelector(".modal-content")
    .classList.add("scale-100", "opacity-100");
  document.body.style.overflow = "hidden";
}
function closeImageModal() {
  const modal = document.getElementById("imageModal");
  if (!modal || modal.classList.contains("hidden")) return;
  modal.classList.remove("opacity-100");
  modal
    .querySelector(".modal-content")
    .classList.remove("scale-100", "opacity-100");
  setTimeout(() => {
    modal.classList.add("hidden");
    const modalImage = document.getElementById("modalImage");
    if (modalImage) modalImage.src = "";
    document.body.style.overflow = "";
  }, 300);
}

function renderGaugeChart(grade) {
  const gaugeCtx = document.getElementById("gaugeChart")?.getContext("2d");
  const scoreTextElement = document.getElementById("gauge-score-text");
  if (!gaugeCtx || !scoreTextElement) {
    console.warn("Canvas/Texto Gauge no encontrado.");
    return;
  }
  const displayGradeText = typeof grade === "number" ? grade.toFixed(1) : "-.-";
  scoreTextElement.textContent = displayGradeText;
  scoreTextElement.style.color = "var(--gnius-light)";
  if (gaugeChartInstance) {
    gaugeChartInstance.destroy();
  }
  const maxGrade = 10;
  const numericGrade = typeof grade === "number" ? grade : 0;
  const displayGradeValue = Math.min(Math.max(numericGrade, 0), maxGrade);
  let gaugeColorVar = "--gnius-green";
  if (displayGradeValue < 5) {
    gaugeColorVar = "--gnius-red";
  } else if (displayGradeValue < 8) {
    gaugeColorVar = "--gnius-yellow";
  }
  let gaugeColor = "#4CAF50";
  let bgColor = "#333333";
  try {
    gaugeColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue(gaugeColorVar)
        .trim() || gaugeColor;
    bgColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--gnius-gray-dark")
        .trim() || bgColor;
  } catch (e) {
    console.error("Error leyendo CSS vars para gauge", e);
  }
  const data = {
    datasets: [
      {
        data: [displayGradeValue, maxGrade - displayGradeValue],
        backgroundColor: [gaugeColor, bgColor],
        borderColor: [gaugeColor, bgColor],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "75%",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { animateRotate: true, animateScale: false },
  };
  gaugeChartInstance = new Chart(gaugeCtx, {
    type: "doughnut",
    data: data,
    options: options,
  });
}
function renderRubricBars(rubricScores) {
  const container = document.getElementById("rubric-criteria-container");
  if (!container) {
    console.warn("Contenedor de barras de rúbrica no encontrado.");
    return;
  }
  container.innerHTML = "";
  const criteriaMap = {
    innovation: "Innovación",
    collaboration: "Colaboración",
    impact: "Impacto",
    techUse: "Uso de Tecnología",
    presentation: "Presentación",
  };
  let foundValidScores = false;
  for (const key in criteriaMap) {
    if (
      Object.hasOwnProperty.call(rubricScores, key) &&
      typeof rubricScores[key] === "number"
    ) {
      const score = rubricScores[key];
      if ([1, 2, 3].includes(score)) {
        foundValidScores = true;
        const maxScore = 3;
        const percentage = (score / maxScore) * 100;
        let colorVar = "--gnius-green";
        if (score === 1) colorVar = "--gnius-red";
        else if (score === 2) colorVar = "--gnius-yellow";
        let color = "#4CAF50";
        try {
          color =
            getComputedStyle(document.documentElement)
              .getPropertyValue(colorVar)
              .trim() || color;
        } catch (e) {
          console.error("Error leyendo CSS var para barra rúbrica", e);
        }
        const criterionDiv = document.createElement("div");
        criterionDiv.classList.add("rubric-criterion");
        criterionDiv.innerHTML = `<p class="text-sm font-semibold text-gnius-light-text/90 mb-1 font-sans">${criteriaMap[key]}</p><div class="rubric-bar-chart-wrapper"><div class="rubric-bar rubric-bar-${score}" style="width: ${percentage}%; background-color: ${color};"><span class="rubric-score-text text-xs">${score}</span></div></div>`;
        container.appendChild(criterionDiv);
      } else {
        console.warn(`Score inválido (${score}) para criterio '${key}'.`);
      }
    } else {
      console.warn(`Score faltante/inválido para criterio '${key}'.`);
    }
  }
  if (foundValidScores) {
    const legend = document.createElement("p");
    legend.classList.add(
      "text-xs",
      "text-gnius-light-text/70",
      "mt-4",
      "font-medium"
    );
    // === NUEVO CÓDIGO PARA OBTENER COLORES CSS ===
    const rootStyles = getComputedStyle(document.documentElement);
    const color1 = rootStyles.getPropertyValue("--rubric-color-1").trim();
    const color2 = rootStyles.getPropertyValue("--rubric-color-2").trim();
    const color3 = rootStyles.getPropertyValue("--rubric-color-3").trim();

    // Aplicando margin-left: 16px, margin-right: 4px, Y position: relative; top: -1px; para ajustar la alineación vertical
    const swatchHtml1 = `<span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background-color: ${color1}; margin-left: 16px; margin-right: 4px; vertical-align: middle; position: relative; top: -1px;"></span>`; // Añadido position: relative; top: -1px;
    const swatchHtml2 = `<span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background-color: ${color2}; margin-left: 16px; margin-right: 4px; vertical-align: middle; position: relative; top: -1px;"></span>`; // Añadido position: relative; top: -1px;
    const swatchHtml3 = `<span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background-color: ${color3}; margin-left: 16px; margin-right: 4px; vertical-align: middle; position: relative; top: -1px;"></span>`; // Añadido position: relative; top: -1px;

    // Modifica la línea legend.innerHTML para incluir los swatches
    // Modifica la línea legend.innerHTML para incluir los swatches
    legend.innerHTML = `* Criterios evaluados:${swatchHtml1} <strong>Newbie</strong>,${swatchHtml2} <strong>Guru</strong>,${swatchHtml3} <strong>Wizard</strong>`;

    container.appendChild(legend);
  }
}
function getContrastYIQ(hexcolor) {
  if (!hexcolor) return "#FFFFFF";
  hexcolor = hexcolor.replace("#", "");
  if (hexcolor.length === 3)
    hexcolor = hexcolor
      .split("")
      .map((hex) => hex + hex)
      .join("");
  if (hexcolor.length !== 6) return "#FFFFFF";
  try {
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 135 ? "#111111" : "#FFFFFF";
  } catch (e) {
    console.error("Error calculando contraste YIQ:", hexcolor, e);
    return "#FFFFFF";
  }
}

document.addEventListener("DOMContentLoaded", loadProjectDetails);
