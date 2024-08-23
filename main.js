document.addEventListener('DOMContentLoaded', function() {
    mostrarCarrito(); // Muestra los productos en el carrito al cargar la página
    actualizarTotalCarrito(); // Actualiza el total al cargar la página
    cargarProductos(); // Carga los productos desde el JSON
});

function cargarProductos() {
    fetch('productos.json')
        .then(response => response.json())
        .then(productos => {
            mostrarProductos(productos);
            configurarFiltro(productos);
        });
}

function mostrarProductos(productos) {
    let contenedorProductos = document.querySelector('.productos-grid');
    contenedorProductos.innerHTML = ''; // Limpiar contenido anterior

    productos.forEach(producto => {
        let productoHTML = `
        <article class="producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString()} COP</p>
            <button class="btn-comprar" data-id="${producto.id}">Añadir al Carrito</button>
        </article>
        `;
        contenedorProductos.innerHTML += productoHTML;
    });

    // Reasignar eventos a los botones nuevos
    document.querySelectorAll('.btn-comprar').forEach(boton => {
        boton.addEventListener('click', function() {
            let producto = productos.find(p => p.id == this.getAttribute('data-id'));
            añadirAlCarrito(producto);
            mostrarAlerta('Producto añadido al carrito', 'success');
        });
    });
}

function configurarFiltro(productos) {
    document.querySelector('#filtro').addEventListener('input', function() {
        let textoFiltro = this.value.toLowerCase();
        let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(textoFiltro));
        mostrarProductos(productosFiltrados);
    });
}

function añadirAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarNumeroCarrito();
    actualizarTotalCarrito();
}

function actualizarNumeroCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    document.querySelector('.icono-carrito .cantidad').innerText = carrito.length;
}

function actualizarTotalCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    document.querySelector('.subtotal').innerText = `Subtotal: $${total.toFixed(2)} COP`;
    document.querySelector('.total').innerText = `Total: $${total.toFixed(2)} COP`;
}

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let contenedorCarrito = document.querySelector('.contenedor-carrito');
    contenedorCarrito.innerHTML = '';

    carrito.forEach((producto, index) => {
        let productoHTML = `
        <div class="producto-carrito">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div>
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio.toLocaleString()} COP</p>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </div>
        </div>
        `;
        contenedorCarrito.innerHTML += productoHTML;
    });

    // Asignar evento de eliminación
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', function() {
            eliminarProductoCarrito(this.getAttribute('data-index'));
        });
    });
}

function eliminarProductoCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1); // Elimina el producto
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarTotalCarrito();
    mostrarAlerta('Producto eliminado del carrito', 'warning');
}

function mostrarAlerta(mensaje, tipo) {
    alert(`${mensaje}`);
}