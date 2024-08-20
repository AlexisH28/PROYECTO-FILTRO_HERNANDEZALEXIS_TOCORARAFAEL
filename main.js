function toggleMenu() {
    const menu = document.querySelector('.navbar');
    menu.classList.toggle('active');
}

// Local Storage for Cart Management
function saveToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function addToCart(product) {
    let cart = loadFromLocalStorage();
    cart.push(product);
    saveToLocalStorage(cart);
    updateCartUI();
}

function updateCartUI() {
    const cart = loadFromLocalStorage();
    const cartElement = document.querySelector('.cart-items');
    cartElement.innerHTML = '';
    cart.forEach(item => {
        const productElement = document.createElement('div');
        productElement.textContent = `${item.name} - ${item.price}`;
        cartElement.appendChild(productElement);
    });
}

// Event listeners for add to cart buttons
document.querySelectorAll('.btn-comprar').forEach(button => {
    button.addEventListener('click', (event) => {
        const productElement = event.target.closest('.producto');
        const product = {
            name: productElement.querySelector('h3').textContent,
            price: productElement.querySelector('p').textContent,
        };
        addToCart(product);
    });
});

// Fetch products from JSON file and display them
fetch('/path/to/productos.json')
    .then(response => response.json())
    .then(products => {
        const productsContainer = document.querySelector('.productos-grid');
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productHTML = `
                <article class="producto">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price} COP</p>
                    <button class="btn-comprar">Añadir al Carrito</button>
                </article>
            `;
            productsContainer.innerHTML += productHTML;
        });
        attachAddToCartListeners();
    });

function attachAddToCartListeners() {
    document.querySelectorAll('.btn-comprar').forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.producto');
            const product = {
                name: productElement.querySelector('h3').textContent,
                price: productElement.querySelector('p').textContent,
            };
            addToCart(product);
        });
    });
}

// Filter functionality
function filterProducts(searchTerm) {
    const products = document.querySelectorAll('.producto');
    products.forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchTerm.toLowerCase())) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

document.querySelector('#search-input').addEventListener('input', (event) => {
    filterProducts(event.target.value);
});