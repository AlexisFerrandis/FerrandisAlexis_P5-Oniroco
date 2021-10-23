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

// For each bear in localStorage, render them on the page
(async function renderEachBear() {
	let htmlRender = "";
	const bearsContainer = document.getElementById("bearsContainer");
	for (let i = 0; i < localStorage.length; i++) {
		let bearInfo = await getBearInfoWithId(i);
		let bearSpecification = localStorage.getItem(localStorage.key(i));
		let bearQuantity = bearSpecification.split(",")[0];
		let bearColor = bearSpecification.split(",")[1];
		let bearHTMLContent = `
        <article class="cart-bear" data-id="${bearInfo._id}" data-color="${bearColor}" data-price="${bearInfo.price}">
            <div class="cart-bear__img">
                <img src="${bearInfo.imageUrl}" alt="Photo d'un petit ours">
            </div>
            <div class="cart-bear__content">
                <div class="cart-bear__content--title-price">
                    <h2>${bearInfo.name}</h2>
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
})();

/*** BEAR SETTINGS MANIPULATION ***/
