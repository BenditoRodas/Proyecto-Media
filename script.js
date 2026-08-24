const marca = document.getElementById("marca");
const familia = document.getElementById("familia");
const modelo = document.getElementById("modelo");
const sugerencias = document.getElementById("sugerencias");

const boton = document.getElementById("buscar");
const limpiar = document.getElementById("limpiar");

const resultado = document.getElementById("resultado");

const soporte = document.getElementById("soporte");

const estado = document.getElementById("estado");


let baseDatos = {};


// ==========================================
// ENLACES OFICIALES
// ==========================================

const paginasSoporte = {

    HP:
        "https://support.hp.com/co-es/computer",

    Lenovo:
        "https://support.lenovo.com/co/es/"

};


// ==========================================
// CARGAR BASE DE DATOS
// ==========================================

fetch("database.json")

    .then(respuesta => {

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar database.json"
            );

        }

        return respuesta.json();

    })

    .then(datos => {

        baseDatos = datos;


        estado.textContent =
            "✅ Base de datos cargada correctamente";


        estado.style.background =
            "#d4edda";


        estado.style.color =
            "#155724";


        console.log(
            "Base de datos cargada correctamente"
        );

    })

    .catch(error => {

        console.error(error);


        estado.textContent =
            "❌ Error cargando la base de datos";


        estado.style.background =
            "#f8d7da";


        estado.style.color =
            "#721c24";


        resultado.innerHTML = `

            <h3>⚠️ Error</h3>

            <p>
                No se pudo cargar la base de datos.
            </p>

        `;

    });


// ==========================================
// CAMBIAR MARCA
// ==========================================

marca.addEventListener(
    "change",
    function () {

        familia.innerHTML = `

            <option value="">
                Seleccione una familia
            </option>

        `;


        modelo.value = "";

        sugerencias.innerHTML = "";


        familia.disabled = true;

        modelo.disabled = true;

        boton.disabled = true;


        resultado.innerHTML = `

            <h3>
                Resultado
            </h3>

            <p>
                Selecciona una familia
                para continuar.
            </p>

        `;


        if (!baseDatos[marca.value]) {

            return;

        }


        const familias =
            baseDatos[marca.value];


        Object.keys(familias)
            .forEach(
                function (nombreFamilia) {

                    const opcion =
                        document.createElement(
                            "option"
                        );


                    opcion.value =
                        nombreFamilia;


                    opcion.textContent =
                        nombreFamilia;


                    familia.appendChild(
                        opcion
                    );

                }
            );


        familia.disabled = false;

    }
);


// ==========================================
// CAMBIAR FAMILIA
// ==========================================

familia.addEventListener(
    "change",
    function () {

        modelo.value = "";

        sugerencias.innerHTML = "";


        boton.disabled = true;


        if (familia.value === "") {

            modelo.disabled = true;

            modelo.placeholder =
                "Seleccione primero una familia";

            return;

        }


        modelo.disabled = false;

        modelo.placeholder =
            "Escribe el modelo específico";


        resultado.innerHTML = `

            <h3>
                🔎 Buscar modelo
            </h3>

            <p>
                Escribe el código de tu equipo
                para ver las sugerencias.
            </p>

        `;

    }
);


// ==========================================
// ESCRIBIR MODELO
// ==========================================

modelo.addEventListener(
    "input",
    function () {

        const texto =
            modelo.value
                .trim()
                .toLowerCase();


        sugerencias.innerHTML = "";


        boton.disabled = true;


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
            baseDatos[marca.value]
            [familia.value];


        let cantidad =
            0;


        Object.keys(modelos)
            .forEach(
                function (codigo) {

                    if (
                        codigo
                            .toLowerCase()
                            .includes(texto)
                    ) {

                        cantidad++;


                        const elemento =
                            document.createElement(
                                "div"
                            );


                        elemento.className =
                            "sugerencia";


                        elemento.innerHTML = `

                            <strong>
                                ${codigo}
                            </strong>

                            <br>

                            ${modelos[codigo].nombre}

                        `;


                        elemento.addEventListener(
                            "click",
                            function () {

                                modelo.value =
                                    codigo;


                                sugerencias
                                    .innerHTML =
                                    "";


                                boton.disabled =
                                    false;

                            }
                        );


                        sugerencias.appendChild(
                            elemento
                        );

                    }

                }
            );


        if (cantidad === 0) {

            resultado.innerHTML = `

                <h3>
                    ⚠️ No hay coincidencias
                </h3>

                <p>
                    No encontramos ese modelo
                    en nuestra base de datos.
                </p>

            `;

        }

    }
);


// ==========================================
// BUSCAR DRIVERS
// ==========================================

boton.addEventListener(
    "click",
    function () {

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

                <h3>
                    ⚠️ Faltan datos
                </h3>

                <p>
                    Completa todos los campos.
                </p>

            `;

            return;

        }


        const familias =
            baseDatos[
                marcaSeleccionada
            ];


        const modelos =
            familias[
                familiaSeleccionada
            ];


        const modeloEncontrado =
            modelos[
                modeloEscrito
            ];


        if (!modeloEncontrado) {

            resultado.innerHTML = `

                <h3>
                    ❌ Modelo no encontrado
                </h3>

                <p>
                    No encontramos
                    <b>
                        ${modeloEscrito}
                    </b>
                    en nuestra base de datos.
                </p>

                <p>
                    Puedes buscarlo directamente
                    en el soporte oficial.
                </p>

                <a
                    class="boton-descarga"
                    href="${
                        paginasSoporte[
                            marcaSeleccionada
                        ]
                    }"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🔎 Buscar en soporte oficial
                </a>

            `;

            return;

        }


        resultado.innerHTML = `

            <h3>
                ✅ Equipo encontrado
            </h3>

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
                href="href="${modeloEncontrado.url}""
                target="_blank"
                rel="noopener noreferrer"
            >
                ⬇️ Ir a drivers oficiales
            </a>

        `;

    }
);


// ==========================================
// BOTÓN SOPORTE
// ==========================================

soporte.addEventListener(
    "click",
    function () {

        const marcaSeleccionada =
            marca.value;


        if (marcaSeleccionada === "") {

            resultado.innerHTML = `

                <h3>
                    ⚠️ Selecciona una marca
                </h3>

                <p>
                    Primero selecciona
                    HP o Lenovo.
                </p>

            `;

            return;

        }


        window.open(
            paginasSoporte[
                marcaSeleccionada
            ],
            "_blank"
        );

    }
);


// ==========================================
// BOTÓN LIMPIAR
// ==========================================

limpiar.addEventListener(
    "click",
    function () {

        marca.value = "";

        familia.innerHTML = `

            <option value="">
                Seleccione primero una marca
            </option>

        `;


        modelo.value = "";

        modelo.disabled = true;

        familia.disabled = true;

        boton.disabled = true;


        modelo.placeholder =
            "Seleccione primero una familia";


        sugerencias.innerHTML = "";


        resultado.innerHTML = `

            <h3>
                Resultado
            </h3>

            <p>
                Selecciona tu equipo
                para comenzar.
            </p>

        `;

    }
);