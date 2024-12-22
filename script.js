async function fetchProfesionales() {
    try {
        const response = await fetch("./info.json");
        if (!response.ok) {
            throw new Error("Error al cargar los profesionales");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Error",
            text: "No se pudo cargar la lista de profesionales. Por favor, inténtalo más tarde.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        return [];
    }
}
async function principal() {
    const profesionales = await fetchProfesionales();
    if (!profesionales.length) {
        return;
    }

    localStorage.setItem("profesionales", JSON.stringify(profesionales));
    const profesionalesGuardados = JSON.parse(localStorage.getItem("profesionales"));

    crearTarjetasProfesionales(profesionales);
    agregarEventoBusqueda(profesionales);
}

document.addEventListener("DOMContentLoaded", principal);

function agregarEventoBusqueda(profesionales) {
    const buscador = document.getElementById("buscador");
    const btnBuscar = document.getElementById("btnBuscar");

    btnBuscar.addEventListener("click", () => filtrarProfesionales(profesionales));
    buscador.addEventListener("input", () => {
        if (buscador.value.trim() === "") {
            crearTarjetasProfesionales(profesionales);
        }
    });
}

function filtrarProfesionales(profesionales) {
    const buscador = document.getElementById("buscador");
    const terminoBusqueda = buscador.value.trim().toLowerCase();

    const profesionalesFiltrados = profesionales.filter(profesional =>
        profesional.nombre.toLowerCase().includes(terminoBusqueda) ||
        profesional.especialidad.toLowerCase().includes(terminoBusqueda) ||
        profesional.obraSocial.some(obra => obra.toLowerCase().includes(terminoBusqueda))
    );

    crearTarjetasProfesionales(profesionalesFiltrados);
}

function crearTarjetasProfesionales(profesionales) {
    const contenedor = document.getElementById("contenedorProfesionales");
    contenedor.innerHTML = profesionales.map(profesional => `
        <div class="profesional">
            <img src="./images/${profesional.rutaImagen}" alt="Imagen de ${profesional.nombre}">
            <h3>${profesional.nombre}</h3>
            <p>Especialidad: ${profesional.especialidad}</p>
            <p>Obras Sociales: ${profesional.obraSocial.join(", ")}</p>
            <button class="btn-turno" data-id="${profesional.id}">Sacar Turno</button>
        </div>
    `).join("");

    document.querySelectorAll(".btn-turno").forEach(button => {
        button.addEventListener("click", event => {
            const profesionalId = event.target.getAttribute("data-id");
            mostrarFormulario(profesionalId, profesionales);
        });
    });
}

function obtenerFechas() {
    const hoy = new Date();
    const maxFecha = new Date(hoy);
    maxFecha.setDate(hoy.getDate() + 60);
    return {
        min: hoy.toISOString().split("T")[0],
        max: maxFecha.toISOString().split("T")[0]
    };
}

function esDiaHabil(fecha) {
    const { DateTime } = luxon;
    const dia = DateTime.fromISO(fecha);
    return dia.weekday >= 1 && dia.weekday <= 5;
}

function mostrarFormulario(profesionalId, profesionales) {
    const profesional = profesionales.find(p => p.id == profesionalId);
    if (!profesional) {
        alert("Profesional no encontrado.");
        return;
    }

    const { min, max } = obtenerFechas();
    const contenedorCalendario = document.getElementById("contenedorCalendario");
    contenedorCalendario.innerHTML = `
        <div id="formularioTurno">
            <h3>Reserva tu turno con ${profesional.nombre}</h3>
            <form id="formulario">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" required>
                <label for="apellido">Apellido:</label>
                <input type="text" id="apellido" required>
                <label for="dni">DNI:</label>
                <input type="number" id="dni" required>
                <label for="obraSocial">Obra Social:</label>
                <select id="obraSocial" required>
                    ${profesional.obraSocial.map(obra => `<option value="${obra}">${obra}</option>`).join("")}
                </select>
                <label for="fecha">Fecha:</label>
                <input type="date" id="fecha" min="${min}" max="${max}" required>
                <h4>Horarios Disponibles:</h4>
                <div id="contenedorHorarios"></div>
            </form>
            <p id="mensajeConfirmacion" style="color: green; font-weight: bold;"></p>
        </div>
    `;

    const inputFecha = document.getElementById("fecha");
    inputFecha.addEventListener("input", () => manejarFechaYHorarios(inputFecha.value, profesional));

    const formulario = document.getElementById("formulario");
    formulario.addEventListener("submit", event => {
        event.preventDefault();
    });
}

function manejarFechaYHorarios(fecha, profesional) {
    const contenedorHorarios = document.getElementById("contenedorHorarios");
    const contenedorBoton = document.getElementById("contenedorBotonConfirmar");

    // Limpiar horarios y botón existentes
    contenedorHorarios.innerHTML = "";
    if (contenedorBoton) contenedorBoton.innerHTML = "";

    if (!esDiaHabil(fecha)) {
        mostrarMensajeError("Elige una fecha válida (lunes a viernes).", contenedorHorarios);
        return;
    }

    const turnosReservados = obtenerTurnosReservados(fecha);
    const horariosDisponibles = profesional.horariosDisponibles.filter(
        horario => !turnosReservados.includes(horario)
    );

    if (horariosDisponibles.length === 0) {
        mostrarMensajeError("No hay horarios disponibles para esta fecha.", contenedorHorarios);
        return;
    }

    renderizarHorarios(horariosDisponibles, contenedorHorarios, profesional, fecha);
}

function mostrarMensajeError(mensaje, contenedor) {
    contenedor.innerHTML = `<p style="color: red;">${mensaje}</p>`;
}

function obtenerTurnosReservados(fecha) {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    return turnos.filter(turno => turno.fecha === fecha).map(turno => turno.horario);
}

function renderizarHorarios(horarios, contenedor, profesional, fecha) {
    contenedor.innerHTML = horarios
        .map(horario => `<button class="btn-horario" data-horario="${horario}">${horario}</button>`)
        .join("");

    document.querySelectorAll(".btn-horario").forEach(button => {
        button.addEventListener("click", () => {
            seleccionarHorario(button, contenedor, profesional, fecha);
        });
    });
}

function seleccionarHorario(button, contenedorHorarios, profesional, fecha) {
    // Remover selección previa
    document.querySelectorAll(".btn-horario").forEach(btn => btn.classList.remove("seleccionado"));
    button.classList.add("seleccionado");

    const horarioSeleccionado = button.getAttribute("data-horario");

    // Crear o actualizar botón confirmar
    let contenedorBoton = document.getElementById("contenedorBotonConfirmar");
    if (!contenedorBoton) {
        contenedorBoton = document.createElement("div");
        contenedorBoton.id = "contenedorBotonConfirmar";
        contenedorHorarios.parentElement.appendChild(contenedorBoton);
    }

    contenedorBoton.innerHTML = `<button id="btnConfirmarTurno">Confirmar Turno</button>`;
    document.getElementById("btnConfirmarTurno").onclick = () =>
        confirmarTurno(profesional, fecha, horarioSeleccionado);
}

function confirmarTurno(profesional, fecha, horario) {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const dni = document.getElementById("dni").value;
    const obraSocial = document.getElementById("obraSocial").value;

    if ([nombre, apellido, dni, obraSocial, fecha, horario].some(campo => !campo)) {
        Swal.fire({
            title: "Error",
            text: "Por favor, completa todos los campos y selecciona un horario.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        return;
    }

    guardarTurno(profesional, fecha, horario, nombre, apellido, dni, obraSocial);
    Swal.fire({
        title: "Confirmación",
        text: `Turno confirmado: ${profesional.nombre} el ${fecha} a las ${horario}. ¡Gracias, ${nombre}!`,
        icon: "success",
        confirmButtonText: "Ok",
    }).then(() => {
        document.getElementById("contenedorCalendario").innerHTML = "";
        principal();
    });
}

function guardarTurno(profesional, fecha, horario, nombre, apellido, dni, obraSocial) {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    turnos.push({
        profesional: profesional.nombre,
        especialidad: profesional.especialidad,
        nombre,
        apellido,
        dni,
        obraSocial,
        fecha,
        horario,
    });
    localStorage.setItem("turnos", JSON.stringify(turnos));
}
