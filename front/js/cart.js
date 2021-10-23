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
async function renderEachBear() {
	let htmlRender = "";
	const bearsContainer = document.getElementById("bearsContainer");
	for (let i = 0; i < localStorage.length; i++) {
		let bearInfo = await getBearInfoWithId(i);
		let bearSpecification = localStorage.getItem(localStorage.key(i));
		let bearQuantity = bearSpecification.split(",")[0];
		let bearColor = bearSpecification.split(",")[1];
		let bearHTMLContent = `
        <article class="cart__item" data-id="${bearInfo._id}" data-color="${bearColor}" data-price="${bearInfo.price}">
            <p>${bearQuantity}</p>
        </article>
        `;
		htmlRender += bearHTMLContent;
	}
	bearsContainer.innerHTML += htmlRender;
}
renderEachBear();
