// Obtener elementos necesarios del formulario
const formulario = document.getElementById("formulario");
const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const mensaje = document.getElementById("mensaje");

// Escuchar el evento de envío (submit) del formulario
formulario.addEventListener("submit", function (e) {
  let valido = true;

  // Validación del campo Nombre
  if (nombre.value.trim() === "") {
    document.getElementById("errorNombre").textContent = "El nombre es obligatorio";
    valido = false;
  } else {
    document.getElementById("errorNombre").textContent = "";
  }

  // Validación del campo Descripción
  if (descripcion.value.trim() === "") {
    document.getElementById("errorDescripcion").textContent = "La descripción es obligatoria";
    valido = false;
  } else {
    document.getElementById("errorDescripcion").textContent = "";
  }

  // Si alguna validación falla, detener el envío del formulario
  if (!valido) {
    e.preventDefault();
    alert("Por favor, llena los campos obligatorios.");
  } else {
    mensaje.textContent = "Procesando...";
    mensaje.className = "exito";
  }
});

// Limpiar los mensajes de error y de éxito al resetear el formulario
formulario.addEventListener("reset", function () {
  document.getElementById("errorNombre").textContent = "";
  document.getElementById("errorDescripcion").textContent = "";
  mensaje.textContent = "";
  mensaje.className = "";
});