// js/project.js - v3.2 Corregido (Icono Recurso + Logging)

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Listo. Iniciando project.js v3.2..."); // Log inicial v3.2

  // --- DOM Elements ---
  const loadingMessage = document.getElementById("loading-message");
  const errorMessageContainer = document.getElementById("error-message");
  const projectDetailsContainer = document.getElementById("project-details");
  // ... (resto de elementos sin cambios) ...
  const projectTitleEl = document.getElementById("project-title");
  const projectMetadataEl = document.getElementById("project-metadata");
  const introTitleEl = document.getElementById("intro-title");
  const introContentEl = document.getElementById("intro-content");
  const heroMediaContainer = document.getElementById("hero-media");
  const secondaryEvidenceSection = document.getElementById(
    "secondary-evidence-section"
  );
  const secondaryEvidenceMediaContainer = document.getElementById(
    "secondary-evidence-media"
  );
  const evaluationChartSection = document.getElementById(
    "evaluation-chart-section"
  );
  const radarChartCanvas = document.getElementById("radarChart");
  const problemDescEl = document.getElementById("problem-description");
  const solutionPropEl = document.getElementById("solution-proposed");
  const innovationProcessSection = document.getElementById(
    "innovation-process-section"
  );
  const innovationProcessContentEl = document.getElementById(
    "innovation-process-content"
  );
  const gallerySection = document.getElementById("gallery-section");
  const galleryGridEl = document.getElementById("gallery-grid");
  const teamListEl = document.getElementById("team-list");
  const techListEl = document.getElementById("tech-list");
  const resourcesSection = document.getElementById("resources-section");
  const resourcesListEl = document.getElementById("resources-list");
  const currentYearFooterSpan = document.getElementById("current-year-footer");
  const backToProjectLink = document.getElementById("back-to-project-link");
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  let chartInstance = null;

  // --- Helper Functions ---
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  function showLoading(isLoading) {
    if (loadingMessage)
      loadingMessage.style.display = isLoading ? "block" : "none";
    if (errorMessageContainer) errorMessageContainer.style.display = "none";
    if (projectDetailsContainer)
      projectDetailsContainer.classList.toggle("hidden", isLoading);
  } // Usar hidden
  function showError(message) {
    showLoading(false);
    if (errorMessageContainer) {
      errorMessageContainer.textContent = message;
      errorMessageContainer.style.display = "block";
    }
    if (projectDetailsContainer)
      projectDetailsContainer.classList.add("hidden");
    console.error("Error mostrado:", message);
  }
  function updateCopyrightYear() {
    if (currentYearFooterSpan)
      currentYearFooterSpan.textContent = new Date().getFullYear();
  }
  function createChip(text, colorClass) {
    const chip = document.createElement("span");
    chip.className = `chip ${colorClass}`;
    chip.textContent = text;
    return chip;
  }

  // --- CORRECCIÓN FUNCIÓN ICONO RECURSO ---
  function getIconForResourceType(type) {
    const lowerType = type ? type.toLowerCase().trim() : "link"; // Default a link si no hay tipo o está vacío
    switch (lowerType) {
      case "github":
        return "fa-brands fa-github";
      case "pdf":
        return "fa-solid fa-file-pdf";
      case "doc":
      case "docx":
        return "fa-solid fa-file-word";
      case "website":
        return "fa-solid fa-globe";
      case "video":
        return "fa-brands fa-youtube";
      case "figma":
        return "fa-brands fa-figma";
      case "code":
        return "fa-solid fa-code";
      case "paper":
      case "article":
        return "fa-solid fa-newspaper"; // Añadido alias 'article'
      case "link":
      default:
        return "fa-solid fa-link"; // Icono cadena por defecto
    }
  }
  // --- FIN CORRECCIÓN ---

  // --- Main Initialization ---
  async function init() {
    console.log("v3.2: init() llamada");
    updateCopyrightYear();
    const projectSlug = getQueryParam("slug");
    if (!projectSlug) {
      showError("Falta 'slug' en URL.");
      return;
    }
    console.log(`v3.2: Buscando slug: ${projectSlug}`);

    try {
      showLoading(true);
      if (projectDetailsContainer)
        projectDetailsContainer.classList.add("hidden");

      const response = await fetch("data/projects.json");
      console.log("v3.2: Fetch status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const projects = await response.json();
      if (!Array.isArray(projects)) throw new Error("JSON inválido.");

      const project = projects.find((p) => p.slug === projectSlug);
      if (!project) throw new Error(`Proyecto '${projectSlug}' no encontrado.`);
      console.log("v3.2: Proyecto encontrado:", project.projectTitle);

      displayProjectDetails(project);
      setupModal();

      console.log("v3.2: Renderizado completo, mostrando contenedor...");
      if (projectDetailsContainer) {
        projectDetailsContainer.classList.remove("hidden");
        console.log("v3.2: Contenedor #project-details visible.");
      } else {
        console.error("v3.2: ¡Contenedor #project-details NO encontrado!");
      }

      console.log("v3.2: Inicialización completada.");
    } catch (error) {
      showError(`No se pudo cargar el proyecto. ${error.message}.`);
    } finally {
      showLoading(false);
      console.log("v3.2: init() finalizada.");
    }
  }

  // --- Display Project Details ---
  function displayProjectDetails(project) {
    console.log("v3.2: displayProjectDetails() para:", project.projectTitle);
    try {
      document.title = `${project.projectTitle} - Gnius Club`;

      // Rellenar elementos (sin cambios lógicos respecto a v3.1)
      // ... (projectTitleEl, introTitleEl, etc.) ...
      if (projectTitleEl) projectTitleEl.textContent = project.projectTitle;
      else console.warn("ID 'project-title' no encontrado");
      if (introTitleEl) introTitleEl.textContent = project.intro_title;
      else console.warn("ID 'intro-title' no encontrado");
      if (introContentEl) introContentEl.textContent = project.intro_content;
      else console.warn("ID 'intro-content' no encontrado");
      if (problemDescEl) problemDescEl.innerHTML = project.problemDescription;
      else console.warn("ID 'problem-description' no encontrado");
      if (solutionPropEl) solutionPropEl.innerHTML = project.solutionProposed;
      else console.warn("ID 'solution-proposed' no encontrado");
      if (projectMetadataEl) {
        projectMetadataEl.innerHTML = "";
        if (project.projectCategory)
          projectMetadataEl.appendChild(
            createChip(project.projectCategory, "chip-cyan")
          );
        if (project.studentLevel)
          projectMetadataEl.appendChild(
            createChip(project.studentLevel, "chip-red")
          );
      } else console.warn("ID 'project-metadata' no encontrado");

      // Media Hero/Secundaria (sin cambios)
      let heroMediaUsed = null;
      if (heroMediaContainer) {
        heroMediaContainer.innerHTML = "";
        /* ... lógica media ... */ if (project.media?.url) {
          heroMediaUsed = "media";
          if (
            project.media.type === "video" &&
            project.media.url.includes("youtube.com/embed/")
          ) {
            heroMediaContainer.innerHTML = `<div class="relative w-full" style="padding-bottom: 56.25%;"><iframe src="${project.media.url}" class="absolute top-0 left-0 w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Video ${project.projectTitle}"></iframe></div>`;
          } else if (project.media.type === "image") {
            heroMediaContainer.innerHTML = `<img src="${
              project.media.url
            }" alt="${
              project.media.altText || "Media principal"
            }" class="w-full h-full object-contain">`;
          } else {
            heroMediaUsed = null;
          }
        } else if (project.coverUrl?.url) {
          heroMediaUsed = "cover";
          heroMediaContainer.innerHTML = `<img src="${
            project.coverUrl.url
          }" alt="${
            project.coverUrl.altText || "Portada"
          }" class="w-full h-full object-contain">`;
        } else {
          heroMediaContainer.innerHTML =
            '<p class="text-gnius-gray-light italic p-4 text-base">Media no disponible.</p>';
        }
      } else console.warn("ID 'hero-media' no encontrado");
      if (secondaryEvidenceMediaContainer) {
        secondaryEvidenceMediaContainer.innerHTML = "";
        let secondaryMediaRendered = false;
        if (heroMediaUsed === "media" && project.coverUrl?.url) {
          secondaryEvidenceMediaContainer.innerHTML = `<img src="${
            project.coverUrl.url
          }" alt="${
            project.coverUrl.altText || "Portada"
          }" class="w-full h-full object-contain">`;
          secondaryMediaRendered = true;
        } else if (
          heroMediaUsed === "cover" &&
          project.imageGallery?.[0]?.url
        ) {
          secondaryEvidenceMediaContainer.innerHTML = `<img src="${
            project.imageGallery[0].url
          }" alt="${
            project.imageGallery[0].altText || "Evidencia adicional"
          }" class="w-full h-full object-contain">`;
          secondaryMediaRendered = true;
        }
        if (secondaryEvidenceSection)
          secondaryEvidenceSection.style.display = secondaryMediaRendered
            ? "block"
            : "none";
      } else console.warn("ID 'secondary-evidence-media' no encontrado");

      // Proceso Innovación (sin cambios)
      if (innovationProcessSection && innovationProcessContentEl) {
        if (project.innovationProcess?.trim()) {
          innovationProcessContentEl.innerHTML = project.innovationProcess;
          innovationProcessSection.style.display = "block";
        } else {
          innovationProcessSection.style.display = "none";
        }
      } else
        console.warn("IDs 'innovation-process-section/content' no encontrados");

      // Equipo (sin cambios)
      if (teamListEl) {
        teamListEl.innerHTML = "";
        if (project.teamMembers?.length > 0) {
          project.teamMembers.forEach((member, index) => {
            const li = document.createElement("li");
            li.className =
              "team-member-item flex justify-between items-center bg-gnius-dark-2 p-3 rounded shadow";
            li.innerHTML = ` <div class="member-info mr-2"> <span class="block font-semibold text-gnius-light text-base">${member.name}</span> <span class="block text-sm text-gnius-light/70">${member.role}</span> </div> <a href="certificate.html?slug=${project.slug}&memberIndex=${index}" class="certificate-link flex-shrink-0"> <i class="fa-solid fa-award"></i> Ver Certificado </a> `;
            teamListEl.appendChild(li);
          });
        } else {
          teamListEl.innerHTML =
            '<p class="text-gnius-light/70 italic text-base">Equipo no disponible.</p>';
        }
      } else console.warn("ID 'team-list' no encontrado");

      // Tecnologías (sin cambios)
      if (techListEl) {
        techListEl.innerHTML = "";
        if (project.technologies?.length > 0) {
          project.technologies.forEach((tech) => {
            const container = document.createElement("div");
            container.className = "tech-chip-container";
            const categoryLower = tech.category.toLowerCase();
            const iconClass = tech.icon || "fa-solid fa-gear";
            container.innerHTML = ` <span class="tech-icon tech-icon-${tech.category}"><i class="${iconClass}"></i></span> <span class="tech-name">${tech.name}</span> <span class="tech-inner-chip tech-inner-chip-${tech.category}">${tech.category}</span> `;
            techListEl.appendChild(container);
          });
        } else {
          techListEl.innerHTML =
            '<p class="text-gnius-light/70 italic text-base">Tecnologías no especificadas.</p>';
        }
      } else console.warn("ID 'tech-list' no encontrado");

      // --- Recursos (Usa la función getIconForResourceType CORREGIDA) ---
      if (resourcesSection && resourcesListEl) {
        resourcesListEl.innerHTML = "";
        if (project.additionalResources?.length > 0) {
          project.additionalResources.forEach((resource) => {
            const li = document.createElement("li");
            li.className = "resource-item";
            // Usar la función corregida para obtener el icono
            const iconClass = getIconForResourceType(resource.type);
            li.innerHTML = `
                           <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm">
                               <i class="${iconClass} mr-2 text-gnius-gray-light w-4 text-center"></i> ${resource.title}
                           </a>
                       `; // El estilo de link (subrayado) viene del CSS ahora
            resourcesListEl.appendChild(li);
          });
          resourcesSection.style.display = "block";
        } else {
          resourcesSection.style.display = "none";
        }
      } else console.warn("IDs 'resources-section/list' no encontrados");
      // --- FIN Recursos ---

      // Galería (sin cambios)
      if (gallerySection && galleryGridEl) {
        galleryGridEl.innerHTML = "";
        if (project.imageGallery?.length > 0) {
          project.imageGallery.forEach((image, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className =
              "gallery-item bg-gnius-dark-2 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gnius-cyan aspect-video";
            const img = document.createElement("img");
            img.src = image.url;
            img.alt = image.altText || `Imagen ${index + 1}`;
            img.loading = "lazy";
            img.className = "w-full h-full object-cover";
            itemDiv.appendChild(img);
            itemDiv.addEventListener("click", () =>
              openModal(image.url, img.alt, image.caption)
            );
            galleryGridEl.appendChild(itemDiv);
          });
          gallerySection.style.display = "block";
        } else {
          gallerySection.style.display = "none";
        }
      } else console.warn("IDs 'gallery-section/grid' no encontrados");

      // Gráfico Evaluación (sin cambios lógicos)
      console.log("v3.2: Renderizando gráfico si aplica...");
      if (evaluationChartSection && radarChartCanvas) {
        if (
          project.evaluationScores &&
          Object.keys(project.evaluationScores).length > 0
        ) {
          renderRadarChart(project.evaluationScores); // Llama a la versión v3 con colores RGBA
          evaluationChartSection.style.display = "block";
        } else {
          evaluationChartSection.style.display = "none";
        }
      } else
        console.warn("IDs 'evaluation-chart-section/canvas' no encontrados");

      console.log("v3.2: displayProjectDetails finalizada.");
    } catch (renderError) {
      console.error("v3.2: Error durante displayProjectDetails:", renderError);
      showError(`Error al mostrar detalles: ${renderError.message}`);
    }
  }

  // --- Radar Chart Rendering (v3 - Colores RGBA) ---
  function renderRadarChart(scores) {
    // Misma versión que v3.1
    console.log("v3.2: renderRadarChart() con:", scores);
    if (!radarChartCanvas) {
      console.warn("Canvas no encontrado");
      return;
    }
    const ctx = radarChartCanvas.getContext("2d");
    const labels = Object.keys(scores).map((label) => {
      let c = label
        .replace(/^e_/, "")
        .replace(/([A-Z])/g, " $1")
        .trim();
      const m = 15;
      if (c.length > m && c.includes(" ")) {
        let w = c.split(" "),
          l1 = "",
          l2 = "";
        w.forEach((w) => {
          if ((l1 + w).length <= m || l1 === "") l1 += (l1 ? " " : "") + w;
          else l2 += (l2 ? " " : "") + w;
        });
        return [l1, l2.trim()];
      }
      return c;
    });
    const dataPoints = Object.values(scores).map(Number);
    if (dataPoints.some(isNaN)) {
      console.error("Datos eval inválidos:", scores);
      showError("Error: Datos evaluación no numéricos.");
      if (evaluationChartSection) evaluationChartSection.style.display = "none";
      return;
    }
    const averageScore =
      dataPoints.length > 0
        ? dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length
        : 0;
    console.log(`v3.2: Promedio: ${averageScore.toFixed(1)}`);
    let borderColor, backgroundColor, pointBackgroundColor;
    const colorRed = "rgba(255, 0, 0, 1)",
      colorRedFill = "rgba(255, 0, 0, 0.4)";
    const colorYellow = "rgba(255, 215, 0, 1)",
      colorYellowFill = "rgba(255, 215, 0, 0.4)";
    const colorGreenOlive = "rgba(107, 142, 35, 1)",
      colorGreenOliveFill = "rgba(107, 142, 35, 0.4)";
    const colorGreenLime = "rgba(0, 255, 0, 1)",
      colorGreenLimeFill = "rgba(0, 255, 0, 0.4)";
    if (averageScore < 70) {
      [borderColor, backgroundColor] = [colorRed, colorRedFill];
    } else if (averageScore < 86) {
      [borderColor, backgroundColor] = [colorYellow, colorYellowFill];
    } else if (averageScore < 96) {
      [borderColor, backgroundColor] = [colorGreenOlive, colorGreenOliveFill];
    } else {
      [borderColor, backgroundColor] = [colorGreenLime, colorGreenLimeFill];
    }
    pointBackgroundColor = borderColor;
    console.log(`v3.2: Color gráfico: B=${borderColor}, F=${backgroundColor}`);
    if (chartInstance) {
      console.log("v3.2: Destruyendo gráfico anterior.");
      chartInstance.destroy();
    }
    console.log("v3.2: Creando Chart...");
    try {
      chartInstance = new Chart(ctx, {
        type: "radar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Puntuaciones",
              data: dataPoints,
              fill: true,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 2,
              pointBackgroundColor: pointBackgroundColor,
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: borderColor,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              angleLines: { color: "rgba(240, 240, 240, 0.2)" },
              grid: { color: "rgba(240, 240, 240, 0.2)", circular: true },
              pointLabels: {
                color: "#F0F0F0",
                font: {
                  family: "'Saira Condensed', sans-serif",
                  size: 12,
                  weight: "bold",
                },
                padding: 18,
              },
              ticks: { display: false },
            },
          },
          elements: { line: { tension: 0.3 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(15, 15, 15, 0.85)",
              titleColor: "#FFD700",
              bodyColor: "#F0F0F0",
              borderColor: "#00FFFF",
              borderWidth: 1,
              bodyFont: { family: "'Saira Condensed', sans-serif", size: 12 },
              titleFont: {
                family: "'Saira Condensed', sans-serif",
                size: 13,
                weight: "bold",
              },
              callbacks: {
                label: function (context) {
                  return context.parsed.r !== null ? `${context.parsed.r}` : "";
                },
              },
            },
          },
        },
      });
      console.log("v3.2: Gráfico creado.");
    } catch (chartError) {
      console.error("v3.2: Error Chart.js:", chartError);
      showError(`Error al generar gráfico: ${chartError.message}`);
      if (evaluationChartSection) evaluationChartSection.style.display = "none";
    }
  }

  // --- Modal Functionality ---
  function setupModal() {
    console.log("v3.2: setupModal() llamada");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (imageModal) imageModal.addEventListener("click", closeModalOutside);
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        imageModal &&
        !imageModal.classList.contains("hidden")
      )
        closeModal();
    });
  }
  function openModal(imageUrl, altText, captionText) {
    if (!imageModal || !modalImage) return;
    modalImage.src = imageUrl;
    modalImage.alt = altText || "Imagen ampliada";
    if (modalCaption) modalCaption.textContent = captionText || "";
    imageModal.classList.remove("hidden");
    setTimeout(() => imageModal.classList.remove("opacity-0"), 10);
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!imageModal) return;
    imageModal.classList.add("opacity-0");
    setTimeout(() => {
      imageModal.classList.add("hidden");
      document.body.style.overflow = "";
      if (modalImage) modalImage.src = "";
    }, 300);
  }
  function closeModalOutside(event) {
    if (event.target === imageModal) closeModal();
  }

  // --- Start ---
  init();
});
