      let jobData = [
        {
          id: 1,
          company: "Google",
          role: "Software Engineer Intern",
          type: "internship",
          applyLink: "https://careers.microsoft.com/jobs/456",
          description: "Lead product strategy and work with cross-functional teams.",
          workMode: "hybrid",
          datePosted: "2024-06-13",
          stipend: "₹80,000/month",
          ppo: "yes",
          applyLink: "https://careers.google.com/jobs/123",
          description: "Work on cutting-edge technology projects with experienced engineers.",
          postedBy: {{user.username}}
        },
        {
          id: 2,
          company: "Microsoft",
          role: "Product Manager",
          type: "job",
          description: "Analyze large datasets to drive business insights and decisions.",
          workMode: "remote",
          datePosted: "2024-06-12",
          stipend: "₹25,00,000/year",
          ppo: "no",
          applyLink: "https://careers.microsoft.com/jobs/456",
          description: "Lead product strategy and work with cross-functional teams.",
          postedBy: {{user.username}}
        },
        {
          id: 3,
          company: "Amazon",
          role: "Data Scientist",
          applyLink: "https://flipkart.com/careers/101",
          description: "Build responsive web applications using React and modern frameworks.",
          location: "Hyderabad, India",
          workMode: "onsite",
          datePosted: "2024-06-10",
          stipend: "₹18,00,000/year",
          ppo: "yes",
          applyLink: "https://amazon.jobs/en/jobs/789",
          description: "Analyze large datasets to drive business insights and decisions.",
          postedBy: {{user.username}}
        },
        {
          id: 4,
          company: "Flipkart",
          role: "Frontend Developer Intern",
          description: "Drive marketing campaigns and brand awareness strategies.",
          location: "Bangalore, India",
          workMode: "hybrid",
          datePosted: "2024-06-11",
          stipend: "₹45,000/month",
          ppo: "yes",
          applyLink: "https://flipkart.com/careers/101",
          description: "Build responsive web applications using React and modern frameworks.",
          postedBy: {{user.username}}
        },
        {
          id: 5,
          company: "Zomato",
        if (savedTheme === "light") {
          body.classList.add("light-theme");
          type: "job",
          location: "Delhi, India",
          workMode: "remote",
          datePosted: "2024-06-09",
          stipend: "₹12,00,000/year",
          ppo: "no",
          applyLink: "https://zomato.com/careers/202",
          description: "Drive marketing campaigns and brand awareness strategies.",
          postedBy: {{user.username}}
        }
      ];

      let filteredJobs = [...jobData];

      // Theme toggle functionality
      window.addEventListener("DOMContentLoaded", () => {
        const savedTheme = localStorage.getItem("theme");
        const body = document.body;
        const themeToggle = document.getElementById("themeToggle");

        if (savedTheme === "light") {
          body.classList.add("light-theme");
          themeToggle.textContent = "🌙";
        } else {
          body.classList.remove("light-theme");
          themeToggle.textContent = "☀️";
        }

        renderJobs();
        updateStats();
        setupEventListeners();
      });

      function toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById("themeToggle");

        if (body.classList.contains("light-theme")) {
          body.classList.remove("light-theme");
          themeToggle.textContent = "☀️";
          localStorage.setItem("theme", "dark");
        } else {
          body.classList.add("light-theme");
          themeToggle.textContent = "🌙";
          localStorage.setItem("theme", "light");
        }
      }

      function setupEventListeners() {
        document.getElementById("searchInput").addEventListener("input", applyFilters);
        document.getElementById("typeFilter").addEventListener("change", applyFilters);
        document.getElementById("modeFilter").addEventListener("change", applyFilters);
        document.getElementById("ppoFilter").addEventListener("change", applyFilters);
        document.getElementById("dateFilter").addEventListener("change", applyFilters);
        document.getElementById("fromDate").addEventListener("change", applyFilters);
        document.getElementById("toDate").addEventListener("change", applyFilters);
      }

      function renderJobs() {
        const jobListings = document.getElementById("jobListings");
        
        if (filteredJobs.length === 0) {
          jobListings.innerHTML = `
            <div class="card">
              <div class="card-body text-center">
                <h5>No opportunities found</h5>
                <p class="text-muted">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          `;
          return;
        }

        const jobsHTML = filteredJobs.map(job => {
          const timeAgo = getTimeAgo(job.datePosted);
          const typeClass = job.type === 'internship' ? 'badge-internship' : 'badge-job';
          const modeClass = job.workMode === 'remote' ? 'badge-remote' : 
                           job.workMode === 'hybrid' ? 'badge-hybrid' : 'badge-onsite';
          
          return `
            <div class="job-card">
              <div class="job-header">
                <div class="flex-grow-1">
                  <div class="job-title">${job.role}</div>
                  <div class="company-name">${job.company}</div>
                </div>
                <div class="d-flex gap-2">
                  <span class="badge-custom ${typeClass}">${job.type.charAt(0).toUpperCase() + job.type.slice(1)}</span>
                  <span class="badge-custom ${modeClass}">${job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}</span>
                  ${job.ppo === 'yes' ? '<span class="badge-custom badge-ppo">PPO</span>' : ''}
                </div>
              </div>
              
              <div class="job-details">
                <div class="job-detail-item">
                  <i class="bi bi-geo-alt"></i>
                  <span>${job.location}</span>
                </div>
                <div class="job-detail-item">
                  <i class="bi bi-currency-rupee"></i>
                  <span>${job.stipend}</span>
                </div>
                <div class="job-detail-item">
                  <i class="bi bi-clock"></i>
                  <span>${timeAgo}</span>
                </div>
                <div class="job-detail-item">
                  <i class="bi bi-person"></i>
                  <span>Posted by ${job.postedBy}</span>
                </div>
              </div>
              
              ${job.description ? `<p class="mb-3" style="color: #cccccc;">${job.description}</p>` : ''}
              
              <div class="d-flex justify-content-between align-items-center">
                <div class="job-detail-item">
                  <i class="bi bi-calendar3"></i>
                  <span>Posted on ${formatDate(job.datePosted)}</span>
                </div>
                <a href="${job.applyLink}" target="_blank" class="btn btn-success">
                  <i class="bi bi-box-arrow-up-right me-2"></i>
                  Apply Now
                </a>
              </div>
            </div>
          `;
        }).join('');

        jobListings.innerHTML = jobsHTML;
      }

      function getTimeAgo(datePosted) {
        const now = new Date();
        const posted = new Date(datePosted);
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        if (diffDays === 0) {
          if (diffHours === 0) return 'Just now';
          return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
          return 'Yesterday';
        } else if (diffDays < 7) {
          return `${diffDays} days ago`;
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
          const months = Math.floor(diffDays / 30);
          return `${months} month${months > 1 ? 's' : ''} ago`;
        }
      }

      function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }

      function applyFilters() {
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
        const typeFilter = document.getElementById("typeFilter").value;
        const modeFilter = document.getElementById("modeFilter").value;
        const ppoFilter = document.getElementById("ppoFilter").value;
        const dateFilter = document.getElementById("dateFilter").value;
        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;

        filteredJobs = jobData.filter(job => {
          // Search filter
          const matchesSearch = !searchTerm || 
            job.company.toLowerCase().includes(searchTerm) || 
            job.role.toLowerCase().includes(searchTerm);

          // Type filter
          const matchesType = !typeFilter || job.type === typeFilter;

          // Mode filter
          const matchesMode = !modeFilter || job.workMode === modeFilter;

          // PPO filter
          const matchesPPO = !ppoFilter || job.ppo === ppoFilter;

          // Date filters
          let matchesDate = true;
          const jobDate = new Date(job.datePosted);
          const now = new Date();

          if (dateFilter) {
            switch (dateFilter) {
              case '24h':
                matchesDate = (now - jobDate) <= (24 * 60 * 60 * 1000);
                break;
              case '1w':
                matchesDate = (now - jobDate) <= (7 * 24 * 60 * 60 * 1000);
                break;
              case '1m':
                matchesDate = (now - jobDate) <= (30 * 24 * 60 * 60 * 1000);
                break;
            }
          }

          if (fromDate) {
            matchesDate = matchesDate && jobDate >= new Date(fromDate);
          }

          if (toDate) {
            matchesDate = matchesDate && jobDate <= new Date(toDate);
          }

          return matchesSearch && matchesType && matchesMode && matchesPPO && matchesDate;
        });

        renderJobs();
        updateStats();
      }

      function clearFilters() {
        document.getElementById("searchInput").value = '';
        document.getElementById("typeFilter").value = '';
        document.getElementById("modeFilter").value = '';
        document.getElementById("ppoFilter").value = '';
        document.getElementById("dateFilter").value = '';
        document.getElementById("fromDate").value = '';
        document.getElementById("toDate").value = '';
        
        filteredJobs = [...jobData];
        renderJobs();
        updateStats();
      }

      function updateStats() {
        const totalJobs = filteredJobs.filter(job => job.type === 'job').length;
        const totalInternships = filteredJobs.filter(job => job.type === 'internship').length;
        const remoteJobs = filteredJobs.filter(job => job.workMode === 'remote').length;
        const ppoJobs = filteredJobs.filter(job => job.ppo === 'yes').length;

        document.getElementById("totalJobs").textContent = totalJobs;
        document.getElementById("totalInternships").textContent = totalInternships;
        document.getElementById("remoteJobs").textContent = remoteJobs;
        document.getElementById("ppoJobs").textContent = ppoJobs;
      }

      function addOpportunity() {
        const form = document.getElementById("addOpportunityForm");
        
        // Validate required fields
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        // Get form data
        const newJob = {
          id: jobData.length + 1,
          company: document.getElementById("companyName").value,
          role: document.getElementById("role").value,
          type: document.getElementById("jobType").value,
          location: document.getElementById("location").value,
          workMode: document.getElementById("workMode").value,
          datePosted: new Date().toISOString().split('T')[0],
          stipend: document.getElementById("stipend").value || 'Not specified',
          ppo: document.getElementById("ppo").value,
          applyLink: document.getElementById("applyLink").value,
          description: document.getElementById("description").value,
          postedBy: "You" // In real app, this would be the logged-in user
        };

        // Add to job data
        jobData.unshift(newJob); // Add to beginning of array
        filteredJobs = [...jobData];

        // Reset form and close modal
        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addOpportunityModal'));
        modal.hide();

        // Re-render jobs and update stats
        renderJobs();
        updateStats();

        // Show success message
        alert('Opportunity added successfully!');
      }
    