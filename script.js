let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
let totalCost = 0;
let shippingCost = 2.5;

function load() {
    renderShoppingCard();
    render();
    setUpButtonEventListeners();
    updateTotalCost();
    loadHeartState();
}

function openBasket() {
    let basket = document.querySelector('.shoppingcardcontain');
    let isOpen = basket.classList.contains('showbasket');

    if (isOpen) {
        basket.classList.add('slideOut');
        basket.classList.remove('showbasket');
        document.body.style.overflow = 'auto';
    } else {
        basket.classList.remove('slideOut');
        basket.classList.add('showbasket');
        document.body.style.overflow = 'hidden';
    }
}

function switchcolor() {
    let hearth = document.getElementById('hearth');
    if (hearth.src.includes('herz.rot.png')) {
        hearth.src = 'img/herz.png';
        localStorage.setItem('heartColor', 'notRed');
    } else {
        hearth.src = 'img/herz.rot.png';
        localStorage.setItem('heartColor', 'red');
    }
}

function loadHeartState() {
    let heartColor = localStorage.getItem('heartColor');
    let hearth = document.getElementById('hearth');
    if (heartColor === 'red') {
        hearth.src = 'img/herz.rot.png';
    } else {
        hearth.src = 'img/herz.png';
    }
}

function addIngredients(name, price) {
    let itemIndex = shoppingCart.findIndex(item => item.name === name);
    let addfood = document.getElementById('cardorder');
    if (!document.querySelector('.ordercardsettings')) {
        addfood.innerHTML = `
            <div class="ordercardsettings"></div>
            <div class="resultatct">
                <div class="resultat">Gesamtkosten:</div>
                <div class="resultprice">0.00 CHF</div>
            </div>
            <div class="ordernow">Jetzt bestellen!</div>`;
    }
    if (itemIndex === -1) {
        const newItem = {
            name: name,
            price: parseFloat(price),
            crowd: 1
        };
        shoppingCart.push(newItem);
        addItemToDOM(newItem); 
    } else {
        shoppingCart[itemIndex].crowd++;
        updateItemInDOM(shoppingCart[itemIndex]); 
    }
    updateLocalStorage();
    updateTotalCost();
    document.getElementById('shoppingcard').classList.add('hidden');
}

function addItemToDOM(item) {
    let orderCardSettings = document.querySelector('.ordercardsettings');
    let itemHtml = `
        <div class="itemsettings dvwith" id="carddiv${item.name.replace(/\s/g, '')}">
            <div class="isettings" id="food${item.name.replace(/\s/g, '')}">${item.name}</div>
            <div class="crowdoptions">
                <div class="isettings" id="crowdid-${item.name.replace(/\s/g, '')}">${item.crowd}x</div>
                <div class="plusminus"><img src="img/plus.add.png" onclick="increase('${item.name}', '${item.price}')"></div>
                <div class="plusminus"><img src="img/minus.png" onclick="reduce('${item.name}', '${item.price}')"></div>
            </div>
        </div>
    `;
    orderCardSettings.innerHTML += itemHtml;
}

function updateItemInDOM(item) {
    let crowdElement = document.getElementById(`crowdid-${item.name.replace(/\s/g, '')}`);
    if (crowdElement) {
        crowdElement.innerText = `${item.crowd}x`;
    }
}

function reduce(name) {
    let item = shoppingCart.find(item => item.name === name);
    if (item && item.crowd > 1) {
        item.crowd--;
    } else {
        shoppingCart = shoppingCart.filter(item => item.name !== name);
    }
    updateLocalStorage();
    updateTotalCost();
    renderShoppingCard();
}

function returnCard(name, price) {
    if (shoppingCart[name]) {
        shoppingCart[name].crowd--;
        let crowdElement = document.getElementById(`crowdid-${name}`);
        crowdElement.innerText = `${shoppingCart[name].crowd}x`;
        updateTotalPrice(-parseFloat(price));
    }
}

function increase(name, price) {
    addIngredients(name, price); 
}

function updateTotalCost() {
    totalCost = shoppingCart.reduce((acc, item) => acc + (item.price * item.crowd), 0);
    renderShoppingCard(); 
}
    
function updateLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

function renderShoppingCard() {
    let cardheader = document.getElementById('shoppingcard');
    cardheader.innerHTML = `
        <div class="cardheader">Warenkorb</div>
        <div class="deliverysettings dvwith deliverysettingsright">
            <div class="deliverysettings">
                <div class="deliverysettings deliverysettingsleft">
                    <div class="deliveryimg"><img src="img/delivery.png"></div>
                    <div class="deliveryfont">
                        <div class="delivery">Lieferung</div>
                        <div class="delivery2">+2.50 CHF</div>
                    </div>
                </div>
            </div>
            <div class="deliverysettings dvwtih2">
                <div class="deliverysettings">
                    <div class="deliveryimg"><img src="img/bag.png"></div>
                    <div class="deliveryfont">
                        <div class="delivery">Abholung</div>
                        <div class="delivery2">Nicht verfügbar</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="deliveryfont" id="cardorder">
            <div class="bagimg"><img src="img/bag.png"></div>`;

    let cardOrderDiv = document.getElementById('cardorder');
    cardOrderDiv.innerHTML = '';

    if (shoppingCart.length > 0) {
        shoppingCart.forEach(item => {
            cardOrderDiv.innerHTML += `
                <div class="itemsettings dvwith">
                    <div class="isettings">${item.name} - ${item.crowd}x - ${item.price.toFixed(2)} CHF</div>
                    <div class="crowdoptions">
                        <img src="img/minus.png" onclick="reduce('${item.name}', ${item.price})">
                        <img src="img/plus.add.png" onclick="increase('${item.name}', ${item.price})">
                    </div>
                </div>`;
        });
        cardOrderDiv.innerHTML += `
            <div class="resultatct">
                <div class="resultat">Gesamtkosten:</div>
                <div class="resultprice">${(totalCost + shippingCost).toFixed(2)} CHF</div>
            </div>
            <div class="ordernow">Jetzt bestellen!</div>`;
    } else {
        cardOrderDiv.innerHTML += `
            <div class="bagimg"><img src="img/bag.png"></div>
            <div class="cardcontent2">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</div>`;
        }
}


    function render() {
            let foodcontainer = document.getElementById('foodcontainer');
                foodcontainer.innerHTML = '';
            for (let category in Foods) {
                let foods = Foods[category];
                let categoryId = category.replace(/\s+/g, '_').toLowerCase();
                foodcontainer.innerHTML += `<div class="category" id="${categoryId}"><h2>${category}</h2></div>`; 
            for (let i = 0; i < foods.length; i++) {
                const foodlist = foods[i];
                    foodcontainer.innerHTML += `
                    <div class="foodsection">
                    <div class="foodnames">
                    <div class="foodname" id="foodname${i}">${foodlist['name']}<img src="img/info.png"></div>
                    <div class="foodoption" id="foodoption${i}">${foodlist['ingredients']}</div>
                    <div class="price" id="price${i}">${foodlist['price']} CHF</div>
                    </div>
                    <div class="foodimgbtn">
                    <div class="foodimg"><img src="${foodlist['foodimg']}"></div> 
                    <div class="foodplusbtn"><img id="${foodlist['value']}${i}" src="${foodlist['value']}" 
                    onclick="addIngredients('${foodlist['name']}', '${foodlist['price']}', '${foodlist['crowd']}')"></div>
                    </div>    
                    </div>`;
                    }}
                foodcontainer.innerHTML +=
                '<div class="upbtn" style="display:none;"><img src="img/up.button.png"></div>';
    }
    
    function setUpButtonEventListeners() {
        document.querySelector('.upbtn').addEventListener('click', function() {
            window.scrollTo({top: 0, 
            });
            });
        window.addEventListener('scroll', function() {
            const btn = document.querySelector('.upbtn');
                if (window.pageYOffset > 50) {
                btn.style.display = 'block';} 
                else {
                btn.style.display = 'none';
            }});
        }

    document.addEventListener("DOMContentLoaded", load);