/***
API CONFIGURATION
***/

// Get array of all teddy bear information
async function getTheBears() {
	try {
		let response = await fetch("http://localhost:3000/api/teddies");
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
	}
}

// Render the bears on home page
async function renderBears() {
	let allBears = await getTheBears();
	let renderHTML = "";
	allBears.forEach((bear) => {
		let bearPreview = `
        <a href="./product.html?id=${bear._id}">
            <article class="bear-preview">
                <img src="${bear.imageUrl}" alt="Photo d'un petit ours en peluche.">
                <div class="bear-preview__info">
                    <h3 class="bear-preview__info--productName">${bear.name}</h3>
                    <p class="bear-preview__info--productPrice">${(bear.price / 100).toFixed(2)}€</p>
                </div>
            </article>
        </a>
        `;
		renderHTML += bearPreview;
	});
	let bearContainer = document.getElementById("items");
	bearContainer.innerHTML += renderHTML;
}

renderBears();
