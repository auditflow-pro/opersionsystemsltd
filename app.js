// Operion Systems Core JS - Production Baseline
// Fully recreated from last supplied working version

document.addEventListener("DOMContentLoaded", () => {

  // --- Utility: Send data to Operion (n8n local/remote) ---
  async function sendToOperion(payload) {
    const endpoint = "https://<YOUR_NGROK_URL>/orchestrator"; // replace with live ngrok URL
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Operion POST error:", err);
      return { error: err.message };
    }
  }

  // --- Demo Form Submission ---
  const demoForm = document.getElementById("requestDemoForm");
  const formStatus = document.getElementById("formStatus");

  if (demoForm) {
    demoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formStatus.textContent = "";
      const formData = Object.fromEntries(new FormData(demoForm).entries());

      const response = await sendToOperion(formData);

      if (!response.error) {
        formStatus.textContent = "Demo request sent successfully!";
        formStatus.style.color = "#00E5FF";
        demoForm.reset();
      } else {
        formStatus.textContent = `Error sending demo request: ${response.error}`;
        formStatus.style.color = "#FF5555";
      }
    });
  }

  // --- Header Navigation (Request Demo Button) ---
  const demoButton = document.querySelector("a.request-demo");
  if (demoButton) {
    demoButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "demo.html";
    });
  }

  // --- Feature Cards Hover Effects ---
  const features = document.querySelectorAll(".feature");
  features.forEach(f => {
    f.addEventListener("mouseenter", () => {
      f.style.borderColor = "#00E5FF";
      f.style.boxShadow = "0 0 15px rgba(0, 229, 255, 0.5)";
    });
    f.addEventListener("mouseleave", () => {
      f.style.borderColor = "#00E5FF33";
      f.style.boxShadow = "none";
    });
  });

  // --- Logo Hover Glow ---
  const logoImg = document.querySelector(".logo img");
  if (logoImg) {
    logoImg.addEventListener("mouseenter", () => {
      logoImg.style.filter = "drop-shadow(0 0 8px #00E5FF)";
    });
    logoImg.addEventListener("mouseleave", () => {
      logoImg.style.filter = "none";
    });
  }

  // --- Activating Form Interaction ---
  const activatingForm = document.getElementById("activatingForm");
  if (activatingForm) {
    activatingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(activatingForm).entries());
      const resp = await sendToOperion(data);

      if (!resp.error) {
        alert("Activating request sent to Operion!");
        activatingForm.reset();
      } else {
        alert(`Error sending activating request: ${resp.error}`);
      }
    });
  }

  console.log("Operion Systems app.js fully loaded and operational.");
});
