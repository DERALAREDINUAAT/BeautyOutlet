window.addEventListener("load", async () => {
  const container = document.querySelector(".galerie-animata");
  if (!container) return;

  const raspuns = await fetch("/resurse/json/galerie.json");
  const json = await raspuns.json();
  const toatePozele = json.imagini;

  let nrPoze = Math.floor(Math.random() * 4) * 2 + 5;
  const pozeGalerie = toatePozele.slice(-nrPoze);

  let index = 0;

  function creeazaSlide(uri) {
    const img = document.createElement("img");
    img.src = `/resurse/imagini/galerie/${uri}`;
    return img;
  }

  function afiseazaUrmatoarea() {
    container.innerHTML = "";

    const urm = (index + 1) % pozeGalerie.length;

    // fundalul = urmatoarea imagine
    const imgFundal = creeazaSlide(pozeGalerie[urm].cale_imagine);
    container.appendChild(imgFundal);

    // imaginea animata deasupra
    const imgCurenta = creeazaSlide(pozeGalerie[index].cale_imagine);
    imgCurenta.classList.add("animata");
    container.appendChild(imgCurenta);

    index = urm;
  }

  afiseazaUrmatoarea();
  setInterval(afiseazaUrmatoarea, 6000);
});
