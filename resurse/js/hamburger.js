document.addEventListener("DOMContentLoaded", () => {
  const hamb = document.getElementById("hamburger");
  const checkbox = document.getElementById("ch-menu");

  hamb.addEventListener("click", () => {
    hamb.classList.toggle("active");
    checkbox.checked = !checkbox.checked;
  });
});


