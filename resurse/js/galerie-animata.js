document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("galerie-animata");
  if (!container) return;

  const imgs = container.querySelectorAll("img");
  let index = 0;

  function arataImagine(i) {
    imgs.forEach((img, j) => {
      img.style.zIndex = j === i ? 1 : 0;
      img.style.animation = j === i ? "galerieSlide 3s ease-in-out forwards" : "none";
    });
  }

  arataImagine(index);
  let interval = setInterval(() => {
    index = (index + 1) % imgs.length;
    arataImagine(index);
  }, 4000);

  container.addEventListener("mouseenter", () => clearInterval(interval));
  container.addEventListener("mouseleave", () => {
    interval = setInterval(() => {
      index = (index + 1) % imgs.length;
      arataImagine(index);
    }, 4000);
  });
});
