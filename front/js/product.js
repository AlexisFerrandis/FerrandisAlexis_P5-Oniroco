/*** 
Bear render on product page
***/

// Looking for id in the page url
function getIdInUrl() {
	let url = new URL(window.location.href);
	let searchParam = new URLSearchParams(url.search);

	if (searchParam.has("id")) {
		let id = searchParam.get("id");
		return id;
	} else {
		console.log("Unfortunately no match in the URL.");
	}
}

// Get the information of the bear with his id
async function getIdBear() {
	let id = getIdInUrl();
	try {
		let response = await fetch(`http://localhost:3000/api/teddies/${id}`);
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
	}
}

async function renderBear() {
	let bear = await getIdBear();
	let renderHTML = "";
	let bearInformation = `
        <div class="product-presentation">
            <h2>${bear.name} 🐻</h2>
            <p>${bear.description}</p>
        </div>

        <section id="bear-information">
            <article class="bear-information">
                <div class="bear-information__image">
                    <img src="${bear.imageUrl}"" alt="Photo d'un petit ours en peluche">
                </div>
                <div class="bear-information__settings">
                    <div class="bear-information__settings--price">
                            <h3>Prix unitaire : <br/><span>${(bear.price / 100).toFixed(2)}€</span></h3>
                    </div>
                    <div class="bear-information__settings--qte-clr">
                        <div class="bear-quantity">
                            <label for="itemQuantity">Nombre d'article(s)</label>
                            <input type="number" name="itemQuantity" min="1" max="100" value="1" id="quantity" />
                        </div>
                        <div class="bear-color">
                        <label for="color-select">Couleur</label>
							<select name="color-select" id="colors">
								<option value="">Choisir une couleur</option>
							</select>
                        </div>
                    </div>
                </div>
                <div class="bear-information__description">
                    <p>${bear.description}<br/> 🧸</p>
                </div>
                <div class="bear-information__add-to-cart">
                    <button id="add-to-cart">Ajouter</button>
                </div>
            </article>
        </section>
`;
	renderHTML += bearInformation;

	let bearContainer = document.getElementById("product-main");
	bearContainer.innerHTML += renderHTML;

	// Choice of bear color loop
	bear.colors.forEach((color) => {
		document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`;
	});

	// Settings to local storage
	toLocalStorage();
}
renderBear();

/*** 
LOCALSTORAGE INFORMATIONS
***/

// Add to cart & localStorage
function toLocalStorage() {
	const addToBtn = document.getElementById("add-to-cart");
	addToBtn.addEventListener("click", () => {
		let bearId = getIdInUrl();
		let bearColor = document.getElementById("colors").value;
		let bearQuantity = document.getElementById("quantity").value;

		if (bearColor == "") {
			alert("Il faut choisir une couleur à cet ours !");
		} else if (bearQuantity == 0) {
			alert("Impossible d'ajouter 0 ours !");
		} else {
			let bearInCart = [bearId, bearColor];

			localStorage.setItem(bearInCart, bearQuantity);
			window.location.href = "./cart.html";
		}
	});
}
