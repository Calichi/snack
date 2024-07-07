'use strict';

let products = {
    apple: {count: 0},
    gummy: {count: 0}
}

let selectedProductId = "";

let buttonIncrease = document.getElementById('increase');
let buttonDecrease = document.getElementById('decrease');

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

function getProductVisualComponent(className)
{
    return document.querySelector(`#product-${selectedProductId} .${className}`);
}

function getSelectedProduct(){
    return products[selectedProductId]
}

function getProductVisualCount(){
    return getProductVisualComponent('count')
}

function getProductVisualCountBackground(){
    return getProductVisualComponent('count-background')
}

buttonIncrease.addEventListener('click', (event) => {
    let product = getSelectedProduct();
    let visualCount = getProductVisualCount();
    if(product.count == 0) {
        visualCount.style.display = 'block';
        getProductVisualCountBackground().style.display = 'block';
    }
    getProductVisualCount().textContent = increment(product);
})

buttonDecrease.addEventListener('click', (event) => {
    let product = getSelectedProduct();
    let visualCount = getProductVisualCount();
    visualCount.textContent = decrement(product);
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