class Produs{

    constructor({id, nume, descriere, pret, cantitate_ml, tip_produs, categorie, ingrediente, vegan, imagine, data_adaugare}={}) {

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }

    }

}