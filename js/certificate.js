document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const projectSlug = params.get("slug");
  const memberIndexParam = params.get("member"); // Get index as string

  const loadingMessage = document.getElementById("loading-message");
  const errorMessage = document.getElementById("error-message");
  const certificateContent = document.getElementById("certificate-content");

  // Validate parameters
  if (
    !projectSlug ||
    memberIndexParam === null ||
    isNaN(parseInt(memberIndexParam))
  ) {
    showError(
      "Faltan parámetros válidos (slug del proyecto o índice del miembro)."
    );
    return;
  }

  const memberIndex = parseInt(memberIndexParam); // Convert to number

  // Base text for the certificate description
  const certificateBaseText =
    "Este certificado es expedido por parte de Gnius Club y {college}. La persona que obtuvo esta insignia presentó de manera exitosa el proyecto que realizó durante el curso {courseName}, demostrando que es capaz de: Identificar un problema real relacionado con el uso de la tecnología y la información y construir una solución pertinente y significativa para resolverlo. También demuestra que puede aplicar las herramientas aprendidas para desarrollar proyectos de {badgeName} a nivel {level}.";

  // --- Fetch Data and Find Member ---
  async function loadCertificateDetails() {
    try {
      const response = await fetch(
        "data/projects.json?cachebust=" + Date.now()
      ); // Cache busting
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const projects = await response.json();
      const project = projects.find((p) => p.slug === projectSlug);

      if (
        project &&
        project.teamMembers &&
        memberIndex >= 0 &&
        memberIndex < project.teamMembers.length
      ) {
        const member = project.teamMembers[memberIndex];
        // Check if essential certificate fields exist
        if (
          member.certificate_courseName &&
          member.certificate_badgeName &&
          member.certificate_level &&
          member.certificate_skills &&
          member.certificate_criteria &&
          member.certificate_college &&
          member.certificate_issueDate
        ) {
          renderCertificate(project, member);
          loadingMessage.style.display = "none";
          certificateContent.style.display = "block"; // Show content
        } else {
          showError("Datos del certificado incompletos para este miembro.");
        }
      } else {
        showError("Proyecto o miembro del equipo no encontrado.");
      }
    } catch (error) {
      console.error("Error loading certificate details:", error);
      showError("Error al cargar los datos del certificado.");
    }
  }

  function showError(message) {
    loadingMessage.style.display = "none";
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    certificateContent.style.display = "none";
  }

  // --- Render Certificate Content ---
  function renderCertificate(project, member) {
    document.title = `Certificado: ${member.name} - ${member.certificate_badgeName}`; // Update page title

    // Populate fields
    document.getElementById("student-name").textContent = member.name;
    document.getElementById("course-name").textContent =
      member.certificate_courseName;
    document.getElementById("badge-name").textContent =
      member.certificate_badgeName;
    document.getElementById("level-name").textContent =
      member.certificate_level;
    document.getElementById(
      "college-name"
    ).textContent = `Emitido por ${member.certificate_college}`; // Added college to header

    // Render Skills as Chips
    const skillsList = document.getElementById("skills-list");
    skillsList.innerHTML = ""; // Clear previous
    member.certificate_skills.split(";").forEach((skill) => {
      if (skill.trim()) {
        const chip = document.createElement("span");
        chip.className = "chip chip-cyan";
        chip.textContent = skill.trim();
        skillsList.appendChild(chip);
      }
    });

    // Render Criteria as Chips
    const criteriaList = document.getElementById("criteria-list");
    criteriaList.innerHTML = ""; // Clear previous
    member.certificate_criteria.split(";").forEach((criterion) => {
      if (criterion.trim()) {
        const chip = document.createElement("span");
        chip.className = "chip chip-yellow";
        chip.textContent = criterion.trim();
        criteriaList.appendChild(chip);
      }
    });

    // Set Project Link
    const projectLink = document.getElementById("project-link");
    projectLink.href = `project.html?slug=${project.slug}`;
    projectLink.title = `Ver el proyecto "${project.projectTitle}"`;

    // Format and Set Description
    let description = certificateBaseText;
    description = description.replace("{college}", member.certificate_college);
    description = description.replace(
      "{courseName}",
      member.certificate_courseName
    );
    description = description.replace(
      "{badgeName}",
      member.certificate_badgeName
    );
    description = description.replace("{level}", member.certificate_level);
    document.getElementById("certificate-description").textContent =
      description;

    // Set Issuer Info
    document.getElementById("issuer-college").textContent =
      member.certificate_college;
    document.getElementById("issue-date").textContent =
      member.certificate_issueDate;
  }

  // --- Initial Load ---
  loadCertificateDetails();

  // --- Footer Year ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  } else {
    console.warn(
      "Element with ID 'current-year' not found in certificate footer."
    );
  }
});
