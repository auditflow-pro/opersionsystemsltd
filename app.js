// Elements
const demoForm = document.getElementById('requestDemoForm');
const formStatus = document.getElementById('formStatus');
const demoSection = document.getElementById('demoSection');
const openDemoBtn = document.getElementById('openDemoForm');

// NGROK n8n webhook endpoint
const N8N_WEBHOOK = "https://your-ngrok-url.ngrok.io/orchestrator";

// Show demo section when button clicked
openDemoBtn.addEventListener('click', () => {
  demoSection.classList.toggle('hidden');
  demoSection.scrollIntoView({ behavior: 'smooth' });
});

// Handle form submission
demoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formStatus.textContent = "Submitting...";
  
  const formData = new FormData(demoForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      formStatus.textContent = "Demo request submitted successfully.";
      demoForm.reset();
    } else {
      formStatus.textContent = "Error submitting demo. Try again.";
    }
  } catch (err) {
    formStatus.textContent = "Network error. Check connection.";
    console.error(err);
  }
});
