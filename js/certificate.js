// Este script hará lo siguiente:
// Obtendrá el slug del proyecto y el memberIndex del miembro desde los parámetros de la URL.
// Cargará data/projects.json.
// Buscará el proyecto específico por slug.
// Buscará al miembro específico dentro del proyecto usando memberIndex.
// Gestionará errores si faltan parámetros, no se encuentra el proyecto o el índice del miembro es inválido.
// Poblará dinámicamente todos los elementos de la página certificate.html con los datos del miembro y del proyecto correspondiente (nombre, curso, insignia, nivel, habilidades, criterios, imágenes del certificado, enlaces, etc.).
// Generará los chips para habilidades y criterios a partir de las listas separadas por comas.
// Mostrará u ocultará el enlace SBT según esté disponible.
// Ajustará el enlace "Volver al Proyecto" para que apunte al proyecto correcto.
// Actualizará el título de la página y el año del copyright.

// Explicación y Puntos Clave:
// Obtener Parámetros: Lee slug y memberIndex de la URL. Valida que existan y que memberIndex sea un número válido.
// Buscar Datos: Carga el JSON, encuentra el proyecto por slug y luego accede al miembro específico usando el memberIndex en el array teamMembers. Incluye robustas verificaciones de errores en cada paso.
// Poblar Elementos: Similar a project.js, selecciona elementos por ID y rellena sus textContent, src, o href.
// Generar Chips (Habilidades/Criterios): Se reutiliza la función createChip, pero ahora se llama desde populateChipsFromString, que toma la cadena de texto separada por comas del JSON, la divide (split(',')), y crea un chip para cada elemento.
// Enlaces: Actualiza los enlaces "Volver al Proyecto" y el de descarga del certificado. Para la descarga, intenta sugerir un nombre de archivo basado en la URL.
// SBT Link: Comprueba si member.sbtLink existe y es una URL válida antes de mostrar el contenedor y establecer el enlace.
// Visibilidad: Muestra el contenedor principal del certificado (#certificate-details) solo después de que los datos se han cargado y validado correctamente.
// ¡Con esto completamos los tres archivos JavaScript principales! Ahora tienes la estructura HTML, los estilos CSS y la lógica JavaScript para cargar y mostrar los datos.
// El último paso sería que revisaras todo, crearas las carpetas (css, js, data, assets/img), colocaras los archivos en su lugar, reemplazaras los placeholders (logo, videos reales si los tienes), y probaras a abrir index.html en tu navegador. Deberías ver la lista de proyectos cargados desde tu data/projects.json de ejemplo (el que usa rutas assets/img/... si seguiste esa corrección, o el de picsum si usaste ese último).

// js/certificate.js

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const loadingMessage = document.getElementById("loading-message");
  const errorMessageContainer = document.getElementById("error-message");
  const certificateDetailsContainer = document.getElementById(
    "certificate-details"
  );

  // Header Elements
  const backToProjectLinkHeader = document.getElementById(
    "back-to-project-link"
  ); // In header

  // Certificate Content Elements
  const studentNameEl = document.getElementById("student-name");
  const courseNameEl = document.getElementById("course-name");
  const badgeNameEl = document.getElementById("badge-name");
  const levelEl = document.getElementById("level");
  const skillsListEl = document.getElementById("skills-list");
  const criteriaListEl = document.getElementById("criteria-list");
  const sbtLinkContainer = document.getElementById("sbt-link-container");
  const sbtLinkEl = document.getElementById("sbt-link");
  const certificatePreviewImageEl = document.getElementById(
    "certificate-preview-image"
  );
  const certificateDownloadLinkEl = document.getElementById(
    "certificate-download-link"
  );
  const viewProjectButton = document.getElementById("view-project-button"); // Button below metadata
  const issuanceInfoEl = document.getElementById("issuance-info");
  const collegeNameSpan = document.getElementById("college-name"); // Inside issuance info
  const issueDateSpan = document.getElementById("issue-date"); // Inside issuance info

  // Footer Element
  const currentYearFooterSpan = document.getElementById("current-year-footer");

  // --- Helper Functions ---
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function showLoading(isLoading) {
    if (loadingMessage)
      loadingMessage.style.display = isLoading ? "block" : "none";
    if (certificateDetailsContainer)
      certificateDetailsContainer.style.display = isLoading ? "none" : "block";
    if (errorMessageContainer) errorMessageContainer.style.display = "none";
  }

  function showError(message) {
    showLoading(false);
    if (errorMessageContainer) {
      errorMessageContainer.textContent = message;
      errorMessageContainer.style.display = "block";
    }
    if (certificateDetailsContainer)
      certificateDetailsContainer.style.display = "none";
    console.error(message);
  }

  function updateCopyrightYear() {
    if (currentYearFooterSpan) {
      currentYearFooterSpan.textContent = new Date().getFullYear();
    }
  }

  /**
   * Creates a styled chip element.
   * @param {string} text - The text content of the chip.
   * @param {string} colorClass - Tailwind/CSS class for the chip style (e.g., 'chip-cyan', 'chip-yellow-outline').
   * @returns {HTMLElement} - The created span element.
   */
  function createChip(text, colorClass) {
    const chip = document.createElement("span");
    // Base classes + dynamic color class
    chip.className = `chip ${colorClass} text-xs`; // Ensure 'chip' base class is included if needed by CSS
    chip.textContent = text.trim(); // Trim whitespace
    return chip;
  }

  /**
   * Populates a container with chips generated from a comma-separated string.
   * @param {HTMLElement} container - The container element to append chips to.
   * @param {string} listString - The comma-separated string of items.
   * @param {string} chipColorClass - The CSS class for the chip style.
   */
  function populateChipsFromString(container, listString, chipColorClass) {
    if (!container || !listString) return;
    container.innerHTML = ""; // Clear any placeholder chips
    const items = listString
      .split(",")
      .map((item) => item.trim()) // Trim whitespace from each item
      .filter((item) => item !== ""); // Remove empty items

    if (items.length === 0) {
      container.innerHTML =
        '<span class="text-xs text-gnius-light/60 italic">N/A</span>'; // Indicate if empty
      return;
    }

    items.forEach((item) => {
      container.appendChild(createChip(item, chipColorClass));
    });
  }

  // --- Main Initialization ---
  async function init() {
    updateCopyrightYear();
    const projectSlug = getQueryParam("slug");
    const memberIndexParam = getQueryParam("memberIndex");

    if (!projectSlug || memberIndexParam === null) {
      showError(
        "Faltan parámetros en la URL (se requiere 'slug' y 'memberIndex')."
      );
      return;
    }

    const memberIndex = parseInt(memberIndexParam, 10);
    if (isNaN(memberIndex) || memberIndex < 0) {
      showError(
        "El índice del miembro ('memberIndex') en la URL no es válido."
      );
      return;
    }

    try {
      showLoading(true);
      const response = await fetch("data/projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const projects = await response.json();

      if (!Array.isArray(projects)) {
        throw new Error("El archivo JSON de proyectos no es válido.");
      }

      const project = projects.find((p) => p.slug === projectSlug);

      if (!project) {
        showError(`Proyecto con slug '${projectSlug}' no encontrado.`);
        return;
      }

      if (
        !project.teamMembers ||
        !Array.isArray(project.teamMembers) ||
        memberIndex >= project.teamMembers.length
      ) {
        showError(
          `Índice de miembro (${memberIndex}) fuera de rango o equipo no encontrado para el proyecto '${projectSlug}'.`
        );
        return;
      }

      const member = project.teamMembers[memberIndex];

      displayCertificateDetails(project, member, memberIndex);
    } catch (error) {
      console.error("Error al cargar o mostrar el certificado:", error);
      showError(`No se pudo cargar el certificado. ${error.message}.`);
    } finally {
      showLoading(false);
    }
  }

  // --- Display Certificate Details ---
  function displayCertificateDetails(project, member, memberIndex) {
    document.title = `Certificado: ${member.name} - ${project.projectTitle}`; // Update page title

    // Update Back Links
    const projectUrl = `project.html?slug=${project.slug}`;
    if (backToProjectLinkHeader) backToProjectLinkHeader.href = projectUrl;
    if (viewProjectButton) viewProjectButton.href = projectUrl;

    // Populate Main Info
    if (studentNameEl) studentNameEl.textContent = member.name;
    if (courseNameEl) courseNameEl.textContent = member.certificate_courseName;

    // Populate Badge & Level Chips
    if (badgeNameEl) badgeNameEl.textContent = member.certificate_badgeName; // Assuming class 'chip chip-yellow' is already on the element
    if (levelEl) levelEl.textContent = member.certificate_level; // Assuming class 'chip chip-cyan' is already on the element

    // Populate Skills & Criteria Chips
    populateChipsFromString(
      skillsListEl,
      member.certificate_skills,
      "chip-cyan-outline"
    );
    populateChipsFromString(
      criteriaListEl,
      member.certificate_criteria,
      "chip-yellow-outline"
    );

    // Handle SBT Link
    if (sbtLinkContainer && sbtLinkEl) {
      if (member.sbtLink && member.sbtLink.startsWith("http")) {
        sbtLinkEl.href = member.sbtLink;
        sbtLinkContainer.style.display = "block";
      } else {
        sbtLinkContainer.style.display = "none";
      }
    }

    // Set Certificate Images & Download Link
    if (certificatePreviewImageEl) {
      certificatePreviewImageEl.src = member.certificate_previewUrl || ""; // Handle missing URL gracefully
      certificatePreviewImageEl.alt = `Previsualización del certificado de ${member.name}`;
    }
    if (certificateDownloadLinkEl) {
      certificateDownloadLinkEl.href = member.certificate_printUrl || "#"; // Handle missing URL
      // Optional: Add download attribute suggestion based on filename
      if (member.certificate_printUrl) {
        const filename = member.certificate_printUrl.split("/").pop(); // Get filename from path
        certificateDownloadLinkEl.download =
          filename || `Certificado_${project.slug}_${memberIndex}.pdf`; // Suggested filename
      }
    }

    // Populate Issuance Info
    if (collegeNameSpan)
      collegeNameSpan.textContent =
        member.certificate_college || "Institución Desconocida";
    if (issueDateSpan)
      issueDateSpan.textContent =
        member.certificate_issueDate || "Fecha Desconocida"; // Assumes YYYY-MM-DD format from JSON

    // Show the main content container
    certificateDetailsContainer.style.display = "block"; // Or 'flex'/'grid' depending on your layout needs
  }

  // --- Start ---
  init();
});
