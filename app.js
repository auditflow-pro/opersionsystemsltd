// Operion Systems Ltd — app.js
document.addEventListener("DOMContentLoaded", () => {
  // Mobile burger toggle
  const burger = document.querySelector(".nav-burger");
  const links = document.querySelector(".nav-links");

  burger.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  // Smooth scroll for nav links
  document.querySelectorAll(".nav-links a").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      if (this.hash) {
        e.preventDefault();
        document.querySelector(this.hash).scrollIntoView({ behavior: "smooth" });
        links.classList.remove("open");
      }
    });
  });

  // Form submit placeholder
  const form = document.querySelector("form");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    alert("Message sent! (demo placeholder)");
  });
});
