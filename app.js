// Navigation burger toggle
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Demo form submission
const demoForm = document.getElementById('demo-form');
const demoSuccess = document.getElementById('demo-success');

demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Placeholder: connect to Operion pipeline here
  demoSuccess.style.display = 'block';
  demoForm.reset();
});
