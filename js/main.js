// js/main.js - v4.19 (Verificado - Sin cambios funcionales)

// --- DOM Elements ---
const projectList = document.getElementById("project-list"),
  searchInput = document.getElementById("search-input"),
  categorySelect = document.getElementById("category-select"),
  schoolingSelect = document.getElementById("schooling-select"),
  techSelect = document.getElementById("tech-select"),
  sdgSelect = document.getElementById("sdg-select"),
  clearFiltersBtn = document.getElementById("clear-filters-btn"),
  loadingMessage = document.getElementById("loading-message"),
  noResultsMessage = document.getElementById("no-results-message"),
  paginationControls = document.getElementById("pagination-controls"),
  prevPageBtn = document.getElementById("prev-page-btn"),
  nextPageBtn = document.getElementById("next-page-btn"),
  pageInfo = document.getElementById("page-info"),
  projectCardTemplate = document.getElementById("project-card-template"),
  currentYearSpan = document.getElementById("current-year"),
  showSdgLegendBtn = document.getElementById("show-sdg-legend-btn"),
  sdgLegendModal = document.getElementById("sdg-legend-modal"),
  sdgLegendModalContent = document.getElementById("sdg-legend-modal-content"),
  sdgModalCloseBtn = document.getElementById("sdg-modal-close-btn");

// --- State ---
let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
const projectsPerPage = 12;

// --- Utility Functions ---
const fetchData = async (url) => {
  try {
    const t = `${url}?t=${new Date().getTime()}`,
      e = await fetch(t);
    if (!e.ok) {
      if (304 === e.status) {
        const t = await fetch(url);
        if (!t.ok) throw new Error(`HTTP error retry! status: ${t.status}`);
        return await t.json();
      }
      throw new Error(`HTTP error! status: ${e.status}`);
    }
    return await e.json();
  } catch (t) {
    return console.error("Error fetching data:", t), null;
  }
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
  if (!projectCardTemplate?.content) {
    console.error("CRITICAL: Template not found!");
    if (loadingMessage) loadingMessage.textContent = "Error plantilla.";
    return;
  }
  if (typeof odsData === "undefined") {
    console.error("CRITICAL: odsData not defined.");
    if (loadingMessage) loadingMessage.textContent = "Error datos ODS.";
    return;
  }
  if (!projectList || !loadingMessage || !noResultsMessage) {
    console.error("CRITICAL: Missing essential elements.");
    return;
  }
  await loadInitialData();
  setupEventListeners();
  if (showSdgLegendBtn && sdgLegendModal && sdgModalCloseBtn) {
    setupSdgLegendModal();
  }
});

// --- Data Loading and Processing ---
const loadInitialData = async () => {
  if (loadingMessage) loadingMessage.style.display = "block";
  if (noResultsMessage) noResultsMessage.style.display = "none";
  if (projectList) projectList.innerHTML = "";
  const projectsData = await fetchData("data/projects.json");
  if (projectsData && Array.isArray(projectsData)) {
    allProjects = projectsData;
    populateFilters();
    if (sdgLegendModalContent) renderSdgLegend();
    applyFiltersAndRender();
  } else {
    if (loadingMessage) loadingMessage.textContent = "Error al cargar datos.";
    console.error("Failed to load/parse data.");
    if (noResultsMessage) {
      noResultsMessage.textContent = "No se pudieron cargar proyectos.";
      noResultsMessage.style.display = "block";
    }
  }
  if (loadingMessage) loadingMessage.style.display = "none";
};

// --- Populate Filters (con orden escolaridad) ---
const populateFilters = () => {
  const categories = new Set();
  const schoolingLevels = new Set();
  const technologies = new Set();
  allProjects.forEach((project) => {
    if (project.projectCategory) categories.add(project.projectCategory);
    if (project.schooling) schoolingLevels.add(project.schooling);
    if (project.technologies) {
      project.technologies.forEach(
        (tech) => tech.name && technologies.add(tech.name)
      );
    }
  });
  const schoolingOrder = ["Primaria", "Secundaria", "Preparatoria"];
  const sortedSchooling = Array.from(schoolingLevels).sort((a, b) => {
    const indexA = schoolingOrder.indexOf(a);
    const indexB = schoolingOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
  populateSelect(
    document.getElementById("category-select"),
    categories,
    "Categoría"
  );
  populateSelect(
    document.getElementById("schooling-select"),
    sortedSchooling,
    "Escolaridad",
    false
  );
  populateSelect(
    document.getElementById("tech-select"),
    technologies,
    "Tecnología"
  );
  populateSdgSelect(document.getElementById("sdg-select"), "ODS");
};

const populateSelect = (
  selectElement,
  items,
  defaultOptionText,
  sortAlphabetically = true
) => {
  if (!selectElement) return;
  const currentValue = selectElement.value;
  selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
  const itemsToPopulate = sortAlphabetically
    ? Array.from(items).sort((a, b) => a.localeCompare(b))
    : Array.from(items);
  itemsToPopulate.forEach((item) => {
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
  try {
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
  } catch (error) {
    console.error("[Filter] Error:", error);
    filteredProjects = [];
  }
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
      try {
        const card = createProjectCard(project);
        if (card) projectList.appendChild(card);
      } catch (error) {
        console.error(
          `Error rendering card for ${project?.projectTitle}:`,
          error
        );
      }
    });
  }
};

// Renderizar Leyenda ODS como LISTA dentro del MODAL
const renderSdgLegend = () => {
  if (!sdgLegendModalContent || typeof odsData === "undefined") return;
  sdgLegendModalContent.innerHTML = "";
  const sortedSdgKeys = Object.keys(odsData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  sortedSdgKeys.forEach((key) => {
    const sdg = odsData[key];
    const listItem = document.createElement("li");
    listItem.className = "flex items-center space-x-2 sdg-legend-item";
    const square = document.createElement("span");
    square.className = "sdg-legend-square-list font-condensed font-bold";
    square.textContent = sdg.num;
    square.style.backgroundColor = sdg.color;
    square.title = `ODS ${sdg.num}: ${sdg.title}`;
    square.style.color = getContrastYIQ(sdg.color);
    const title = document.createElement("span");
    title.className = "sdg-legend-title-list font-condensed font-semibold"; // <-- Asegurado semibold
    title.textContent = sdg.title;
    listItem.appendChild(square);
    listItem.appendChild(title);
    sdgLegendModalContent.appendChild(listItem);
  });
};

// Crear Tarjeta de Proyecto
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
    console.error("Template elements missing.");
    return null;
  }

  try {
    linkElement.href = `project.html?slug=${project.slug || ""}`;
    imgElement.src =
      project.coverImage?.url || "assets/img/gnius_logo_placeholder.png";
    imgElement.alt =
      project.coverImage?.altText || `Portada ${project.projectTitle || ""}`;
    imgElement.onerror = () => {
      imgElement.src = "assets/img/gnius_logo_placeholder.png";
    };
    titleElement.textContent = project.projectTitle || "Sin Título"; // Clases en HTML

    // ODS Overlay
    sdgContainer.innerHTML = "";
    if (
      project.sdgIds &&
      project.sdgIds.length > 0 &&
      typeof odsData !== "undefined"
    ) {
      sdgOverlayContainer.style.display = "flex";
      project.sdgIds.forEach((sdgId) => {
        const sdgInfo = odsData[sdgId];
        if (sdgInfo) {
          const square = document.createElement("span");
          square.className =
            "sdg-indicator-square-small font-condensed font-bold"; // Clases fuente/peso
          square.textContent = sdgInfo.num;
          square.style.backgroundColor = sdgInfo.color;
          square.title = `ODS ${sdgInfo.num}: ${sdgInfo.title}`;
          square.style.color = getContrastYIQ(sdgInfo.color);
          sdgContainer.appendChild(square);
        }
      });
    } else {
      sdgOverlayContainer.style.display = "none";
    }
    // --- Lógica para el Indicador de Nominación en la Tarjeta ---
    const nominationIndicator = cardClone.querySelector(
      "[data-nomination-indicator-card]"
    );
    if (nominationIndicator) {
      if (project.isNominated === true) {
        nominationIndicator.classList.remove("hidden");
      } else {
        nominationIndicator.classList.add("hidden"); // Asegurar que esté oculto si no está nominado o la propiedad no existe
      }
    }
    // --- Fin de la Lógica para el Indicador de Nominación ---

    // Metadata (Clases CSS + JS añaden fuente/peso)
    metadataContainer.innerHTML = "";
    if (project.projectCategory) {
      const chip = document.createElement("span");
      chip.className =
        "chip chip-metadata chip-cyan-muted-border font-condensed font-medium";
      chip.textContent = project.projectCategory;
      metadataContainer.appendChild(chip);
    }
    if (project.schooling) {
      const chip = document.createElement("span");
      chip.className =
        "chip chip-metadata chip-red-muted-border font-condensed font-medium";
      chip.textContent = project.schooling;
      metadataContainer.appendChild(chip);
    }

    // Descripción (Clase font-medium en HTML)
    descElement.textContent = project.introContent
      ? project.introContent.substring(0, 100) +
        (project.introContent.length > 100 ? "..." : "")
      : "Sin descripción.";

    // Estudiantes (Clase font-semibold en CSS)
    studentsContainer.innerHTML = "";
    const maxStudentsToShow = 4;
    if (project.teamMembers && project.teamMembers.length > 0) {
      project.teamMembers.slice(0, maxStudentsToShow).forEach((member) => {
        const chip = document.createElement("span");
        chip.className = "chip chip-gray student-chip";
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-user fa-xs mr-1";
        icon.setAttribute("aria-hidden", "true");
        chip.appendChild(icon);
        chip.appendChild(document.createTextNode(member.name || ""));
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
  } catch (error) {
    console.error(
      `Error asignando datos para ${project?.projectTitle}:`,
      error
    );
    return null;
  }
  return cardClone;
};

// --- Pagination ---
const updatePaginationControls = () => {
  if (!paginationControls) return;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  if (totalPages <= 1) {
    paginationControls.style.display = "none";
    return;
  }
  paginationControls.style.display = "flex";
  if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
};
const goToPage = (page) => {
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  if (page < 1 || page > totalPages) {
    return;
  }
  currentPage = page;
  renderProjects();
  updatePaginationControls();
  if (projectList) {
    const mainContainer = document.querySelector(".container");
    if (mainContainer) {
      mainContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

// --- Event Listeners ---
const setupEventListeners = () => {
  if (searchInput) searchInput.addEventListener("input", applyFiltersAndRender);
  if (categorySelect)
    categorySelect.addEventListener("change", applyFiltersAndRender);
  if (schoolingSelect)
    schoolingSelect.addEventListener("change", applyFiltersAndRender);
  if (techSelect) techSelect.addEventListener("change", applyFiltersAndRender);
  if (sdgSelect) sdgSelect.addEventListener("change", applyFiltersAndRender);
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categorySelect) categorySelect.value = "";
      if (schoolingSelect) schoolingSelect.value = "";
      if (techSelect) techSelect.value = "";
      if (sdgSelect) sdgSelect.value = "";
      applyFiltersAndRender();
    });
  }
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    });
  }
  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    });
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
  hexcolor = hexcolor?.replace("#", "") ?? "";
  if (hexcolor.length !== 6) return "#ffffff";
  try {
    var r = parseInt(hexcolor.substr(0, 2), 16),
      g = parseInt(hexcolor.substr(2, 2), 16),
      b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 135 ? "#1a1a1a" : "#ffffff";
  } catch (e) {
    return "#ffffff";
  }
}
