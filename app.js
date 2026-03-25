// NAVIGATION BURGER TOGGLE
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// DEMO FORM HANDLER
const demoForm = document.getElementById('demo-form');
const demoInput = document.getElementById('demo-input');
const demoOutput = document.getElementById('demo-output');
const demoResult = document.getElementById('demo-result');

demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = demoInput.value.trim();
  if (!input) return;

  demoResult.textContent = "Processing Operion pipeline...";
  demoOutput.style.display = 'block';

  // Simulate deterministic output for demo
  setTimeout(() => {
    demoResult.innerHTML = `
&gt; Input: ${input}
&gt; Status: ✅ Processed
&gt; Output: Operion deterministic result for "${input}"
    `;
    demoInput.value = '';
  }, 700);
});
