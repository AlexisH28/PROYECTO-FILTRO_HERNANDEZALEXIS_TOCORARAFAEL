document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('productos-container-car');
    if (!contenedor) {
        console.error('Elemento "productos-container-car" no encontrado en el DOM. Verifica que exista en tu HTML.');
        return;
    }
    
    // Cargar productos desde JSON
    fetch('productos.json')
        .then(response => response.json())
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
    if (!contenedor) {
        console.error('Elemento "productos-container-car" no encontrado en el DOM. Verifica que exista en tu HTML.');
        return;
    }

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
}