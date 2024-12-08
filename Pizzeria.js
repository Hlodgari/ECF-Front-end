"use strict"

const nosPizzas = document.getElementById("contenuNosPizzas");
const pizzasTomate = document.getElementById("contenuTomate");
const pizzasCreme = document.getElementById("contenuCreme");
const btnTomate = document.getElementById("baseTomate");
const btnCreme = document.getElementById("baseCreme");
const btnPizza = document.getElementById("nosPizzas")


const pizzas = [
    fetch('mergherita.JSON'),
    fetch('fromage.JSON'),
    fetch('bolognaise.JSON'),
    fetch('carbonnara.JSON'),
    fetch('chevreMiel.JSON'),
    fetch('vosgienne.JSON'),
    fetch('champignon.JSON'),
    fetch('chicken.JSON')
];


let dataArray = [];

Promise.all(pizzas)
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        dataArray = data.flat();
        afficherContenu(dataArray);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des pizzas :", error);
    });



function afficherContenu(data) {
    nosPizzas.innerHTML = "";

    data.forEach(pizza => {
        const card = document.createElement("div");
        card.classList.add("card", "g-col-2", "bg-secondary-subtle", "my-4", "mx-2", "d-flex", "flex-column", "align-items-center", "justify-content-between")
        card.setAttribute("style", "width: 16rem");

        const img = document.createElement("img");
        img.classList.add("card-img-top");
        img.setAttribute("src", pizza.image);
        img.setAttribute("alt", pizza.nom);

        const nom = document.createElement("h4");
        nom.classList.add("text-center","mt-2");
        nom.textContent = pizza.nom;

        const ingredients = document.createElement("ul");
        ingredients.textContent = "Ingrédients :";
        ingredients.classList.add("list-unstyled", "text-center", "my-2");
        const ingredient = document.createElement("li");
        ingredient.textContent = pizza.ingredients;
        ingredients.appendChild(ingredient);

        const ligne = document.createElement("hr")
        
        const footer = document.createElement("div")
        footer.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100", "px-2", "mt-auto");
        
        const prix = document.createElement("p");
        prix.classList.add("mb-0");
        prix.textContent = `Prix : ${pizza.prix} ${pizza.devise}`;

        const btn = document.createElement("a");
        btn.classList.add("btn", "btn-success", "justify-content-center", "d-flex");
        btn.setAttribute("href", "#");
        btn.textContent = "Ajouter";
        btn.setAttribute("id", pizza.nom);

        btn.addEventListener("click", function () {
            ajouterAuPanier(pizza);
        });

        card.appendChild(img);
        card.appendChild(nom);
        card.appendChild(ligne)
        card.appendChild(ingredients);
        card.appendChild(ligne)
        card.appendChild(footer)
        footer.appendChild(prix);
        footer.appendChild(btn)
        nosPizzas.appendChild(card);
    });
}

btnTomate.addEventListener("click", filtrerPizza);
btnCreme.addEventListener("click", filtrerPizza);
btnPizza.addEventListener("click", filtrerPizza);

function filtrerPizza(event) {
    const base = event.target.id;

    if (base === "baseTomate") {
        const pizzasTomate = dataArray.filter(pizza => pizza.base === "tomate");
        afficherContenu(pizzasTomate);
    } else if (base === "baseCreme") {
        const pizzasCreme = dataArray.filter(pizza => pizza.base === "creme");
        afficherContenu(pizzasCreme);
    } else {
        afficherContenu(dataArray);
    }
}



const modalPanier = document.getElementById("myModalPanier");
const btnPanier = document.getElementById("ouvrirModalPanier");
const spanPanier = document.getElementsByClassName("closePanier")[0];

const modalProfil = document.getElementById("myModalProfil");
const btnProfil = document.getElementById("ouvrirModalProfil");
const spanProfil = document.getElementsByClassName("closeProfil")[0];

function gérerModal(modal, btn, span) {
    btn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    span.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}


gérerModal(modalPanier, btnPanier, spanPanier);
gérerModal(modalProfil, btnProfil, spanProfil);
let panier = [];

function ajouterAuPanier(pizza) {
    const pizzaExistante = panier.find(item => item.nom === pizza.nom);
    if (pizzaExistante) {
        pizzaExistante.quantité += 1;
    } else {
        panier.push({ ...pizza, quantité: 1 });
    }
    console.log(panier);
    afficherPanier();
}

function afficherPanier() {
    const panierContenu = document.getElementById("contenuPanier");
    panierContenu.innerHTML = "";
    let totalPrix = 0;

    panier.forEach(pizza => {
        const row = document.createElement("div");
        row.classList.add("d-flex", "flex-wrap", "align-items-center", "mb-3");

        const img = document.createElement("img");
        img.setAttribute("src", pizza.image);
        img.setAttribute("alt", pizza.nom);
        img.setAttribute("style", "width: 50px; height: 50px; margin-right: 10px;");

        const nom = document.createElement("span");
        nom.textContent = pizza.nom;
        nom.classList.add("col");

        const quantité = document.createElement("span");
        quantité.textContent = `Quantité : ${pizza.quantité}`;
        quantité.classList.add("col");

        const btnMoins = document.createElement("button");
        btnMoins.textContent = "-";
        btnMoins.classList.add("btn", "btn-sm", "btn-outline-secondary", "col-1");
        btnMoins.addEventListener("click", function () {
            ajusterQuantite(pizza, -1);
        });

        const btnPlus = document.createElement("button");
        btnPlus.textContent = "+";
        btnPlus.classList.add("btn", "btn-sm", "btn-outline-secondary", "col-1");
        btnPlus.addEventListener("click", function () {
            ajusterQuantite(pizza, 1);
        });

        const prix = document.createElement("span");
        const sousTotal = pizza.quantité * pizza.prix;
        prix.textContent = `Sous-total : ${sousTotal} ${pizza.devise}`;
        prix.classList.add("col");

        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supp.";
        btnSupprimer.classList.add("btn", "btn-outline-danger", "btn-sm", "col-1");
        btnSupprimer.addEventListener("click", function () {
            supprimerPizza(pizza);
        });

        row.appendChild(img);
        row.appendChild(nom);
        row.appendChild(quantité);
        row.appendChild(btnMoins);
        row.appendChild(btnPlus);
        row.appendChild(prix);
        row.appendChild(btnSupprimer);
        panierContenu.appendChild(row);

        totalPrix += sousTotal;
    });

    const totalPrixElement = document.getElementById("totalPrix");
    totalPrixElement.textContent = `Total : ${totalPrix.toFixed(2)} €`;
}

function ajusterQuantite(pizza, delta) {
    const pizzaExistante = panier.find(item => item.nom === pizza.nom);
    if (pizzaExistante) {
        pizzaExistante.quantité = Math.max(1, pizzaExistante.quantité + delta);
    }
    afficherPanier();
}

function supprimerPizza(pizza) {
    panier = panier.filter(item => item.nom !== pizza.nom);
    afficherPanier();
}
