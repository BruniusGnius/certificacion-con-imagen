// js/project.js - Lógica para project.html

const PROJECTS_JSON_URL = "data/projects.json";
const projectDetailsContainer = document.getElementById("project-details");
const projectNotFoundDiv = document.getElementById("project-not-found");
const currentYearSpan = document.getElementById("current-year");

let projectsData = []; // Para almacenar todos los proyectos temporalmente

/**
 * Obtiene el valor de un parámetro de la URL (query string).
 * @param {string} name - Nombre del parámetro.
 * @returns {string|null} Valor del parámetro o null si no se encuentra.
 */
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Obtiene los datos de TODOS los proyectos.
 * @returns {Promise<Array>} Promesa que resuelve con el array de proyectos.
 */
async function fetchAllData() {
  // Si ya tenemos los datos, no los volvemos a buscar (podría optimizarse más)
  if (projectsData.length > 0) return projectsData;
  try {
    const response = await fetch(PROJECTS_JSON_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    projectsData = await response.json();
    return projectsData;
  } catch (error) {
    console.error("Error fetching projects data:", error);
    displayError("Error al cargar los datos de proyectos.");
    return [];
  }
}

/**
 * Encuentra un proyecto específico por su slug.
 * @param {string} slug - El slug del proyecto a buscar.
 * @param {Array} projects - El array de todos los proyectos.
 * @returns {object|null} El objeto del proyecto encontrado o null.
 */
function findProjectBySlug(slug, projects) {
  if (!slug || !projects) return null;
  return projects.find((project) => project.slug === slug);
}

/**
 * Muestra un mensaje de error en la página.
 * @param {string} message - Mensaje de error a mostrar.
 */
function displayError(message) {
  projectDetailsContainer.innerHTML = ""; // Limpiar contenedor principal
  projectDetailsContainer.classList.add("hidden"); // Ocultar contenedor principal
  projectNotFoundDiv.classList.remove("hidden"); // Mostrar contenedor de error
  const errorParagraph = projectNotFoundDiv.querySelector("p");
  if (errorParagraph) {
    errorParagraph.textContent = message;
  }
  projectDetailsContainer.style.opacity = 1; // Asegurar que la transición no oculte el error
}

/**
 * Renderiza la sección Hero (Título, Resumen, Metadatos, Imagen Portada).
 * @param {object} project - Datos del proyecto.
 * @returns {string} HTML de la sección Hero.
 */
function renderHeroSection(project) {
  const coverUrl =
    project.coverUrl?.url ||
    "https://placehold.co/600x400/2a2a2a/f0f0f0?text=Sin+Imagen";
  const coverAlt =
    project.coverUrl?.altText || "Imagen de portada del proyecto";

  return `
        <section class="mb-10 md:mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="order-2 md:order-1">
                <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gnius-yellow">${
                  project.projectTitle || "Proyecto Sin Título"
                }</h1>
                 ${
                   project.intro_title
                     ? `<p class="text-xl text-gnius-cyan mb-4">${project.intro_title}</p>`
                     : ""
                 }
                 <p class="text-gnius-gray mb-5">${
                   project.intro_content || "Introducción no disponible."
                 }</p>
                <div>
                    ${
                      project.projectCategory
                        ? `<span class="gnius-chip">${project.projectCategory}</span>`
                        : ""
                    }
                    ${
                      project.studentLevel
                        ? `<span class="gnius-chip">${project.studentLevel}</span>`
                        : ""
                    }
                    ${
                      project.projectDate
                        ? `<span class="gnius-chip"><i class="far fa-calendar-alt mr-1"></i> ${formatDate(
                            project.projectDate
                          )}</span>`
                        : ""
                    }
                </div>
            </div>
            <div class="order-1 md:order-2">
                <img src="${coverUrl}" alt="${coverAlt}" class="rounded-lg shadow-lg w-full h-auto max-h-[400px] object-cover">
            </div>
        </section>
    `;
}

/**
 * Renderiza la sección Principal (Evidencia Media y Gráfico de Evaluación).
 * @param {object} project - Datos del proyecto.
 * @returns {string} HTML de la sección Principal. O string vacío si no hay ni media ni scores.
 */
function renderMainContentSection(project) {
  const hasMedia = project.media && project.media.type && project.media.url;
  const hasScores =
    project.evaluationScores &&
    Object.keys(project.evaluationScores).length > 0;

  if (!hasMedia && !hasScores) return ""; // No renderizar la sección si no hay contenido

  let mediaHTML = "";
  if (hasMedia) {
    const { type, url, altText } = project.media;
    const alt = altText || "Evidencia principal del proyecto";
    if (type === "video") {
      // Intentar detectar YouTube/Vimeo para embed, si no, usar etiqueta video
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        // Extraer ID de YouTube (simplificado)
        const videoId =
          url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
        mediaHTML = `<div class="aspect-w-16 aspect-h-9">
                                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-lg shadow-md"></iframe>
                              </div>`;
      } else {
        // Asumir video directo o de otra plataforma
        mediaHTML = `<video controls class="rounded-lg shadow-md w-full">
                                <source src="${url}" type="video/mp4"> <!-- Asumir mp4, podría necesitar más tipos -->
                                Tu navegador no soporta la etiqueta de video.
                              </video>`;
      }
    } else if (type === "image") {
      mediaHTML = `<img src="${url}" alt="${alt}" class="rounded-lg shadow-md w-full h-auto object-contain max-h-[400px]">`;
    }
  }

  const scoresHTML = hasScores
    ? `
        <div class="h-[350px] md:h-[400px] flex justify-center items-center p-4">
             <canvas id="evaluationChart"></canvas>
         </div>
    `
    : "";

  // Ajustar grid layout basado en si ambos elementos existen
  const gridCols = hasMedia && hasScores ? "md:grid-cols-2" : "md:grid-cols-1";

  return `
        <section class="mb-10 md:mb-12 grid grid-cols-1 ${gridCols} gap-8 items-center">
            ${
              hasMedia
                ? `<div><h2 class="section-title mb-4">Evidencia Principal</h2>${mediaHTML}</div>`
                : ""
            }
            ${
              hasScores
                ? `<div><h2 class="section-title mb-4">Evaluación del Proyecto</h2>${scoresHTML}</div>`
                : ""
            }
        </section>
    `;
}

/**
 * Renderiza la sección Problema/Solución.
 * @param {object} project - Datos del proyecto.
 * @returns {string} HTML de la sección.
 */
function renderProblemSolutionSection(project) {
  // Requeridos según prompt, así que no necesitan check de existencia
  return `
        <section class="mb-10 md:mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 class="section-title">Problema Identificado</h2>
                <p class="text-gnius-gray leading-relaxed">${
                  project.problemDescription || "No descrito."
                }</p>
            </div>
            <div>
                <h2 class="section-title">Solución Propuesta</h2>
                <p class="text-gnius-gray leading-relaxed">${
                  project.solutionProposed || "No descrita."
                }</p>
            </div>
        </section>
    `;
}

/**
 * Renderiza la sección Proceso de Innovación (si existe).
 * @param {object} project - Datos del proyecto.
 * @returns {string} HTML de la sección o string vacío.
 */
function renderInnovationProcessSection(project) {
  if (!project.innovationProcess) return "";
  // Permitir HTML básico en este campo (¡sanitizar si viniera de input directo!)
  // Como viene de un JSON controlado, asumimos que es seguro por ahora.
  return `
        <section class="mb-10 md:mb-12">
            <h2 class="section-title">Proceso de Innovación</h2>
            <div class="text-gnius-gray leading-relaxed prose dark:prose-invert max-w-none">
                ${project.innovationProcess.replace(/\n/g, "<br>")}
            </div>
        </section>
    `;
}

/**
 * Renderiza la Galería de Evidencias (si existe).
 * @param {object} project - Datos del proyecto.
 * @returns {string} HTML de la sección o string vacío.
 */
function renderImageGallerySection(project) {
  if (!project.imageGallery || project.imageGallery.length === 0) return "";

  const imagesHTML = project.imageGallery
    .map(
      (img) => `
        <div class="bg-gnius-dark-secondary p-2 rounded-lg shadow-md">
            <img src="${
              img.url ||
              "https://placehold.co/350x200/2a2a2a/f0f0f0?text=Sin+Imagen"
            }"
                 alt="${img.altText || "Imagen de galería"}"
                 class="w-full h-40 object-cover rounded-md mb-2">
             ${
               img.caption
                 ? `<p class="text-xs text-center text-gnius-gray">${img.caption}</p>`
                 : ""
             }
        </div>
    `
    )
    .join("");

  return `
        <section class="mb-10 md:mb-12">
            <h2 class="section-title">Galería de Evidencias</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                ${imagesHTML}
            </div>
        </section>
    `;
}

/**
 * Renderiza la barra lateral (Aside) con Equipo, Tecnologías y Recursos.
 * @param {object} project - Datos del proyecto.
 * @returns {string} HTML del aside.
 */
function renderAsideSection(project) {
  const hasTeam = project.teamMembers && project.teamMembers.length > 0;
  const hasTech = project.technologies && project.technologies.length > 0;
  const hasResources =
    project.additionalResources && project.additionalResources.length > 0;

  if (!hasTeam && !hasTech && !hasResources) return ""; // No renderizar si está vacío

  // --- Team Members ---
  let teamHTML = "";
  if (hasTeam) {
    const membersList = project.teamMembers
      .map((member, index) => {
        const certificateLink = `certificate.html?slug=${project.slug}&member=${index}`;
        // Añadir enlace a certificado siempre
        let memberItem = `<li class="mb-3">
                                <p class="font-semibold text-gnius-light">${
                                  member.name || "Miembro Desconocido"
                                }</p>
                                <p class="text-sm text-gnius-gray mb-1">${
                                  member.role || "Rol no especificado"
                                }</p>`;
        // Enlace al certificado
        memberItem += `<a href="${certificateLink}" class="text-xs text-gnius-cyan hover:text-gnius-yellow mr-2" title="Ver Certificado">
                               <i class="fas fa-certificate mr-1"></i>Ver Certificado
                           </a>`;
        // Enlace al SBT (opcional)
        if (member.sbtLink) {
          memberItem += `<a href="${member.sbtLink}" target="_blank" rel="noopener noreferrer" class="text-xs text-gnius-cyan hover:text-gnius-yellow" title="Ver SBT">
                                    <i class="fas fa-external-link-alt mr-1"></i>SBT
                                </a>`;
        }
        memberItem += `</li>`;
        return memberItem;
      })
      .join("");
    teamHTML = `
            <div class="aside-section">
                <h3 class="aside-title"><i class="fas fa-users mr-2"></i>Equipo Desarrollador</h3>
                <ul class="list-none p-0">${membersList}</ul>
            </div>`;
  }

  // --- Technologies ---
  let techHTML = "";
  if (hasTech) {
    const techList = project.technologies
      .map((tech) => {
        const icon = tech.icon || "cog"; // Icono por defecto
        const category = tech.category || "default";
        const chipColorClass = `tech-chip-${category}` || "tech-chip-default"; // Clase CSS para color
        return `<li class="mb-2">
                       <span class="gnius-chip ${chipColorClass} text-sm">
                           <i class="fa-solid fa-${icon} mr-2"></i>${
          tech.name || "Tecnología Desconocida"
        }
                       </span>
                       <span class="text-xs text-gnius-gray ml-1">(${
                         tech.category || "General"
                       })</span>
                    </li>`;
      })
      .join("");
    techHTML = `
            <div class="aside-section">
                <h3 class="aside-title"><i class="fas fa-cogs mr-2"></i>Tecnologías Clave</h3>
                <ul class="list-none p-0">${techList}</ul>
            </div>`;
  }

  // --- Additional Resources ---
  let resourcesHTML = "";
  if (hasResources) {
    const resourceList = project.additionalResources
      .map((res) => {
        let iconClass = "fa-link"; // Icono por defecto
        if (res.type === "github") iconClass = "fa-github";
        else if (res.type === "pdf") iconClass = "fa-file-pdf";
        else if (res.type === "doc") iconClass = "fa-file-word";

        return `<li class="icon-list">
                       <i class="fa-solid ${iconClass}"></i>
                       <a href="${
                         res.url || "#"
                       }" target="_blank" rel="noopener noreferrer" class="gnius-link">${
          res.title || "Recurso sin título"
        }</a>
                     </li>`;
      })
      .join("");
    resourcesHTML = `
            <div class="aside-section">
                <h3 class="aside-title"><i class="fas fa-folder-open mr-2"></i>Recursos Adicionales</h3>
                <ul class="list-none p-0">${resourceList}</ul>
            </div>`;
  }

  return `
        <aside>
            ${teamHTML}
            ${techHTML}
            ${resourcesHTML}
        </aside>
    `;
}

/**
 * Renderiza el gráfico Polar Area usando Chart.js.
 * @param {object} scores - Objeto con los puntajes { 'Metrica': valor }.
 */
function renderEvaluationChart(scores) {
  const chartCanvas = document.getElementById("evaluationChart");
  if (!chartCanvas || !scores || Object.keys(scores).length === 0) return;

  const ctx = chartCanvas.getContext("2d");
  const labels = Object.keys(scores);
  const data = Object.values(scores);

  // Colores base Gnius, con transparencia
  const backgroundColors = [
    "rgba(255, 204, 0, 0.6)", // yellow
    "rgba(0, 255, 255, 0.6)", // cyan
    "rgba(255, 77, 77, 0.6)", // red
    "rgba(160, 160, 160, 0.6)", // gray
    "rgba(255, 159, 64, 0.6)", // orange (example)
    "rgba(75, 192, 192, 0.6)", // teal (example)
  ];
  const borderColors = [
    "rgb(255, 204, 0)",
    "rgb(0, 255, 255)",
    "rgb(255, 77, 77)",
    "rgb(160, 160, 160)",
    "rgb(255, 159, 64)",
    "rgb(75, 192, 192)",
  ];

  // Asegurar suficientes colores si hay muchas métricas
  while (backgroundColors.length < data.length) {
    backgroundColors.push(
      `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.6)`
    );
    borderColors.push(
      `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`
    );
  }

  new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Puntuación Evaluación",
          data: data,
          backgroundColor: backgroundColors.slice(0, data.length),
          borderColor: borderColors.slice(0, data.length),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permitir que el contenedor controle el tamaño
      scales: {
        r: {
          // Escala radial (valor)
          suggestedMin: 0,
          suggestedMax: 100,
          grid: { color: "rgba(160, 160, 160, 0.3)" }, // Color rejilla
          angleLines: { color: "rgba(160, 160, 160, 0.3)" }, // Color lineas angulares
          pointLabels: {
            // Etiquetas de las métricas
            color: "#f0f0f0", // gnius-light
            font: { size: 12 },
          },
          ticks: {
            // Marcas numéricas en la escala
            color: "#a0a0a0", // gnius-gray
            backdropColor: "rgba(42, 42, 42, 0.7)", // gnius-dark-secondary con transparencia
            stepSize: 20,
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: { color: "#f0f0f0" }, // gnius-light
        },
        tooltip: {
          backgroundColor: "rgba(26, 26, 26, 0.9)", // gnius-dark
          titleColor: "#ffcc00", // gnius-yellow
          bodyColor: "#f0f0f0", // gnius-light
        },
      },
    },
  });
}

/**
 * Formatea una fecha YYYY-MM-DD a un formato más legible.
 * @param {string} dateString - Fecha en formato YYYY-MM-DD.
 * @returns {string} Fecha formateada (ej. "26 de Octubre, 2024").
 */
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString + "T00:00:00"); // Añadir tiempo para evitar problemas de zona horaria
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.warn("Error formatting date:", dateString, e);
    return dateString; // Devolver original si falla
  }
}

/**
 * Inicializa la página de detalle del proyecto.
 */
async function initializeProjectPage() {
  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const slug = getQueryParam("slug");
  if (!slug) {
    displayError("No se especificó ningún proyecto (falta 'slug' en la URL).");
    return;
  }

  const projects = await fetchAllData();
  if (projects.length === 0) {
    // El error ya se mostró en fetchAllData si falló la carga
    return;
  }

  const project = findProjectBySlug(slug, projects);

  if (project) {
    // Renderizar secciones principales
    const heroHTML = renderHeroSection(project);
    const mainContentHTML = renderMainContentSection(project);
    const problemSolutionHTML = renderProblemSolutionSection(project);
    const innovationProcessHTML = renderInnovationProcessSection(project); // Puede ser vacío
    const galleryHTML = renderImageGallerySection(project); // Puede ser vacío

    // Renderizar aside
    const asideHTML = renderAsideSection(project); // Puede ser vacío

    // Combinar todo en la estructura grid/flex principal
    projectDetailsContainer.innerHTML = `
            ${heroHTML}
            ${mainContentHTML}

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div class="lg:col-span-2">
                    ${problemSolutionHTML}
                    ${innovationProcessHTML}
                    ${galleryHTML}
                 </div>
                 <div class="lg:col-span-1">
                    ${asideHTML}
                 </div>
            </div>
        `;

    // Renderizar el gráfico después de que el canvas esté en el DOM
    if (
      project.evaluationScores &&
      Object.keys(project.evaluationScores).length > 0
    ) {
      renderEvaluationChart(project.evaluationScores);
    }

    // Mostrar el contenido con fade-in
    projectDetailsContainer.classList.remove("opacity-0");
  } else {
    displayError(`El proyecto con slug "${slug}" no fue encontrado.`);
  }
}

document.addEventListener("DOMContentLoaded", initializeProjectPage);
