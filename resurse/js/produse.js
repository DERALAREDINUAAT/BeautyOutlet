window.onload = function () {
    let selectTema = document.getElementById("select-tema");

    function aplicaTema(tema) {
        document.body.setAttribute("data-tema", tema);
        localStorage.setItem("tema", tema);
        if (selectTema) selectTema.value = tema;
    }

    let temaSalvata = localStorage.getItem("tema") || "light";
    aplicaTema(temaSalvata);

    if (selectTema) {
        selectTema.onchange = function () {
            aplicaTema(this.value);
        };
    }

    btn = document.getElementById("filtrare");
    btn.onclick = aplicaFiltrare;
    function aplicaFiltrare(event) {
        //this.btn.classList.add("selectat");
        let inpNume = document.getElementById("inp-nume");
        let valNume = inpNume.value.trim().toLowerCase();

        if (!/^[a-zăâîșț\s]*$/i.test(valNume)) {
            inpNume.classList.add("is-invalid");
            alert("Numele nu trebuie să conțină cifre sau caractere speciale.");
            return;
        } else {
            inpNume.classList.remove("is-invalid");
        }
        let inpPret = document.getElementById("inp-pret").value
        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase();
        let produse = document.getElementsByClassName("produs")

        let vectRadio = document.getElementsByName("gr_vegan")
        let textarea = document.getElementById("inp-descriere");
        let cuvinteCheie = textarea.value.trim().toLowerCase().split(",");
        cuvinteCheie = cuvinteCheie.map(c => c.trim()).filter(c => c.length > 0);
        if (textarea.value.trim().length > 0 && cuvinteCheie.length == 0) {
            textarea.classList.add("is-invalid");
            alert("Introduceți cuvinte cheie separate prin virgulă.");
            return;
        } else {
            textarea.classList.remove("is-invalid");
        }
        let ingredienteCheckbox = document.getElementsByName("ingredient");
        let ingredienteSelectate = [];

        for (let ch of ingredienteCheckbox) {
            if (ch.checked) {
                ingredienteSelectate.push(ch.value.toLowerCase());
            }
        }
        let aplicaFiltruIngrediente = ingredienteSelectate.length > 0;

        let valVegan = "toate";
        for (let red of vectRadio) {
            if (red.checked) {
                valVegan = red.value;
                break;
            }
        }

        let inpCuloare = document.getElementById("inp-culoare").value.trim().toLowerCase();

        let selectTip = document.getElementById("inp-tip");
        let valoriTip = Array.from(selectTip.selectedOptions).map(opt => opt.value);
        let selectCuloare = document.getElementById("inp-culoare");
        let valoriCulori = Array.from(selectCuloare.selectedOptions).map(opt => opt.value);
        let container = document.getElementById("container-produse");

        let produseAfisate = [];

        for (let prod of produse) {
            prod.style.display = "none";

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = nume.includes(valNume);

            let vegan = prod.getElementsByClassName("val-vegan")[0].innerHTML.trim().toLowerCase();
            let cond2 = (valVegan == "toate" || vegan == valVegan);


            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            let cond3 = (inpPret <= pret);

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            let cond4 = (inpCategorie == "toate" || inpCategorie == categorie);

            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let cond5 = cuvinteCheie.length == 0 || cuvinteCheie.some(cuv => descriere.includes(cuv));

            let ingredienteRaw = prod.getElementsByClassName("val-ingrediente")[0].innerHTML.trim().toLowerCase();
let ingredienteProdus = ingredienteRaw ? ingredienteRaw.split(",").map(i => i.trim()) : [];
let cond6 = ingredienteSelectate.length === 0 || ingredienteProdus.some(i => ingredienteSelectate.includes(i));

            let tipProdus = prod.getElementsByClassName("val-tip")[0].innerHTML.trim().toLowerCase();
            let cond7 = valoriTip.length === 0 || valoriTip.includes(tipProdus);

            let culoare = prod.getElementsByClassName("val-culoare")[0]?.innerHTML.trim().toLowerCase();
            let cond8 = valoriCulori.length === 0 || valoriCulori.includes(culoare);

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                prod.style.display = "block";
                produseAfisate.push(prod);
            }
        }
        if (produseAfisate.length === 0) {
            container.innerHTML = "<p class='msg-gol'>Nu există produse conform filtrării curente.</p>";
        }
        document.getElementById("nr-produse").textContent = `${produseAfisate.length} produse afișate`;
    }



    document.getElementById("inp-pret").onchange = function () {
        document.getElementById("infoRange").innerHTML = `(${this.value})`
    }

    document.getElementById("resetare").onclick = function () {
        if (!confirm("Sigur vrei să resetezi toate filtrele?")) {
            return;
        }
        document.getElementById("inp-nume").value = ""
        document.getElementById("inp-descriere").value = "";
        document.getElementById("inp-pret").value = document.getElementById("inp-pret").min;
        document.getElementById("infoRange").innerHTML = `(${document.getElementById("inp-pret").value})`;
        document.getElementById("inp-categorie").value = "toate";

        document.getElementById("vegan-toate").checked = true;

        // Reset ingrediente
        let checkboxes = document.getElementsByName("ingredient");
        for (let ch of checkboxes) ch.checked = false;

        // Reset select multiplu
        let tipuri = document.getElementById("inp-tip").options;
        for (let opt of tipuri) opt.selected = false;
        let culori = document.getElementById("inp-culoare").options;
        for (let opt of culori) opt.selected = false;

        let produse = document.getElementsByClassName("produs")

        for (let prod of produse) {
            prod.style.display = "block";

            document.getElementById("nr-produse").textContent = `${produse.length} produse afișate`;
            document.getElementById("container-produse").querySelector(".msg-gol")?.remove();
        }
    }
    document.getElementById("sortCrescNume").onclick = function () {
        sorteaza(1)
    }
    document.getElementById("sortDescrescNume").onclick = function () {
        sorteaza(-1)
    }

    function sorteaza(semn) {
        let produse = document.getElementsByClassName("produs");
        let vProduse = Array.from(produse);
        vProduse.sort(function (a, b) { // a si b sunt <article>
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())
            if (pretA != pretB) {
                return semn * (pretA - pretB)
            }
            let ingA = a.getElementsByClassName("val-ingrediente")[0].innerHTML.trim();
            let ingB = b.getElementsByClassName("val-ingrediente")[0].innerHTML.trim();

            let nrIngA = ingA ? ingA.split(",").length : 0;
            let nrIngB = ingB ? ingB.split(",").length : 0;

            return semn * (nrIngA - nrIngB);
        })
        for (let prod of vProduse) {
            prod.parentNode.appendChild(prod);
        }

    }


    window.onkeydown = function (e) {
        console.log(e)
        if (e.key == "c" && e.altKey) {
            let produse = document.getElementsByClassName("produs")
            sumaPreturi = 0
            for (let prod of produse) {
                if (prod.style.display != "none") {
                    let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
                    sumaPreturi += pret
                }
            }
            if (!document.getElementById("suma_preturi")) {
                let pRezultat = document.createElement("p") //<p></p>
                pRezultat.innerHTML = sumaPreturi //<p>sumaPreturi</p>
                pRezultat.id = "suma_preturi"
                let p = document.getElementById("p-suma")
                p.parentNode.insertBefore(pRezultat, p.nextElementSibling)
                setTimeout(function () {
                    let p1 = document.getElementById("suma_preturi")
                    if (p1) {
                        p1.remove()
                    }
                }, 2000)
            }
        }
    }

    document.getElementById("inp-nume").oninput = aplicaFiltrare;
    document.getElementById("inp-descriere").oninput = aplicaFiltrare;
    document.getElementById("inp-pret").oninput = aplicaFiltrare;
    document.getElementById("inp-categorie").onchange = aplicaFiltrare;

    let radioVegan = document.getElementsByName("gr_vegan");
    for (let r of radioVegan) r.onchange = aplicaFiltrare;

    let ingrediente = document.getElementsByName("ingredient");
    for (let ch of ingrediente) ch.onchange = aplicaFiltrare;

    document.getElementById("inp-tip").onchange = aplicaFiltrare;
    document.getElementById("inp-culoare").onchange = aplicaFiltrare;
}