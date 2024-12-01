
<<<<<<< HEAD

// Lista de profesionales en el consultorio
function principal() {
    const profesionales = [
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
        }, {
            id: 105,
            nombre: "Lic. Gisela Alecha",
            especialidad: "Psicologa",
            obraSocial: ["Swiss Medical", " Osde", " Sempre", "Particular"],
            diasDisponibles: ["lunes", "martes", "miercoles", "jueves"],
            horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            rutaImagen: "LicGiselaAlecha.JPG"
        }, {
            id: 106,
            nombre: "Dra. Catalina Bavera",
            especialidad: "Pediatra",
            obraSocial: ["Sancor Salud", " Osde", " Sempre", "Particular"],
            diasDisponibles: ["lunes", "martes", "miercoles", "jueves", "viernes"],
            horariosDisponibles: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
            rutaImagen: "DraCatalinaBavera.JPG"
        }



    ];
    crearTarjetasProfesionales(profesionales);
    agregarEventoBusqueda(profesionales);

    // Guardar los datos iniciales en localStorage si no existen
if (!localStorage.getItem("profesionales")) {
    localStorage.setItem("profesionales", JSON.stringify(profesionalesData));
}

// Función principal
function principal() {
    const profesionales = JSON.parse(localStorage.getItem("profesionales"));
    crearTarjetasProfesionales(profesionales);
    agregarEventoBusqueda(profesionales);
}

document.addEventListener("DOMContentLoaded", () => {
    principal();
});

function agregarEventoBusqueda(profesionales) {
    const buscador = document.getElementById("buscador");
    const btnBuscar = document.getElementById("btnBuscar");

    btnBuscar.addEventListener("click", () => {
        const terminoBusqueda = buscador.value.trim().toLowerCase();

        const profesionalesFiltrados = profesionales.filter(profesional =>
            profesional.nombre.toLowerCase().includes(terminoBusqueda) ||
            profesional.especialidad.toLowerCase().includes(terminoBusqueda) ||
            profesional.obraSocial.some(obra => obra.toLowerCase().includes(terminoBusqueda))
        );

        crearTarjetasProfesionales(profesionalesFiltrados);
    });

    // Mostrar todos los profesionales al borrar el buscador
    buscador.addEventListener("input", () => {
        if (buscador.value.trim() === "") {
            crearTarjetasProfesionales(profesionales);
        }
    });
}

function crearTarjetasProfesionales(profesionales) {
    const contenedor = document.getElementById("contenedorProfesionales");
    contenedor.innerHTML = ''; // Limpia el contenido previo
    profesionales.forEach(profesional => {
        contenedor.innerHTML += `
            <div class="profesional">
                <img src="./images/${profesional.rutaImagen}" alt="Imagen de ${profesional.nombre}">
                <h3>${profesional.nombre}</h3>
                <p>Especialidad: ${profesional.especialidad}</p>
                <p>Obras Sociales: ${profesional.obraSocial.join(", ")}</p>
                <button class="btn-turno" data-id="${profesional.id}">Sacar Turno</button>
            </div>
        `;
    });

    document.querySelectorAll(".btn-turno").forEach(button => {
        button.addEventListener("click", event => {
            const profesionalId = event.target.getAttribute("data-id");
            mostrarCalendario(profesionalId, profesionales);
        });
    });
}

function mostrarCalendario(profesionalId, profesionales) {
    const profesional = profesionales.find(p => p.id == profesionalId);

    if (!profesional) {
        alert("Profesional no encontrado.");
        return;
    }

    const contenedorCalendario = document.getElementById("contenedorCalendario");
    contenedorCalendario.innerHTML = `
        <h3>Seleccione un horario para ${profesional.nombre}</h3>
        <div class="horarios">
            ${profesional.horariosDisponibles.map(horario => `
                <button class="horario disponible" data-horario="${horario}">
                    ${horario}
                </button>
            `).join("")}
        </div>
        <p id="mensajeConfirmacion" style="color: green; font-weight: bold; margin-top: 10px;"></p>
    `;

    document.querySelectorAll(".horario.disponible").forEach(button => {
        button.addEventListener("click", (event) => {
            const horarioSeleccionado = event.target.getAttribute("data-horario");

            // Mostrar el mensaje de confirmación
            const mensaje = document.getElementById("mensajeConfirmacion");
            mensaje.textContent = `Turno reservado con ${profesional.nombre} a las ${horarioSeleccionado}.`;

            // Cambiar el color del botón a rojo y deshabilitarlo
            event.target.style.backgroundColor = "red";
            event.target.style.color = "white";
            event.target.disabled = true;

            // Deshabilitar el resto de los botones 
            document.querySelectorAll(".horario.disponible").forEach(btn => {
                if (btn !== event.target) {
                    btn.disabled = true;
                }
            });
        });
    });
}

// Guardar el turno seleccionado en localStorage
function guardarTurno(profesional, horario) {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    turnos.push({
        profesional: profesional.nombre,
        especialidad: profesional.especialidad,
        horario
    });
    localStorage.setItem("turnos", JSON.stringify(turnos));
    console.log("Turno reservado:", turnos);
}
}

document.addEventListener("DOMContentLoaded", () => {
    principal();
});

function agregarEventoBusqueda(profesionales) {
    const buscador = document.getElementById("buscador");
    const btnBuscar = document.getElementById("btnBuscar");

    btnBuscar.addEventListener("click", () => {
        const terminoBusqueda = buscador.value.trim().toLowerCase();

        const profesionalesFiltrados = profesionales.filter(profesional =>
            profesional.nombre.toLowerCase().includes(terminoBusqueda) ||
            profesional.especialidad.toLowerCase().includes(terminoBusqueda) ||
            profesional.obraSocial.some(obra => obra.toLowerCase().includes(terminoBusqueda))
        );

        document.getElementById("contenedorProfesionales").innerHTML = '';
        crearTarjetasProfesionales(profesionalesFiltrados);
    });
}

function crearTarjetasProfesionales(profesionales) {
    const contenedor = document.getElementById("contenedorProfesionales");
    contenedor.innerHTML = ''; // Limpia el contenido previo
    profesionales.forEach(profesional => {
        contenedor.innerHTML += `
            <div class="profesional">
                <img src="./images/${profesional.rutaImagen}" alt="Imagen de ${profesional.nombre}">
                <h3>${profesional.nombre}</h3>
                <p>Especialidad: ${profesional.especialidad}</p>
                <p>Obras Sociales: ${profesional.obraSocial.join(", ")}</p>
                <button class="btn-turno" data-id="${profesional.id}">Sacar Turno</button>
            </div>
        `;
    });

    document.querySelectorAll(".btn-turno").forEach(button => {
        button.addEventListener("click", event => {
            const profesionalId = event.target.getAttribute("data-id");
            mostrarCalendario(profesionalId, profesionales);
        });
    });
}

// Muestra el calendario de turnos de un profesional
function mostrarCalendario(profesionalId, profesionales) {
    const profesional = profesionales.find(p => p.id == profesionalId);

    if (!profesional) {
        alert("Profesional no encontrado.");
        return;
    }

    const contenedorCalendario = document.getElementById("contenedorCalendario");
    contenedorCalendario.innerHTML = `
        <h3>Seleccione un horario para ${profesional.nombre}</h3>
        <div class="horarios">
            ${profesional.horariosDisponibles.map(horario => `
                <button class="horario disponible" data-horario="${horario}">
                    ${horario}
                </button>
            `).join("")}
        </div>
    `;

    document.querySelectorAll(".horario.disponible").forEach(button => {
        button.addEventListener("click", (event) => {
            const horarioSeleccionado = event.target.getAttribute("data-horario");
            alert(`Turno reservado con ${profesional.nombre} a las ${horarioSeleccionado}.`);
        });
    });
}

