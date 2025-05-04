// js/certificate.js - Lógica para certificate.html

const PROJECTS_JSON_URL = "data/projects.json";
const certificateDetailsContainer = document.getElementById(
  "certificate-details"
);
const certificateNotFoundDiv = document.getElementById("certificate-not-found");
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
  if (projectsData.length > 0) return projectsData; // Cache simple
  try {
    const response = await fetch(PROJECTS_JSON_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    projectsData = await response.json();
    return projectsData;
  } catch (error) {
    console.error("Error fetching projects data:", error);
    displayError("Error al cargar los datos necesarios para el certificado.");
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
  certificateDetailsContainer.innerHTML = "";
  certificateDetailsContainer.classList.add("hidden");
  certificateNotFoundDiv.classList.remove("hidden");
  const errorParagraph = certificateNotFoundDiv.querySelector("p");
  if (errorParagraph) {
    errorParagraph.textContent = message;
  }
  certificateDetailsContainer.style.opacity = 1; // Evitar que la transición oculte el error
}

/**
 * Formatea una fecha YYYY-MM-DD a un formato más legible.
 * @param {string} dateString - Fecha en formato YYYY-MM-DD.
 * @returns {string} Fecha formateada (ej. "15 de Noviembre, 2024").
 */
function formatDate(dateString) {
  if (!dateString) return "Fecha no especificada";
  try {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.warn("Error formatting date:", dateString, e);
    return dateString;
  }
}

/**
 * Renderiza el contenido del certificado.
 * @param {object} member - Objeto del miembro del equipo con datos del certificado.
 * @param {object} project - Objeto del proyecto (para el enlace de evidencia).
 */
function renderCertificate(member, project) {
  // Validar campos requeridos para el certificado
  const requiredFields = [
    "name",
    "certificate_courseName",
    "certificate_badgeName",
    "certificate_level",
    "certificate_skills",
    "certificate_criteria",
    "certificate_college",
    "certificate_issueDate",
  ];
  const missingFields = requiredFields.filter((field) => !member[field]);

  if (missingFields.length > 0) {
    displayError(
      `Faltan datos esenciales para generar este certificado (campos: ${missingFields.join(
        ", "
      )}).`
    );
    return;
  }

  const skillsList = member.certificate_skills
    .split(";")
    .map((skill) => skill.trim())
    .filter((skill) => skill) // Eliminar vacíos
    .map((skill) => `<li>${skill}</li>`)
    .join("");

  const criteriaList = member.certificate_criteria
    .split(";")
    .map((criterion) => criterion.trim())
    .filter((criterion) => criterion) // Eliminar vacíos
    .map((criterion) => `<li>${criterion}</li>`)
    .join("");

  const formattedIssueDate = formatDate(member.certificate_issueDate);
  const projectEvidenceLink = `project.html?slug=${project.slug}`;

  // Texto base del certificado con reemplazos
  const baseText = `Este certificado es expedido por parte de Gnius Club y ${
    member.certificate_college || "[Colegio no especificado]"
  }. La persona que obtuvo esta insignia presentó de manera exitosa el proyecto que realizó durante el curso ${
    member.certificate_courseName || "[Curso no especificado]"
  }, demostrando que es capaz de: Identificar un problema real relacionado con el uso de la tecnología y la información y construir una solución pertinente y significativa para resolverlo. También demuestra que puede aplicar las herramientas aprendidas para desarrollar proyectos de ${
    member.certificate_badgeName || "[Insignia no especificada]"
  } a nivel ${member.certificate_level || "[Nivel no especificado]"}.`;

  const certificateHTML = `
    <div class="certificate-container">
        <div class="certificate-header">
             <img src="https://gnius.club/wp-content/uploads/2024/03/Logo-Gnius-Club-Light-Large.svg" alt="Gnius Club Logo" class="h-16 mx-auto mb-4">
            <p class="course-name">${member.certificate_courseName}</p>
            <h2 class="badge-name">${member.certificate_badgeName}</h2>
            <p class="text-lg text-gnius-gray">Nivel: ${
              member.certificate_level
            }</p>
        </div>

        <p class="text-center text-lg text-gnius-light mb-4">Otorgado a:</p>
        <p class="student-name text-center">${member.name}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8">
            <div class="certificate-section">
                <span class="certificate-label">Habilidades Demostradas</span>
                ${
                  skillsList
                    ? `<ul class="certificate-list">${skillsList}</ul>`
                    : '<p class="text-sm text-gnius-gray">No especificadas.</p>'
                }
            </div>

            <div class="certificate-section">
                <span class="certificate-label">Criterios de Evaluación Cumplidos</span>
                 ${
                   criteriaList
                     ? `<ul class="certificate-list">${criteriaList}</ul>`
                     : '<p class="text-sm text-gnius-gray">No especificados.</p>'
                 }
            </div>
        </div>

        <div class="certificate-section mt-6 text-center">
             <span class="certificate-label">Evidencia del Proyecto</span>
             <a href="${projectEvidenceLink}" class="gnius-link text-lg">
                 <i class="fas fa-search-plus mr-1"></i> Ver Proyecto "${
                   project.projectTitle || "Proyecto Asociado"
                 }"
             </a>
         </div>

        <div class="certificate-section mt-8 border-t border-gray-700 pt-6">
            <p class="text-base text-gnius-light leading-relaxed mb-4">${baseText}</p>
            <p class="issuance-info text-center">
                Emitido por Gnius Club y ${member.certificate_college} <br>
                Fecha de Emisión: ${formattedIssueDate}
            </p>
             ${
               member.sbtLink
                 ? `
                 <p class="text-center mt-4">
                     <a href="${member.sbtLink}" target="_blank" rel="noopener noreferrer" class="gnius-link text-sm" title="Ver Soulbound Token (SBT)">
                         <i class="fas fa-external-link-alt mr-1"></i> Verificar Credencial (SBT)
                     </a>
                 </p>
             `
                 : ""
             }
        </div>
    </div>
    `;

  certificateDetailsContainer.innerHTML = certificateHTML;
  certificateDetailsContainer.classList.remove("opacity-0"); // Mostrar con fade-in
}

/**
 * Inicializa la página del certificado.
 */
async function initializeCertificatePage() {
  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const slug = getQueryParam("slug");
  const memberIndexStr = getQueryParam("member");

  if (!slug || memberIndexStr === null) {
    displayError(
      "Información inválida para cargar el certificado (faltan 'slug' o 'member' en la URL)."
    );
    return;
  }

  const memberIndex = parseInt(memberIndexStr, 10);
  if (isNaN(memberIndex) || memberIndex < 0) {
    displayError("Índice de miembro inválido en la URL.");
    return;
  }

  const projects = await fetchAllData();
  if (projects.length === 0) {
    // El error ya se mostró en fetchAllData si falló la carga
    return;
  }

  const project = findProjectBySlug(slug, projects);

  if (!project) {
    displayError(`El proyecto asociado con slug "${slug}" no fue encontrado.`);
    return;
  }

  if (!project.teamMembers || memberIndex >= project.teamMembers.length) {
    displayError(
      `No se encontró el miembro del equipo con índice ${memberIndex} en el proyecto "${project.projectTitle}".`
    );
    return;
  }

  const member = project.teamMembers[memberIndex];
  renderCertificate(member, project);
}

document.addEventListener("DOMContentLoaded", initializeCertificatePage);
