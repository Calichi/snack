'use strict';

// GLOBAL ELEMENTS

let selectedProductId = "";

let increaseButton = document.getElementById('increase');
let decreaseButton = document.getElementById('decrease');
let sendButton = document.getElementById('send')
let orderTable = document.querySelector('.preview .table .content');
let orderTableTotal = document.querySelector('.preview .table .total');


// PRODUCT ORDER DATA

let products = [
    {
        id: 'apple',
        count: 0,
        price: 60,
        name: {
            singular: 'Manzana preparada',
            plural: 'Manzanas preparadas'
        }
    },
    {
        id: 'gummy',
        count: 0,
        price: 20,
        name: {
            singular: 'Bolsita de gomitas',
            plural: 'Bolsitas de gomitas'
        }
    }
];

// CREATE PRODUCT VIEW

function showProduct(product)
{
    let productsElement = document.querySelector('.products');
    let productElement = document.createElement('li');

    productElement.innerHTML = 
    `
    <article id="product-${product.id}" class="product">
        <img id="image-${product.id}" src="img/${product.id}.webp" class="image" width="300"/>
        <figure alt="Fondo gráfico de la cantidad del producto" class="count-background"></figure>
        <label class="count">${product.count}</label>
        <figure alt="Fondo gráfico del precio producto" class="price-background"></figure>
        <label class="name">${product.name.singular}</label>
        <label class="price">$${product.price}</label>
        <input type="radio" name="product" value="${product.id}"/>
    </article>
    `
    productsElement.appendChild(productElement);
}

products.forEach(product => {
    showProduct(product);
});

//PRODUCT VISUAL MANAGEMENT

function getProductVisualComponent(className)
{
    return document.querySelector(`#product-${selectedProductId} .${className}`);
}

function getSelectedProduct(){
    return products.find(product => product.id == selectedProductId)
    //return products[selectedProductId]
}

function getProductVisualCount(){
    return getProductVisualComponent('count')
}

function getProductVisualCountBackground(){
    return getProductVisualComponent('count-background')
}

// ORDER VISUAL MANAGEMENT

function getOrderElementChild(orderClassName, childClassName){
    return document.querySelector(`.${orderClassName} .${childClassName}`)
}

function getOrderElement(productId) {
    return document.querySelector(`.${productId}-order`);
}

function newOrderElement(product) {
    let countElement = document.createElement('td');
    let nameElement = document.createElement('td');
    let priceElement = document.createElement('td');
    let orderElement = document.createElement('tr');

    countElement.className = 'count';
    nameElement.className = 'name';
    priceElement.className = 'price';
    orderElement.className = `${product.id}-order`;
    
    countElement.textContent = product.count;
    nameElement.textContent = product.count == 1 ? product.name.singular : product.name.plural;
    priceElement.textContent = `$${product.count * product.price}`;

    orderElement.appendChild(countElement);
    orderElement.appendChild(nameElement);
    orderElement.appendChild(priceElement);
    return orderElement;
}

function updateOrderElement(product)
{
    let orderClassName = `${product.id}-order`

    let countElement = getOrderElementChild(orderClassName, 'count');
    let nameElement = getOrderElementChild(orderClassName, 'name');
    let priceElement = getOrderElementChild(orderClassName, 'price');

    countElement.textContent = product.count;
    nameElement.textContent = product.count == 1 ? product.name.singular : product.name.plural;
    priceElement.textContent = `$${product.count * product.price}`;
}

function onChangedOrder(product) {
    let orderElement = getOrderElement(product.id);
    let existsOrderElement = orderElement != null;
    let thereAreProducts = product.count > 0;

    if (existsOrderElement && !thereAreProducts) {
        orderElement.remove();
    } else if (existsOrderElement && thereAreProducts) {
        updateOrderElement(product);
    } else if (!existsOrderElement && thereAreProducts) {
        orderTableTotal.textContent = `$${getComputedTotal()}`;
        orderTable.appendChild(newOrderElement(product));
    }

    orderTableTotal.textContent = `$${getComputedTotal()}`;
}

// COMPUTE ORDER TOTAL

function getComputedTotal() {
    let total = 0;
    products.forEach(product => {
        total += product.count * product.price;
    });
    return total;
}

// PRODUCT QUANTITY INCREMENT AND DECREMENT SYSTEM

function increment(product) {
    let max = 99;
    product.count++;
    if(product.count > max) product.count = max;
    return product.count;
}

function decrement(product) {
    let min = 0;
    product.count--;
    if(product.count < min) product.count = min;
    return product.count;
}

increaseButton.addEventListener('click', (event) => {
    let product = getSelectedProduct();
    let visualCount = getProductVisualCount();
    if(product.count == 0) {
        visualCount.style.display = 'block';
        getProductVisualCountBackground().style.display = 'block';
    }
    getProductVisualCount().textContent = increment(product);
    onChangedOrder(product);
    hideToolTip('add');
})

decreaseButton.addEventListener('click', (event) => {
    let product = getSelectedProduct();
    let visualCount = getProductVisualCount();
    visualCount.textContent = decrement(product);
    onChangedOrder(product);
    if(product.count == 0) {
        visualCount.style.display = 'none';
        getProductVisualCountBackground().style.display = 'none';
    }
    hideToolTip('add');
})

// PRODUCT SELECTION

// document.querySelectorAll('input[name="product"]')
// .forEach(element => {
//     element.addEventListener('change', (event) => {
//         let radio = event.target;
//         if(radio.checked) {
//             selectedProductId = radio.value;
//             hideToolTip('touch');
//             showToolTip('add');
//         }
//     });
// });

document.querySelectorAll('.product .image')
.forEach(element => {
    element.addEventListener('click', (event) => {
        let image = event.target;
        let productName = image.id.split('-')[1];
        let radio = document.querySelector(`input[value="${productName}"]`)

        radio.checked = !image.checked;

        if(radio.checked) {
            selectedProductId = radio.value;
            hideToolTip('touch');
            showToolTip('add');
        }
    });
});

// SEND ORDER

function getOrder() {
    let order = "";
    products.forEach(product => {
        if(product.count > 0) {
            order += `${product.count} `;
            order += product.count == 1 ? product.name.singular : product.name.plural;
            order += ", ";
        }
    });
    if(order.endsWith(", "))
    {
        order = order.substring(0, order.length - 2) + ".";
    }
    
    return order;
}

function sendOrder() {
    let phone = '+528991902648';
    let message = getOrder();
    let whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(whatsappUrl, '_blank')
}

sendButton.addEventListener('click', sendOrder);

// TOOLTIP PRODUCTS
let productsElement = document.querySelector('.products');
let isActive = {
    slide: true, touch: true, add: true
}

function hideToolTip(name){
    if(!isActive[name]) return;
    let toolTip = document.getElementById(`tt-${name}`);
    toolTip.style.display = 'none';
    isActive[name] = false;
}

function showToolTip(name){
    if(!isActive[name]) return;
    let toolTip = document.getElementById(`tt-${name}`);
    toolTip.style.display = 'inline';
}

productsElement.addEventListener('scroll', (event) => {
    hideToolTip('slide');
    showToolTip('touch');
});