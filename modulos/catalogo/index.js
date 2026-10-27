(function () {
  async function iniciarCatalogo() {
    var estado = document.getElementById("catalogo-estado");
    if (!estado) {
      return;
    }
    try {
      await window.catalogoServicio.listarTodos();
      estado.textContent = "Estructura base del módulo catálogo cargada.";
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base del catálogo.";
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarCatalogo);
})();
// ===== G1-MAR · Marca crear · inicio =====
const catalogoMarcaForm = document.getElementById("catalogo-marca-form");
const catalogoMarcaId = document.getElementById("catalogo-marca-id");
const catalogoMarcaNombre = document.getElementById("catalogo-marca-nombre");
const catalogoMarcaErrores = document.getElementById("catalogo-marca-errores");
const catalogoMarcaExito = document.getElementById("catalogo-marca-exito");
const catalogoMarcaBoton = catalogoMarcaForm.querySelector("button[type='submit']");

async function catalogoMostrarSiguienteId() {
  try {
    catalogoMarcaId.value = await productoServicio.siguienteIdMarca();
  } catch (error) {
    console.error("No se pudo calcular el id de la marca:", error);
  }
}

function catalogoLimpiarMensajes() {
  catalogoMarcaErrores.replaceChildren();
  catalogoMarcaExito.textContent = "";
  catalogoMarcaNombre.removeAttribute("aria-invalid");
}

function catalogoMostrarErrores(errores) {
  const lista = document.createElement("ul");
  errores.forEach((e) => {
    const item = document.createElement("li");
    item.textContent = e.mensaje;
    lista.appendChild(item);
  });
  catalogoMarcaErrores.replaceChildren(lista);
  catalogoMarcaNombre.setAttribute("aria-invalid", "true");
  catalogoMarcaNombre.focus();
}

async function catalogoEnviarMarca(evento) {
  evento.preventDefault();
  catalogoLimpiarMensajes();

  const marca = {
    idMarca: Number(catalogoMarcaId.value),
    nombreMarca: catalogoMarcaNombre.value.trim().normalize("NFC")
  };

  const errores = MarcaValidacion.validar(marca);
  if (errores.length) {
    catalogoMostrarErrores(errores);
    return;
  }

  catalogoMarcaBoton.disabled = true;
  try {
    const creada = await productoServicio.crearMarca(marca);
    catalogoMarcaForm.reset();
    catalogoMarcaExito.textContent = `Marca "${creada.nombreMarca}" creada correctamente.`;
    await catalogoMostrarSiguienteId();
  } catch (error) {
    if (error.errores) {
      catalogoMostrarErrores(error.errores);
    } else {
      catalogoMostrarErrores([{ mensaje: "No se pudo guardar la marca. Intenta de nuevo." }]);
      console.error(error);
    }
  } finally {
    catalogoMarcaBoton.disabled = false;
  }
}

catalogoMarcaForm.addEventListener("submit", catalogoEnviarMarca);
catalogoMarcaNombre.addEventListener("input", catalogoLimpiarMensajes);
document.addEventListener("DOMContentLoaded", catalogoMostrarSiguienteId);
// ===== G1-MAR · Marca crear · fin =====
