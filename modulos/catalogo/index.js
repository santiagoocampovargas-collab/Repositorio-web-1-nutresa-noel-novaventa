// PEGA AQUÍ LA URL DE TU MOCKAPI WEB
const MOCK_API_URL = "https://6ada65967512f497b3ffea30.mockapi.io/api/v1/productos";

document.addEventListener('DOMContentLoaded', () => {
    const btnCargar = document.getElementById('btn-cargar');
    
    // Escuchar el clic sobre el botón para iniciar la carga
    if (btnCargar) {
        btnCargar.addEventListener('click', cargarProductosMockAPI);
    }
});

async function cargarProductosMockAPI() {
    const contenedor = document.getElementById('vitrina-contenedor');
    const btnCargar = document.getElementById('btn-cargar');

    try {
        // 1. Mostrar estado de carga en el botón e interfaz
        if (btnCargar) {
            btnCargar.disabled = true;
            btnCargar.textContent = "Consultando Mock API...";
        }

        contenedor.innerHTML = '<p>Cargando productos desde la API...</p>';

        // 2. Consumo asíncrono con fetch y await
        const respuesta = await fetch(MOCK_API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const productos = await respuesta.json();
        contenedor.innerHTML = '';

        if (!productos || productos.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron productos en la base de datos de tu Mock API.</p>';
            return;
        }

        // 3. Renderizado de cada tarjeta en el DOM
        productos.forEach(producto => {
            const article = document.createElement('article');
            article.className = 'tarjeta-producto';

            const nombre = producto.nombre || producto.nombreProducto || 'Producto sin nombre';
            const imagen = producto.imagen || producto.urlImagen || producto.avatar || 'https://via.placeholder.com/150';
            const precio = producto.precio || producto.precioReferencia || 'N/A';

            article.innerHTML = `
                <figure>
                    <img src="${imagen}" alt="${nombre}">
                </figure>
                <div class="info-producto">
                    <h3>${nombre}</h3>
                    <p>Precio: $${precio}</p>
                    <button class="btn-detalle" onclick="alert('Detalle de: ${nombre}')">Ver detalle</button>
                </div>
            `;

            contenedor.appendChild(article);
        });

    } catch (error) {
        console.error("Error al consumir la Mock API:", error);
        contenedor.innerHTML = `<p style="color: red; font-weight: bold;">
            Error al conectar con la Mock API. Revisa la consola de DevTools (F12) y confirma tu URL.
        </p>`;
    } finally {
        // 4. Restaurar el botón al finalizar la operación
        if (btnCargar) {
            btnCargar.disabled = false;
            btnCargar.textContent = "Volver a Cargar Productos";
        }
    }
}