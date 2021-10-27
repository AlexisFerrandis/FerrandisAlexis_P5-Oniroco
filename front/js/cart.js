/*** GET THE BEARS FROM LOCAL STORAGE THEN DISPLAY THEM ***/

// Get id from localStorage.key(i), and extract info from the API
async function getBearInfoWithId(i) {
	let bearId = localStorage.key(i);
	try {
		let response = await fetch(`http://localhost:3000/api/teddies/${bearId}`);
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
	}
}

// Empty cart verification
function checkIfCartEmpty() {
	if (localStorage.length == 0) {
		document.getElementById("bearsContainer").innerHTML = "<p >Il n'y a pas encore d'ours ici, visitez <a href='./index.html'>notre séléction d'🐻</a>.</p>";
	}
}

// For each bear in localStorage, render them on the page
(async function renderEachBear() {
	let htmlRender = "";
	const bearsContainer = document.getElementById("bearsContainer");
	// If empty
	checkIfCartEmpty();
	// Else
	for (let i = 0; i < localStorage.length; i++) {
		let bearInfo = await getBearInfoWithId(i);
		let bearSpecification = localStorage.getItem(localStorage.key(i));
		let bearQuantity = bearSpecification.split(",")[0];
		let bearColor = bearSpecification.split(",")[1];
		let bearHTMLContent = `
        <article class="cart-bear" data-id="${bearInfo._id}" data-color="${bearColor}" data-price="${bearInfo.price}" data-quantity="${bearQuantity}">
            <div class="cart-bear__img">
                <a href="http://127.0.0.1:5500/front/html/product.html?id=${bearInfo._id}">
                    <img src="${bearInfo.imageUrl}" alt="Photo d'un petit ours">
                </a>
            </div>
            <div class="cart-bear__content">
                <div class="cart-bear__content--title-price">
                    <a href="http://127.0.0.1:5500/front/html/product.html?id=${bearInfo._id}">
                        <h2>${bearInfo.name}</h2>
                    </a
                    <p>${(bearInfo.price / 100).toFixed(2)}€</p>
                </div>
                <div class="cart-bear__content--settings">
                    <div class="cart-bear__content--settings-quantity">
                        <p>Quantité : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${bearQuantity}">
                    </div>
                    <div class="cart-bear__content--settings-color">
                        <p>Coloris : ${bearColor}</p>
                    </div>
                    <div class="cart-bear__content--settings-delete">
                        <p class="delete-bear">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
        `;
		htmlRender += bearHTMLContent;
	}
	bearsContainer.innerHTML += htmlRender;

	// OnLoad actualise total quantity & price, enable function
	totalPriceActualisation();
	totalBearActualisation();
	deleteBear();
	bearQuantityManipulation();
})();

/*** BEAR SETTINGS MANIPULATION ***/

// Actualising total price of the cart
function totalPriceActualisation() {
	let quantitySelect = document.querySelectorAll(".itemQuantity");
	let totalCartPrice = 0;
	for (let i = 0; i < quantitySelect.length; i++) {
		let bearInDOM = quantitySelect[i].closest("article");
		let individualPrice = bearInDOM.dataset.price;
		totalCartPrice += parseInt(quantitySelect[i].value) * individualPrice;
	}
	const totalPriceToDOM = document.getElementById("totalPrice");
	totalPriceToDOM.innerHTML = "Prix total : " + (totalCartPrice / 100).toFixed(2) + "€";
}

// Actualising total bear quantity
function totalBearActualisation() {
	let quantitySelect = document.querySelectorAll(".itemQuantity");
	let bearAmount = 0;
	for (let i = 0; i < quantitySelect.length; i++) {
		bearAmount += parseInt(quantitySelect[i].value);
	}
	const totalQuantityToDOM = document.getElementById("totalQuantity");
	totalQuantityToDOM.innerHTML = "Nombre d'ours : " + bearAmount + ` ours.`;

	// Total price actualisation
	totalPriceActualisation();
	// Look if cart empty
	checkIfCartEmpty();
}

// Deleting in localStorage and DOM
function deleteBear() {
	let deleteBearBtn = document.querySelectorAll(".delete-bear");
	for (let i = 0; i < deleteBearBtn.length; i++) {
		deleteBearBtn[i].addEventListener("click", (e) => {
			e.preventDefault();

			let bearInDOM = deleteBearBtn[i].closest("article");
			let bearId = bearInDOM.dataset.id;
			let bearQuantity = bearInDOM.dataset.quantity;
			let bearColor = bearInDOM.dataset.color;

			localStorage.removeItem(bearId, [bearQuantity, bearColor]);
			bearInDOM.remove();

			// Total price actualisation
			totalPriceActualisation();
		});
	}
}

// Modifying quantity in localStorage and DOM
function bearQuantityManipulation() {
	let quantitySelect = document.querySelectorAll(".itemQuantity");
	for (let i = 0; i < quantitySelect.length; i++) {
		quantitySelect[i].addEventListener("change", (e) => {
			e.preventDefault();

			let articleDOM = quantitySelect[i].closest("article");
			let bearId = articleDOM.dataset.id;
			let bearColor = articleDOM.dataset.color;

			let bearQuantity = e.target.value;
			if (bearQuantity == 0) {
				alert("Il faut au moins ajouter un petit ours 🧸");
			}
			localStorage.setItem(bearId, [bearQuantity, bearColor]);

			// Actualising the total amount of article
			totalBearActualisation();
		});
	}
}

/*** USER FORM INTERPRETATION ***/

// Object for user input
class Form {
	constructor() {
		this.firstName = document.getElementById("firstName").value;
		this.lastName = document.getElementById("lastName").value;
		this.adress = document.getElementById("address").value;
		this.city = document.getElementById("city").value;
		this.email = document.getElementById("email").value;
	}
}

// Analysing user input with regex
function userInputVerification() {
	const userForm = new Form();
	// Firstname
	function firstNameValid() {
		const userFirstName = userForm.firstName;
		const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
		if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(userFirstName)) {
			firstNameErrorMsg.innerText = "";
			return true;
		} else {
			firstNameErrorMsg.innerText = "Votre prénom ne peut contenir que des lettres, de 3 à 20 caractères.";
		}
	}
	// Lastname
	function lastNameValid() {
		const userLastName = userForm.lastName;
		const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
		if (/^[A-Za-z]{2,20}$/.test(userLastName)) {
			lastNameErrorMsg.innerText = "";
			return true;
		} else {
			lastNameErrorMsg.innerText = "Votre nom ne peut contenir que des lettres, de 2 à 20 caractères.";
		}
	}
	// Adresse
	function adressValid() {
		const userAdress = userForm.adress;
		const addressErrorMsg = document.getElementById("addressErrorMsg");
		if (/[^§]{5,50}$/.test(userAdress)) {
			addressErrorMsg.innerText = "";
			return true;
		} else {
			addressErrorMsg.innerText = "L'adresse semble incorrect.";
		}
	}
	// City
	function cityValid() {
		const userCity = userForm.city;
		const cityErrorMsg = document.getElementById("cityErrorMsg");
		if (/^[A-Za-z]{2,20}$/.test(userCity)) {
			cityErrorMsg.innerText = "";
			return true;
		} else {
			cityErrorMsg.innerText = "La ville ne peut contenir que des lettres, de 2 à 20 caractères.";
		}
	}
	// Email
	function emailValid() {
		const userEmail = userForm.email;
		const emailErrorMsg = document.getElementById("emailErrorMsg");
		if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail)) {
			emailErrorMsg.innerText = "";
			return true;
		} else {
			emailErrorMsg.innerText = "Il faut renseigner une adresse email valide.";
		}
	}

	if (firstNameValid() && lastNameValid() && adressValid() && cityValid() && emailValid()) {
		return true;
	} else {
		console.log("Unvalid form input.");
	}
}

// Id in Array to POST
function productsToSend() {
	let userBasket = [];
	for (let i = 0; i < localStorage.length; i++) {
		let id = localStorage.key(i);
		userBasket.push(id);
	}
	return userBasket;
}

// Send info to the back if valid, request orderId
let userFormSubmit = document.getElementById("order");
userFormSubmit.addEventListener("click", (e) => {
	e.preventDefault();

	if (userInputVerification()) {
		const products = productsToSend();
		const toSend = {
			contact: {
				firstName: firstName.value,
				lastName: lastName.value,
				address: address.value,
				city: city.value,
				email: email.value,
			},
			products,
		};
		// POSTing on the API
		fetch("http://localhost:3000/api/teddies/order", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(toSend),
		})
			// Storing order Id in the url
			.then((response) => response.json())
			.then((value) => {
				localStorage.clear();
				document.location.href = `./confirmation.html?id=${value.orderId}`;
			})
			.catch((error) => {
				console.log("Error: " + error);
			});
	}
});
