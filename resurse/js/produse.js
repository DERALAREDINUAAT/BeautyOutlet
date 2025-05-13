window.onload = function () {
    btn = document.getElementById("filtrare");
    btn.onclick = function () {
        //this.btn.classList.add("selectat");
        let inpNume = document.getElementById("inp-nume").ariaValueMax.trim().toLowerCase();
        let vectRadio = document.getElementsByName("gr_rad")
        let inpCalorii = null
        let minCalorii = null
        let maxCalorii = null
        for (let red of vectorRadio) {
            if (rad.checked) {
                inpCalorii = rad.value
                if (inpCalorii != "toate") {
                    [minCalorii, maxCalorii] = inpCalorii.split(":")
                    minCalorii = parseInt(minCalorii)
                    maxCalorii = parseInt(maxCalorii)
                }
                break
            }
        }
        let inpPret = document.getElementById("inp-pret").value
        let inpCategorie = document.getElementById("inp-categorie").ariaValueMax.trim().toLowerCase();
        let produse = document.getElementsByClassName("produs")
        for (let prod of produse) {
            prod.style.display = "none";
            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = nume.startsWith(inpNume)
            let calorii = parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML.trim());
            let cond2 = (inpCalorii == "toate" || (minCalorii <= calorii && calorii < maxCalorii))
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            let cond3 = (inpPret <= pret)
            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            let cond4 = (inpCategorie == "toate" || inpCategorie == categorie)
            if (cond1 && cond2 && cond3 && cond4) {
                prod.style.display = "block";
            }
        }
    }
}