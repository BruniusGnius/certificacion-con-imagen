document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const projectSlug = params.get("slug");

  // Elementos del DOM
  const loadingMessage = document.getElementById("loading-message");
  const errorMessage = document.getElementById("error-message");
  const projectDetailsContainer = document.getElementById("project-details"); // Asegúrate que este ID exista si lo usas
  const heroSection = document.getElementById("hero-section");
  const imageGalleryContainer = document.getElementById("image-gallery");
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const radarChartCanvas = document.getElementById("radarChart");

  if (!projectSlug) {
    showError("No se especificó un proyecto.");
    return;
  }

  // --- Fetch Data and Find Project ---
  async function loadProjectDetails() {
    try {
      const response = await fetch(`data/projects.json?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const projects = await response.json();
      const project = projects.find((p) => p.slug === projectSlug);

      if (project) {
        renderProject(project); // Renderizar todo el contenido
        setupModalEventListeners(); // Configurar listeners DESPUÉS de renderizar
        loadingMessage.style.display = "none";
        if (heroSection) heroSection.style.display = "grid"; // Mostrar Hero si existe
      } else {
        showError(`Proyecto con slug "${projectSlug}" no encontrado.`);
      }
    } catch (error) {
      console.error("Error loading project details:", error);
      // Mostrar error y ocultar todo el contenido potencialmente visible
      showError("Error al cargar los detalles del proyecto.");
    }
  }

  function showError(message) {
    loadingMessage.style.display = "none";
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    // Ocultar todas las secciones principales al haber un error
    const sectionsToHide = [
      "hero-section",
      "main-evidence-chart",
      "problem-solution-section",
      "innovation-process-section",
      "gallery-section",
    ];
    sectionsToHide.forEach((id) => {
      const section = document.getElementById(id);
      if (section) section.style.display = "none";
    });
    // Ocultar también el aside completo
    const aside = document.querySelector("aside");
    if (aside) aside.style.display = "none";
  }

  // --- Render Project Content ---
  function renderProject(project) {
    document.title = `${project.projectTitle} - Gnius Club`;

    // --- Hero Section ---
    const hero_projectTitle = document.getElementById("project-title");
    const hero_metadataContainer = document.getElementById("project-metadata");
    const hero_introTitle = document.getElementById("intro-title");
    const hero_introContent = document.getElementById("intro-content");
    const hero_coverImage = document.getElementById("cover-image");

    if (hero_projectTitle) {
      hero_projectTitle.textContent = project.projectTitle;
      hero_projectTitle.style.color = "var(--gnius-cyan)";
    }
    if (hero_metadataContainer) {
      hero_metadataContainer.innerHTML = "";
      if (project.projectCategory)
        hero_metadataContainer.innerHTML += `<span class="chip chip-cyan">${project.projectCategory}</span>`;
      if (project.studentLevel)
        hero_metadataContainer.innerHTML += `<span class="chip chip-red">${project.studentLevel}</span>`;
      if (project.projectDate)
        hero_metadataContainer.innerHTML += `<span class="chip chip-gray"><i class="fa-regular fa-calendar-alt mr-1"></i> ${project.projectDate}</span>`;
    }
    if (hero_introTitle) {
      hero_introTitle.textContent = project.intro_title;
      hero_introTitle.style.color = "var(--gnius-yellow)";
    }
    if (hero_introContent)
      hero_introContent.textContent = project.intro_content;
    if (hero_coverImage) {
      hero_coverImage.src = project.coverUrl.url;
      hero_coverImage.alt = project.coverUrl.altText;
    }

    // --- Media Section ---
    const mediaSection = document.getElementById("media-section");
    let mediaRendered = false; // Declarar ANTES del bloque if
    if (mediaSection) {
      mediaSection.innerHTML = ""; // Limpiar
      if (project.media && project.media.type && project.media.url) {
        let titleText = "Evidencia Principal";
        if (project.media.type === "video") titleText += " (Video)";
        if (project.media.type === "image") titleText += " (Imagen)";
        mediaSection.innerHTML += `<h3 class="text-xl font-semibold mb-4 w-full text-center" style="color: var(--gnius-cyan);">${titleText}</h3>`;

        if (
          project.media.type === "video" &&
          project.media.url.includes("youtube.com/embed")
        ) {
          mediaSection.innerHTML += `<div class="youtube-embed w-full mt-2"><iframe src="${project.media.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
          mediaRendered = true; // Asignar dentro del if
        } else if (project.media.type === "image") {
          mediaSection.innerHTML += `<img src="${project.media.url}" alt="${
            project.media.altText || "Evidencia principal del proyecto"
          }" class="w-full h-auto object-contain rounded-lg border border-gray-600 mt-2 max-h-[400px]">`;
          mediaRendered = true; // Asignar dentro del if
        }
      }
      mediaSection.style.display = mediaRendered ? "flex" : "none"; // Usar después del bloque if
    }

    // --- Chart Section ---
    const chartSection = document.getElementById("chart-section");
    let chartRendered = false; // Declarar para saber si se renderizó
    if (chartSection) {
      const chartTitle = chartSection.querySelector("h3");
      if (chartTitle) chartTitle.style.color = "var(--gnius-yellow)";

      if (
        project.evaluationScores &&
        Object.keys(project.evaluationScores).length > 0
      ) {
        renderRadarChart(project.evaluationScores);
        chartSection.style.display = "flex";
        chartRendered = true; // Marcar como renderizado
      } else {
        chartSection.style.display = "none";
      }
    }

    // --- Main Evidence Container Visibility ---
    // Mover esta lógica DESPUÉS de determinar mediaRendered y chartRendered
    const mainEvidenceChartContainer = document.getElementById(
      "main-evidence-chart"
    );
    if (mainEvidenceChartContainer) {
      mainEvidenceChartContainer.style.display =
        mediaRendered || chartRendered ? "grid" : "none";
    }

    // --- Problem / Solution ---
    const problemSection = document.getElementById("problem-solution-section"); // Asumiendo que este ID existe
    if (problemSection) {
      const problemTitle = problemSection.querySelector("div:first-of-type h3");
      const solutionTitle = problemSection.querySelector("div:last-of-type h3");
      const problemDesc = document.getElementById("problem-description");
      const solutionProp = document.getElementById("solution-proposed");

      if (problemTitle) problemTitle.style.color = "var(--gnius-red)";
      if (solutionTitle) solutionTitle.style.color = "var(--gnius-cyan)";
      if (problemDesc) problemDesc.textContent = project.problemDescription;
      if (solutionProp) solutionProp.textContent = project.solutionProposed;
      problemSection.style.display = "grid"; // Mostrar si existe
    }

    // --- Innovation Process ---
    const innovationSection = document.getElementById(
      "innovation-process-section"
    );
    if (innovationSection) {
      const innovationTitle = innovationSection.querySelector("h3");
      const innovationContent = document.getElementById(
        "innovation-process-content"
      );
      if (innovationTitle) innovationTitle.style.color = "var(--gnius-yellow)";

      if (
        project.innovationProcess &&
        project.innovationProcess.trim() !== "" &&
        innovationContent
      ) {
        innovationContent.innerHTML = project.innovationProcess;
        innovationSection.style.display = "block";
      } else {
        innovationSection.style.display = "none";
      }
    }

    // --- Image Gallery ---
    const gallerySection = document.getElementById("gallery-section");
    const imageGalleryOuterContainer = document.getElementById(
      "image-gallery-container"
    ); // Contenedor con padding/borde
    // imageGalleryContainer es el div con id="image-gallery" donde van las imágenes
    if (gallerySection && imageGalleryContainer && imageGalleryOuterContainer) {
      const galleryTitle = gallerySection.querySelector("h3");
      if (galleryTitle) galleryTitle.style.color = "var(--gnius-yellow)";
      imageGalleryContainer.innerHTML = ""; // Limpiar grid interno

      if (project.imageGallery && project.imageGallery.length > 0) {
        project.imageGallery.forEach((img) => {
          const figure = document.createElement("figure");
          figure.className = "gallery-item";
          figure.setAttribute("data-modal-src", img.url);
          figure.setAttribute("data-modal-alt", img.altText);
          figure.setAttribute("data-modal-caption", img.caption || "");
          figure.innerHTML = `<img src="${img.url}" alt="${img.altText}">${
            img.caption ? `<figcaption>${img.caption}</figcaption>` : ""
          }`;
          figure.addEventListener("click", handleImageClick);
          imageGalleryContainer.appendChild(figure);
        });
        gallerySection.style.display = "block"; // Mostrar título
        imageGalleryOuterContainer.style.display = "block"; // Mostrar contenedor con padding
      } else {
        gallerySection.style.display = "none";
        imageGalleryOuterContainer.style.display = "none";
      }
    }

    // --- ASIDE CONTENT ---
    // Team
    const teamSection = document.getElementById("team-section");
    if (teamSection) {
      const teamTitle = teamSection.querySelector("h3");
      const teamList = document.getElementById("team-list");
      if (teamTitle) teamTitle.style.color = "var(--gnius-cyan)";
      if (teamList) {
        teamList.innerHTML = "";
        project.teamMembers.forEach((member, index) => {
          const li = document.createElement("li");
          li.className =
            "team-member-item flex items-center justify-between gap-3";
          const memberInfoDiv = document.createElement("div");
          memberInfoDiv.className = "member-info flex-grow";
          memberInfoDiv.innerHTML = `<span class="member-name block font-semibold text-white">${
            member.name
          }</span><span class="member-role block text-sm text-gray-400">${
            member.role
          }</span>${
            member.sbtLink
              ? `<a href="${member.sbtLink}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 ml-1 text-xs" title="Ver SBT"><i class="fa-solid fa-shield-halved"></i> SBT</a>`
              : ""
          }`;
          const certificateLink = document.createElement("a");
          certificateLink.href = `certificate.html?slug=${project.slug}&member=${index}`;
          certificateLink.className =
            "certificate-link flex-shrink-0 flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 text-xs whitespace-nowrap pl-2 text-center";
          certificateLink.innerHTML = `<i class="fa-solid fa-award text-lg mb-1"></i><span>Ver Certif.</span>`;
          li.appendChild(memberInfoDiv);
          li.appendChild(certificateLink);
          teamList.appendChild(li);
        });
      }
      teamSection.style.display = "block"; // Mostrar sección de equipo
    }

    // Tecnologías
    const techSection = document.getElementById("tech-section");
    if (techSection) {
      const techTitle = techSection.querySelector("h3");
      const techListContainer = document.getElementById("tech-list");
      if (techTitle) techTitle.style.color = "var(--gnius-yellow)";
      if (techListContainer) {
        techListContainer.innerHTML = "";
        project.technologies.forEach((tech) => {
          const outerChip = document.createElement("div");
          outerChip.className = "tech-chip-container";
          let iconColorClass = "tech-icon-Tool",
            innerChipClass = "tech-inner-chip-Tool";
          if (tech.category === "Hardware") {
            iconColorClass = "tech-icon-Hardware";
            innerChipClass = "tech-inner-chip-Hardware";
          } else if (tech.category === "Software") {
            iconColorClass = "tech-icon-Software";
            innerChipClass = "tech-inner-chip-Software";
          }
          const iconPrefix = tech.icon?.startsWith("fa-brands")
            ? "fa-brands"
            : "fa-solid";
          const iconName = tech.icon
            ? tech.icon.replace(/fa-(brands|solid)\s*/, "")
            : "cog";
          outerChip.innerHTML = `<span class="tech-icon ${iconColorClass}"><i class="${iconPrefix} fa-${iconName}"></i></span><span class="tech-name">${tech.name}</span><span class="tech-inner-chip ${innerChipClass}">${tech.category}</span>`;
          techListContainer.appendChild(outerChip);
        });
      }
      techSection.style.display = "block"; // Mostrar sección
    }

    // Recursos Adicionales
    const resourcesSection = document.getElementById("resources-section");
    if (resourcesSection) {
      const resourcesTitle = resourcesSection.querySelector("h3");
      const resourcesList = document.getElementById("resources-list");
      if (resourcesTitle) resourcesTitle.style.color = "var(--gnius-red)";

      if (
        project.additionalResources &&
        project.additionalResources.length > 0 &&
        resourcesList
      ) {
        resourcesList.innerHTML = ""; // Limpiar lista
        project.additionalResources.forEach((resource) => {
          let iconClass = "fa-link";
          switch (resource.type.toLowerCase()) {
            case "github":
              iconClass = "fa-brands fa-github";
              break;
            case "pdf":
              iconClass = "fa-file-pdf";
              break;
            case "doc":
            case "docx":
              iconClass = "fa-file-word";
              break;
            case "website":
              iconClass = "fa-globe";
              break;
          }
          const li = document.createElement("li");
          li.className = "text-sm";
          li.innerHTML = `<a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 hover:underline flex items-center"><i class="fa-solid ${iconClass} w-4 mr-2"></i>${resource.title} <i class="fa-solid fa-external-link-alt text-xs ml-1 opacity-70"></i></a>`;
          resourcesList.appendChild(li);
        });
        resourcesSection.style.display = "block"; // Mostrar sección
      } else {
        resourcesSection.style.display = "none"; // Ocultar si no hay recursos o lista no existe
      }
    }
  } // Fin renderProject

  // --- Helper para convertir HEX a RGBA ---
  function hexToRgba(hex, alpha = 1) {
    /* (sin cambios) */
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    alpha = Math.min(1, Math.max(0, alpha));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // --- Función para renderizar Gráfico RADAR con color dinámico y vibrante ---
  function renderRadarChart(scores) {
    if (!radarChartCanvas) {
      return;
    } // Salir si no hay canvas
    const existingChart = Chart.getChart(radarChartCanvas);
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = radarChartCanvas.getContext("2d");
    const labels = Object.keys(scores).map((label) =>
      label
        .replace("eval_", "")
        .replace(/([A-Z])/g, " $1")
        .trim()
    );
    const data = Object.values(scores);
    const scoreKeys = Object.keys(scores);

    // Encontrar máxima puntuación y su clave
    let maxScore = -1;
    let maxKey = null;
    scoreKeys.forEach((key) => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        maxKey = key;
      }
    });

    const vibrantPalette = [
      /* (sin cambios en la paleta) */ "#FFD700",
      "#00FFFF",
      "#FF00FF",
      "#FF0000",
      "#FFA500",
      "#32CD32",
      "#007BFF",
      "#9400D3",
    ];

    // Selección dinámica de color
    let chartBackgroundColor = hexToRgba(
      vibrantPalette[1 % vibrantPalette.length],
      0.5
    );
    let chartBorderColor = hexToRgba(
      vibrantPalette[1 % vibrantPalette.length],
      1
    );
    if (maxKey) {
      const maxKeyIndex = scoreKeys.indexOf(maxKey);
      if (maxKeyIndex !== -1) {
        const colorIndex = maxKeyIndex % vibrantPalette.length;
        const selectedHex = vibrantPalette[colorIndex];
        chartBackgroundColor = hexToRgba(selectedHex, 0.5);
        chartBorderColor = hexToRgba(selectedHex, 1);
      }
    }

    const gniusColors = {
      gridColor: "rgba(255, 255, 255, 0.2)",
      ticksColor: "#A0A0A0",
      pointLabelColor: "#E0E0E0",
    };

    // Creación del gráfico (sin cambios en la configuración interna)
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Puntuaciones",
            data: data,
            backgroundColor: chartBackgroundColor,
            borderColor: chartBorderColor,
            pointBackgroundColor: chartBorderColor,
            borderWidth: 2,
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: chartBorderColor,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            beginAtZero: true,
            angleLines: { color: gniusColors.gridColor },
            grid: { color: gniusColors.gridColor, circular: true },
            pointLabels: {
              color: gniusColors.pointLabelColor,
              font: { size: 11 },
            },
            ticks: {
              color: gniusColors.ticksColor,
              backdropColor: "rgba(0, 0, 0, 0.3)",
              stepSize: 20,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`,
            },
          },
        },
        elements: { line: {}, point: { radius: 3, hoverRadius: 5 } },
      },
    });
  }

  // --- LÓGICA DEL MODAL DE LA GALERÍA ---
  function handleImageClick(event) {
    /* (sin cambios) */
    const figure = event.currentTarget;
    modalImage.src = figure.getAttribute("data-modal-src");
    modalImage.alt = figure.getAttribute("data-modal-alt");
    modalCaption.textContent = figure.getAttribute("data-modal-caption");
    openModal();
  }
  function openModal() {
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
  function setupModalEventListeners() {
    /* (sin cambios) */
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal?.classList.contains("active")) {
        closeModal();
      }
    });
  }

  // --- Initial Load ---
  loadProjectDetails();

  // --- Footer Year ---
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
}); // Fin DOMContentLoaded
