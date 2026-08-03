const marca = document.getElementById("marca");
const familia = document.getElementById("familia");
const modelo = document.getElementById("modelo");
const boton = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

let baseDatos = {};


// Cargar la base de datos
fetch("database.json")
    .then(respuesta => respuesta.json())
    .then(datos => {

        baseDatos = datos;

        console.log("Base de datos cargada correctamente");

    })
    .catch(error => {

        console.error("Error cargando database.json:", error);

        resultado.innerHTML = `
            <h3>⚠️ Error</h3>
            <p>No se pudo cargar la base de datos.</p>
        `;

    });


// Cuando se selecciona una marca
marca.addEventListener("change", function () {

    familia.innerHTML = `
        <option value="">Seleccione una familia</option>
    `;

    modelo.value = "";

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


// Botón Buscar Drivers
boton.addEventListener("click", function () {

    const marcaSeleccionada = marca.value;
    const familiaSeleccionada = familia.value;
    const modeloEscrito = modelo.value.trim();

    if (
        marcaSeleccionada === "" ||
        familiaSeleccionada === "" ||
        modeloEscrito === ""
    ) {

        resultado.innerHTML = `
            <h3>⚠️ Faltan datos</h3>

            <p>
                Selecciona la marca, la familia y escribe
                el modelo específico.
            </p>
        `;

        return;
    }


    const familias = baseDatos[marcaSeleccionada];

    if (!familias) {

        resultado.innerHTML = `
            <h3>❌ Marca no encontrada</h3>
        `;

        return;
    }


    const modelos = familias[familiaSeleccionada];

    if (!modelos) {

        resultado.innerHTML = `
            <h3>❌ Familia no encontrada</h3>
        `;

        return;
    }


    const modeloEncontrado = modelos[modeloEscrito];


    if (!modeloEncontrado) {

        resultado.innerHTML = `
            <h3>❌ Modelo no encontrado</h3>

            <p>
                No encontramos <b>${modeloEscrito}</b>
                en nuestra base de datos.
            </p>

            <p>
                Comprueba que escribiste correctamente
                el modelo.
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