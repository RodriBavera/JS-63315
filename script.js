
alert("Bienvenido al consultorio")
function solicitarTurno() {
    let diaSolicitado;
    let turnoOtorgado = false;

    // Bucle para solicitar el día hasta que se ingrese un día válido o "salir"
    while (!turnoOtorgado) {
        diaSolicitado = prompt("Ingresa el día para solicitar un turno (lunes a viernes) o 'salir' para terminar:").toLowerCase();

        // Verifica si el usuario quiere salir
        if (diaSolicitado === 'salir') {
            alert("Programa terminado.");
            break;
        }

        if (diaSolicitado === "lunes" || diaSolicitado === "martes" ||
            diaSolicitado === "miércoles" || diaSolicitado === "jueves" ||
            diaSolicitado === "viernes") {

            // Solicitar la hora y validar si está entre 14:00 y 19:00
            let horaSolicitada;
            let horaValida = false;
            while (!horaValida) {
                horaSolicitada = parseInt(prompt("Ingresa la hora para el turno (14 a 19):"));

                if (horaSolicitada >= 14 && horaSolicitada <= 19) {
                    alert(`Turno otorgado para el día ${diaSolicitado} a las ${horaSolicitada}:00.`);
                    horaValida = true;
                    turnoOtorgado = true; 
                } else {
                    alert("El consultorio está abierto de 14 a 19 horas. Ingresa una hora válida.");
                }
            }
        } else {
            alert("No hay turnos disponibles ese día. Por favor, ingresa un día válido (lunes a viernes).");
        }
    }
}

solicitarTurno()  
