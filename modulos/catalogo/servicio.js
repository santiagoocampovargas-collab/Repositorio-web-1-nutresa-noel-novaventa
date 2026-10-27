(function () {
  window.catalogoServicio = {
    async listarTodos() {
      return Promise.resolve(
        window.catalogoMockData || {
          categorias: [],
          marcas: [],
          productos: [],
          presentaciones: [],
          imagenesProducto: []
        }
      );
    }
  };
})();
// ===== G1-MAR · Marca · inicio =====
window.productoServicio = window.productoServicio || {};

const MarcaValidacion = {
  validar(marca) {
    const errores = [];
    const nombre = (marca.nombreMarca || "").trim();

    if (!nombre) {
      errores.push({ campo: "nombreMarca", mensaje: "El nombre de la marca es obligatorio." });
    } else if (nombre.length < 2 || nombre.length > 40) {
      errores.push({ campo: "nombreMarca", mensaje: "El nombre debe tener entre 2 y 40 caracteres." });
    } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .&'-]+$/.test(nombre)) {
      errores.push({ campo: "nombreMarca", mensaje: "El nombre contiene caracteres no permitidos." });
    }
    return errores;
  },

  normalizarParaComparar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
};

productoServicio.listarMarcas = async function () {
  let marcas;
  if (API_CONFIG.modo === "api") {
    const respuesta = await fetch(`${API_CONFIG.baseUrl}/marcas`);
    if (!respuesta.ok) throw new Error(`Error de la API (${respuesta.status})`);
    marcas = await respuesta.json();
  } else {
    marcas = (window.catalogoMockData && window.catalogoMockData.marcas) || [];
  }
  return marcas.map((m) => ({
    idMarca: Number(m.idMarca),
    nombreMarca: m.nombreMarca.normalize("NFC")
  }));
};

productoServicio.siguienteIdMarca = async function () {
  const marcas = await productoServicio.listarMarcas();
  return marcas.length ? Math.max(...marcas.map((m) => m.idMarca)) + 1 : 1;
};

productoServicio.crearMarca = async function (marca) {
  const errores = MarcaValidacion.validar(marca);
  const marcas = await productoServicio.listarMarcas();

  if (!errores.length) {
    const nuevo = MarcaValidacion.normalizarParaComparar(marca.nombreMarca);
    const repetida = marcas.some(
      (m) => MarcaValidacion.normalizarParaComparar(m.nombreMarca) === nuevo
    );
    if (repetida) {
      errores.push({ campo: "nombreMarca", mensaje: "Ya existe una marca con ese nombre." });
    }
  }
  if (errores.length) {
    const error = new Error("Validación fallida");
    error.errores = errores;
    throw error;
  }

  const creada = {
    idMarca: await productoServicio.siguienteIdMarca(),
    nombreMarca: marca.nombreMarca.trim().normalize("NFC")
  };

  if (API_CONFIG.modo === "api") {
    const respuesta = await fetch(`${API_CONFIG.baseUrl}/marcas`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(creada)
    });
    if (!respuesta.ok) throw new Error(`Error de la API (${respuesta.status})`);
    return respuesta.json();
  }

  if (window.catalogoMockData && window.catalogoMockData.marcas) {
    window.catalogoMockData.marcas.push(creada);
  }
  return creada;
};
// ===== G1-MAR · Marca · fin =====