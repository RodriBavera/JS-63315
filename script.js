
alert("Bienvenido al consultorio");

// Lista de profesionales en el consultorio
const profesionales = [
    {
        id: 101,
        nombre: "Dr. Juan Pérez",
        especialidad: "Pediatra",
        obraSocial: ["Sempre", "Particular"],
        diasDisponibles: ["lunes", "miércoles", "viernes"],
        horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
    },
    {
        id: 102,
        nombre: "Dra. Ana García",
        especialidad: "Cardióloga",
        obraSocial: ["Osde", "Sempre", "Particular"],
        diasDisponibles: ["martes", "jueves"],
        horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
    },
    {
        id: 103,
        nombre: "Dr. Luis Martínez",
        especialidad: "Dermatólogo",
        obraSocial: ["Swiss Medical", "Sancor Salud", "Particular"],
        diasDisponibles: ["lunes", "martes", "jueves", "viernes"],
        horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
    },
    {
        id: 104,
        nombre: "Lic. Alejandro Gonzalez",
        especialidad: "Nutricionista",
        obraSocial: ["Swiss Medical", "Osde", "Sancor Salud", "Particular"],
        diasDisponibles: ["lunes", "martes", "jueves"],
        horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
    },    {
        id: 105,
        nombre: "Lic. Gisela Alecha",
        especialidad: "Psicologa",
        obraSocial: ["Swiss Medical", " Osde", " Sempre", "Particular"],
        diasDisponibles: ["lunes", "martes", "miercoles", "jueves"],
        horariosDisponibles: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
    },    {
        id: 106,
        nombre: "Dra. Catalina Bavera",
        especialidad: "Pediatra",
        obraSocial: ["Sancor Salud", " Osde", " Sempre", "Particular"],
        diasDisponibles: ["lunes", "martes", "miercoles", "jueves", "viernes"],
        horariosDisponibles: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
    }
];


// Obtiene una lista única de todas las obras sociales
function obtenerObrasSociales() {
    const obrasSociales = new Set();
    profesionales.forEach(profesional => {
        profesional.obraSocial.forEach(obra => obrasSociales.add(obra.trim()));
    });
    return Array.from(obrasSociales); // Convierte el conjunto a un array
}

// Permite al usuario seleccionar una obra social de la lista
function seleccionarObraSocial() {
    const obrasSociales = obtenerObrasSociales();
    let mensaje = "Obras sociales disponibles:\n";
    obrasSociales.forEach((obraSocial, index) => {
        mensaje += `${index + 1}. ${obraSocial}\n`;
    });

    let seleccion = parseInt(prompt(mensaje + "Selecciona el número de la obra social:"));
    return obrasSociales[seleccion - 1];
}

// Filtra los profesionales que aceptan la obra social seleccionada
function profesionalesPorObraSocial(obraSocial) {
    return profesionales.filter(profesional =>
        profesional.obraSocial.includes(obraSocial)
    );
}

// Permite al usuario seleccionar un profesional de la lista filtrada
function seleccionarProfesional(profesionales) {
    let mensaje = "Profesionales disponibles:\n";
    profesionales.forEach((profesional, index) => {
        mensaje += `${index + 1}. ${profesional.nombre} - ${profesional.especialidad} (ID: ${profesional.id})\n`;
    });
    let seleccion = parseInt(prompt(mensaje + "Selecciona el número del profesional:"));
    return profesionales[seleccion - 1];
}

function validarDia(dia) {
    const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    return diasValidos.includes(dia);
}

function solicitarDia() {
    let diaSolicitado;
    while (true) {
        diaSolicitado = prompt("Ingresa el día para solicitar un turno (lunes a viernes) o 'salir' para terminar:").toLowerCase();
        if (diaSolicitado === 'salir') {
            alert("Programa terminado.");
            return null;
        }
        if (validarDia(diaSolicitado)) {
            return diaSolicitado;
        } else {
            alert("Día no válido. Por favor, ingresa un día de lunes a viernes.");
        }
    }
}

function solicitarTurno() {
    const obraSocialSeleccionada = seleccionarObraSocial();
    if (!obraSocialSeleccionada) {
        alert("Obra social no válida.");
        return;
    }

    const disponibles = profesionalesPorObraSocial(obraSocialSeleccionada);
    if (disponibles.length === 0) {
        alert("No hay profesionales disponibles para esa obra social.");
        return;
    }

    const diaSolicitado = solicitarDia();
    if (!diaSolicitado) return;

    const profesionalSeleccionado = seleccionarProfesional(disponibles.filter(profesional => profesional.diasDisponibles.includes(diaSolicitado)));
    if (!profesionalSeleccionado) {
        alert("No se seleccionó un profesional válido.");
        return;
    }

    let horariosMensaje = `Horarios disponibles para ${profesionalSeleccionado.nombre} el ${diaSolicitado}:\n`;
    profesionalSeleccionado.horariosDisponibles.forEach((hora, index) => {
        horariosMensaje += `${index + 1}. ${hora}\n`;
    });

    let horaSeleccionada = prompt(horariosMensaje + "Selecciona el horario (formato HH:MM):");
    if (profesionalSeleccionado.horariosDisponibles.includes(horaSeleccionada)) {
        alert(`Turno otorgado con ${profesionalSeleccionado.nombre}, ${profesionalSeleccionado.especialidad} el ${diaSolicitado} a las ${horaSeleccionada}.`);
    } else {
        alert("Hora no válida. Vuelve a intentarlo.");
    }
}

solicitarTurno();
