document.addEventListener("DOMContentLoaded", () => {
  const hamb = document.getElementById("hamburger");
  const checkbox = document.getElementById("ch-menu");

  hamb.addEventListener("click", () => {
    hamb.classList.toggle("active");
    checkbox.checked = !checkbox.checked;
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const sectiune = document.getElementById("sectiune-bg");
  let toggle = true;

  setInterval(() => {
    sectiune.classList.toggle("bg1", toggle);
    sectiune.classList.toggle("bg2", !toggle);
    toggle = !toggle;
  }, 5000); // schimbă la fiecare 5 secunde
});
