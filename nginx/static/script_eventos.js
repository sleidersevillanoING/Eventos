// Función para crear eventos
// Función para crear eventos
async function crearEvento() {
    // Obtención de los valores desde el DOM
    const nombre = document.getElementById("nombre").value;
    const fecha = document.getElementById("fecha").value;
    const lugar = document.getElementById("lugar").value;

    try {
        // Realiza la petición POST sin concatenar parámetros en la URL
        const response = await fetch('/events/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Envía los datos mediante JSON en el body
            body: JSON.stringify({ nombre, fecha, lugar })
        });

        if (!response.ok) {
            throw new Error('Error al crear el evento');
        }

        // Vuelve a cargar la lista de eventos
        cargarEventos();
    } catch (error) {
        console.error("Error al crear evento:", error);
    }
}


// Función para cargar eventos
async function cargarEventos() {
    const resp = await fetch('/events/eventos');
    const eventos = await resp.json();
    let divEventos = document.getElementById("eventos");
    divEventos.innerHTML = "";
    
    eventos.forEach(ev => {
        divEventos.innerHTML += `
        <div class="evento">
            <strong>${ev.nombre}</strong>
            ${ev.fecha} - ${ev.lugar}<br>
            <button onclick="editarEvento('${ev.id}')">Editar</button>
            <button onclick="eliminarEvento('${ev.id}')" style="background:red;">Eliminar</button>
        </div>
        `;
    });
}

// Función para editar eventos
async function editarEvento(id) {
    const nuevoNombre = prompt("Nuevo nombre del evento:");
    const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD):");
    const nuevoLugar = prompt("Nuevo lugar del evento:");
    
    if (nuevoNombre && nuevaFecha && nuevoLugar) {
        await fetch(`/events/eventos/${id}?nombre=${encodeURIComponent(nuevoNombre)}&fecha=${nuevaFecha}&lugar=${encodeURIComponent(nuevoLugar)}`, {
            method: 'PUT'
        });
        cargarEventos();
    }
}

// Función para eliminar eventos
async function eliminarEvento(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este evento?")) {
        await fetch(`/events/eventos/${id}`, {
            method: 'DELETE'
        });
        cargarEventos();
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    window.location.href = "index.html";
}

// Cargar eventos al iniciar
cargarEventos();