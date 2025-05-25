async function login() {
    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;
    const mensajeError = document.getElementById("mensajelogin");

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ usuario, clave })
        });

        // Verificar que la respuesta sea JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await response.text();
            throw new Error(`Respuesta inesperada: ${errorText}`);
        }

        const data = await response.json();

        if (data.estado === "exitoso") {
            window.location.href = "eventos.html";
        } else {
            mensajeError.textContent = data.mensaje || "Credenciales incorrectas";
            mensajeError.style.color = "red";
        }
    } catch (error) {
        console.error("Error en login:", error);
        mensajeError.textContent = "Error al conectar con el servidor";
        mensajeError.style.color = "red";
    }
}
