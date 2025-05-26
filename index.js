const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");
const pg = require("pg");

const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");

const AccesBD=require("./module_proprii/accesbd.js")
AccesBD.getInstanta().select({tabel:"produse", campuri:["*"]},function(err,rez){
    console.log("-----------------Acces BD ---------------- ")
    console.log(err)
    console.log(rez)
})

const Client = pg.Client;

client = new Client({
    database: "beautyoutlet",
    user: "dariae",
    password: "dariae",
    host: "localhost",
    port: 5432
})

client.connect()
client.query("select * from produse", function (err, rezultat) {
    console.log(err)
    console.log(rezultat)
})
client.query("select * from unnest(enum_range(null::categ_produs))", function (err, rezultat) {
    console.log(err)
    console.log("Rezultat query:", rezultat)
})

app = express();



/*a={
    prop:10,
    b:["orice", {c:100}, true, [0,12,{d:200}]]
}
console.log(a.b[3][2].d)*/

app.set("view engine", "ejs");

v = [10, 27, 23, 44, 15]

nrImpar = v.find(function (elem) { return elem % 100 == 1 })
console.log(nrImpar)

console.log("Folderul proiectului", "__dirname")
console.log("Cale fisier index.js:", "__filename")
console.log("Folderul de lucru:", process.cwd())

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
    optiuniMeniu: null
}

client.query("select * from unnest(enum_range(null::tipuri_produse_cosmetice))", function(err, rezultat ){
    console.log(err)    
    console.log("Tipuri produse:", rezultat)
    obGlobal.optiuniMeniu=rezultat.rows
})

vect_foldere = ["temp", "backup", "temp1", "poze_uploadate"]
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder)
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder)
    }
}

function compileazaScss(caleScss, caleCss) {
    console.log("cale:", caleCss);
    if (!caleCss) {

        let numeFisExt = path.basename(caleScss); // "folder1/folder2/ceva.txt" -> "ceva.txt"
        let numeFis = numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss = numeFis + ".css"; // output: a.css
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss)
    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true })
    }

    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss)) {
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss))// +(new Date()).getTime()
    }
    rez = sass.compile(caleScss, { "sourceMap": true });
    fs.writeFileSync(caleCss, rez.css)
    // console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");

//la pornirea serverului
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    console.log(eveniment, numeFis);
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
})

function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");

    console.log(continut)
    obGlobal.obErori=JSON.parse(continut)
    console.log(obGlobal.obErori)

    obGlobal.obErori.eroare_default.imagine = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori)

}
initErori()
function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;

    let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu = path.join(__dirname, obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini) {
        [numeFis, ext] = imag.cale_imagine.split(".");
        let caleFisAbs = path.join(caleAbs, imag.cale_imagine);
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.cale_imagine_mediu = path.join("/", obGlobal.obImagini.cale_galerie, "mediu", numeFis + ".webp")
        imag.cale_imagine = path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_imagine)

    }
    console.log(obGlobal.obImagini)
}
initImagini();

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find(function (elem) {
        return elem.identificator == identificator
    });
    if (eroare) {
        if (eroare.status)
            res.status(identificator)
        var titluCustom = titlu || eroare.titlu;
        var textCustom = text || eroare.text;
        var imagineCustom = imagine || eroare.imagine;


    }
    else {
        var err = obGlobal.obErori.eroare_default
        var titluCustom = titlu || err.titlu;
        var textCustom = text || err.text;
        var imagineCustom = imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
    })
}

app.use("/*nume", function(req, res, next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu
    next();
} )

app.use("/resurse", express.static(path.join(__dirname, "resurse")))
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")))
app.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/ico/imagini/favicon.ico"))
})

app.get("/despre", function (req, res) {
    res.render("pagini/despre");
})

app.get(["/", "/index", "/home"], function (req, res) {
    res.render("pagini/index", { ip: req.ip, imagini: obGlobal.obImagini.imagini });
})

app.get("/despre", function (req, res) {
    res.render("pagini/despre");
})

app.get("/index/a", function (req, res) {
    res.render("pagini/index");
})


/*app.get("/cerere", function(req, res){
    res.send("<p style='color:blue'>Buna ziua</p>")
})*/


app.get("/fisier", function (req, res, next) {
    res.sendfile(path.join(__dirname, "package.json"));
})


app.get("/abc", function (req, res, next) {
    res.write("Data curenta: ")
    next()
})

app.get("/abc", function (req, res, next) {
    res.write((new Date()) + "")
    res.end()
    next()
})


app.get("/abc", function (req, res, next) {
    console.log("------------")
})

app.get("/produse", function (req, res) {
    console.log(req.query)
    var conditieQuery = ""; // TO DO where din parametri
    if (req.query.tip) {
        conditieQuery = ` where tip_produs='${req.query.tip}'`

    }

    queryOptiuni = "select * from unnest(enum_range(null::categ_produs))"
    client.query(queryOptiuni, function (err, rezOptiuni) {
        console.log(rezOptiuni)


        queryProduse = "select * from produse" +conditieQuery
        client.query(queryProduse, function (err, rez) {
            if (err) {
                console.log(err);
                afisareEroare(res, 2);
            }
            else {
                res.render("pagini/produse", { produse: rez.rows, optiuni: rezOptiuni.rows })
            }
        })
    });
})

app.get("/produs/:id", function (req, res) {
    console.log(req.params)
    client.query(`select * from produse where id=${req.params.id}`, function (err, rez) {
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
        }
        else {
            if (rez.rowCount == 0) {
                afisareEroare(res, 404);
            }
            else {
                res.render("pagini/produs", { prod: rez.rows[0] })
            }
        }
    })
})

// ------------------------- utilizatori ---------------------------
app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);
        console.log(campuriFisier);
        console.log(poza, username);
        var eroare="";
        // TO DO var utilizNou = creare utilizator
        var utilizNou =new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume[0];
            utilizNou.setareUsername=campuriText.username[0];
            utilizNou.email=campuriText.email[0]
            utilizNou.prenume=campuriText.prenume[0]
          
            utilizNou.parola=campuriText.parola[0];
            utilizNou.culoare_chat=campuriText.culoare_chat[0];
            utilizNou.poza= poza;
            Utilizator.getUtilizDupaUsername(campuriText.username[0], {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    //TO DO salveaza utilizator
                    utilizNou.salvareUtilizator()
                }
                else{
                    eroare+="Mai exista username-ul";
                }
                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                  
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
          
        }
        catch(e){
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
  
    });
    formular.on("field", function(nume,val){  // 1
  
        console.log(`--- ${nume}=${val}`);
      
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
      
        console.log(nume,fisier);
        //TO DO adaugam folderul poze_uploadate ca static si sa fie creat de aplicatie
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului (variabila folderUser)
        var folderUser=path.join(__dirname, "poze_uploadate", username);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser)
      
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:",poza)
        console.log("fileBegin, fisier:",fisier)
    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});

//app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function (req, res, next) {
  //  afisareEroare(res, 403);
//})


app.get("/*nume.ejs", function (req, res, next) {
    afisareEroare(res, 400);
})


app.get("/*nume", function (req, res, next) {
    try {
        res.render("pagini" + req.url, function (err, rezultatRandare) {
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404);
                }
                else {
                    afisareEroare(res);
                }
            }
            else {
                console.log(rezultatRandare);
                res.send(rezultatRandare)
            }
        });
    }
    catch (errRandare) {
        if (errRandare.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404);
        }
        else {
            afisareEroare(res);
        }
    }
})


app.get("/", async (req, res) => {
    const ora = new Date().getHours();
    const imaginiAfisate = filtreazaImagini(ora);
    await genereaza();
    res.render("pagini/index", { imagini: imaginiAfisate });
});

app.get("/galerie", async (req, res) => {
    const ora = new Date().getHours();
    const imaginiAfisate = filtreazaImagini(ora);
    await genereaza();
    res.render("pagini/galerie", { imagini: imaginiAfisate, cale_galerie: obGlobal.obImagini.cale_galerie });
});

// Functia care filtreaza imaginile in functie de ora curenta
function filtreazaImagini(oraCurenta) {
    let imaginiAfisate = obGlobal.obImagini.imagini.filter(img => {
        if (!img.timp) return false; // Dacă nu există interval de timp, nu afișa imaginea

        const [oraStart, oraStop] = img.timp.split("-").map(t => t.trim());
        const [oraStartH, oraStartM] = oraStart.split(":").map(Number);
        const [oraStopH, oraStopM] = oraStop.split(":").map(Number);

        const startInMinute = oraStartH * 60 + oraStartM;
        const stopInMinute = oraStopH * 60 + oraStopM;
        const currentInMinute = oraCurenta * 60;

        return currentInMinute >= startInMinute && currentInMinute <= stopInMinute;
    });

    if (imaginiAfisate.length > 10) {
        imaginiAfisate = imaginiAfisate.slice(0, 10);
    }

    return imaginiAfisate;
}


// Functia care va procesa imaginile
async function genereaza() {
    for (const img of obGlobal.obImagini.imagini) {
        const numeFisier = img.cale_imagine;
        const caleOriginala = path.join(__dirname, 'resurse/imagini/galerieStatica', numeFisier);
    }
}



app.listen(8080);
console.log("Serverul a pornit")