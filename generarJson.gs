/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file authorization,
 * letting users know that the script only accesses the current spreadsheet.
 */

/**
 * Adds a custom menu to the spreadsheet.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Gnius Club Tools')
      .addItem('Generar JSON de Proyectos', 'showJsonDialog')
      .addToUi();
}

/**
 * Shows a dialog box with the generated JSON.
 */
function showJsonDialog() {
  try {
    const jsonString = generateProjectsJson();
    // Use HtmlService to create a larger dialog with selectable text area
    const htmlOutput = HtmlService.createHtmlOutput('<textarea style="width: 95%; height: 300px;" readonly>' + escapeHtml(jsonString) + '</textarea>')
        .setWidth(600)
        .setHeight(400);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'JSON Generado (Copia y Pega)');
  } catch (e) {
    Logger.log("Error generating JSON: " + e);
    SpreadsheetApp.getUi().alert('Error al generar el JSON: ' + e.message + '. Revisa los Logs (Ver > Logs) y el formato de tus datos.');
  }
}

/**
 * Utility function to escape HTML characters for display in HtmlService.
 */
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&")
         .replace(/</g, "<")
         .replace(/>/g, ">")
         .replace(/"/g, """)
         .replace(/'/g, "'");
 }


/**
 * Generates the JSON string from the spreadsheet data.
 * Assumes data is in a sheet named "Proyectos" or the active sheet if "Proyectos" doesn't exist.
 * Assumes the first row contains headers matching the JSON keys or key paths (e.g., coverUrl_url).
 */
function generateProjectsJson() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Proyectos");
  if (!sheet) {
      sheet = ss.getActiveSheet();
      Logger.log("Sheet 'Proyectos' not found. Using active sheet: " + sheet.getName());
  }

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  if (values.length < 2) {
    Logger.log("No data found in the sheet (less than 2 rows).");
    return "[]"; // Return empty array if no data rows
  }

  const headers = values[0].map(header => header.trim());
  const projects = [];

  // Get column indices based on headers
  const headerMap = {};
  headers.forEach((header, index) => {
    headerMap[header] = index;
  });

  // Slug generation function
  const generateSlug = (title) => {
    if (!title || typeof title !== 'string') return 'proyecto-sin-titulo-' + Date.now();
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove non-word chars (excluding space and hyphen)
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
  };


  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const project = {};

    // --- Simple Fields ---
    const projectTitle = row[headerMap['projectTitle']];
    if (!projectTitle) {
        Logger.log("Skipping row " + (i+1) + " due to missing projectTitle.");
        continue; // Skip row if essential title is missing
    }
    project.projectTitle = projectTitle;
    project.slug = generateSlug(projectTitle); // Generate slug

    if (headerMap['projectCategory'] !== undefined && row[headerMap['projectCategory']]) project.projectCategory = row[headerMap['projectCategory']];
    if (headerMap['studentLevel'] !== undefined && row[headerMap['studentLevel']]) project.studentLevel = row[headerMap['studentLevel']];
    if (headerMap['projectDate'] !== undefined && row[headerMap['projectDate']]) {
        // Attempt to format date correctly, assuming it might be a Date object or string
        try {
           const dateValue = row[headerMap['projectDate']];
           if (dateValue instanceof Date) {
                project.projectDate = Utilities.formatDate(dateValue, Session.getScriptTimeZone(), "yyyy-MM-dd");
           } else if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
               project.projectDate = dateValue; // Assume already correct format
           } else if (dateValue) {
               // Try parsing common formats if needed, otherwise keep original string or log warning
               project.projectDate = dateValue.toString(); // Keep as string if unsure
               Logger.log(`Warning: projectDate in row ${i+1} ('${dateValue}') might not be in YYYY-MM-DD format.`);
           }
        } catch (e) {
            Logger.log(`Warning: Could not format projectDate in row ${i+1}: ${e.message}`);
            if (row[headerMap['projectDate']]) project.projectDate = row[headerMap['projectDate']].toString(); // Fallback to string
        }
    }
    if (headerMap['intro_title'] !== undefined && row[headerMap['intro_title']]) project.intro_title = row[headerMap['intro_title']];
    if (headerMap['intro_content'] !== undefined && row[headerMap['intro_content']]) project.intro_content = row[headerMap['intro_content']];
    if (headerMap['problemDescription'] !== undefined && row[headerMap['problemDescription']]) project.problemDescription = row[headerMap['problemDescription']];
    if (headerMap['solutionProposed'] !== undefined && row[headerMap['solutionProposed']]) project.solutionProposed = row[headerMap['solutionProposed']];
    if (headerMap['innovationProcess'] !== undefined && row[headerMap['innovationProcess']]) project.innovationProcess = row[headerMap['innovationProcess']];


    // --- Nested Objects (coverUrl, media) ---
    const coverUrl_url = headerMap['coverUrl_url'] !== undefined ? row[headerMap['coverUrl_url']] : null;
    const coverUrl_altText = headerMap['coverUrl_altText'] !== undefined ? row[headerMap['coverUrl_altText']] : null;
    if (coverUrl_url && coverUrl_altText) {
        project.coverUrl = { url: coverUrl_url, altText: coverUrl_altText };
    } else if (coverUrl_url) {
        project.coverUrl = { url: coverUrl_url, altText: 'Cover image' }; // Default alt text
         Logger.log(`Warning: Missing alt text for coverUrl in row ${i+1}.`);
    } else {
         Logger.log(`Error: Missing required coverUrl_url for project in row ${i+1}. Setting placeholder.`);
         project.coverUrl = { url: "https://placehold.co/600x338/111/FFF/png?text=Missing+Image", altText: "Placeholder image" };
    }


    const media_type = headerMap['media_type'] !== undefined ? row[headerMap['media_type']] : null;
    const media_url = headerMap['media_url'] !== undefined ? row[headerMap['media_url']] : null;
    const media_altText = headerMap['media_altText'] !== undefined ? row[headerMap['media_altText']] : null;
    if (media_type && media_url) {
      project.media = { type: media_type, url: media_url };
      if (media_altText) project.media.altText = media_altText;
    }

    // --- Arrays of Objects (teamMembers, technologies, additionalResources, imageGallery) ---
    // Function to parse complex cell data: "prop1A;prop2A | prop1B;prop2B"
    const parseComplexCell = (cellData, props) => {
      if (!cellData || typeof cellData !== 'string' || cellData.trim() === '') return [];
      const items = cellData.split(' | ');
      return items.map(item => {
        const values = item.split(';');
        const obj = {};
        props.forEach((prop, index) => {
          obj[prop] = values[index] ? values[index].trim() : null; // Assign null if value missing
        });
        return obj;
      }).filter(obj => obj[props[0]]); // Filter out items where the first property is missing/null
    };

     // Team Members (Added Certificate Fields)
    if (headerMap['teamMembers'] !== undefined && row[headerMap['teamMembers']]) {
        const memberProps = [
            "name", "role", "sbtLink",
            "certificate_courseName", "certificate_badgeName", "certificate_level",
            "certificate_skills", "certificate_criteria", "certificate_college", "certificate_issueDate"
        ];
        project.teamMembers = parseComplexCell(row[headerMap['teamMembers']], memberProps);
         // Basic validation check
         if (project.teamMembers.length === 0 && row[headerMap['teamMembers']].trim() !== '') {
            Logger.log(`Warning: Could not parse teamMembers for row ${i+1}. Check format: ${row[headerMap['teamMembers']]}`);
         } else if (project.teamMembers.length === 0) {
             Logger.log(`Error: Missing required teamMembers for project in row ${i+1}. Adding placeholder.`);
             project.teamMembers = [{ name: "Participante No Especificado", role: "Estudiante", sbtLink: null, certificate_courseName:"N/A", certificate_badgeName:"N/A", certificate_level:"N/A", certificate_skills:"N/A", certificate_criteria:"N/A", certificate_college:"N/A", certificate_issueDate:"N/A" }];
         }
    } else {
         Logger.log(`Error: Missing required teamMembers for project in row ${i+1}. Adding placeholder.`);
         project.teamMembers = [{ name: "Participante No Especificado", role: "Estudiante", sbtLink: null, certificate_courseName:"N/A", certificate_badgeName:"N/A", certificate_level:"N/A", certificate_skills:"N/A", certificate_criteria:"N/A", certificate_college:"N/A", certificate_issueDate:"N/A" }];
    }


    // Technologies
    if (headerMap['technologies'] !== undefined && row[headerMap['technologies']]) {
        const techProps = ["name", "icon", "category"];
        project.technologies = parseComplexCell(row[headerMap['technologies']], techProps);
         if (project.technologies.length === 0 && row[headerMap['technologies']].trim() !== '') {
             Logger.log(`Warning: Could not parse technologies for row ${i+1}. Check format: ${row[headerMap['technologies']]}`);
         } else if (project.technologies.length === 0) {
             Logger.log(`Error: Missing required technologies for project in row ${i+1}. Adding placeholder.`);
             project.technologies = [{ name: "Tecnología No Especificada", icon: "question-circle", category: "Tool" }];
         }
    } else {
        Logger.log(`Error: Missing required technologies for project in row ${i+1}. Adding placeholder.`);
        project.technologies = [{ name: "Tecnología No Especificada", icon: "question-circle", category: "Tool" }];
    }


    // Additional Resources (Optional)
    if (headerMap['additionalResources'] !== undefined && row[headerMap['additionalResources']]) {
        const resourceProps = ["title", "url", "type"];
        project.additionalResources = parseComplexCell(row[headerMap['additionalResources']], resourceProps);
        if (project.additionalResources.length === 0 && row[headerMap['additionalResources']].trim() !== '') {
             Logger.log(`Warning: Could not parse additionalResources for row ${i+1}. Check format: ${row[headerMap['additionalResources']]}`);
        }
    } // No else clause, it's optional

    // Image Gallery (Optional)
    if (headerMap['imageGallery'] !== undefined && row[headerMap['imageGallery']]) {
        const galleryProps = ["url", "altText", "caption"]; // Caption is optional
        project.imageGallery = parseComplexCell(row[headerMap['imageGallery']], galleryProps);
        // Ensure required fields 'url' and 'altText' are present for each item
        project.imageGallery = project.imageGallery.filter(img => img.url && img.altText);
        if (project.imageGallery.length === 0 && row[headerMap['imageGallery']].trim() !== '') {
             Logger.log(`Warning: Could not parse imageGallery for row ${i+1}, or items lack url/altText. Check format: ${row[headerMap['imageGallery']]}`);
        }
    } // No else clause, it's optional


     // --- Evaluation Scores ---
     project.evaluationScores = {};
     headers.forEach((header, index) => {
       if (header.startsWith('eval_')) {
         const scoreKey = header; // Keep the full key 'eval_Whatever'
         const scoreValue = parseFloat(row[index]);
         if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100) {
           project.evaluationScores[scoreKey] = scoreValue;
         } else if (row[index] !== undefined && row[index] !== '') { // Only warn if cell is not empty but invalid
            Logger.log(`Warning: Invalid score for ${scoreKey} in row ${i+1}: '${row[index]}'. Score must be a number between 0-100. Omitting score.`);
         }
       }
     });
     // Check if evaluationScores object is empty, log warning if so
      if (Object.keys(project.evaluationScores).length === 0) {
        Logger.log(`Warning: No valid evaluation scores found for project in row ${i+1}. The evaluationScores object will be empty.`);
     }


    projects.push(project);
  } // End row loop

  return JSON.stringify(projects, null, 2); // Pretty print JSON
}