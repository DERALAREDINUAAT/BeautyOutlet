document.addEventListener("DOMContentLoaded", () => {
  let toggle = true;

  setInterval(() => {
    document.body.classList.toggle("bg1", toggle);
    document.body.classList.toggle("bg2", !toggle);
    toggle = !toggle;
  }, 5000); // schimbă fundalul la fiecare 5 secunde
});
