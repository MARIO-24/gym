// nuevo_cliente.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNuevo");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevenir envío automático

    // Limpiar errores anteriores
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.style.borderColor = "";
      const error = input.nextElementSibling;
      if (error && error.classList.contains("error-msg")) {
        error.remove();
      }
    });

    let isValid = true;

    // Función para mostrar error
    function showError(input, message) {
      input.style.borderColor = "red";
      const error = document.createElement("div");
      error.className = "error-msg";
      error.style.color = "red";
      error.style.fontSize = "0.9em";
      error.textContent = message;
      input.parentNode.appendChild(error);
      isValid = false;
    }

    // Validación Nombre
    const nombre = form.nombre.value.trim();
    if (nombre.length < 3 || /\d/.test(nombre)) {
      showError(form.nombre, "Nombre mínimo 3 letras y sin números.");
    }

    // Validación Apellido
    const apellido = form.apellido.value.trim();
    if (apellido.length < 3 || /\d/.test(apellido)) {
      showError(form.apellido, "Apellido mínimo 3 letras y sin números.");
    }

    // Validación Email
    const email = form.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(form.email, "Ingresa un correo válido.");
    }

    // Validación Teléfono
    const telefono = form.telefono.value.trim();
    if (!/^\d{9,}$/.test(telefono)) {
      showError(form.telefono, "Teléfono solo números, mínimo 9 dígitos.");
    }

    // Validación Fecha de Nacimiento
    const fechaNacimiento = form.fecha_nacimiento.value;
    if (!fechaNacimiento) {
      showError(form.fecha_nacimiento, "Debes seleccionar una fecha.");
    } else {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      if (edad < 16 || edad > 90) {
        showError(form.fecha_nacimiento, "Edad debe ser entre 16 y 90 años.");
      }
    }

    // Validación Género
    const genero = form.genero.value;
    if (!["Masculino", "Femenino", "Otro"].includes(genero)) {
      showError(form.genero, "Debes seleccionar un género válido.");
    }

    // Validación Tipo de Membresía
    const membresia = form.tipo_membresia.value;
    if (!["Mensual", "Trimestral", "Anual"].includes(membresia)) {
      showError(form.tipo_membresia, "Debes seleccionar una membresía válida.");
    }

    // Si todo es válido, enviamos los datos usando fetch
    if (isValid) {
      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData
      })
        .then(async (response) => {
          if (response.ok) {
            // Redirigir al index de socios
            window.location.href = "/clientes";
          } else {
            // Leer mensaje de error del backend
            const text = await response.text();

            // Si el error es por email duplicado
            if (text.toLowerCase().includes("email")) {
              showError(form.email, text);
            } else {
              alert("Ocurrió un error al guardar el socio: " + text);
              console.error("Error backend:", text);
            }
          }
        })
        .catch((err) => {
          alert("Ocurrió un error al guardar el socio: " + err.message);
          console.error(err);
        });
    }
  });
});
