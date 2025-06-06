document.addEventListener("DOMContentLoaded", () => {
  // LOGIN FORM HANDLER
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "dashboard.html"; // ✅ Redirect
        } else {
          document.getElementById("loginMessage").textContent = data.message;
        }
      } catch (err) {
        console.error("Login error:", err);
        document.getElementById("loginMessage").textContent = "Login failed.";
      }
    });
  }

  // SEARCH FORM HANDLER
  const form = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("resultsContainer");

  if (form && resultsContainer) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const params = new URLSearchParams();
      if (form.name.value.trim()) params.append("name", form.name.value.trim());
      if (form.gender.value) params.append("gender", form.gender.value);
      if (form.condition.value) params.append("condition", form.condition.value);
      if (form.ageFrom.value) params.append("ageFrom", form.ageFrom.value);
      if (form.ageTo.value) params.append("ageTo", form.ageTo.value);

      try {
        const res = await fetch(`/api/patients/search?${params.toString()}`);
        const data = await res.json();

        if (res.ok) {
          displayResults(data.patients);
        } else {
          resultsContainer.innerHTML = `<p style="color:red;">Error: ${data.error || 'Failed to fetch patients'}</p>`;
        }
      } catch {
        resultsContainer.innerHTML = "<p style='color:red;'>Network error. Please try again.</p>";
      }
    });
  }

  function displayResults(patients) {
    if (!patients.length) {
      resultsContainer.innerHTML = "<p>No patients found.</p>";
      return;
    }

    let html = `
      <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse;">
        <thead style="background-color:#0083b0; color:#fff;">
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    patients.forEach((p) => {
      html += `
        <tr>
          <td>${p.patientId}</td>
          <td>${p.name}</td>
          <td>${p.age}</td>
          <td>${p.gender}</td>
          <td>${p.condition}</td>
          <td>
            <a href="/update-patient.html?id=${p.patientId}">Edit</a> |
            <a href="/delete-patient.html?id=${p.patientId}">Delete</a>
          </td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    resultsContainer.innerHTML = html;
  }

  // LOGOUT FUNCTIONALITY
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");        // Clear auth token
      localStorage.removeItem("dark-mode");    // Clear theme preference
      window.location.href = "/login.html";    // Redirect to login
    });
  }
});
