
let baseDatos = {};

const marca = document.getElementById("marca");
const familia = document.getElementById("familia");
const modelo = document.getElementById("modelo");
const boton = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

// Cargar base de datos
async function cargarBaseDatos() {
    try {
        const respuesta = await fetch("./database.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la base de datos.");
        }

        baseDatos = await respuesta.json();

        console.log("Base de datos cargada correctamente.");

    } catch (error) {
        console.error(error);
        resultado.textContent =
            "No se pudo cargar la base de datos. Intenta nuevamente.";
    }
}

cargarBaseDatos();

// Crear contenedor de sugerencias
let contenedorSugerencias = document.getElementById("sugerencias");

if (!contenedorSugerencias) {
    contenedorSugerencias = document.createElement("div");
    contenedorSugerencias.id = "sugerencias";
    modelo.insertAdjacentElement("afterend", contenedorSugerencias);
}

// Seleccionar familia según marca
marca.addEventListener("change", function () {

    familia.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Seleccione una familia";
    familia.appendChild(opcionInicial);

    contenedorSugerencias.innerHTML = "";
    resultado.innerHTML = "";

    if (!marca.value || !baseDatos[marca.value]) {
        return;
    }

    Object.keys(baseDatos[marca.value]).forEach(function (nombreFamilia) {

        const opcion = document.createElement("option");

        opcion.value = nombreFamilia;
        opcion.textContent = nombreFamilia;

        familia.appendChild(opcion);
    });
});

// Normalizar texto para comparar modelos
function normalizar(texto) {
    return texto
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "");
}

// Mostrar sugerencias
modelo.addEventListener("input", function () {

    contenedorSugerencias.innerHTML = "";

    if (!marca.value || !familia.value || !modelo.value.trim()) {
        return;
    }

    const equipos = baseDatos[marca.value]?.[familia.value];

    if (!equipos) {
        return;
    }

    const busqueda = normalizar(modelo.value);

    const coincidencias = Object.entries(equipos).filter(
        function ([codigo, datos]) {

            const nombre = normalizar(datos.nombre || "");
            const codigoNormalizado = normalizar(codigo);

            return codigoNormalizado.includes(busqueda) ||
                   nombre.includes(busqueda);
        }
    );

    coincidencias.slice(0, 5).forEach(function ([codigo, datos]) {

        const sugerencia = document.createElement("div");

        sugerencia.className = "sugerencia";
        sugerencia.textContent =
            (datos.nombre || codigo) + " (" + codigo + ")";

        sugerencia.addEventListener("click", function () {

            modelo.value = codigo;
            contenedorSugerencias.innerHTML = "";
        });

        contenedorSugerencias.appendChild(sugerencia);
    });
});

// Buscar drivers
boton.addEventListener("click", function () {

    contenedorSugerencias.innerHTML = "";

    if (!marca.value || !familia.value || !modelo.value.trim()) {

        resultado.innerHTML =
            "<h3>Campos incompletos</h3>" +
            "<p>Completa todos los campos para continuar.</p>";

        return;
    }

    const equipos = baseDatos[marca.value]?.[familia.value];

    if (!equipos) {

        resultado.innerHTML =
            "<h3>Familia no encontrada</h3>" +
            "<p>No se encontró información para esta familia.</p>";

        return;
    }

    const busqueda = normalizar(modelo.value);

    const modeloEncontrado = Object.entries(equipos).find(
        function ([codigo, datos]) {

            return normalizar(codigo) === busqueda ||
                   normalizar(datos.nombre || "") === busqueda;
        }
    );

    if (!modeloEncontrado) {

        resultado.innerHTML =
            "<h3>Modelo no encontrado</h3>" +
            "<p>Verifica el modelo o selecciona una de las sugerencias.</p>";

        return;
    }

    const [codigo, datos] = modeloEncontrado;

    if (!datos.url) {

        resultado.innerHTML =
            "<h3>Descarga no disponible</h3>" +
            "<p>Este modelo todavía no tiene un enlace de descarga.</p>";

        return;
    }

    resultado.innerHTML = `
        <h3>Equipo encontrado</h3>

        <p><strong>Marca:</strong> ${marca.value}</p>

        <p><strong>Familia:</strong> ${familia.value}</p>

        <p><strong>Modelo:</strong> ${datos.nombre || codigo}</p>

        <p><strong>Código:</strong> ${codigo}</p>

        <a
            class="boton-descarga"
            href="${datos.url}"
            target="_blank"
            rel="noopener noreferrer">
            Descargar Drivers
        </a>
    `;
});
