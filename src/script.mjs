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
]

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
})

// PRODUCT SELECTION

document.querySelectorAll(".order .products .product .image")
.forEach(element => {
    element.addEventListener('click', (event) => {
        selectedProductId = event.target.getAttribute('id');
    });
});

// SEND ORDER

function getOrder() {
    let order = "";
    products.forEach(product => {
        if(product.count > 0) {
            order += `${product.count} `;
            order += product.count == 1 ? product.name.singular : product.name.plural;
            order += "\n";
        }
    });
    return order;
}

function sendOrder() {
    let phone = '+528991902648';
    let message = getOrder();
    let whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(whatsappUrl, '_blank')
}

sendButton.addEventListener('click', sendOrder);