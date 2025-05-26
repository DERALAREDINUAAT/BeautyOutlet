window.onload = function () {
    let temaSalvata = localStorage.getItem("tema");
    if (temaSalvata) {
        document.body.setAttribute("data-tema", temaSalvata);
    } else {
        document.body.setAttribute("data-tema", "light");
    }

    document.getElementById("btn-tema").onclick = function () {
        let tema = document.body.getAttribute("data-tema");
        if (tema === "dark") {
            document.body.setAttribute("data-tema", "light");
            localStorage.setItem("tema", "light");
        } else {
            document.body.setAttribute("data-tema", "dark");
            localStorage.setItem("tema", "dark");
        }
    }

    btn = document.getElementById("filtrare");
    btn.onclick = function () {
        //this.btn.classList.add("selectat");
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
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
        let valVegan = "toate";
        for (let red of vectRadio) {
            if (red.checked) {
                valVegan = red.value;
                break;
            }
        }

        for (let prod of produse) {
            prod.style.display = "none";

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = nume.startsWith(inpNume);

            let vegan = prod.getElementsByClassName("val-vegan")[0].innerHTML.trim().toLowerCase();
            let cond2 = (valVegan == "toate" || vegan == valVegan);


            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            let cond3 = (inpPret <= pret);

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            let cond4 = (inpCategorie == "toate" || inpCategorie == categorie);

            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let cond5 = cuvinteCheie.length == 0 || cuvinteCheie.some(cuv => descriere.includes(cuv));

            let ingredienteProdus = prod.getElementsByClassName("val-ingrediente")[0].innerHTML.trim().toLowerCase().split(",");
            ingredienteProdus = ingredienteProdus.map(i => i.trim());

            let cond6 = ingredienteSelectate.length == 0 || ingredienteProdus.some(i => ingredienteSelectate.includes(i));

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6) {
                prod.style.display = "block";
            }
        }
    }


    document.getElementById("inp-pret").onchange = function () {
        document.getElementById("infoRange").innerHTML = `(${this.value})`
    }

    document.getElementById("resetare").onclick = function () {
        document.getElementById("inp-nume").value = ""

        let produse = document.getElementsByClassName("produs")

        document.getElementById("i_rad4").checked = true;

        for (let prod of produse) {
            prod.style.display = "block";
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
            // aici pretA==pretB
            let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            return semn * numeA.localeCompare(numeB)
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
}