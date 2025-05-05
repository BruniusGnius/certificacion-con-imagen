// Explicación y Puntos Clave:
// Estructura: Usa un DOMContentLoaded listener para asegurar que el HTML esté listo. Tiene secciones claras para elementos DOM, estado, inicialización, UI, filtros, renderizado, paginación y eventos.
// Carga Asíncrona: Usa async/await con fetch para cargar el JSON.
// Manejo de Errores: Implementa try...catch y funciones showLoading, showError, showNoResults para feedback al usuario.
// Población de Filtros: Lee todas las categorías, niveles y tecnologías únicos del JSON cargado y los añade a los <select>.
// Renderizado: Clona el template HTML (<template>) para cada proyecto, rellena los datos usando data- atributos y textContent/src, y lo añade al contenedor. Crea chips dinámicamente.
// Filtrado: Escucha eventos input y change en los filtros. Cuando cambian, filtra el array allProjects completo según los criterios seleccionados y vuelve a renderizar la página 1 con los filteredProjects.
// Paginación: Calcula cuántas páginas se necesitan, muestra solo los proyectos de la página actual, y actualiza los botones y la información de página.
// Estado: Mantiene variables como allProjects (datos originales), filteredProjects (datos filtrados actuales) y currentPage.
// Robustez: Incluye verificaciones para elementos DOM (if (element)), valida que el JSON sea un array, y tiene un fallback para imágenes.
// Con este archivo, la página principal ya debería cargar los datos, mostrar las tarjetas y permitir filtrar y paginar.

// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const projectListContainer = document.getElementById("project-list");
  const projectCardTemplate = document.getElementById("project-card-template");
  const loadingMessage = document.getElementById("loading-message");
  const noResultsMessage = document.getElementById("no-results-message");
  const paginationControls = document.getElementById("pagination-controls");
  const prevPageBtn = document.getElementById("prev-page-btn");
  const nextPageBtn = document.getElementById("next-page-btn");
  const pageInfo = document.getElementById("page-info");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const levelSelect = document.getElementById("level-select");
  const techSelect = document.getElementById("tech-select");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  const currentYearSpan = document.getElementById("current-year");

  // --- State Variables ---
  let allProjects = [];
  let filteredProjects = [];
  let currentPage = 1;
  const itemsPerPage = 12; // Ajusta cuántas tarjetas mostrar por página

  // --- Initialization ---
  async function init() {
    updateCopyrightYear();
    try {
      showLoading(true);
      const response = await fetch("data/projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allProjects = await response.json();
      filteredProjects = [...allProjects]; // Inicialmente, mostrar todos

      if (!Array.isArray(allProjects)) {
        throw new Error(
          "El archivo JSON no contiene un array de proyectos válido."
        );
      }

      if (allProjects.length > 0) {
        populateFilters();
        setupEventListeners();
        displayPage(currentPage); // Mostrar la primera página
        showNoResults(false);
      } else {
        showNoResults(true, "No hay proyectos para mostrar.");
      }
    } catch (error) {
      console.error("Error al cargar o procesar proyectos:", error);
      showError(
        `No se pudieron cargar los proyectos. ${error.message}. Intenta recargar la página.`
      );
    } finally {
      showLoading(false);
    }
  }

  // --- Data Fetching and Processing ---

  // --- UI Updates ---
  function showLoading(isLoading) {
    if (loadingMessage) {
      loadingMessage.style.display = isLoading ? "block" : "none";
    }
    // Opcional: Deshabilitar filtros mientras carga
    searchInput?.setAttribute("disabled", isLoading);
    categorySelect?.setAttribute("disabled", isLoading);
    levelSelect?.setAttribute("disabled", isLoading);
    techSelect?.setAttribute("disabled", isLoading);
    clearFiltersBtn?.setAttribute("disabled", isLoading);
  }

  function showNoResults(
    show,
    message = "No se encontraron proyectos que coincidan con la búsqueda."
  ) {
    if (noResultsMessage) {
      noResultsMessage.textContent = message;
      noResultsMessage.style.display = show ? "block" : "none";
    }
    if (paginationControls) {
      paginationControls.style.display = show ? "none" : "flex"; // Ocultar paginación si no hay resultados
    }
  }

  function showError(message) {
    if (projectListContainer) {
      // Mostrar error en el área principal
      projectListContainer.innerHTML = `<p class="text-center col-span-full text-gnius-red bg-red-900/30 p-4 rounded">${message}</p>`;
    }
    showNoResults(false); // Ocultar mensaje "no results"
    if (paginationControls) paginationControls.style.display = "none";
  }

  function updateCopyrightYear() {
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  // --- Filter Population ---
  function populateFilters() {
    const categories = new Set();
    const levels = new Set();
    const technologies = new Set();

    allProjects.forEach((project) => {
      if (project.projectCategory)
        categories.add(project.projectCategory.trim());
      if (project.studentLevel) levels.add(project.studentLevel.trim());
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach((tech) => {
          if (tech.name) technologies.add(tech.name.trim());
        });
      }
    });

    populateSelect(categorySelect, categories);
    populateSelect(levelSelect, levels);
    populateSelect(techSelect, technologies);
  }

  function populateSelect(selectElement, itemsSet) {
    if (!selectElement) return;
    const sortedItems = Array.from(itemsSet).sort((a, b) => a.localeCompare(b)); // Ordenar alfabéticamente
    sortedItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    });
  }

  // --- Rendering Project Cards ---
  function renderProjectCard(project) {
    if (!projectCardTemplate) return null;

    const cardClone = projectCardTemplate.content.cloneNode(true);
    const cardElement = cardClone.querySelector("article");
    const link = cardClone.querySelector("[data-card-link]");
    const img = cardClone.querySelector("[data-card-img]");
    const title = cardClone.querySelector("[data-card-title]");
    const metadataContainer = cardClone.querySelector("[data-card-metadata]");
    const desc = cardClone.querySelector("[data-card-desc]");
    const studentsContainer = cardClone.querySelector("[data-card-students]");

    if (link) link.href = `project.html?slug=${project.slug}`;
    if (img) {
      img.src =
        project.coverUrl?.url || "https://picsum.photos/seed/fallback/640/360"; // Fallback image
      img.alt =
        project.coverUrl?.altText ||
        `Portada del proyecto ${project.projectTitle}`;
    }
    if (title) title.textContent = project.projectTitle;
    if (desc) {
      // Simple truncation (consider more robust library if needed)
      const maxLength = 160;
      desc.textContent =
        project.intro_content.length > maxLength
          ? project.intro_content.substring(0, maxLength) + "..."
          : project.intro_content;
    }

    // Add metadata chips (Category & Level)
    if (metadataContainer) {
      metadataContainer.innerHTML = ""; // Clear existing example chips
      if (project.projectCategory) {
        metadataContainer.appendChild(
          createChip(project.projectCategory, "cyan")
        );
      }
      if (project.studentLevel) {
        metadataContainer.appendChild(createChip(project.studentLevel, "red"));
      }
    }

    // Add student chips
    if (
      studentsContainer &&
      project.teamMembers &&
      Array.isArray(project.teamMembers)
    ) {
      studentsContainer.innerHTML = ""; // Clear existing example chips
      project.teamMembers.slice(0, 3).forEach((member) => {
        // Mostrar max 3 estudiantes en card
        studentsContainer.appendChild(createStudentChip(member.name));
      });
      if (project.teamMembers.length > 3) {
        const moreChip = document.createElement("span");
        moreChip.className = "chip chip-gray text-xs";
        moreChip.textContent = `+${project.teamMembers.length - 3} más`;
        studentsContainer.appendChild(moreChip);
      }
    }

    return cardElement;
  }

  function createChip(text, color) {
    const chip = document.createElement("span");
    chip.className = `chip chip-${color} text-xs`;
    chip.textContent = text;
    return chip;
  }

  function createStudentChip(name) {
    const chip = document.createElement("span");
    chip.className = "chip chip-gray text-xs";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-user mr-1";
    chip.appendChild(icon);
    chip.appendChild(document.createTextNode(name));
    return chip;
  }

  // --- Pagination ---
  function displayPage(page) {
    currentPage = page;
    if (!projectListContainer) return;

    projectListContainer.innerHTML = ""; // Limpiar lista actual
    showNoResults(false); // Ocultar mensaje "no results" por defecto

    if (filteredProjects.length === 0) {
      showNoResults(true); // Mostrar si no hay resultados después de filtrar
      return;
    }

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    page = Math.max(1, Math.min(page, totalPages)); // Asegurar que la página esté en rango

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    paginatedProjects.forEach((project) => {
      const card = renderProjectCard(project);
      if (card) {
        projectListContainer.appendChild(card);
      }
    });

    updatePaginationUI(page, totalPages);
  }

  function updatePaginationUI(page, totalPages) {
    if (!paginationControls || totalPages <= 1) {
      if (paginationControls) paginationControls.style.display = "none";
      return;
    }
    paginationControls.style.display = "flex";

    if (pageInfo) {
      pageInfo.textContent = `Página ${page} de ${totalPages}`;
    }
    if (prevPageBtn) {
      prevPageBtn.disabled = page === 1;
    }
    if (nextPageBtn) {
      nextPageBtn.disabled = page === totalPages;
    }
  }

  function goToPrevPage() {
    if (currentPage > 1) {
      displayPage(currentPage - 1);
    }
  }

  function goToNextPage() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    if (currentPage < totalPages) {
      displayPage(currentPage + 1);
    }
  }

  // --- Filtering ---
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;
    const selectedLevel = levelSelect.value;
    const selectedTech = techSelect.value;

    filteredProjects = allProjects.filter((project) => {
      const titleMatch = project.projectTitle
        .toLowerCase()
        .includes(searchTerm);
      const studentMatch = project.teamMembers?.some((member) =>
        member.name.toLowerCase().includes(searchTerm)
      );
      const categoryMatch =
        !selectedCategory || project.projectCategory === selectedCategory;
      const levelMatch =
        !selectedLevel || project.studentLevel === selectedLevel;
      const techMatch =
        !selectedTech ||
        project.technologies?.some((tech) => tech.name === selectedTech);

      return (
        (titleMatch || studentMatch) && categoryMatch && levelMatch && techMatch
      );
    });

    displayPage(1); // Volver a la primera página después de filtrar
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    prevPageBtn?.addEventListener("click", goToPrevPage);
    nextPageBtn?.addEventListener("click", goToNextPage);
    searchInput?.addEventListener("input", applyFilters);
    categorySelect?.addEventListener("change", applyFilters);
    levelSelect?.addEventListener("change", applyFilters);
    techSelect?.addEventListener("change", applyFilters);
    clearFiltersBtn?.addEventListener("click", () => {
      searchInput.value = "";
      categorySelect.value = "";
      levelSelect.value = "";
      techSelect.value = "";
      filteredProjects = [...allProjects];
      displayPage(1);
    });
  }

  // --- Start the application ---
  init();
});
