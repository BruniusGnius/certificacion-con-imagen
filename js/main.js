// js/main.js - v4.11 (Ajustes Finales Index v5)

// --- DOM Elements ---
const projectList = document.getElementById("project-list");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const schoolingSelect = document.getElementById("schooling-select");
const techSelect = document.getElementById("tech-select");
const sdgSelect = document.getElementById("sdg-select");
const clearFiltersBtn = document.getElementById("clear-filters-btn");
const loadingMessage = document.getElementById("loading-message");
const noResultsMessage = document.getElementById("no-results-message");
const paginationControls = document.getElementById("pagination-controls");
const prevPageBtn = document.getElementById("prev-page-btn");
const nextPageBtn = document.getElementById("next-page-btn");
const pageInfo = document.getElementById("page-info");
const projectCardTemplate = document.getElementById("project-card-template");
const currentYearSpan = document.getElementById("current-year");
const showSdgLegendBtn = document.getElementById("show-sdg-legend-btn");
const sdgLegendModal = document.getElementById("sdg-legend-modal");
const sdgLegendModalContent = document.getElementById(
  "sdg-legend-modal-content"
);
const sdgModalCloseBtn = document.getElementById("sdg-modal-close-btn");

// --- State ---
let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
const projectsPerPage = 12;

// --- Utility Functions ---
const fetchData = async (url) => {
  try {
    const cacheBustingUrl = `${url}?t=${new Date().getTime()}`;
    const response = await fetch(cacheBustingUrl);
    if (!response.ok) {
      if (response.status === 304) {
        const retryResponse = await fetch(url);
        if (!retryResponse.ok) {
          throw new Error(`HTTP error retry! status: ${retryResponse.status}`);
        }
        return await retryResponse.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
  if (!projectCardTemplate?.content) {
    console.error("CRITICAL: Project card template not found!");
    if (loadingMessage) loadingMessage.textContent = "Error plantilla.";
    return;
  }
  if (typeof odsData === "undefined") {
    console.error("CRITICAL: odsData not defined.");
    if (loadingMessage) loadingMessage.textContent = "Error datos ODS.";
    return;
  }
  if (!projectList || !loadingMessage || !noResultsMessage) {
    console.error("CRITICAL: Missing essential list/message elements.");
    return;
  }

  await loadInitialData();
  setupEventListeners();
  if (showSdgLegendBtn && sdgLegendModal && sdgModalCloseBtn) {
    setupSdgLegendModal();
  } else {
    console.warn("Modal SDG Legend elements missing.");
  }
});

// --- Data Loading and Processing ---
const loadInitialData = async () => {
  if (loadingMessage) loadingMessage.style.display = "block";
  if (noResultsMessage) noResultsMessage.style.display = "none";
  if (projectList) projectList.innerHTML = "";

  const modifyDataForDemo = (data) => {
    if (data && data.length >= 2) {
      let hasPrimaria = data.some((p) => p.schooling === "Primaria");
      if (!hasPrimaria) {
        console.warn("Modificando datos de ejemplo para incluir 'Primaria'");
        if (data[data.length - 1]) data[data.length - 1].schooling = "Primaria";
        if (data[data.length - 2]) data[data.length - 2].schooling = "Primaria";
      }
    }
    return data;
  };

  let projectsData = await fetchData("data/projectsLoremPicsum.json");
  projectsData = modifyDataForDemo(projectsData); // Aplicar HACK (solo para LoremPicsum)

  if (projectsData && Array.isArray(projectsData)) {
    allProjects = projectsData;
    console.log(`Total projects loaded: ${allProjects.length}`);
    populateFilters();
    if (sdgLegendModalContent) renderSdgLegend();
    applyFiltersAndRender();
  } else {
    if (loadingMessage) loadingMessage.textContent = "Error al cargar datos.";
    console.error("Failed to load or parse project data.");
    if (noResultsMessage) {
      noResultsMessage.textContent = "No se pudieron cargar los proyectos.";
      noResultsMessage.style.display = "block";
    }
  }
  if (loadingMessage) loadingMessage.style.display = "none";
};

// --- Populate Filters ---
const populateFilters = () => {
  const categories = new Set();
  const schoolingLevels = new Set();
  const technologies = new Set();
  allProjects.forEach((project) => {
    if (project.projectCategory) categories.add(project.projectCategory);
    if (project.schooling) schoolingLevels.add(project.schooling);
    if (project.technologies) {
      project.technologies.forEach((tech) => technologies.add(tech.name));
    }
  });
  populateSelect(
    document.getElementById("category-select"),
    categories,
    "Categoría"
  );
  populateSelect(
    document.getElementById("schooling-select"),
    schoolingLevels,
    "Escolaridad"
  );
  populateSelect(
    document.getElementById("tech-select"),
    technologies,
    "Tecnología"
  );
  populateSdgSelect(document.getElementById("sdg-select"), "ODS");
};

const populateSelect = (selectElement, items, defaultOptionText) => {
  if (!selectElement) return;
  const currentValue = selectElement.value;
  selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
  const sortedItems = Array.from(items).sort((a, b) => a.localeCompare(b));
  sortedItems.forEach((item) => {
    if (item) {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    }
  });
  if (
    currentValue &&
    Array.from(selectElement.options).some((opt) => opt.value === currentValue)
  ) {
    selectElement.value = currentValue;
  }
};

const populateSdgSelect = (selectElement, defaultOptionText) => {
  if (!selectElement || typeof odsData === "undefined") return;
  const currentValue = selectElement.value;
  selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
  const sortedSdgKeys = Object.keys(odsData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  sortedSdgKeys.forEach((key) => {
    const sdg = odsData[key];
    const option = document.createElement("option");
    option.value = sdg.num;
    option.textContent = `${sdg.num}. ${sdg.title}`;
    selectElement.appendChild(option);
  });
  if (
    currentValue &&
    selectElement.querySelector(`option[value="${currentValue}"]`)
  ) {
    selectElement.value = currentValue;
  }
};

// --- Filtering Logic ---
const applyFiltersAndRender = () => {
  const searchTerm = searchInput?.value.toLowerCase().trim() ?? "";
  const selectedCategory = categorySelect?.value ?? "";
  const selectedSchooling = schoolingSelect?.value ?? "";
  const selectedTech = techSelect?.value ?? "";
  const selectedSdg = sdgSelect?.value ? parseInt(sdgSelect.value, 10) : "";

  filteredProjects = allProjects.filter((project) => {
    const titleMatch =
      project.projectTitle?.toLowerCase().includes(searchTerm) ?? false;
    const studentMatch =
      project.teamMembers?.some((member) =>
        member.name?.toLowerCase().includes(searchTerm)
      ) ?? false;
    const categoryMatch =
      !selectedCategory || project.projectCategory === selectedCategory;
    const schoolingMatch =
      !selectedSchooling || project.schooling === selectedSchooling;
    const techMatch =
      !selectedTech ||
      project.technologies?.some((tech) => tech.name === selectedTech);
    const sdgMatch = !selectedSdg || project.sdgIds?.includes(selectedSdg);
    return (
      (titleMatch || studentMatch) &&
      categoryMatch &&
      schoolingMatch &&
      techMatch &&
      sdgMatch
    );
  });

  currentPage = 1;
  renderProjects();
  updatePaginationControls();
};

// --- Rendering ---
const renderProjects = () => {
  if (!projectList || !noResultsMessage) return;
  projectList.innerHTML = "";
  noResultsMessage.style.display =
    filteredProjects.length === 0 ? "block" : "none";
  if (filteredProjects.length > 0) {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const projectsToRender = filteredProjects.slice(startIndex, endIndex);
    projectsToRender.forEach((project) => {
      const card = createProjectCard(project);
      if (card) {
        projectList.appendChild(card);
      } else {
        console.error(`Error al crear tarjeta para ${project.projectTitle}`);
      }
    });
  }
};

// Renderizar Leyenda ODS como LISTA dentro del MODAL
const renderSdgLegend = () => {
  if (!sdgLegendModalContent || typeof odsData === "undefined") return;
  sdgLegendModalContent.innerHTML = ""; // Limpiar UL
  const sortedSdgKeys = Object.keys(odsData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  sortedSdgKeys.forEach((key) => {
    const sdg = odsData[key];
    const listItem = document.createElement("li");
    listItem.className = "flex items-center space-x-3 sdg-legend-item";

    const circle = document.createElement("span");
    circle.className = "sdg-legend-circle-list"; // Clase para círculo en lista
    circle.textContent = sdg.num;
    circle.style.backgroundColor = sdg.color;
    circle.title = `ODS ${sdg.num}: ${sdg.title}`;
    circle.style.color = getContrastYIQ(sdg.color); // Contraste mejorado

    const title = document.createElement("span");
    title.className = "sdg-legend-title-list"; // Clase para título en lista
    title.textContent = sdg.title; // Título completo

    listItem.appendChild(circle);
    listItem.appendChild(title);
    sdgLegendModalContent.appendChild(listItem); // Añadir LI al UL
  });
};

// Crear Tarjeta de Proyecto (ODS Overlay, Metadata B.1, Desc Font)
const createProjectCard = (project) => {
  if (!projectCardTemplate?.content) {
    return null;
  }
  const cardClone = projectCardTemplate.content.cloneNode(true);
  const linkElement = cardClone.querySelector("[data-card-link]");
  const imgElement = cardClone.querySelector("[data-card-img]");
  const titleElement = cardClone.querySelector("[data-card-title]");
  const sdgContainer = cardClone.querySelector("[data-card-sdgs]");
  const metadataContainer = cardClone.querySelector("[data-card-metadata]");
  const descElement = cardClone.querySelector("[data-card-desc]");
  const studentsContainer = cardClone.querySelector("[data-card-students]");
  const sdgOverlayContainer = cardClone.querySelector(".sdg-overlay");

  if (
    !linkElement ||
    !imgElement ||
    !titleElement ||
    !sdgContainer ||
    !metadataContainer ||
    !descElement ||
    !studentsContainer ||
    !sdgOverlayContainer
  ) {
    console.error("Elementos faltantes en plantilla.");
    return null;
  }

  linkElement.href = `project.html?slug=${project.slug}`;
  imgElement.src =
    project.coverImage?.url || "assets/img/gnius_logo_placeholder.png";
  imgElement.alt =
    project.coverImage?.altText ||
    `Portada del proyecto ${project.projectTitle}`;
  titleElement.textContent = project.projectTitle;

  // RENDERIZADO CÍRCULOS ODS PEQUEÑOS EN TARJETA (OVERLAY)
  sdgContainer.innerHTML = "";
  if (
    project.sdgIds &&
    project.sdgIds.length > 0 &&
    typeof odsData !== "undefined"
  ) {
    sdgOverlayContainer.style.display = "flex"; // Mostrar overlay (flex)
    project.sdgIds.forEach((sdgId) => {
      const sdgInfo = odsData[sdgId];
      if (sdgInfo) {
        const circle = document.createElement("span");
        circle.className = "sdg-indicator-circle-small"; // Círculo pequeño
        circle.textContent = sdgInfo.num;
        circle.style.backgroundColor = sdgInfo.color;
        circle.title = `ODS ${sdgInfo.num}: ${sdgInfo.title}`;
        circle.style.color = getContrastYIQ(sdgInfo.color); // Contraste mejorado
        sdgContainer.appendChild(circle);
      }
    });
  } else {
    sdgOverlayContainer.style.display = "none";
  }

  // Renderizar Metadata (Atenuado B.1 - Borde tenue)
  metadataContainer.innerHTML = "";
  if (project.projectCategory) {
    const chip = document.createElement("span");
    chip.className = "chip chip-metadata chip-cyan-muted-border";
    chip.textContent = project.projectCategory;
    metadataContainer.appendChild(chip);
  }
  if (project.schooling) {
    const chip = document.createElement("span");
    chip.className = "chip chip-metadata chip-red-muted-border";
    chip.textContent = project.schooling;
    metadataContainer.appendChild(chip);
  }

  // Descripción (Fuente SemiCondensed 600 - font-semibold en HTML)
  descElement.textContent = project.introContent
    ? project.introContent.substring(0, 100) +
      (project.introContent.length > 100 ? "..." : "")
    : "Sin descripción.";

  // Renderizar Estudiantes (Peso 500 - font-medium aplicado en CSS)
  studentsContainer.innerHTML = "";
  const maxStudentsToShow = 4;
  if (project.teamMembers && project.teamMembers.length > 0) {
    project.teamMembers.slice(0, maxStudentsToShow).forEach((member) => {
      const chip = document.createElement("span");
      chip.className = "chip chip-gray student-chip";
      chip.innerHTML = `<i class="fa-solid fa-user fa-xs" aria-hidden="true"></i> ${member.name}`;
      studentsContainer.appendChild(chip);
    });
    if (project.teamMembers.length > maxStudentsToShow) {
      const chip = document.createElement("span");
      chip.className = "chip chip-gray student-chip";
      chip.textContent = `+${project.teamMembers.length - maxStudentsToShow}`;
      studentsContainer.appendChild(chip);
    }
  } else {
    const chip = document.createElement("span");
    chip.className = "chip chip-gray student-chip";
    chip.textContent = "Equipo no especificado";
    studentsContainer.appendChild(chip);
  }

  return cardClone;
};

// --- Pagination ---
const updatePaginationControls = () => {
  /* ... sin cambios ... */
};
const goToPage = (page) => {
  /* ... sin cambios ... */
};

// --- Event Listeners ---
const setupEventListeners = () => {
  // Añadir listeners solo si los elementos existen
  if (searchInput) searchInput.addEventListener("input", applyFiltersAndRender);
  else console.warn("Elemento searchInput no encontrado");
  if (categorySelect)
    categorySelect.addEventListener("change", applyFiltersAndRender);
  else console.warn("Elemento categorySelect no encontrado");
  if (schoolingSelect)
    schoolingSelect.addEventListener("change", applyFiltersAndRender);
  else console.warn("Elemento schoolingSelect no encontrado");
  if (techSelect) techSelect.addEventListener("change", applyFiltersAndRender);
  else console.warn("Elemento techSelect no encontrado");
  if (sdgSelect) sdgSelect.addEventListener("change", applyFiltersAndRender);
  else console.warn("Elemento sdgSelect no encontrado");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categorySelect) categorySelect.value = "";
      if (schoolingSelect) schoolingSelect.value = "";
      if (techSelect) techSelect.value = "";
      if (sdgSelect) sdgSelect.value = "";
      applyFiltersAndRender();
    });
  } else {
    console.warn("Elemento clearFiltersBtn no encontrado");
  }
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    });
  } else {
    console.warn("Elemento prevPageBtn no encontrado");
  }
  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    });
  } else {
    console.warn("Elemento nextPageBtn no encontrado");
  }
};

// --- Lógica Modal Leyenda ODS ---
const setupSdgLegendModal = () => {
  if (!showSdgLegendBtn || !sdgLegendModal || !sdgModalCloseBtn) return;
  const openModal = () => {
    sdgLegendModal.classList.remove("hidden");
    void sdgLegendModal.offsetWidth;
    sdgLegendModal.classList.add("visible");
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    sdgLegendModal.classList.remove("visible");
    document.body.style.overflow = "";
  };
  sdgLegendModal.addEventListener("transitionend", (e) => {
    if (
      e.target === sdgLegendModal &&
      e.propertyName === "opacity" &&
      !sdgLegendModal.classList.contains("visible")
    ) {
      sdgLegendModal.classList.add("hidden");
    }
  });
  showSdgLegendBtn.addEventListener("click", openModal);
  sdgModalCloseBtn.addEventListener("click", closeModal);
  sdgLegendModal.addEventListener("click", (e) => {
    if (e.target === sdgLegendModal) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sdgLegendModal.classList.contains("visible")) {
      closeModal();
    }
  });
};

// --- Helper para Contraste de Color ---
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  if (hexcolor.length !== 6) return "#ffffff"; // Default blanco
  try {
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // Umbral ligeramente más alto para preferir texto blanco sobre fondos "medios"
    return yiq >= 135 ? "#1a1a1a" : "#ffffff";
  } catch (e) {
    console.warn("Error parsing hex color for contrast:", hexcolor, e);
    return "#ffffff"; // Fallback a blanco
  }
}
