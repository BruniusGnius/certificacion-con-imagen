// Este script es crucial y hará lo siguiente:
// Obtendrá el slug del proyecto desde la URL (ej. project.html?slug=robot-rea).
// Cargará los datos de data/projects.json.
// Encontrará el proyecto específico que coincida con el slug.
// Mostrará un error si el slug falta o el proyecto no se encuentra.
// Rellenará dinámicamente todos los campos de la página project.html con los datos del proyecto encontrado (títulos, descripciones, imágenes, videos, listas, etc.).
// Implementará la lógica condicional para mostrar media o coverUrl en el Hero y la evidencia secundaria.
// Renderizará el gráfico radar de Chart.js con las puntuaciones de evaluación, aplicando los estilos y colores dinámicos solicitados.
// Creará la galería de imágenes y manejará la funcionalidad del modal para ampliar las imágenes.
// Ocultará las secciones opcionales si no tienen contenido (proceso, galería, recursos).
// Actualizará el año del copyright.

// Explicación y Puntos Clave:
// Obtener Slug: Usa URLSearchParams para leer el slug de la query string.
// Encontrar Proyecto: Carga projects.json y usa Array.find() para localizar el proyecto correcto.
// Renderizado Dinámico: Selecciona elementos por ID y actualiza su textContent o innerHTML. Para listas (equipo, techs, recursos, galería), limpia el contenido existente y crea nuevos elementos (<li>, <a>, <div>, etc.) iterando sobre los datos.
// Media Hero/Secundaria: Implementa la lógica para mostrar media o coverUrl según disponibilidad y lo que se haya usado en el Hero.
// Chart.js:
// Prepara labels y dataPoints. Limpia los labels para mejor legibilidad.
// Calcula el averageScore.
// Define una función (implícita en el cálculo de hue) para mapear el promedio a un color HSL entre amarillo y verde.
// Configura extensivamente las opciones del gráfico: tipo radar, escalas (máximo 100, rejilla circular, estilo de etiquetas/pointLabels), tensión de línea (curvas), y plugins (leyenda oculta, tooltips personalizados).
// Destruye instancias anteriores del gráfico si existen antes de crear una nueva.
// Modal: Funciones openModal y closeModal manejan la visibilidad, transición de opacidad y contenido del modal. Se añade cierre al hacer clic fuera y con la tecla Escape.
// Enlaces Certificado: Construye la URL correcta para cada miembro del equipo, incluyendo el slug del proyecto y el index del miembro.
// Iconos: Usa una función getIconForResourceType para mapear tipos de recursos a clases de Font Awesome. Para tecnologías, asume que el icono ya viene con el prefijo correcto del Apps Script.
// Ocultar Secciones: Usa element.style.display = 'none' o 'block' para ocultar/mostrar secciones opcionales según si tienen datos.
// Seguridad: Usa textContent por defecto para insertar texto y innerHTML solo cuando se espera contenido HTML (como en innovationProcess). Esto ayuda a prevenir XSS.
// Con este script, la página de detalles debería cobrar vida al recibir un slug válido en la URL.

// js/project.js

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const loadingMessage = document.getElementById("loading-message");
  const errorMessageContainer = document.getElementById("error-message");
  const projectDetailsContainer = document.getElementById("project-details");
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
  const backToProjectLink = document.getElementById("back-to-project-link"); // Link in header
  const viewProjectButton = document.getElementById("view-project-button"); // Button in certificate page context (might be null here)

  // Modal Elements
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  let chartInstance = null; // To store the chart instance

  // --- Helper Functions ---
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function showLoading(isLoading) {
    if (loadingMessage)
      loadingMessage.style.display = isLoading ? "block" : "none";
    if (projectDetailsContainer)
      projectDetailsContainer.style.display = isLoading ? "none" : "block"; // Toggle main content visibility
    if (errorMessageContainer) errorMessageContainer.style.display = "none"; // Hide error when loading starts
  }

  function showError(message) {
    showLoading(false); // Hide loading message
    if (errorMessageContainer) {
      errorMessageContainer.textContent = message;
      errorMessageContainer.style.display = "block";
    }
    if (projectDetailsContainer) projectDetailsContainer.style.display = "none"; // Hide content area
    console.error(message);
  }

  function updateCopyrightYear() {
    if (currentYearFooterSpan) {
      currentYearFooterSpan.textContent = new Date().getFullYear();
    }
  }

  function createChip(text, colorClass) {
    const chip = document.createElement("span");
    // Base classes + dynamic color class
    chip.className = `chip ${colorClass} text-xs`;
    chip.textContent = text;
    return chip;
  }

  function getIconForResourceType(type) {
    const lowerType = type.toLowerCase();
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
        return "fa-brands fa-youtube"; // Assuming video links are youtube
      case "figma":
        return "fa-brands fa-figma";
      case "code":
        return "fa-solid fa-code";
      case "paper":
        return "fa-solid fa-newspaper";
      case "link": // Fallback for generic links
      default:
        return "fa-solid fa-link";
    }
  }

  // --- Main Initialization ---
  async function init() {
    updateCopyrightYear();
    const projectSlug = getQueryParam("slug");

    if (!projectSlug) {
      showError(
        "No se especificó ningún proyecto (falta el 'slug' en la URL)."
      );
      return;
    }

    // Adjust back link if needed (though it defaults to index)
    if (backToProjectLink) {
      // Could adjust if coming from a specific filter state, but index.html is safe
    }

    try {
      showLoading(true);
      const response = await fetch("data/projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const projects = await response.json();

      if (!Array.isArray(projects)) {
        throw new Error("El archivo JSON no contiene un array válido.");
      }

      const project = projects.find((p) => p.slug === projectSlug);

      if (!project) {
        showError(`Proyecto con slug '${projectSlug}' no encontrado.`);
        return;
      }

      displayProjectDetails(project);
      setupModal(); // Setup modal listeners after content is potentially loaded
    } catch (error) {
      console.error("Error al cargar o mostrar el proyecto:", error);
      showError(`No se pudo cargar el proyecto. ${error.message}.`);
    } finally {
      showLoading(false);
    }
  }

  // --- Display Project Details ---
  function displayProjectDetails(project) {
    document.title = `${project.projectTitle} - Gnius Club`; // Update page title

    if (projectTitleEl) projectTitleEl.textContent = project.projectTitle;
    if (introTitleEl) introTitleEl.textContent = project.intro_title;
    if (introContentEl) introContentEl.textContent = project.intro_content; // Use textContent for safety unless HTML is intended
    if (problemDescEl) problemDescEl.innerHTML = project.problemDescription; // Use innerHTML if HTML content is possible/intended
    if (solutionPropEl) solutionPropEl.innerHTML = project.solutionProposed; // Use innerHTML if HTML content is possible/intended

    // Populate Metadata
    if (projectMetadataEl) {
      projectMetadataEl.innerHTML = ""; // Clear placeholders
      if (project.projectCategory) {
        projectMetadataEl.appendChild(
          createChip(project.projectCategory, "chip-cyan")
        );
      }
      if (project.studentLevel) {
        projectMetadataEl.appendChild(
          createChip(project.studentLevel, "chip-red")
        );
      }
    }

    // Determine Media to Display
    let heroMediaUsed = null; // Track what was used in hero ('media', 'cover', null)
    heroMediaContainer.innerHTML = ""; // Clear loading text

    // Priority: Project Media (video/image)
    if (project.media && project.media.url) {
      heroMediaUsed = "media";
      if (project.media.type === "video") {
        const iframe = document.createElement("iframe");
        iframe.src = project.media.url;
        iframe.className = "w-full h-full absolute top-0 left-0 border-0"; // Tailwind/CSS handles aspect ratio
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.title = `Video del proyecto ${project.projectTitle}`;
        heroMediaContainer.appendChild(iframe);
        heroMediaContainer.classList.add("relative"); // Needed for absolute iframe positioning
        heroMediaContainer.style.paddingBottom = "56.25%"; // Force 16:9 aspect ratio for video
      } else if (project.media.type === "image") {
        const img = document.createElement("img");
        img.src = project.media.url;
        img.alt =
          project.media.altText ||
          `Media principal del proyecto ${project.projectTitle}`;
        img.className = "w-full h-full object-contain"; // Use contain to see the whole image
        heroMediaContainer.appendChild(img);
      } else {
        heroMediaUsed = null; // Invalid type
      }
      // Fallback: Cover URL
    } else if (project.coverUrl && project.coverUrl.url) {
      heroMediaUsed = "cover";
      const img = document.createElement("img");
      img.src = project.coverUrl.url;
      img.alt =
        project.coverUrl.altText ||
        `Portada del proyecto ${project.projectTitle}`;
      img.className = "w-full h-full object-contain"; // Use contain for consistency? Or cover? Let's use contain.
      heroMediaContainer.appendChild(img);
    } else {
      // No media or cover available for hero
      heroMediaContainer.innerHTML =
        '<p class="text-gnius-gray-light italic p-4">No hay imagen o video principal disponible.</p>';
    }

    // Render Secondary Evidence
    secondaryEvidenceMediaContainer.innerHTML = "";
    let secondaryMediaRendered = false;
    if (heroMediaUsed === "media" && project.coverUrl && project.coverUrl.url) {
      // If media was used in hero, show cover here
      const img = document.createElement("img");
      img.src = project.coverUrl.url;
      img.alt =
        project.coverUrl.altText ||
        `Portada del proyecto ${project.projectTitle}`;
      img.className = "w-full h-full object-contain";
      secondaryEvidenceMediaContainer.appendChild(img);
      secondaryMediaRendered = true;
    } else if (
      heroMediaUsed === "cover" &&
      project.imageGallery &&
      project.imageGallery.length > 0 &&
      project.imageGallery[0].url
    ) {
      // If cover was used in hero, show first gallery image here
      const img = document.createElement("img");
      img.src = project.imageGallery[0].url;
      img.alt =
        project.imageGallery[0].altText ||
        `Evidencia adicional del proyecto ${project.projectTitle}`;
      img.className = "w-full h-full object-contain";
      secondaryEvidenceMediaContainer.appendChild(img);
      secondaryMediaRendered = true;
    }
    // Show/Hide the section
    if (secondaryEvidenceSection) {
      secondaryEvidenceSection.style.display = secondaryMediaRendered
        ? "block"
        : "none";
    }

    // Render Innovation Process
    if (innovationProcessSection && innovationProcessContentEl) {
      if (
        project.innovationProcess &&
        project.innovationProcess.trim() !== ""
      ) {
        innovationProcessContentEl.innerHTML = project.innovationProcess; // Assumes safe HTML
        innovationProcessSection.style.display = "block";
      } else {
        innovationProcessSection.style.display = "none";
      }
    }

    // Render Team List
    if (teamListEl && project.teamMembers && project.teamMembers.length > 0) {
      teamListEl.innerHTML = ""; // Clear placeholders
      project.teamMembers.forEach((member, index) => {
        const li = document.createElement("li");
        li.className =
          "team-member-item flex justify-between items-center bg-gnius-dark-2 p-3 rounded";

        const infoDiv = document.createElement("div");
        infoDiv.className = "member-info";
        infoDiv.innerHTML = `
                   <span class="block font-semibold text-gnius-light">${member.name}</span>
                   <span class="block text-sm text-gnius-light/70">${member.role}</span>
               `;

        const link = document.createElement("a");
        // Construct certificate URL: certificate.html?slug=PROJECT_SLUG&memberIndex=INDEX
        link.href = `certificate.html?slug=${project.slug}&memberIndex=${index}`;
        link.className =
          "certificate-link flex items-center text-gnius-yellow hover:text-yellow-300 text-sm transition duration-150 ease-in-out";
        link.innerHTML = `<i class="fa-solid fa-award mr-2"></i> Ver Certificado`;

        li.appendChild(infoDiv);
        li.appendChild(link);
        teamListEl.appendChild(li);
      });
    } else if (teamListEl) {
      teamListEl.innerHTML =
        '<p class="text-gnius-light/70 italic">No hay información del equipo disponible.</p>';
    }

    // Render Technologies List
    if (techListEl && project.technologies && project.technologies.length > 0) {
      techListEl.innerHTML = ""; // Clear placeholders
      project.technologies.forEach((tech) => {
        const container = document.createElement("div");
        container.className = "tech-chip-container"; // Base styles from CSS

        const iconSpan = document.createElement("span");
        const iconClass = tech.icon; // Icon class already includes fa-solid/fa-brands from Apps Script
        const categoryLower = tech.category.toLowerCase();
        iconSpan.className = `tech-icon mr-2 tech-cat-${categoryLower}`; // Color class based on category
        iconSpan.innerHTML = `<i class="${iconClass}"></i>`;

        const nameSpan = document.createElement("span");
        nameSpan.className = "tech-name text-gnius-light mr-2";
        nameSpan.textContent = tech.name;

        const categoryChip = document.createElement("span");
        categoryChip.className = `tech-inner-chip text-xs font-bold px-1.5 py-0.5 rounded-md tech-inner-chip-${categoryLower}`; // BG/Color class based on category
        categoryChip.textContent = tech.category;

        container.appendChild(iconSpan);
        container.appendChild(nameSpan);
        container.appendChild(categoryChip);
        techListEl.appendChild(container);
      });
    } else if (techListEl) {
      techListEl.innerHTML =
        '<p class="text-gnius-light/70 italic">No hay tecnologías especificadas.</p>';
    }

    // Render Additional Resources
    if (
      resourcesSection &&
      resourcesListEl &&
      project.additionalResources &&
      project.additionalResources.length > 0
    ) {
      resourcesListEl.innerHTML = ""; // Clear placeholders
      project.additionalResources.forEach((resource) => {
        const li = document.createElement("li");
        li.className = "resource-item";
        const link = document.createElement("a");
        link.href = resource.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className =
          "text-gnius-light hover:text-gnius-cyan transition duration-150 ease-in-out inline-flex items-center text-sm";
        const icon = document.createElement("i");
        icon.className = `${getIconForResourceType(
          resource.type
        )} mr-2 text-gnius-gray-light w-4 text-center`; // Icon based on type
        link.appendChild(icon);
        link.appendChild(document.createTextNode(resource.title));
        li.appendChild(link);
        resourcesListEl.appendChild(li);
      });
      resourcesSection.style.display = "block";
    } else if (resourcesSection) {
      resourcesSection.style.display = "none";
    }

    // Render Image Gallery
    if (
      gallerySection &&
      galleryGridEl &&
      project.imageGallery &&
      project.imageGallery.length > 0
    ) {
      galleryGridEl.innerHTML = ""; // Clear placeholders
      project.imageGallery.forEach((image, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "gallery-item"; // Styles from CSS

        const img = document.createElement("img");
        img.src = image.url;
        img.alt = image.altText || `Imagen ${index + 1} de la galería`;
        img.loading = "lazy"; // Lazy load gallery images

        itemDiv.appendChild(img);
        itemDiv.addEventListener("click", () =>
          openModal(image.url, image.altText, image.caption)
        );
        galleryGridEl.appendChild(itemDiv);
      });
      gallerySection.style.display = "block";
    } else if (gallerySection) {
      gallerySection.style.display = "none";
    }

    // Render Evaluation Chart
    if (
      evaluationChartSection &&
      radarChartCanvas &&
      project.evaluationScores &&
      Object.keys(project.evaluationScores).length > 0
    ) {
      renderRadarChart(project.evaluationScores);
      evaluationChartSection.style.display = "block";
    } else if (evaluationChartSection) {
      evaluationChartSection.style.display = "none";
    }

    // Show the main content container now that it's populated
    projectDetailsContainer.style.display = "block";
  }

  // --- Radar Chart Rendering ---
  function renderRadarChart(scores) {
    if (!radarChartCanvas) return;
    const ctx = radarChartCanvas.getContext("2d");

    // Prepare data
    const labels = Object.keys(scores).map((label) => {
      // Clean up label: remove 'eval_' prefix and split long words if needed
      let cleanLabel = label
        .replace(/^eval_/, "")
        .replace(/([A-Z])/g, " $1")
        .trim(); // Add space before caps
      // Simple word split for longer labels (adjust max length as needed)
      const maxLength = 15; // Max chars per line approx
      if (cleanLabel.length > maxLength && cleanLabel.includes(" ")) {
        // Split into roughly two lines
        const words = cleanLabel.split(" ");
        let line1 = "";
        let line2 = "";
        let currentLength = 0;
        words.forEach((word) => {
          if ((line1 + word).length <= maxLength || line1 === "") {
            line1 += (line1 ? " " : "") + word;
          } else {
            line2 += (line2 ? " " : "") + word;
          }
        });
        return [line1, line2.trim()]; // Return array for multi-line
      }
      return cleanLabel; // Return single line label
    });
    const dataPoints = Object.values(scores);

    // Calculate average for dynamic color
    const averageScore =
      dataPoints.reduce((sum, score) => sum + score, 0) / dataPoints.length;

    // Define color scale (Yellow for low avg, Green for high avg)
    // Using HSL: Hue (60=Yellow, 120=Green), Saturation 100%, Lightness 50%
    const hue = 60 + (averageScore / 100) * 60; // Map 0-100 -> 60-120 Hue
    const dynamicColor = `hsla(${hue}, 100%, 50%, 1)`; // Full opacity for border
    const dynamicFillColor = `hsla(${hue}, 100%, 50%, 0.4)`; // 40% opacity for fill

    // Destroy previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create chart
    chartInstance = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Puntuaciones",
            data: dataPoints,
            fill: true,
            backgroundColor: dynamicFillColor,
            borderColor: dynamicColor,
            borderWidth: 2,
            pointBackgroundColor: dynamicColor, // Color of the points
            pointBorderColor: "#fff", // White border for points
            pointHoverBackgroundColor: "#fff", // White on hover
            pointHoverBorderColor: dynamicColor, // Border color on hover
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // Keep aspect ratio defined in HTML/CSS
        scales: {
          r: {
            // Radial axis (the scores)
            beginAtZero: true,
            max: 100, // Assuming scores are 0-100
            angleLines: {
              // Lines from center to edge
              color: "rgba(240, 240, 240, 0.2)", // Faint lines
            },
            grid: {
              // Circular grid lines
              color: "rgba(240, 240, 240, 0.2)", // Faint grid
              circular: true, // Make grid circular
            },
            pointLabels: {
              // Labels around the edge (eval metrics)
              color: "#F0F0F0", // gnius-light
              font: {
                family: "'Saira Condensed', sans-serif", // Use condensed font
                size: 11, // Adjust size as needed
                weight: "bold",
              },
              padding: 15, // Add padding between label and chart edge
            },
            ticks: {
              // Labels on the radial axis (0, 20, 40...)
              display: false, // Hide the 0-100 labels on spokes for cleaner look
              // color: 'rgba(240, 240, 240, 0.7)',
              // backdropColor: 'rgba(15, 15, 15, 0.8)', // Dark semi-transparent bg for ticks
              // stepSize: 20 // Show ticks every 20 points
            },
          },
        },
        elements: {
          line: {
            tension: 0.3, // Make lines slightly curved (bezier)
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the default legend (only one dataset)
          },
          tooltip: {
            backgroundColor: "rgba(15, 15, 15, 0.85)", // Darker tooltip bg
            titleColor: "#FFD700", // Yellow title
            bodyColor: "#F0F0F0", // Light body text
            borderColor: "#00FFFF", // Cyan border
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.r !== null) {
                  label += context.parsed.r; // Show score
                }
                return label;
              },
            },
          },
        },
      },
    });
  }

  // --- Modal Functionality ---
  function setupModal() {
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }
    // Close modal if clicked outside the content area
    if (imageModal) {
      imageModal.addEventListener("click", closeModalOutside);
    }
    // Close modal with Escape key
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        imageModal &&
        !imageModal.classList.contains("hidden")
      ) {
        closeModal();
      }
    });
  }

  function openModal(imageUrl, altText, captionText) {
    if (!imageModal || !modalImage) return;

    modalImage.src = imageUrl;
    modalImage.alt = altText || "Imagen ampliada";
    if (modalCaption) {
      modalCaption.textContent = captionText || "";
    }

    imageModal.classList.remove("hidden");
    // Timeout needed to allow display:flex to apply before starting opacity transition
    setTimeout(() => {
      imageModal.classList.remove("opacity-0");
    }, 10); // Small delay
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  function closeModal() {
    if (!imageModal) return;
    imageModal.classList.add("opacity-0");
    // Wait for transition to finish before hiding
    setTimeout(() => {
      imageModal.classList.add("hidden");
      document.body.style.overflow = ""; // Restore background scrolling
      // Clear image src to stop loading if modal is closed quickly
      if (modalImage) modalImage.src = "";
    }, 300); // Must match transition duration in CSS/Tailwind
  }

  function closeModalOutside(event) {
    // Check if the click target is the modal background itself, not its children
    if (event.target === imageModal) {
      closeModal();
    }
  }

  // --- Start ---
  init();
});
