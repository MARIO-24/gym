// editar_cliente.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEditar");

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

    // Validación Teléfono (opcional)
    const telefono = form.telefono.value.trim();
    if (telefono && !/^\d{9,}$/.test(telefono)) {
      showError(form.telefono, "Teléfono solo números, mínimo 9 dígitos.");
    }

    // Validación Fecha de Nacimiento (opcional)
    const fechaNacimiento = form.fecha_nacimiento.value;
    if (fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      if (edad < 16 || edad > 90) {
        showError(form.fecha_nacimiento, "Edad debe estar entre 16 y 90 años.");
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
            // Redirigir al listado de socios
            window.location.href = "/clientes";
          } else {
            const text = await response.text();
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
