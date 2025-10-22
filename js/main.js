// js/main.js - vFINAL (con búsqueda por ID de proyecto)

// --- DOM Elements ---
const projectList = document.getElementById("project-list");
const searchInput = document.getElementById("search-input");
const idSearchInput = document.getElementById("id-search-input");
const categorySelect = document.getElementById("category-select");
const schoolingSelect = document.getElementById("schooling-select");
const techSelect = document.getElementById("tech-select");
const sdgSelect = document.getElementById("sdg-select");
const statusSelect = document.getElementById("status-select");
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
    const response = await fetch(`${url}?t=${new Date().getTime()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// --- Initialization & Data Loading ---
document.addEventListener("DOMContentLoaded", async () => {
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
  if (!projectCardTemplate?.content) {
    console.error("CRITICAL: Template #project-card-template not found!");
    if (loadingMessage)
      loadingMessage.textContent = "Error: Falta la plantilla de la tarjeta.";
    return;
  }
  if (typeof odsData === "undefined") {
    console.error("CRITICAL: odsData object not found (from ods-data.js).");
    if (loadingMessage)
      loadingMessage.textContent = "Error: Faltan datos de ODS.";
    return;
  }
  await loadInitialData();
  setupEventListeners();
  if (showSdgLegendBtn && sdgLegendModal && sdgModalCloseBtn) {
    setupSdgLegendModal();
  }
});

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
    if (loadingMessage)
      loadingMessage.textContent =
        "Error al cargar los datos de los proyectos.";
    console.error("Failed to load or parse projects.json.");
    if (noResultsMessage) {
      noResultsMessage.textContent =
        "No se pudieron cargar los proyectos. Inténtalo de nuevo más tarde.";
      noResultsMessage.style.display = "block";
    }
  }
  if (loadingMessage) loadingMessage.style.display = "none";
};

// --- Filter Population, Application, and Rendering ---
const populateFilters = () => {
  const categories = new Set(),
    schoolingLevels = new Set(),
    technologies = new Set(),
    statuses = new Set();

  allProjects.forEach((project) => {
    if (project.projectCategory) categories.add(project.projectCategory);
    if (project.schooling) schoolingLevels.add(project.schooling);
    if (project.technologies)
      project.technologies.forEach(
        (tech) => tech.name && technologies.add(tech.name)
      );
    if (project.projectStatus) statuses.add(project.projectStatus);
  });

  const schoolingOrder = ["Primaria", "Secundaria", "Preparatoria"];
  const sortedSchooling = Array.from(schoolingLevels).sort((a, b) => {
    const indexA = schoolingOrder.indexOf(a);
    const indexB = schoolingOrder.indexOf(b);
    return indexA - indexB;
  });

  populateSelect(statusSelect, statuses, "Estado del proyecto", false);
  populateSelect(categorySelect, categories, "Categoría");
  populateSelect(schoolingSelect, sortedSchooling, "Escolaridad", false);
  populateSelect(techSelect, technologies, "Tecnología");
  populateSdgSelect(sdgSelect, "ODS");
};

const populateSelect = (
  selectElement,
  items,
  defaultOptionText,
  sortAlphabetically = true
) => {
  if (!selectElement) return;
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
};

const populateSdgSelect = (selectElement, defaultOptionText) => {
  if (!selectElement || typeof odsData === "undefined") return;
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
};

const applyFiltersAndRender = () => {
  const searchTerm = searchInput?.value.toLowerCase().trim() ?? "";
  const idSearchTerm = idSearchInput?.value.toLowerCase().trim() ?? "";
  const selectedCategory = categorySelect?.value ?? "";
  const selectedSchooling = schoolingSelect?.value ?? "";
  const selectedTech = techSelect?.value ?? "";
  const selectedSdg = sdgSelect?.value ? parseInt(sdgSelect.value, 10) : "";
  const selectedStatus = statusSelect?.value ?? "";

  filteredProjects = allProjects.filter((project) => {
    const titleMatch = project.projectTitle?.toLowerCase().includes(searchTerm);
    const studentMatch = project.teamMembers?.some((member) =>
      member.name?.toLowerCase().includes(searchTerm)
    );
    const idMatch =
      !idSearchTerm || project.projectId?.toLowerCase().includes(idSearchTerm);
    const categoryMatch =
      !selectedCategory || project.projectCategory === selectedCategory;
    const schoolingMatch =
      !selectedSchooling || project.schooling === selectedSchooling;
    const techMatch =
      !selectedTech ||
      project.technologies?.some((tech) => tech.name === selectedTech);
    const sdgMatch = !selectedSdg || project.sdgIds?.includes(selectedSdg);
    const statusMatch =
      !selectedStatus || project.projectStatus === selectedStatus;

    return (
      (titleMatch || studentMatch) &&
      idMatch &&
      categoryMatch &&
      schoolingMatch &&
      techMatch &&
      sdgMatch &&
      statusMatch
    );
  });

  currentPage = 1;
  renderProjects();
  updatePaginationControls();
};

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
      if (card) projectList.appendChild(card);
    });
  }
};

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
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderProjects();
  updatePaginationControls();
  if (projectList) {
    projectList.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// --- Event Listeners and Modal Setup ---
const setupEventListeners = () => {
  if (searchInput) searchInput.addEventListener("input", applyFiltersAndRender);
  if (idSearchInput)
    idSearchInput.addEventListener("input", applyFiltersAndRender);
  if (categorySelect)
    categorySelect.addEventListener("change", applyFiltersAndRender);
  if (schoolingSelect)
    schoolingSelect.addEventListener("change", applyFiltersAndRender);
  if (techSelect) techSelect.addEventListener("change", applyFiltersAndRender);
  if (sdgSelect) sdgSelect.addEventListener("change", applyFiltersAndRender);
  if (statusSelect)
    statusSelect.addEventListener("change", applyFiltersAndRender);

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (idSearchInput) idSearchInput.value = "";
      if (categorySelect) categorySelect.value = "";
      if (schoolingSelect) schoolingSelect.value = "";
      if (techSelect) techSelect.value = "";
      if (sdgSelect) sdgSelect.value = "";
      if (statusSelect) statusSelect.value = "";
      applyFiltersAndRender();
    });
  }

  if (prevPageBtn)
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) goToPage(currentPage - 1);
    });
  if (nextPageBtn)
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      if (currentPage < totalPages) goToPage(currentPage + 1);
    });
};

const setupSdgLegendModal = () => {
  const openModal = () => {
    sdgLegendModal.classList.remove("hidden");
    requestAnimationFrame(() => sdgLegendModal.classList.add("visible"));
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    sdgLegendModal.classList.remove("visible");
    document.body.style.overflow = "";
  };
  sdgLegendModal.addEventListener("transitionend", (e) => {
    if (
      e.target === sdgLegendModal &&
      !sdgLegendModal.classList.contains("visible")
    ) {
      sdgLegendModal.classList.add("hidden");
    }
  });
  showSdgLegendBtn.addEventListener("click", openModal);
  sdgModalCloseBtn.addEventListener("click", closeModal);
  sdgLegendModal.addEventListener("click", (e) => {
    if (e.target === sdgLegendModal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sdgLegendModal.classList.contains("visible"))
      closeModal();
  });
};

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
    title.className = "sdg-legend-title-list font-condensed font-semibold";
    title.textContent = sdg.title;
    listItem.appendChild(square);
    listItem.appendChild(title);
    sdgLegendModalContent.appendChild(listItem);
  });
};

// --- Card Creation and Helper Functions ---
const createProjectCard = (project) => {
  if (!projectCardTemplate?.content) return null;
  const cardClone = projectCardTemplate.content.cloneNode(true);
  const articleElement = cardClone.querySelector("[data-card-article]");
  const linkElement = cardClone.querySelector("[data-card-link]");
  const imgElement = cardClone.querySelector("[data-card-img]");
  const titleElement = cardClone.querySelector("[data-card-title]");
  const sdgContainer = cardClone.querySelector("[data-card-sdgs]");
  const metadataContainer = cardClone.querySelector("[data-card-metadata]");
  const descElement = cardClone.querySelector("[data-card-desc]");
  const studentsContainer = cardClone.querySelector("[data-card-students]");
  const sdgOverlayContainer = cardClone.querySelector(".sdg-overlay");
  const statusContainer = cardClone.querySelector("[data-card-status]");
  const nominationIndicator = cardClone.querySelector(
    "[data-nomination-indicator-card]"
  );

  if (
    !articleElement ||
    !linkElement ||
    !imgElement ||
    !titleElement ||
    !sdgContainer ||
    !metadataContainer ||
    !descElement ||
    !studentsContainer ||
    !sdgOverlayContainer ||
    !statusContainer ||
    !nominationIndicator
  ) {
    console.error(
      "One or more template elements are missing in #project-card-template."
    );
    return null;
  }

  // Set card border color based on status
  if (project.projectStatus) {
    const lowerCaseStatus = project.projectStatus.toLowerCase();
    if (lowerCaseStatus === "idea") {
      articleElement.style.borderColor = "var(--gnius-orange)";
    } else if (lowerCaseStatus === "prototipo") {
      articleElement.style.borderColor = "var(--gnius-violet)";
    }
  }

  // Populate card content
  linkElement.href = `project.html?slug=${project.slug || ""}`;
  imgElement.src =
    project.coverImage?.url || "assets/img/gnius_logo_placeholder.png";
  imgElement.alt =
    project.coverImage?.altText ||
    `Portada para ${project.projectTitle || "proyecto"}`;
  imgElement.onerror = () => {
    imgElement.src = "assets/img/problemas-imagenes-placeholder.png";
  };
  titleElement.textContent = project.projectTitle || "Sin Título";

  // SDG indicators
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
          "sdg-indicator-square-small font-condensed font-bold";
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

  // Nomination indicator
  nominationIndicator.classList.toggle("hidden", !project.isNominated);

  // Metadata chips
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

  // Description
  descElement.innerHTML = project.introContent || "Sin descripción.";

  // Student chips
  studentsContainer.innerHTML = "";
  const maxStudentsToShow = 4;
  if (project.teamMembers && project.teamMembers.length > 0) {
    project.teamMembers.slice(0, maxStudentsToShow).forEach((member) => {
      const chip = document.createElement("span");
      chip.className = "chip chip-gray student-chip";
      chip.innerHTML = `<i class="fa-solid fa-user fa-xs mr-1" aria-hidden="true"></i>${
        member.name || ""
      }`;
      studentsContainer.appendChild(chip);
    });
    if (project.teamMembers.length > maxStudentsToShow) {
      const chip = document.createElement("span");
      chip.className = "chip chip-gray student-chip";
      chip.textContent = `+${project.teamMembers.length - maxStudentsToShow}`;
      studentsContainer.appendChild(chip);
    }
  }

  // Status indicator
  statusContainer.innerHTML = project.projectStatus
    ? createStatusIndicator(project.projectStatus)
    : "";

  return cardClone;
};

function getContrastYIQ(hexcolor) {
  hexcolor = (hexcolor || "").replace("#", "");
  if (hexcolor.length !== 6) return "#ffffff";
  try {
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 135 ? "#1a1a1a" : "#ffffff";
  } catch (e) {
    return "#ffffff";
  }
}

function createStatusIndicator(status) {
  if (!status) return "";
  const lowerCaseStatus = status.toLowerCase();
  let iconClass = "",
    modifierClass = "";

  if (lowerCaseStatus === "idea") {
    iconClass = "fa-solid fa-lightbulb";
    modifierClass = "status-idea";
  } else if (lowerCaseStatus === "prototipo") {
    iconClass = "fa-solid fa-gears";
    modifierClass = "status-prototipo";
  } else {
    return "";
  }

  return `
    <div class="status-indicator-card ${modifierClass}">
        <div class="icon-wrapper">
            <i class="${iconClass}"></i>
        </div>
        <p class="status-text">${status}</p>
    </div>
  `;
}
