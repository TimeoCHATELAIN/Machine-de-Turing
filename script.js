document.getElementById('file').addEventListener('change', function(event) {
    document.querySelector(':root').style.setProperty('--main-color', getComputedStyle(document.querySelector(':root')).getPropertyValue('--orange'));
    document.querySelector(':root').style.setProperty('--main-transparency', getComputedStyle(document.querySelector(':root')).getPropertyValue('--orange-transparency'));
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
        const content = e.target.result;
        parseAndRender(content);
        };
        reader.readAsText(file);
    }
});

function parseAndRender(content) {
    const lines = content.split('\n');
    var etats = [];
    var symboles = [];
    var alphabet = [];
    var blanksymbol = "";
    var initialstate = "";
    var finalstates = [];
    var transitions = [];

    lines.forEach((line, index) => {

        if (line == "/**  States **/") {
            for (let i = index + 1; i < lines.length; i++) {
                if (lines[i].startsWith("/**")) {
                    break;
                }
                if (lines[i] == "") {
                    continue;
                }
                etats.push(lines[i]);
            }
        }

        if(line == "/**  Tape alphabet **/"){
            for (let i = index + 1; i < lines.length; i++) {
                if (lines[i].startsWith("/**")) {
                    break;
                }
                if (lines[i] == "") {
                    continue;
                }
                alphabet.push(lines[i]);
            }
        }

        if(line == "/**  Blank symbol **/"){
            lines[index+1] != "" ? blanksymbol = lines[index+1] : blanksymbol = "#";
        }

        if(line == "/**  Initial state **/"){
            lines[index+1] != "" ? initialstate = lines[index+1] : initialstate = "q0";
        }

        if(line == "/**  Final states **/"){
            for (let i = index + 1; i < lines.length; i++) {
                if (lines[i].startsWith("/**")) {
                    break;
                }
                if (lines[i] == "") {
                    continue;
                }
                finalstates.push(lines[i]);
            }
        }

        if (line == "/**  Input symbols **/") {
            for (let i = index + 1; i < lines.length; i++) {
                if (lines[i].startsWith("/**")) {
                    break;
                }
                if (lines[i] == "") {
                    continue;
                }
                symboles.push(lines[i]);
            }
        }

        if (line == "/**  Transitions **/") {
            for (let i = index + 1; i < lines.length; i++) {
                if (lines[i].startsWith("/**")) {
                    break;
                }
                if (lines[i] == "") {
                    continue;
                }
                transitions.push(lines[i]);
            }
        }

    });
    data = { etats, symboles, alphabet, blanksymbol, initialstate, finalstates, transitions };
    render(data);
    initialiserMachine();
}

function render(data) {
    const table = document.getElementById('transition-table');

    // Effacer le contenu existant
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (thead) thead.innerHTML = "";
    if (tbody) tbody.innerHTML = "";
    else table.appendChild(document.createElement('tbody'));

    // Ajouter les en-têtes de colonne
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th'));
    data.alphabet.forEach((symbol) => {
        const th = document.createElement('th');
        th.textContent = symbol;
        headerRow.appendChild(th);
    });
    table.querySelector('thead').appendChild(headerRow);

    // Ajouter les lignes pour chaque état
    data.etats.forEach((state) => {
        const tr = document.createElement('tr');

        const th = document.createElement('th');
        th.textContent = state;
        tr.appendChild(th);

        data.alphabet.forEach((symbol) => {
            const td = document.createElement('td');

            td.textContent = 
                data.transitions.filter((transition) => {
                    return transition.startsWith(state + "," + symbol);
                }).map((transition) => {
                    return transition.split("->")[1];
                }).join(" ");

            tr.appendChild(td);
        });

        table.querySelector('tbody').appendChild(tr);
    });

    document.getElementById('etat-initial').textContent = "Etat inital : " + data.initialstate;
    if (data.finalstates.length == 0) {
        document.getElementById('etats-finaux').textContent = "| Etat final : Aucun |";
    }
    else{
        document.getElementById('etats-finaux').textContent = "| Etat final : " + data.finalstates.join(", ")+" |";
    }
    document.getElementById('blanksymbol').textContent = "Symbole vide : " + data.blanksymbol;

    console.log(data);
}

// ---- Machine de turing ----

let ruban = [];
let position = 0;
let etatCourant = "";
let enCours = false;
let interval;
let compteur = 0;

// Initialisation de la machine de Turing
function initialiserMachine() {
    ruban = document.getElementById('ruban').value.split("");
    position = 0;
    compteur = 0;
    etatCourant = data.initialstate;
    document.getElementById("historique-list").innerHTML = "";
    afficherEtat();
}

// Affiche l'état courant, le ruban et la position de la tête de lecture
function afficherEtat() {

    document.getElementById("step-counter").textContent = `Etape : ${compteur}`;
    document.getElementById("etat-courant").textContent = `État courant : ${etatCourant}`;
    document.getElementById("position-tete-lecture").textContent = `Position de la tête de lecture : ${position}`;

    let rubanAffichage = ruban.map((char, index) => {
        if (index === position) {
            return `<span class="highlight">${char}</span>`;
        }
        return char;
    }).join("");
    
    document.getElementById("resultat").innerHTML = `Ruban : ${data.blanksymbol}${rubanAffichage}${data.blanksymbol}`;

    let liste = document.getElementById("historique-list");
    liste.appendChild(document.createElement('li')).innerHTML += `Etape ${compteur} : ${etatCourant} ${data.blanksymbol}${rubanAffichage}${data.blanksymbol} `; // Ajoute l'étape courante à la
}

// Exécute une étape de la machine de Turing
function executerEtape() {
    document.querySelector(':root').style.setProperty('--main-color', getComputedStyle(document.querySelector(':root')).getPropertyValue('--orange'));
    document.querySelector(':root').style.setProperty('--main-transparency', getComputedStyle(document.querySelector(':root')).getPropertyValue('--orange-transparency'));
    if (data.finalstates.includes(etatCourant)) {
        document.querySelector(':root').style.setProperty('--main-color', getComputedStyle(document.querySelector(':root')).getPropertyValue('--vert'));
        document.querySelector(':root').style.setProperty('--main-transparency', getComputedStyle(document.querySelector(':root')).getPropertyValue('--vert-transparency'));
        //alert("La machine a atteint un état final !");
        //arreterExecution();
        return;
    }

    const symboleCourant = ruban[position] || data.blanksymbol;
    const transition = data.transitions.find(t => t.startsWith(`${etatCourant},${symboleCourant}`));

    if (!transition) {
        document.querySelector(':root').style.setProperty('--main-color', getComputedStyle(document.querySelector(':root')).getPropertyValue('--rouge'));
        document.querySelector(':root').style.setProperty('--main-transparency', getComputedStyle(document.querySelector(':root')).getPropertyValue('--rouge-transparency'));
        //alert("Aucune transition applicable !");
        //arreterExecution();
        return;
    }

    const [, resultat] = transition.split("->");
    const [nouvelEtat, nouveauSymbole, direction] = resultat.split(",");

    // Mise à jour du ruban, de l'état et de la position
    ruban[position] = nouveauSymbole;
    etatCourant = nouvelEtat;

    if (direction === "R") {
        position++;
    } else if (direction === "L") {
        position = Math.max(0, position - 1);
    }

    compteur++;
    afficherEtat();
}

function executerBackEtape() {
    if (compteur === 0) return; // Ne rien faire si aucune étape n'a été exécutée

    compteur--;
    const previousTransition = data.transitions.find(t => {
        const [etat, symbole] = t.split("->")[0].split(",");
        return etat === etatCourant && symbole === ruban[position];
    });

    if (!previousTransition) return;

    const [, resultat] = previousTransition.split("->");
    const [nouvelEtat, nouveauSymbole, direction] = resultat.split(",");

    // Mise à jour du ruban, de l'état et de la position
    ruban[position] = nouveauSymbole;
    etatCourant = nouvelEtat;

    if (direction === "R") {
        position = Math.max(0, position - 1);
    } else if (direction === "L") {
        position++;
    }

    afficherEtat();
}

// Lancement de l'exécution continue
function lancerExecution() {
    document.getElementById("play").classList.add("hidden");
    document.getElementById("pause").classList.remove("hidden");
    if (enCours) return;
    enCours = true;
    interval = setInterval(executerEtape, 500); // Une étape toutes les 500 ms
}

// Pause de l'exécution
function mettreEnPause() {
    document.getElementById("pause").classList.add("hidden");
    document.getElementById("play").classList.remove("hidden");

    enCours = false;
    clearInterval(interval);
}

// Arrêt complet de la simulation
function arreterExecution() {
    mettreEnPause();
    initialiserMachine();
}

// Gestion des boutons
document.getElementById("play").addEventListener("click", lancerExecution);
document.getElementById("step").addEventListener("click", executerEtape);
document.getElementById("pause").addEventListener("click", mettreEnPause);
document.getElementById("aply").addEventListener("click", arreterExecution);


