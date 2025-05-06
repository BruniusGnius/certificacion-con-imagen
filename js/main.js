// js/main.js - v3 Corregido (ReferenceError)

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
  const itemsPerPage = 12;
  let hadLoadingError = false; // Track if a loading error occurred

  // --- Helper Functions ---
  const setFiltersDisabled = (disabled) => {
    if (searchInput) searchInput.disabled = disabled;
    if (categorySelect) categorySelect.disabled = disabled;
    if (levelSelect) levelSelect.disabled = disabled;
    if (techSelect) techSelect.disabled = disabled;
    if (clearFiltersBtn) clearFiltersBtn.disabled = disabled;
  };

  // --- Initialization ---
  async function init() {
    updateCopyrightYear();
    hadLoadingError = false; // Reset error flag
    try {
      showLoading(true);
      setFiltersDisabled(true);
      const response = await fetch("data/projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allProjects = await response.json();
      filteredProjects = [...allProjects];

      if (!Array.isArray(allProjects)) {
        throw new Error(
          "El archivo JSON no contiene un array de proyectos válido."
        );
      }

      if (allProjects.length > 0) {
        populateFilters();
        setupEventListeners();
        displayPage(currentPage);
        showNoResults(false);
        // Filters will be enabled in 'finally' if no error
      } else {
        showNoResults(true, "No hay proyectos para mostrar.");
        // Keep filters disabled if no projects initially
      }
    } catch (error) {
      hadLoadingError = true; // Set error flag
      console.error("Error al cargar o procesar proyectos:", error);
      showError(
        `No se pudieron cargar los proyectos. ${error.message}. Intenta recargar la página.`
      );
      setFiltersDisabled(true); // Keep filters disabled on error
    } finally {
      showLoading(false);
      // --- CORRECCIÓN AQUÍ ---
      // Habilitar filtros solo si NO hubo error Y hay proyectos cargados.
      if (!hadLoadingError && allProjects.length > 0) {
        setFiltersDisabled(false);
      }
      // --- FIN CORRECCIÓN ---
    }
  }

  // --- UI Updates ---
  function showLoading(isLoading) {
    if (loadingMessage) {
      loadingMessage.style.display = isLoading ? "block" : "none";
    }
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
      paginationControls.style.display = show ? "none" : "flex";
    }
  }

  function showError(message) {
    if (projectListContainer) {
      // Limpiar antes de mostrar error
      projectListContainer.innerHTML = `<p class="text-center col-span-full text-gnius-red bg-red-900/30 p-4 rounded">${message}</p>`;
    }
    showNoResults(false); // Ocultar "no results"
    if (paginationControls) paginationControls.style.display = "none"; // Ocultar paginación
    // No hay un `errorMessageContainer` global en index.html
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

    populateSelect(categorySelect, categories, "Todas las Categorías");
    populateSelect(levelSelect, levels, "Todos los Niveles");
    populateSelect(techSelect, technologies, "Todas las Tecnologías");
  }

  function populateSelect(selectElement, itemsSet, defaultOptionText) {
    if (!selectElement) return;
    const firstOption = selectElement.options[0];
    selectElement.innerHTML = "";
    if (firstOption) {
      firstOption.textContent = defaultOptionText;
      selectElement.appendChild(firstOption);
    }

    const sortedItems = Array.from(itemsSet).sort((a, b) => a.localeCompare(b));
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
        project.coverUrl?.url || "assets/img/gnius_logo_placeholder.png";
      img.alt =
        project.coverUrl?.altText ||
        `Portada del proyecto ${project.projectTitle}`;
    }
    if (title) title.textContent = project.projectTitle;
    if (desc) {
      const maxLength = 150;
      desc.textContent =
        project.intro_content.length > maxLength
          ? project.intro_content.substring(0, maxLength).trim() + "..."
          : project.intro_content;
    }

    // Add metadata chips
    if (metadataContainer) {
      metadataContainer.innerHTML = "";
      if (project.projectCategory) {
        metadataContainer.appendChild(
          createChip(project.projectCategory, "chip-cyan")
        );
      }
      if (project.studentLevel) {
        metadataContainer.appendChild(
          createChip(project.studentLevel, "chip-red")
        );
      }
    }

    // Add student chips
    if (
      studentsContainer &&
      project.teamMembers &&
      Array.isArray(project.teamMembers)
    ) {
      studentsContainer.innerHTML = "";
      project.teamMembers.slice(0, 3).forEach((member) => {
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

  function createChip(text, colorClass) {
    const chip = document.createElement("span");
    chip.className = `chip ${colorClass}`;
    chip.textContent = text;
    return chip;
  }

  function createStudentChip(name) {
    const chip = document.createElement("span");
    chip.className = "chip chip-gray student-chip"; // Incluye .student-chip
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-user";
    chip.appendChild(icon);
    chip.appendChild(document.createTextNode(name));
    return chip;
  }

  // --- Pagination ---
  function displayPage(page) {
    currentPage = page;
    if (!projectListContainer) return;

    projectListContainer.innerHTML = "";
    showNoResults(false);

    if (filteredProjects.length === 0) {
      showNoResults(true);
      updatePaginationUI(0, 0);
      return;
    }

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    page = Math.max(1, Math.min(page, totalPages));

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    projectListContainer.innerHTML = "";
    if (paginatedProjects.length > 0) {
      paginatedProjects.forEach((project) => {
        const card = renderProjectCard(project);
        if (card) {
          projectListContainer.appendChild(card);
        }
      });
    } else if (page > 1) {
      showNoResults(true, "No hay más proyectos en esta página.");
    }

    updatePaginationUI(page, totalPages);
  }

  function updatePaginationUI(page, totalPages) {
    if (!paginationControls || totalPages <= 0) {
      if (paginationControls) paginationControls.style.display = "none";
      return;
    }
    if (totalPages === 1) {
      paginationControls.style.display = "none";
      return;
    }
    paginationControls.style.display = "flex";
    if (pageInfo) pageInfo.textContent = `Página ${page} de ${totalPages}`;
    if (prevPageBtn) prevPageBtn.disabled = page === 1;
    if (nextPageBtn) nextPageBtn.disabled = page === totalPages;
  }

  function goToPrevPage() {
    if (currentPage > 1) displayPage(currentPage - 1);
  }

  function goToNextPage() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    if (currentPage < totalPages) displayPage(currentPage + 1);
  }

  // --- Filtering ---
  function applyFilters() {
    // Pequeño debounce para no filtrar en cada tecla si escribe rápido
    // clearTimeout(filterTimeout);
    // filterTimeout = setTimeout(() => { // Necesitaría declarar filterTimeout fuera
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;
    const selectedLevel = levelSelect.value;
    const selectedTech = techSelect.value;

    filteredProjects = allProjects.filter((project) => {
      const pTitle = project.projectTitle?.toLowerCase() || "";
      const pCategory = project.projectCategory || "";
      const pLevel = project.studentLevel || "";
      const studentsText =
        project.teamMembers?.map((m) => m.name.toLowerCase()).join(" ") || "";
      const techNames = project.technologies?.map((t) => t.name) || [];

      const textMatch =
        searchTerm === "" ||
        pTitle.includes(searchTerm) ||
        studentsText.includes(searchTerm);
      const categoryMatch = !selectedCategory || pCategory === selectedCategory;
      const levelMatch = !selectedLevel || pLevel === selectedLevel;
      const techMatch = !selectedTech || techNames.includes(selectedTech);

      return textMatch && categoryMatch && levelMatch && techMatch;
    });

    displayPage(1);
    // }, 250); // Espera 250ms después de dejar de escribir
  }
  // let filterTimeout; // Declarar fuera para el debounce (opcional)

  // --- Event Listeners ---
  function setupEventListeners() {
    prevPageBtn?.addEventListener("click", goToPrevPage);
    nextPageBtn?.addEventListener("click", goToNextPage);
    searchInput?.addEventListener("input", applyFilters); // 'input' para tiempo real
    categorySelect?.addEventListener("change", applyFilters);
    levelSelect?.addEventListener("change", applyFilters);
    techSelect?.addEventListener("change", applyFilters);
    clearFiltersBtn?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categorySelect) categorySelect.value = "";
      if (levelSelect) levelSelect.value = "";
      if (techSelect) techSelect.value = "";
      applyFilters();
    });
  }

  // --- Start the application ---
  init();
});
