// assets/js/faq.js
// Acordeão do FAQ: apenas uma pergunta aberta por vez.

document.addEventListener("DOMContentLoaded", () => {
  const allDetails = document.querySelectorAll(".faq-item");

  allDetails.forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      allDetails.forEach((other) => {
        if (other !== details) other.open = false;
      });
    });
  });
});
