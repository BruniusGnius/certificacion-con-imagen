document.addEventListener("DOMContentLoaded", () => {
  // Selectores de elementos del DOM
  const projectList = document.getElementById("project-list");
  const loadingMessage = document.getElementById("loading-message");
  const noResultsMessage = document.getElementById("no-results-message");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const levelFilter = document.getElementById("level-filter");
  const techFilter = document.getElementById("tech-filter");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  const paginationControls = document.getElementById("pagination");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");
  // Selector para el template de la tarjeta
  const cardTemplate = document.getElementById("project-card-template");

  // Estado y configuración
  let allProjects = [];
  let filteredProjects = [];
  const projectsPerPage = 9;
  let currentPage = 1;
  const descriptionLength = 160;

  // --- Fetch Data ---
  async function loadProjects() {
    try {
      const response = await fetch(`data/projects.json?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allProjects = await response.json();
      filteredProjects = [...allProjects];
      populateFilters();
      displayProjects();
      loadingMessage.style.display = "none";
    } catch (error) {
      console.error("Error loading projects:", error);
      loadingMessage.textContent = "Error al cargar los proyectos.";
      projectList.innerHTML =
        '<p class="text-red-500 text-center col-span-full">No se pudieron cargar los datos.</p>';
    }
  }

  // --- Populate Filter Dropdowns ---
  function populateFilters() {
    const categories = new Set();
    const levels = new Set();
    const techs = new Set();

    allProjects.forEach((project) => {
      if (project.projectCategory) categories.add(project.projectCategory);
      if (project.studentLevel) levels.add(project.studentLevel);
      project.technologies.forEach((tech) => techs.add(tech.name));
    });

    populateSelect(categoryFilter, categories);
    populateSelect(levelFilter, levels);
    populateSelect(techFilter, techs);
  }

  function populateSelect(selectElement, items) {
    const firstOptionValue = selectElement.options[0]?.value || "";
    const defaultOptionText =
      selectElement.options[0]?.textContent || "Seleccionar...";
    selectElement.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = firstOptionValue;
    defaultOption.textContent = defaultOptionText;
    selectElement.appendChild(defaultOption);

    const sortedItems = Array.from(items).sort((a, b) => a.localeCompare(b));
    sortedItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    });
  }

  // --- Render Project Cards using Template ---
  function renderProjectCard(project) {
    if (!cardTemplate) {
      console.error("Error: Template #project-card-template not found!");
      return null; // No se puede crear la tarjeta
    }

    // Clonar el contenido del template
    const cardClone = cardTemplate.content.cloneNode(true);
    const cardElement = cardClone.querySelector(".project-card"); // El div exterior en el template

    // Encontrar elementos dentro del clon usando data-attributes
    const imgEl = cardElement.querySelector("[data-card-img]");
    const titleEl = cardElement.querySelector("[data-card-title]");
    const metadataEl = cardElement.querySelector("[data-card-metadata]");
    const descEl = cardElement.querySelector("[data-card-desc]");
    const studentsEl = cardElement.querySelector("[data-card-students]");
    const linkEl = cardElement.querySelector("[data-card-link]");

    // Rellenar datos
    imgEl.src = project.coverUrl.url;
    imgEl.alt = project.coverUrl.altText;
    titleEl.textContent = project.projectTitle;
    linkEl.href = `project.html?slug=${project.slug}`;

    // Metadata (Chips Categoría/Nivel)
    metadataEl.innerHTML = ""; // Limpiar por si acaso
    if (project.projectCategory) {
      metadataEl.innerHTML += `<span class="chip chip-cyan">${project.projectCategory}</span>`;
    }
    if (project.studentLevel) {
      metadataEl.innerHTML += `<span class="chip chip-red">${project.studentLevel}</span>`;
    }

    // Descripción truncada
    const shortDesc =
      project.intro_content.length > descriptionLength
        ? project.intro_content.substring(0, descriptionLength) + "..."
        : project.intro_content;
    descEl.textContent = shortDesc;

    // --- CORRECCIÓN: Añadir chips de estudiantes ---
    studentsEl.innerHTML = ""; // Limpiar contenedor de estudiantes
    if (project.teamMembers && project.teamMembers.length > 0) {
      // Mostrar icono y número O nombres si son pocos? Por ahora, icono y número.
      // O mostrar nombres como chips discretos
      project.teamMembers.forEach((member) => {
        const studentChip = document.createElement("span");
        // Usar chip-gray para discreción
        studentChip.className = "chip chip-gray text-xs px-2 py-0.5"; // Más pequeño
        studentChip.innerHTML = `<i class="fa-solid fa-user mr-1 text-xs"></i>${member.name}`; // Icono + Nombre
        studentsEl.appendChild(studentChip);
      });
    }
    // --- FIN CORRECCIÓN ---

    return cardElement; // Devolver el elemento .project-card completo
  }

  // --- Apply All Filters ---
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedLevel = levelFilter.value;
    const selectedTech = techFilter.value;

    filteredProjects = allProjects.filter((project) => {
      const titleMatch = project.projectTitle
        .toLowerCase()
        .includes(searchTerm);
      const studentMatch = project.teamMembers.some((member) =>
        member.name.toLowerCase().includes(searchTerm)
      );
      const categoryMatch =
        !selectedCategory || project.projectCategory === selectedCategory;
      const levelMatch =
        !selectedLevel || project.studentLevel === selectedLevel;
      const techMatch =
        !selectedTech ||
        project.technologies.some((tech) => tech.name === selectedTech);

      return (
        (searchTerm === "" || titleMatch || studentMatch) &&
        categoryMatch &&
        levelMatch &&
        techMatch
      );
    });
  }

  // --- Display Projects (Handles Filtering and Pagination) ---
  function displayProjects() {
    applyFilters();
    currentPage = 1;
    renderCurrentPage();
  }

  // --- Render Current Page (Pagination Logic) ---
  function renderCurrentPage() {
    projectList.innerHTML = "";
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    currentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const projectsToDisplay = filteredProjects.slice(start, end);

    if (projectsToDisplay.length > 0) {
      projectsToDisplay.forEach((project) => {
        const cardElement = renderProjectCard(project); // Obtener el elemento
        if (cardElement) {
          // Verificar si se creó correctamente
          projectList.appendChild(cardElement);
        }
      });
      noResultsMessage.style.display = "none";
      paginationControls.style.display = totalPages > 1 ? "flex" : "none";
      pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
    } else {
      const isActiveFilter =
        categoryFilter.value ||
        levelFilter.value ||
        techFilter.value ||
        searchInput.value;
      if (isActiveFilter) {
        noResultsMessage.textContent =
          "No se encontraron proyectos con los filtros seleccionados.";
        noResultsMessage.style.display = "block";
      } else if (
        allProjects.length === 0 &&
        loadingMessage.style.display === "none"
      ) {
        noResultsMessage.textContent = "Aún no hay proyectos para mostrar.";
        noResultsMessage.style.display = "block";
      } else {
        noResultsMessage.style.display = "none";
      }
      paginationControls.style.display = "none";
    }
  }

  // --- Event Listeners ---
  searchInput.addEventListener("input", displayProjects);
  categoryFilter.addEventListener("change", displayProjects);
  levelFilter.addEventListener("change", displayProjects);
  techFilter.addEventListener("change", displayProjects);

  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    levelFilter.value = "";
    techFilter.value = "";
    // Restaurar texto por defecto de los selectores
    categoryFilter.options[0].textContent = "Categorías";
    levelFilter.options[0].textContent = "Niveles";
    techFilter.options[0].textContent = "Tecnologías";
    displayProjects();
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCurrentPage();
      window.scrollTo({ top: projectList.offsetTop - 80, behavior: "smooth" });
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderCurrentPage();
      window.scrollTo({ top: projectList.offsetTop - 80, behavior: "smooth" });
    }
  });

  // --- Initial Load ---
  loadProjects();

  // --- Footer Year ---
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
}); // Fin DOMContentLoaded
