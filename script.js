const marca = document.getElementById("marca");
const familia = document.getElementById("familia");
const modelo = document.getElementById("modelo");
const sugerencias = document.getElementById("sugerencias");
const boton = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

let baseDatos = {};


// ===============================
// CARGAR BASE DE DATOS
// ===============================

fetch("database.json")
    .then(respuesta => respuesta.json())
    .then(datos => {

        baseDatos = datos;

        console.log("Base de datos cargada correctamente");

    })
    .catch(error => {

        console.error("Error:", error);

        resultado.innerHTML = `
            <h3>⚠️ Error</h3>
            <p>No se pudo cargar la base de datos.</p>
        `;

    });


// ===============================
// SELECCIONAR MARCA
// ===============================

marca.addEventListener("change", function () {

    familia.innerHTML = `
        <option value="">Seleccione una familia</option>
    `;

    modelo.value = "";

    sugerencias.innerHTML = "";

    if (!baseDatos[marca.value]) {
        return;
    }

    const familias = baseDatos[marca.value];

    Object.keys(familias).forEach(function (nombreFamilia) {

        const opcion = document.createElement("option");

        opcion.value = nombreFamilia;
        opcion.textContent = nombreFamilia;

        familia.appendChild(opcion);

    });

});


// ===============================
// ESCRIBIR MODELO
// ===============================

modelo.addEventListener("input", function () {

    const texto = modelo.value
        .trim()
        .toLowerCase();

    sugerencias.innerHTML = "";

    if (texto.length === 0) {
        return;
    }

    if (!baseDatos[marca.value]) {
        return;
    }

    if (!familia.value) {
        return;
    }


    const modelos =
        baseDatos[marca.value][familia.value];


    Object.keys(modelos).forEach(function (codigo) {

        if (codigo.toLowerCase().includes(texto)) {

            const elemento =
                document.createElement("div");

            elemento.className = "sugerencia";

            elemento.innerHTML = `
                <strong>${codigo}</strong>
                <br>
                ${modelos[codigo].nombre}
            `;


            elemento.addEventListener(
                "click",
                function () {

                    modelo.value = codigo;

                    sugerencias.innerHTML = "";

                }
            );


            sugerencias.appendChild(elemento);

        }

    });

});


// ===============================
// BUSCAR DRIVERS
// ===============================

boton.addEventListener("click", function () {

    const marcaSeleccionada =
        marca.value;

    const familiaSeleccionada =
        familia.value;

    const modeloEscrito =
        modelo.value.trim();


    if (
        marcaSeleccionada === "" ||
        familiaSeleccionada === "" ||
        modeloEscrito === ""
    ) {

        resultado.innerHTML = `
            <h3>⚠️ Faltan datos</h3>

            <p>
                Selecciona la marca, la familia
                y el modelo.
            </p>
        `;

        return;

    }


    const modelos =
        baseDatos[marcaSeleccionada]
        [familiaSeleccionada];


    const modeloEncontrado =
        modelos[modeloEscrito];


    if (!modeloEncontrado) {

        resultado.innerHTML = `
            <h3>❌ Modelo no encontrado</h3>

            <p>
                No encontramos
                <b>${modeloEscrito}</b>
                en nuestra base de datos.
            </p>
        `;

        return;

    }


    resultado.innerHTML = `

        <h3>✅ Equipo encontrado</h3>

        <p>
            <b>Marca:</b>
            ${marcaSeleccionada}
        </p>

        <p>
            <b>Familia:</b>
            ${familiaSeleccionada}
        </p>

        <p>
            <b>Modelo:</b>
            ${modeloEncontrado.nombre}
        </p>

        <a
            class="boton-descarga"
            href="${modeloEncontrado.url}"
            target="_blank"
        >
            ⬇️ Descargar Drivers
        </a>

    `;

});