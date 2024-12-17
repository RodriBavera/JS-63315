function principal() {
    const profesionalesIniciales = [
        {
            id: 101,
            nombre: "Dr. Juan Pérez",
            especialidad: "Pediatra",
            obraSocial: ["Sempre", "Particular"],
            diasDisponibles: ["lunes", "miércoles", "viernes"],
            horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            rutaImagen: "DrJuanPerez.JPG"
        },
        {
            id: 102,
            nombre: "Dra. Ana García",
            especialidad: "Cardióloga",
            obraSocial: ["Osde", "Sempre", "Particular"],
            diasDisponibles: ["martes", "jueves"],
            horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            rutaImagen: "DraAnaGarcia.JPG"
        },
        {
            id: 103,
            nombre: "Dr. Luis Martínez",
            especialidad: "Dermatólogo",
            obraSocial: ["Swiss Medical", "Sancor Salud", "Particular"],
            diasDisponibles: ["lunes", "martes", "jueves", "viernes"],
            horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            rutaImagen: "DrLuisMartinez.JPG"
        },
        {
            id: 104,
            nombre: "Lic. Alejandro Gonzalez",
            especialidad: "Nutricionista",
            obraSocial: ["Swiss Medical", "Osde", "Sancor Salud", "Particular"],
            diasDisponibles: ["lunes", "martes", "jueves"],
            horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            rutaImagen: "LicAlejandroGonzalez.JPG"
        },
        {
            id: 105,
            nombre: "Lic. Gisela Alecha",
            especialidad: "Psicologa",
            obraSocial: ["Swiss Medical", " Osde", " Sempre", "Particular"],
            diasDisponibles: ["lunes", "martes", "miercoles", "jueves"],
            horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            rutaImagen: "LicGiselaAlecha.JPG"
        },
        {
            id: 106,
            nombre: "Dra. Catalina Bavera",
            especialidad: "Pediatra",
            obraSocial: ["Sancor Salud", " Osde", " Sempre", "Particular"],
            diasDisponibles: ["lunes", "martes", "miercoles", "jueves", "viernes"],
            horariosDisponibles: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
            rutaImagen: "DraCatalinaBavera.JPG"
        }
    ];

    if (!localStorage.getItem("profesionales")) {
        localStorage.setItem("profesionales", JSON.stringify(profesionalesIniciales));
    }

    const profesionalesGuardados = JSON.parse(localStorage.getItem("profesionales"));
    crearTarjetasProfesionales(profesionalesGuardados);
    agregarEventoBusqueda(profesionalesGuardados);
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
        guardarTurnoFormulario(profesional);
    });
}

function manejarFechaYHorarios(fecha, profesional) {
    const contenedorHorarios = document.getElementById("contenedorHorarios");

    // Verificar si es un día hábil
    if (!esDiaHabil(fecha)) {
        Swal.fire({
            title: 'Fecha no válida',
            text: 'Elige una fecha válida (lunes a viernes).',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        contenedorHorarios.innerHTML = `<p style="color: red;">Elige una fecha válida (lunes a viernes).</p>`;
        return;
    }

    // Obtener los turnos reservados
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

    // Filtrar horarios reservados para la fecha seleccionada
    const turnosReservados = turnos.filter(turno => turno.fecha === fecha).map(turno => turno.horario);

    // Mostrar los horarios disponibles (filtrando los ya reservados)
    contenedorHorarios.innerHTML = profesional.horariosDisponibles
        .filter(horario => !turnosReservados.includes(horario)) // Excluir horarios reservados
        .map(horario => `
            <button class="btn-horario" data-horario="${horario}">${horario}</button>
        `).join("");

    document.querySelectorAll(".btn-horario").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".btn-horario").forEach(btn => btn.classList.remove("seleccionado"));
            button.classList.add("seleccionado");
        });
    });
}

function guardarTurnoFormulario(profesional) {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const dni = document.getElementById("dni").value;
    const obraSocial = document.getElementById("obraSocial").value;
    const fecha = document.getElementById("fecha").value;
    const horario = document.querySelector(".btn-horario.seleccionado")?.getAttribute("data-horario");

    if (!horario) {
        alert("Por favor selecciona un horario.");
        return;
    }

    // Guardar turno en localStorage
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
        reservado: true
    });
    localStorage.setItem("turnos", JSON.stringify(turnos));

    Swal.fire({
        title: 'Confirmación',
        text: `Turno confirmado: ${profesional.nombre} el ${fecha} a las ${horario}. ¡Gracias, ${nombre}!`,
        icon: 'success',
        confirmButtonText: 'Ok'
    }).then(() => {
        principal();
        document.getElementById("contenedorCalendario").innerHTML = '';
    });
}


document.addEventListener("DOMContentLoaded", principal);
