
/* Liste med oplysninger om de biler der kan lejes hos Solbiler ApS.
Variablen for biler erklæres som en konstant. Der laves et array
for at variablen kan indeholde flere værdier (objekter)
*/
const biler = [
    {
        bilmaerke: "Suzuki",
        billede: "images/suzuki.png",
        billedetekst: "Billede af udlejningsbil",
        kategori: "Budget",
        personer: "4",
        kufferter: "0",
        tillaeg: "0"
    },

    {
        bilmaerke: "Mazda",
        billede: "images/mazda.png",
        billedetekst: "Billede af udlejningsbil",
        kategori: "Mellemklasse",
        personer: "5",
        kufferter: "3",
        tillaeg: "60"
    },

    {
        bilmaerke: "Citroën",
        billede: "images/citroen.png",
        billedetekst: "Billede af udlejningsbil",
        kategori: "Minivan",
        personer: "7",
        kufferter: "4",
        tillaeg: "105"
    },
];

// Elementer fra HTML findes og defineres som konstanter.
const sektion = document.getElementById("bil_sektion");
const skabelon = document.getElementById("skabelon_output");
const personer = document.getElementById('personer');
const kufferter = document.getElementById('kufferter');
const formular = document.getElementById('formular');
const afhentningsdato = document.getElementById('afhentning');
const afleveringsdato = document.getElementById('aflevering');

/*
Tager fat i id objektet "formular". Der sættes en eventlistener på søgknappen ("submit") i 
formularen. 
Der laves en funktion (valideDatoer) som fortæller om der er sat et rigtig 
datosæt ind. Dette gøres med boolean, som returnerer en sand eller falsk værdi
*/
formular.addEventListener("submit", function (event) {
    event.preventDefault();
    if (valideDatoer(afhentningsdato.value, afleveringsdato.value)) {
        sektion.innerHTML = ""; //Nulstiller output-sektion
        for (const bil of biler) {
            if (kufferter.value <= bil.kufferter && personer.value <= bil.personer) {
                const antaldage = beregnAntalLejedage(afhentningsdato.value, afleveringsdato.value);
                const klon = skabelon.content.cloneNode(true);
                const bilMM = klon.querySelector(".bilMM");
                const billedtag = klon.querySelector("img");
                const kategori = klon.querySelector(".kategori");
                const antalpersoner = klon.querySelector(".antalpersoner");
                const antalkufferter = klon.querySelector(".antalkufferter");
                const lejeudgift = klon.querySelector(".lejeudgift");

                billedtag.src = bil.billede;
                billedtag.alt = bil.billedetekst;
                bilMM.textContent = bil.bilmaerke;
                kategori.textContent += bil.kategori;
                antalkufferter.textContent += bil.kufferter;
                antalpersoner.textContent += bil.personer;
                lejeudgift.textContent = beregnLejeudgift(antaldage,bil.tillaeg);

                sektion.appendChild(klon);
            }
        }
    } else {
        sektion.innerText = "Vælg en afleveringsdato som ligger efter afhentningsdato.";
    }

})

/* Længden af lejeperioden beregnes ud fra de datoer som er valgt. Værdien af de to dato-inputs 
laves til et dato objekt ved at bruge en date constructor (new Date). Denne beregner altså på 
om afleveringsdatoen er større end afhentningsdatoen.
*/
function valideDatoer(afhentningsdato, afleveringsdato) {
    const afhentning = new Date(afhentningsdato);
    const aflevering = new Date (afleveringsdato);
    if (afhentning > aflevering) {
        return false;
    } 
    else {
        return true;
    }
};

/* Antal lejedage udregnes vha.  getTime() metoden. Denne returnerer antallet af millisekunder siden 1. januar 
1970. For at få dette tal omregnet til dage, bruges følgende udregningsmetode:

1000 millisekunder per sekund * 60 sekunder per minut * 60 minutter per time * 24 timer per døgn.
Der lægges 1 til det beregnede tal, således at perioden er inklusiv start- og slutdato, hvis 
bilen bliver hentet og afleveret samme dag (dette tæller altså for 1 dag)
*/
function beregnAntalLejedage(afhentningsdato, afleveringsdato) {
    const afhentning = new Date (afhentningsdato);
    const aflevering = new Date (afleveringsdato);
    const forskelitid = aflevering.getTime() - afhentning.getTime();
    const forskelidage = forskelitid / (1000 * 3600 * 24) + 1;
    return forskelidage;
}

/* Lejeudgiften udregnes til sidst ved at lave en funktion for antal dage en bil er udlejet, samt tillægget, alt efter 
hvilken bil der udlejes. Herefter laves der en konstant for moms, grundbeløb og prisen pr. dag, da disse værdier 
er konstante for hver bil. Til sidst returneres lejeudgiften for den valgte bil 
*/  
function beregnLejeudgift(antaldage, biltillaeg) {
    const moms = 0.25;
    const grundbeloeb = 495;
    const prisprdag = 100;
    const lejeudgift = (grundbeloeb + (antaldage * prisprdag) + (antaldage * biltillaeg)) *(1 + moms);
    return lejeudgift.toFixed(2);
}



