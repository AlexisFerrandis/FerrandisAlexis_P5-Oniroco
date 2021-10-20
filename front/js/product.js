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
async function renderItem() {
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
								<!--<option value="vert">vert</option>
                                <option value="blanc">blanc</option> -->
							</select>
                        </div>
                    </div>
                </div>
                <div class="bear-information__description">
                    <p>${bear.description}<br/> 🧸</p>
                </div>
                <div class="bear-information__add-to-cart">
                    <button id="bear-information__add-to-cart--add-btn">Ajouter</button>
                </div>
            </article>
        </section>
`;
	renderHTML += bearInformation;

	let bearContainer = document.getElementById("product-main");
	bearContainer.innerHTML += renderHTML;

	// Choice of bear colors
	bear.colors.forEach((color) => {
		document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`;
	});
}
renderItem();
