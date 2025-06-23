
      // Enhanced App Initialization
      let currentUser = "{{user.username}}";
      let opportunities = [];
      let filteredOpportunities = [];
      let isEditMode = false;
      let currentEditId = null;
      let searchTimeout = null;

      // Initialize the app
      function initApp() {
        document.getElementById("usernameDisplay").textContent = currentUser;
        loadOpportunities();
        setupEventListeners();
        renderOpportunities();
        updateStats();
        checkThemePreference();

        // Initialize PPO field visibility
        document
          .getElementById("jobType")
          .addEventListener("change", togglePPOField);
      }

      // Toggle PPO field based on job type
      function togglePPOField() {
        const jobType = document.getElementById("jobType").value;
        const ppoField = document.getElementById("ppo").closest(".form-group");

        if (jobType === "internship") {
          ppoField.style.display = "block";
          document.getElementById("ppo").required = true;
        } else {
          ppoField.style.display = "none";
          document.getElementById("ppo").required = false;
          document.getElementById("ppo").value = "";
        }
      }

      // Enhanced Event Listeners
      function setupEventListeners() {
        // Debounced search
        document
          .getElementById("searchInput")
          .addEventListener("input", function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(applyFilters, 300);
          });

        // Other filter event listeners
        document
          .getElementById("typeFilter")
          .addEventListener("change", applyFilters);
        document
          .getElementById("modeFilter")
          .addEventListener("change", applyFilters);
        document
          .getElementById("ppoFilter")
          .addEventListener("change", applyFilters);
        document
          .getElementById("fromDate")
          .addEventListener("change", applyFilters);
        document
          .getElementById("toDate")
          .addEventListener("change", applyFilters);


  document.addEventListener('click', function(event) {
  // Close dropdown when clicking outside
  if (!event.target.closest('.dropdown')) {
    document.getElementById('userDropdown').classList.remove('show');
  }
  
  // Close modal when clicking on modal background
  if (event.target.classList.contains("modal")) {
    closeModal();
  }
});
      }

      // Opportunity Management
      function loadOpportunities() {
        const stored = localStorage.getItem("internstellar_opportunities");
        if (stored) {
          opportunities = JSON.parse(stored);
        } else {
          // Add some sample data
          opportunities = [];
          saveOpportunities();
        }
        filteredOpportunities = [...opportunities];
      }

      function saveOpportunities() {
        localStorage.setItem(
          "internstellar_opportunities",
          JSON.stringify(opportunities)
        );
      }

      // Modal Functions
      function openAddModal() {
        isEditMode = false;
        currentEditId = null;
        document.getElementById("modalTitle").textContent =
          "Add New Opportunity";
        document.getElementById("modalActionBtn").innerHTML =
          '<i class="fas fa-plus"></i> Add Opportunity';
        document.getElementById("deleteBtn").style.display = "none";
        document.getElementById("opportunityForm").reset();

        // Initialize PPO field visibility
        togglePPOField();

        document.getElementById("opportunityModal").classList.add("show");
      }

      function openEditModal(id) {
        const opportunity = opportunities.find((op) => op.id === id);
        if (!opportunity) return;

        isEditMode = true;
        currentEditId = id;
        document.getElementById("modalTitle").textContent = "Edit Opportunity";
        document.getElementById("modalActionBtn").innerHTML =
          '<i class="fas fa-save"></i> Save Changes';
        document.getElementById("deleteBtn").style.display = "block";

        // Populate form
        document.getElementById("opportunityId").value = opportunity.id;
        document.getElementById("companyName").value = opportunity.company;
        document.getElementById("role").value = opportunity.role;
        document.getElementById("jobType").value = opportunity.type;
        document.getElementById("workMode").value = opportunity.workMode;
        document.getElementById("location").value = opportunity.location;
        document.getElementById("stipend").value = opportunity.stipend || "";
        document.getElementById("ppo").value = opportunity.ppo;
        document.getElementById("applyLink").value = opportunity.applyLink;
        document.getElementById("description").value =
          opportunity.description || "";

        // Set PPO field visibility
        togglePPOField();

        document.getElementById("opportunityModal").classList.add("show");
      }

      function saveOpportunity() {
        const form = document.getElementById("opportunityForm");
        const jobType = document.getElementById("jobType").value;
        let requiredFields = [
          "companyName",
          "role",
          "jobType",
          "workMode",
          "location",
          "applyLink",
        ];

        // Only require PPO for internships
        if (jobType === "internship") {
          requiredFields.push("ppo");
        }

        let isValid = true;

        // Validate form
        requiredFields.forEach((field) => {
          const element = document.getElementById(field);
          if (!element.value.trim()) {
            element.style.borderColor = "red";
            isValid = false;
          } else {
            element.style.borderColor = "";
          }
        });

        if (!isValid) {
          showToast("Please fill in all required fields", "error");
          return;
        }

        const opportunityData = {
          id: isEditMode ? currentEditId : Date.now(),
          company: document.getElementById("companyName").value.trim(),
          role: document.getElementById("role").value.trim(),
          type: jobType,
          workMode: document.getElementById("workMode").value,
          location: document.getElementById("location").value.trim(),
          stipend: document.getElementById("stipend").value.trim(),
          ppo:
            jobType === "internship"
              ? document.getElementById("ppo").value
              : "no",
          applyLink: document.getElementById("applyLink").value.trim(),
          description: document.getElementById("description").value.trim(),
          postedBy: currentUser,
          datePosted: isEditMode
            ? opportunities.find((op) => op.id === currentEditId).datePosted
            : new Date().toISOString(),
        };

        if (isEditMode) {
          // Update existing opportunity
          const index = opportunities.findIndex(
            (op) => op.id === currentEditId
          );
          if (index !== -1) {
            opportunities[index] = opportunityData;
            showToast("Opportunity updated successfully!", "success");
          }
        } else {
          // Add new opportunity
          opportunities.unshift(opportunityData);
          showToast("Opportunity added successfully!", "success");
        }

        saveOpportunities();
        filteredOpportunities = [...opportunities];
        renderOpportunities();
        updateStats();
        closeModal();
      }

      function deleteOpportunity() {
        if (confirm("Are you sure you want to delete this opportunity?")) {
          opportunities = opportunities.filter((op) => op.id !== currentEditId);
          saveOpportunities();
          filteredOpportunities = filteredOpportunities.filter(
            (op) => op.id !== currentEditId
          );
          renderOpportunities();
          updateStats();
          showToast("Opportunity deleted successfully!", "success");
          closeModal();
        }
      }

      function closeModal() {
        document.getElementById("opportunityModal").classList.remove("show");
      }

      // Rendering Functions
      function renderOpportunities() {
        const container = document.getElementById("jobListings");

        if (filteredOpportunities.length === 0) {
          container.innerHTML = `
                    <div class="no-opportunities">
                        <h3>No opportunities found</h3>
                        <p>Try adjusting your filters or add a new opportunity!</p>
                    </div>
                `;
          return;
        }

        container.innerHTML = filteredOpportunities
          .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
          .map(
            (job) => `
                <div class="job-card">
                    <div class="job-header">
                        <div>
                            <div class="job-title">${job.role}</div>
                            <div class="company-name">${job.company}</div>
                        </div>
                        ${
                          job.postedBy === currentUser
                            ? `
                        <div class="job-actions">
                            <button class="edit-btn" onclick="openEditModal(${job.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    
                    <div class="job-details">
                        <div class="job-detail">
                            <i class="fas fa-map-marker-alt"></i> ${
                              job.location
                            }
                        </div>
                        <div class="job-detail">
                            <i class="fas fa-laptop-house"></i> ${job.workMode}
                        </div>
                        ${
                          job.stipend
                            ? `<div class="job-detail"><i class="fas fa-money-bill-wave"></i> ${job.stipend}</div>`
                            : ""
                        }
                    </div>
                    
                    <div class="job-tags">
                        <span class="job-tag">${job.type}</span>
                        <span class="job-tag">PPO: ${job.ppo}</span>
                    </div>
                    
                    ${
                      job.description
                        ? `<div class="job-description">${job.description}</div>`
                        : ""
                    }
                    
                    <div class="job-footer">
                        <div class="job-meta">
                            <i class="fas fa-user"></i> Posted by <strong> ${
                              job.postedBy
                            } </strong>• <i class="fas fa-clock"></i> ${formatDate(
              job.datePosted
            )}
                        </div>
                        <a href="${
                          job.applyLink
                        }" target="_blank" class="apply-btn">
                            <i class="fas fa-external-link-alt"></i> Apply Now
                        </a>
                    </div>
                </div>
            `
          )
          .join("");
      }

      function updateStats() {
        const totalJobs = opportunities.filter(
          (op) => op.type === "job"
        ).length;
        const totalInternships = opportunities.filter(
          (op) => op.type === "internship"
        ).length;
        const remoteJobs = opportunities.filter(
          (op) => op.workMode === "remote"
        ).length;
        const ppoJobs = opportunities.filter((op) => op.ppo === "yes").length;

        document.getElementById("totalJobs").textContent = totalJobs;
        document.getElementById("totalInternships").textContent =
          totalInternships;
        document.getElementById("remoteJobs").textContent = remoteJobs;
        document.getElementById("ppoJobs").textContent = ppoJobs;
      }

      // Filter Functions
      function applyFilters() {
        const search = document
          .getElementById("searchInput")
          .value.toLowerCase();
        const type = document.getElementById("typeFilter").value;
        const mode = document.getElementById("modeFilter").value;
        const ppo = document.getElementById("ppoFilter").value;
        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;

        filteredOpportunities = opportunities.filter((job) => {
          const matchSearch =
            !search ||
            job.company.toLowerCase().includes(search) ||
            job.role.toLowerCase().includes(search);

          const matchType = !type || job.type === type;
          const matchMode = !mode || job.workMode === mode;
          const matchPpo = !ppo || job.ppo === ppo;

          const jobDate = new Date(job.datePosted);
          const matchFromDate = !fromDate || jobDate >= new Date(fromDate);
          const matchToDate = !toDate || jobDate <= new Date(toDate);

          return (
            matchSearch &&
            matchType &&
            matchMode &&
            matchPpo &&
            matchFromDate &&
            matchToDate
          );
        });

        renderOpportunities();
      }

      function clearFilters() {
        document.getElementById("searchInput").value = "";
        document.getElementById("typeFilter").value = "";
        document.getElementById("modeFilter").value = "";
        document.getElementById("ppoFilter").value = "";
        document.getElementById("fromDate").value = "";
        document.getElementById("toDate").value = "";

        filteredOpportunities = [...opportunities];
        renderOpportunities();
        showToast("Filters cleared", "success");
      }

      function toggleFilters() {
        const filterSection = document.getElementById("filterSection");
        filterSection.classList.toggle("show");
      }

      function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('userDropdown');
  const isShowing = dropdown.classList.contains('show');
  
  // Close all other dropdowns first
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    if (menu !== dropdown) menu.classList.remove('show');
  });
  
  // Toggle this dropdown
  dropdown.classList.toggle('show', !isShowing);
}

      function showMyOpportunities() {
  filteredOpportunities = opportunities.filter(op => op.postedBy === currentUser);
  renderOpportunities();
  document.getElementById("userDropdown").classList.remove("show");
  
  // Add a back button container
  const header = document.querySelector(".opportunities-header");
  if (!document.getElementById("backButtonContainer")) {
    header.innerHTML += `
      <div id="backButtonContainer" style="display: flex; gap: 10px;">
        <button class="filter-btn" onclick="showAllOpportunities()">
          <i class="fas fa-arrow-left"></i> All Opportunities
        </button>
      </div>
    `;
  }
  
  showToast("Showing your posted opportunities", "success");
}


function showAllOpportunities() {
  filteredOpportunities = [...opportunities]; // Reset to all opportunities
  renderOpportunities();
  document.getElementById("backButtonContainer").remove();
  
  // Reset search input and filters
  document.getElementById("searchInput").value = "";
  clearFilters(); // This will reset all filter values
  
  showToast("Showing all opportunities", "success");
}



      function logout() {
        if (confirm("Are you sure you want to logout?")) {
          window.location.href = "/logout/";
        }
      }

      function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
      }

      // Theme Management
      function toggleTheme() {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        updateThemeIcon(isLight);
      }

      function checkThemePreference() {
        const savedTheme = localStorage.getItem("theme") || "dark";
        if (savedTheme === "light") {
          document.body.classList.add("light-theme");
        }
        updateThemeIcon(savedTheme === "light");
      }

      function updateThemeIcon(isLight) {
        const icon = document.querySelector(".theme-toggle i");
        icon.className = isLight ? "fas fa-sun" : "fas fa-moon";
      }

      // Toast Notification System
      function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      }

      // Initialize the app when page loads
      document.addEventListener("DOMContentLoaded", initApp);
