// js/main.js - Lógica para index.html

const PROJECTS_JSON_URL = "data/projects.json";
const projectListContainer = document.getElementById("project-list");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const levelSelect = document.getElementById("level-select");
const techSelect = document.getElementById("tech-select");
const clearFiltersBtn = document.getElementById("clear-filters-btn");
const noResultsDiv = document.getElementById("no-results");
const paginationContainer = document.getElementById("pagination");
const currentYearSpan = document.getElementById("current-year");

const ITEMS_PER_PAGE = 9; // Número de proyectos por página
let allProjects = []; // Almacena todos los proyectos cargados
let currentPage = 1;

/**
 * Obtiene los datos de los proyectos desde el archivo JSON.
 * @returns {Promise<Array>} Promesa que resuelve con el array de proyectos.
 */
async function fetchData() {
  try {
    const response = await fetch(PROJECTS_JSON_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching projects data:", error);
    projectListContainer.innerHTML = `<p class="text-red-500 col-span-full text-center">Error al cargar los proyectos. Intenta recargar la página.</p>`;
    return []; // Devuelve array vacío en caso de error
  }
}

/**
 * Genera el HTML para una tarjeta de proyecto.
 * @param {object} project - El objeto del proyecto.
 * @returns {string} HTML de la tarjeta del proyecto.
 */
function createProjectCardHTML(project) {
  // Asegurarse de que los campos requeridos existen
  const title = project.projectTitle || "Proyecto sin título";
  const intro = project.intro_content || "Descripción no disponible.";
  const imageUrl =
    project.coverUrl?.url ||
    "https://placehold.co/600x400/2a2a2a/f0f0f0?text=Sin+Imagen";
  const imageAlt = project.coverUrl?.altText || "Imagen del proyecto";
  const slug = project.slug || "#"; // Enlace seguro si falta slug

  // Limitar longitud de introducción
  const shortIntro =
    intro.length > 100 ? intro.substring(0, 100) + "..." : intro;

  return `
        <div class="gnius-card flex flex-col">
            <img class="w-full h-48 object-cover" src="${imageUrl}" alt="${imageAlt}">
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-xl font-bold tracking-tight text-gnius-light mb-2">${title}</h3>
                <div class="mb-3">
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
                </div>
                <p class="mb-4 font-normal text-gnius-gray flex-grow">${shortIntro}</p>
                <a href="project.html?slug=${slug}" class="gnius-button inline-flex items-center justify-center text-center">
                    Ver detalles
                    <i class="fas fa-arrow-right ml-2"></i>
                </a>
            </div>
        </div>
    `;
}

/**
 * Renderiza la lista de proyectos en el contenedor especificado.
 * @param {Array} projectsToRender - Array de proyectos a mostrar.
 */
function renderProjects(projectsToRender) {
  if (!projectListContainer) return;

  // Calcular paginación
  const totalPages = Math.ceil(projectsToRender.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProjects = projectsToRender.slice(startIndex, endIndex);

  if (paginatedProjects.length === 0) {
    projectListContainer.innerHTML = ""; // Limpiar si no hay resultados en esta página (podría ser por filtros)
    noResultsDiv.classList.remove("hidden");
  } else {
    projectListContainer.innerHTML = paginatedProjects
      .map(createProjectCardHTML)
      .join("");
    noResultsDiv.classList.add("hidden");
  }

  renderPagination(totalPages, projectsToRender.length);
}

/**
 * Renderiza los controles de paginación.
 * @param {number} totalPages - Número total de páginas.
 * @param {number} totalItems - Número total de items filtrados.
 */
function renderPagination(totalPages, totalItems) {
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    paginationContainer.classList.add("hidden");
    return;
  }

  paginationContainer.classList.remove("hidden");
  paginationContainer.innerHTML = ""; // Limpiar paginación anterior

  // Botón Anterior
  const prevButton = document.createElement("button");
  prevButton.innerHTML = `<i class="fas fa-chevron-left"></i>`;
  prevButton.className = `px-3 py-1 rounded ${
    currentPage === 1
      ? "text-gray-600 cursor-not-allowed"
      : "text-gnius-cyan hover:bg-gnius-dark-secondary"
  }`;
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Números de Página (simplificado para no mostrar todos si son muchos)
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    paginationContainer.appendChild(createPageButton(1));
    if (startPage > 2) paginationContainer.appendChild(createPageEllipsis());
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.appendChild(createPageButton(i));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1)
      paginationContainer.appendChild(createPageEllipsis());
    paginationContainer.appendChild(createPageButton(totalPages));
  }

  // Botón Siguiente
  const nextButton = document.createElement("button");
  nextButton.innerHTML = `<i class="fas fa-chevron-right"></i>`;
  nextButton.className = `px-3 py-1 rounded ${
    currentPage === totalPages
      ? "text-gray-600 cursor-not-allowed"
      : "text-gnius-cyan hover:bg-gnius-dark-secondary"
  }`;
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
    }
  });
  paginationContainer.appendChild(nextButton);
}

/** Crea un botón numérico para la paginación */
function createPageButton(pageNumber) {
  const pageButton = document.createElement("button");
  pageButton.textContent = pageNumber;
  pageButton.className = `px-3 py-1 rounded ${
    pageNumber === currentPage
      ? "bg-gnius-cyan text-gnius-dark font-bold"
      : "text-gnius-light hover:bg-gnius-dark-secondary"
  }`;
  pageButton.addEventListener("click", () => {
    currentPage = pageNumber;
    applyFilters();
  });
  return pageButton;
}

/** Crea el elemento '...' para la paginación */
function createPageEllipsis() {
  const ellipsis = document.createElement("span");
  ellipsis.textContent = "...";
  ellipsis.className = "px-3 py-1 text-gnius-gray";
  return ellipsis;
}

/**
 * Popula los dropdowns de filtros con opciones únicas basadas en los datos.
 * @param {Array} projects - Array de todos los proyectos.
 */
function populateFilters(projects) {
  if (!categorySelect || !levelSelect || !techSelect) return;

  const categories = new Set();
  const levels = new Set();
  const techs = new Set();

  projects.forEach((project) => {
    if (project.projectCategory) categories.add(project.projectCategory);
    if (project.studentLevel) levels.add(project.studentLevel);
    if (project.technologies && Array.isArray(project.technologies)) {
      project.technologies.forEach((tech) => {
        if (tech.name) techs.add(tech.name);
      });
    }
  });

  const populateSelect = (selectElement, options) => {
    // Guardar la opción "Todos/as"
    const firstOption = selectElement.options[0];
    selectElement.innerHTML = ""; // Limpiar opciones existentes
    selectElement.appendChild(firstOption); // Re-agregar "Todos/as"
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      selectElement.appendChild(opt);
    });
  };

  populateSelect(categorySelect, [...categories].sort());
  populateSelect(levelSelect, [...levels].sort());
  populateSelect(techSelect, [...techs].sort());
}

/**
 * Aplica los filtros seleccionados y renderiza los proyectos.
 */
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categorySelect.value;
  const selectedLevel = levelSelect.value;
  const selectedTech = techSelect.value;

  const filteredProjects = allProjects.filter((project) => {
    const titleMatch = project.projectTitle?.toLowerCase().includes(searchTerm);
    const memberMatch = project.teamMembers?.some((member) =>
      member.name?.toLowerCase().includes(searchTerm)
    );
    const categoryMatch =
      !selectedCategory || project.projectCategory === selectedCategory;
    const levelMatch = !selectedLevel || project.studentLevel === selectedLevel;
    const techMatch =
      !selectedTech ||
      project.technologies?.some((tech) => tech.name === selectedTech);

    return (
      (titleMatch || memberMatch) && categoryMatch && levelMatch && techMatch
    );
  });

  // Resetear a página 1 si los filtros cambian significativamente (excepto si es navegación de paginación)
  // No reseteamos aquí directamente, el cambio de página maneja su estado.
  // Si la página actual queda vacía tras filtrar, la lógica de renderizado lo mostrará.
  // Sin embargo, si la página actual > totalPages filtradas, debemos ajustar.
  const totalFilteredPages = Math.ceil(
    filteredProjects.length / ITEMS_PER_PAGE
  );
  if (currentPage > totalFilteredPages && totalFilteredPages > 0) {
    currentPage = totalFilteredPages;
  } else if (totalFilteredPages === 0) {
    currentPage = 1; // Si no hay resultados, volver a la página 1 conceptualmente
  }

  renderProjects(filteredProjects);
}

/**
 * Limpia todos los filtros y vuelve a renderizar.
 */
function clearFilters() {
  searchInput.value = "";
  categorySelect.value = "";
  levelSelect.value = "";
  techSelect.value = "";
  currentPage = 1; // Volver a la primera página
  applyFilters();
}

/**
 * Inicializa la página: carga datos, popula filtros y renderiza proyectos iniciales.
 */
async function initializePage() {
  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  allProjects = await fetchData();
  if (allProjects.length > 0) {
    populateFilters(allProjects);
    renderProjects(allProjects); // Render inicial

    // Añadir event listeners a los filtros
    searchInput.addEventListener("input", () => {
      currentPage = 1;
      applyFilters();
    });
    categorySelect.addEventListener("change", () => {
      currentPage = 1;
      applyFilters();
    });
    levelSelect.addEventListener("change", () => {
      currentPage = 1;
      applyFilters();
    });
    techSelect.addEventListener("change", () => {
      currentPage = 1;
      applyFilters();
    });
    clearFiltersBtn.addEventListener("click", clearFilters);
  } else {
    // Mostrar mensaje si no se cargaron proyectos incluso sin filtros
    noResultsDiv.classList.remove("hidden");
    noResultsDiv.innerHTML = `
             <i class="fas fa-folder-open fa-3x text-gnius-gray mb-4"></i>
             <p class="text-gnius-gray text-lg">Aún no hay proyectos para mostrar.</p>
         `;
    projectListContainer.innerHTML = ""; // Asegurarse que el spinner se quite
  }
}

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initializePage);
