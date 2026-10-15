
"use strict";

// Sample internship records supplied for this project.
const internships = [
  {
    id: "INT-101",
    title: "Frontend Intern",
    domain: "Full Stack Development",
    mode: "Remote",
    location: "India",
    skills: ["HTML", "CSS", "JavaScript"],
    openings: 3
  },
  {
    id: "INT-102",
    title: "API Engineering Intern",
    domain: "Full Stack Development",
    mode: "Hybrid",
    location: "Pune",
    skills: ["Node.js", "SQL", "Testing"],
    openings: 2
  },
  {
    id: "INT-103",
    title: "UI/UX Intern",
    domain: "UI/UX",
    mode: "Remote",
    location: "India",
    skills: ["Figma", "Research", "Accessibility"],
    openings: 1
  },
  {
    id: "INT-104",
    title: "Data Analyst Intern",
    domain: "Data Analytics",
    mode: "On-site",
    location: "Bengaluru",
    skills: ["Excel", "SQL", "Data visualisation"],
    openings: 2
  },
  {
    id: "INT-105",
    title: "Security Operations Intern",
    domain: "Cyber Security",
    mode: "Remote",
    location: "India",
    skills: ["Linux", "Logs", "Networking"],
    openings: 1
  }
];

// Get HTML elements.
const searchInput = document.querySelector("#search");
const domainFilter = document.querySelector("#domain");
const modeFilter = document.querySelector("#mode");
const resetButton = document.querySelector("#reset");
const internshipList = document.querySelector("#internship-list");
const resultCount = document.querySelector("#result-count");
const statusBox = document.querySelector("#status");
const retryButton = document.querySelector("#retry");

const detailsDialog = document.querySelector("#details-dialog");
const detailsTitle = document.querySelector("#dialog-title");
const detailsBody = document.querySelector("#dialog-body");
const closeDialogButton = document.querySelector("#close-dialog");
const applyFromDetails = document.querySelector("#apply-from-details");

const applyDialog = document.querySelector("#apply-dialog");
const applyRole = document.querySelector("#apply-role");
const applicationForm = document.querySelector("#application-form");
const formMessage = document.querySelector("#form-message");
const closeApplyButton = document.querySelector("#close-apply");

let selectedInternship = null;

// Show a message to the user.
function showStatus(message) {
  statusBox.textContent = message;
  statusBox.hidden = false;
}

// Escape text before inserting it into HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Read saved application IDs safely.
function getSavedApplications() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("internshipApplications") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Filter internships using search, domain and work mode.
function getFilteredInternships() {
  const query = searchInput.value.trim().toLowerCase();
  const domain = domainFilter.value;
  const mode = modeFilter.value;

  return internships.filter(internship => {
    const searchableText = [
      internship.title,
      internship.domain,
      internship.location,
      ...internship.skills
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);
    const matchesDomain =
      domain === "all" || internship.domain === domain;
    const matchesMode =
      mode === "all" || internship.mode === mode;

    return matchesSearch && matchesDomain && matchesMode;
  });
}

// Build and display internship cards.
function renderInternships() {
  retryButton.hidden = true;
  statusBox.hidden = true;

  const filtered = getFilteredInternships();

  resultCount.textContent =
    `${filtered.length} internship${filtered.length === 1 ? "" : "s"} found`;

  if (filtered.length === 0) {
    internshipList.replaceChildren();
    showStatus(
      "No internships found. Try another search or clear your filters."
    );
    return;
  }

  internshipList.innerHTML = filtered.map(internship => `
    <article class="internship-card">
      <div class="card-top">
        <span class="domain-label">${escapeHTML(internship.domain)}</span>
        <span class="card-id">${escapeHTML(internship.id)}</span>
      </div>

      <h3>${escapeHTML(internship.title)}</h3>

      <div class="card-info">
        <p>📍 ${escapeHTML(internship.location)}</p>
        <p>💼 ${escapeHTML(internship.mode)}</p>
        <p>👥 ${internship.openings} opening(s)</p>
      </div>

      <div class="skills" aria-label="Required skills">
        ${internship.skills.map(skill =>
          `<span class="skill">${escapeHTML(skill)}</span>`
        ).join("")}
      </div>

      <div class="card-actions">
        <button class="secondary-button"
          type="button" data-action="details"
          data-id="${escapeHTML(internship.id)}">
          View details
        </button>

        <button class="primary-button"
          type="button" data-action="apply"
          data-id="${escapeHTML(internship.id)}">
          Apply now
        </button>
      </div>
    </article>
  `).join("");
}

// Find an internship using its ID.
function findInternship(id) {
  return internships.find(item => item.id === id);
}

// Open the internship details dialog.
function openDetails(id) {
  const internship = findInternship(id);
  if (!internship) return;

  selectedInternship = internship;
  detailsTitle.textContent = internship.title;

  detailsBody.innerHTML = `
    <p><strong>Domain:</strong> ${escapeHTML(internship.domain)}</p>
    <p><strong>Work mode:</strong> ${escapeHTML(internship.mode)}</p>
    <p><strong>Location:</strong> ${escapeHTML(internship.location)}</p>
    <p><strong>Openings:</strong> ${internship.openings}</p>
    <p><strong>Skills:</strong>
      ${internship.skills.map(escapeHTML).join(", ")}
    </p>
    <p>This is a sample internship record for the project.</p>
  `;

  detailsDialog.showModal();
}

// Open the application form.
function openApplication(id) {
  const internship = findInternship(id);
  if (!internship) return;

  selectedInternship = internship;
  applyRole.textContent = `Applying for: ${internship.title}`;
  formMessage.textContent = "";
  applicationForm.reset();

  detailsDialog.close();
  applyDialog.showModal();

  document.querySelector("#applicant-name").focus();
}

// Use event delegation for the card buttons.
internshipList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.action === "details") {
    openDetails(id);
  } else if (button.dataset.action === "apply") {
    openApplication(id);
  }
});

// Update the results when a filter changes.
searchInput.addEventListener("input", renderInternships);
domainFilter.addEventListener("change", renderInternships);
modeFilter.addEventListener("change", renderInternships);

// Reset all filters.
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  domainFilter.value = "all";
  modeFilter.value = "all";
  renderInternships();
  searchInput.focus();
});

// Dialog controls.
closeDialogButton.addEventListener("click", () => {
  detailsDialog.close();
});

closeApplyButton.addEventListener("click", () => {
  applyDialog.close();
});

applyFromDetails.addEventListener("click", () => {
  if (selectedInternship) {
    openApplication(selectedInternship.id);
  }
});

// Validate and save a demo application.
applicationForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!selectedInternship) {
    formMessage.textContent = "Please select an internship first.";
    return;
  }

  const name = document.querySelector("#applicant-name").value.trim();
  const email = document.querySelector("#applicant-email").value.trim();
  const portfolio = document.querySelector("#portfolio").value.trim();

  if (!name || name.length > 80) {
    formMessage.textContent = "Please enter a valid full name.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email) || email.length > 254) {
    formMessage.textContent = "Please enter a valid email address.";
    return;
  }

  // Only allow secure HTTPS portfolio links.
  if (portfolio) {
    try {
      const url = new URL(portfolio);

      if (url.protocol !== "https:") {
        formMessage.textContent =
          "Portfolio URL must start with https://";
        return;
      }
    } catch {
      formMessage.textContent = "Please enter a valid portfolio URL.";
      return;
    }
  }

  const applications = getSavedApplications();

  // Prevent duplicate applications for the same role and email.
  const duplicate = applications.some(application =>
    application.internshipId === selectedInternship.id &&
    application.email.toLowerCase() === email.toLowerCase()
  );

  if (duplicate) {
    formMessage.textContent =
      "You have already applied for this internship on this browser.";
    return;
  }

  applications.push({
    internshipId: selectedInternship.id,
    email: email,
    name: name,
    submittedAt: new Date().toISOString()
  });

  try {
    localStorage.setItem(
      "internshipApplications",
      JSON.stringify(applications)
    );
  } catch {
    formMessage.textContent =
      "Unable to save this demo application in your browser.";
    return;
  }

  formMessage.textContent =
    "Demo application saved successfully on this browser!";

  applicationForm.reset();
});

// Retry button for the error state.
retryButton.addEventListener("click", () => {
  renderInternships();
});

// Initial page load.
function initializeApp() {
  try {
    if (!Array.isArray(internships) || internships.length === 0) {
      throw new Error("No internship records available.");
    }

    renderInternships();
  } catch {
    internshipList.replaceChildren();
    resultCount.textContent = "Unable to load internships";
    showStatus("Something went wrong while loading the internships.");
    retryButton.hidden = false;
  }
}

initializeApp();
