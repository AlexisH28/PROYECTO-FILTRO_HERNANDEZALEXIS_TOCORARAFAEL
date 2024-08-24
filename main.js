document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos desde JSON
    fetch('productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('productos', JSON.stringify(data));
            mostrarProductos(data);
        })
        .catch(error => console.error('Error al cargar productos:', error));

    cargarCarrito();

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-comprar')) {
            const productoId = e.target.closest('.producto-2').dataset.id;
            añadirAlCarrito(productoId);
        }
    });

    const carritoContainer = document.getElementById('carrito');
    if (carritoContainer) {
        carritoContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-eliminar')) {
                const productoId = e.target.dataset.id;
                eliminarDelCarrito(productoId);
            }
        });
    } else {
        console.error('Elemento "carrito" no encontrado en el DOM. Asegúrate de que existe en tu HTML.');
    }
});

function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos-container-car');
    if (contenedor) {
        contenedor.innerHTML = '';  // Limpiar el contenedor

        productos.forEach(producto => {
            const productoHTML = `
                <article class="producto-2" data-id="${producto.id}">
                    <img class="imagen-prd" src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="text-prd">
                        <h3>${producto.nombre}</h3>
                        <p>$${producto.precio.toLocaleString('es-CO')} COP</p>
                        <button class="btn-comprar">Añadir al Carrito</button>
                    </div>
                </article>
            `;
            contenedor.insertAdjacentHTML('beforeend', productoHTML);
        });
    } else {
        console.error('Elemento "productos-container-car" no encontrado en el DOM. Asegúrate de que existe en tu HTML.');
    }
}

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarCarritoUI(carrito);
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function añadirAlCarrito(productoId) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = obtenerProductoPorId(productoId);

    if (producto) {
        const productoExistente = carrito.find(p => p.id === parseInt(productoId));
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        guardarCarrito(carrito);
        actualizarCarritoUI(carrito);
    } else {
        console.error('Producto no encontrado en LocalStorage.');
    }
}

function eliminarDelCarrito(productoId) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(producto => producto.id !== parseInt(productoId));

    guardarCarrito(carrito);
    actualizarCarritoUI(carrito);
}

function actualizarCarritoUI(carrito) {
    const carritoContainer = document.getElementById('carrito');
    if (carritoContainer) {
        carritoContainer.innerHTML = '';  // Limpiar carrito

        let subtotal = 0;

        carrito.forEach(producto => {
            const productoHTML = `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${(producto.precio * producto.cantidad).toLocaleString('es-CO')}</td>
                    <td>
                        <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                    </td>
                </tr>
            `;
            carritoContainer.insertAdjacentHTML('beforeend', productoHTML);
            subtotal += producto.precio * producto.cantidad;
        });

        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        if (subtotalElement && totalElement) {
            subtotalElement.textContent = `$${subtotal.toLocaleString('es-CO')} COP`;
            const total = subtotal + calcularImpuestos(subtotal);
            totalElement.textContent = `$${total.toLocaleString('es-CO')} COP`;
        } else {
            console.error('Elementos "subtotal" o "total" no encontrados en el DOM. Asegúrate de que existen en tu HTML.');
        }
    } else {
        console.error('Elemento "carrito" no encontrado en el DOM. Asegúrate de que existe en tu HTML.');
    }
}

function obtenerProductoPorId(productoId) {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    return productos.find(producto => producto.id === parseInt(productoId));
}

function calcularImpuestos(subtotal) {
    return subtotal * 0.19;  // Supongamos un 19% de IVA
}