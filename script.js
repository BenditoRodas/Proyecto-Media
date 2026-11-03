"use strict";

let baseDatos = {};

const marca = document.getElementById("marca");
const familia = document.getElementById("familia");
const modelo = document.getElementById("modelo");
const botonBuscar = document.getElementById("buscar");
const botonLimpiar = document.getElementById("limpiar");
const resultado = document.getElementById("resultado");
const sugerencias = document.getElementById("sugerencias");
const estado = document.getElementById("estado");

function normalizar(texto) {
    return String(texto || "")
        .toLowerCase()
        .trim()
        .replace(/\\s+/g, "");
}

function mostrarMensaje(titulo, mensaje) {
    resultado.replaceChildren();

    const encabezado = document.createElement("h3");
    encabezado.textContent = titulo;

    const parrafo = document.createElement("p");
    parrafo.textContent = mensaje;

    resultado.append(encabezado, parrafo);
}

async function cargarBaseDatos() {
    try {
        const respuesta = await fetch("./database.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar database.json.");
        }

        const datos = await respuesta.json();

        if (!datos || typeof datos !== "object") {
            throw new Error("La base de datos no tiene un formato válido.");
        }

        baseDatos = datos;
        estado.textContent = "Base de datos cargada correctamente.";
        estado.classList.add("correcto");
        marca.disabled = false;
    } catch (error) {
        console.error("Error al cargar la base de datos:", error);
        estado.textContent = "No se pudo cargar la base de datos. Revisa database.json.";
        estado.classList.add("error");
        marca.disabled = true;
    }
}

function obtenerEquiposSeleccionados() {
    return baseDatos[marca.value]?.[familia.value] || {};
}

function buscarCoincidenciaExacta() {
    const equipos = obtenerEquiposSeleccionados();
    const texto = normalizar(modelo.value);

    if (!texto) return null;

    return Object.entries(equipos).find(([codigo, datos]) =>
        normalizar(codigo) === texto ||
        normalizar(datos.nombre) === texto
    ) || null;
}

marca.addEventListener("change", () => {
    familia.innerHTML = '<option value="">Seleccione una familia</option>';
    modelo.value = "";
    modelo.disabled = true;
    modelo.placeholder = "Seleccione primero una familia";
    botonBuscar.disabled = true;
    sugerencias.replaceChildren();
    mostrarMensaje("Resultado", "Selecciona tu familia y modelo para continuar.");

    const familias = baseDatos[marca.value];

    if (!familias) {
        familia.disabled = true;
        return;
    }

    Object.keys(familias).forEach((nombreFamilia) => {
        const opcion = document.createElement("option");
        opcion.value = nombreFamilia;
        opcion.textContent = nombreFamilia;
        familia.appendChild(opcion);
    });

    familia.disabled = false;
});

familia.addEventListener("change", () => {
    modelo.value = "";
    sugerencias.replaceChildren();
    modelo.disabled = !familia.value;
    modelo.placeholder = familia.value
        ? "Escribe el código o nombre del modelo"
        : "Seleccione primero una familia";
    botonBuscar.disabled = true;
    mostrarMensaje("Resultado", "Escribe el código o nombre de tu modelo.");
    if (familia.value) modelo.focus();
});

modelo.addEventListener("input", () => {
    sugerencias.replaceChildren();

    if (!marca.value || !familia.value || !modelo.value.trim()) {
        botonBuscar.disabled = true;
        return;
    }

    const equipos = obtenerEquiposSeleccionados();
    const texto = normalizar(modelo.value);

    const coincidencias = Object.entries(equipos).filter(([codigo, datos]) =>
        normalizar(codigo).includes(texto) ||
        normalizar(datos.nombre).includes(texto)
    );

    coincidencias.slice(0, 6).forEach(([codigo, datos]) => {
        const opcion = document.createElement("button");
        opcion.type = "button";
        opcion.className = "sugerencia";
        opcion.textContent = `${datos.nombre || codigo} (${codigo})`;

        opcion.addEventListener("click", () => {
            modelo.value = codigo;
            sugerencias.replaceChildren();
            botonBuscar.disabled = false;
            modelo.focus();
        });

        sugerencias.appendChild(opcion);
    });

    botonBuscar.disabled = !buscarCoincidenciaExacta();
});

botonBuscar.addEventListener("click", () => {
    sugerencias.replaceChildren();

    if (!marca.value || !familia.value || !modelo.value.trim()) {
        mostrarMensaje("Campos incompletos", "Selecciona una marca, una familia y un modelo.");
        return;
    }

    const encontrado = buscarCoincidenciaExacta();

    if (!encontrado) {
        mostrarMensaje("Modelo no encontrado", "Escribe el código completo o selecciona una de las sugerencias.");
        return;
    }

    const [codigo, datos] = encontrado;

    resultado.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = "Equipo encontrado";

    const datosEquipo = [
        ["Marca", marca.value],
        ["Familia", familia.value],
        ["Modelo", datos.nombre || codigo],
        ["Código", codigo]
    ];

    resultado.appendChild(titulo);

    datosEquipo.forEach(([etiqueta, valor]) => {
        const parrafo = document.createElement("p");
        const fuerte = document.createElement("strong");
        fuerte.textContent = `${etiqueta}: `;
        parrafo.append(fuerte, document.createTextNode(valor));
        resultado.appendChild(parrafo);
    });

    if (!datos.url) {
        const aviso = document.createElement("p");
        aviso.textContent = "Este modelo todavía no tiene un enlace de descarga.";
        resultado.appendChild(aviso);
        return;
    }

    const enlace = document.createElement("a");
    enlace.className = "boton-descarga";
    enlace.href = datos.url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Descargar Drivers";
    resultado.appendChild(enlace);
});

botonLimpiar.addEventListener("click", () => {
    marca.value = "";
    familia.innerHTML = '<option value="">Seleccione primero una marca</option>';
    familia.disabled = true;
    modelo.value = "";
    modelo.disabled = true;
    modelo.placeholder = "Seleccione primero una familia";
    botonBuscar.disabled = true;
    sugerencias.replaceChildren();
    mostrarMensaje("Resultado", "Selecciona tu equipo para comenzar.");
});

cargarBaseDatos();
