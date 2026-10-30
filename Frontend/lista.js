// Selecciona el elemento tbody de la tabla HTML donde se insertarán las filas de las tareas
const cuerpoTabla = document.getElementById("cuerpoTabla");
// Selecciona el mensaje que se muestra cuando no hay tareas disponibles en la lista o búsqueda
const vacio = document.getElementById("vacio");
// Selecciona el campo de entrada de texto utilizado para filtrar o buscar tareas por su nombre
const buscar = document.getElementById("buscar");
// Selecciona el elemento de selección (select) usado para filtrar las tareas según su estado
const filtroEstado = document.getElementById("filtroEstado");

// Inicializa un arreglo global para mantener en memoria la lista completa de tareas obtenidas desde el servidor
let todasLasTareas = [];

// Función asíncrona para solicitar al servidor la lista de todas las tareas registradas
async function obtenerTareas() {
    try {
        // Realiza una petición fetch al endpoint "/tareas" para obtener los datos en texto plano
        const respuesta = await fetch('/tareas');
        // Verifica si la petición fue exitosa (código de respuesta HTTP en el rango 200-299)
        if (respuesta.ok) {
            // Lee la respuesta del servidor como texto
            const texto = await respuesta.text();
            // Separa el texto en líneas, ignora las vacías y convierte cada una en un objeto tarea separando por "|"
            todasLasTareas = texto.split('\n').filter(linea => linea.trim() !== '').map(linea => {
                const [id, nombre, descripcion, estado] = linea.split('|');
                return { id, nombre, descripcion, estado };
            });
            // Llama a la función mostratareas para renderizar las tareas recién obtenidas en la tabla
            mostrarTareas(todasLasTareas);
        }
    } catch (error) {
        // Imprime un mensaje de error en la consola si ocurre un fallo durante la petición a la API
        console.error("Error al obtener las tareas:", error);
    }
}

// Función que toma un arreglo de tareas y se encarga de mostrarlas dinámicamente en la tabla HTML
function mostrarTareas(tareasAMostrar) {
    // Limpia el contenido actual del elemento tbody en la tabla para evitar tareas duplicadas tras actualizaciones
    cuerpoTabla.innerHTML = "";

    // Itera sobre el arreglo de tareas proporcionado para crear una fila HTML por cada una
    tareasAMostrar.forEach(tarea => {
        // Crea un nuevo elemento de fila (tr) para la tabla
        const fila = document.createElement("tr");

        // Inserta el contenido HTML dentro de la fila, mostrando el nombre, descripción, estado y un menú desplegable para cambiar el estado
        fila.innerHTML = `
            <td>${tarea.nombre}</td>
            <td>${tarea.descripcion}</td>
            <td>${tarea.estado}</td>
            <td>
                <select class="form-select" onchange="cambiarEstado('${tarea.id}', this.value)">
                    <option value="" selected disabled>No cambiar</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Terminada">Terminada</option>
                </select>
            </td>
        `;
        // Agrega la fila recién creada al elemento cuerpo de la tabla en el DOM
        cuerpoTabla.appendChild(fila);
    });

    // Oculta o muestra el mensaje de "no hay tareas" dependiendo de si la lista de tareas a mostrar está vacía o tiene elementos
    vacio.hidden = tareasAMostrar.length > 0;
}

// Función asíncrona para enviar una petición al servidor y cambiar el estado de una tarea específica
async function cambiarEstado(id, nuevoEstado) {
    try {
        // Realiza una petición fetch de tipo PUT enviando el ID de la tarea en la URL y el nuevo estado en el cuerpo de la petición
        const respuesta = await fetch(`/tareas/${id}`, {
            method: 'PUT',
            // Envía el nuevo estado como datos de formulario (el navegador pone el tipo de contenido automáticamente)
            body: new URLSearchParams({ estado: nuevoEstado })
        });

        // Si la petición PUT se completó exitosamente, recarga la lista de tareas llamando nuevamente a obtenertareas
        if (respuesta.ok) {
            obtenerTareas();
        }
    } catch (error) {
        // Imprime en la consola cualquier error que ocurra durante la operación de cambio de estado
        console.error("Error al cambiar el estado:", error);
    }
}

// Función para filtrar y mostrar las tareas en la tabla basándose en el texto de búsqueda y el filtro de estado seleccionados
function filtrarTareas() {
    // Convierte el texto de entrada de búsqueda a minúsculas para realizar una comparación insensible a mayúsculas
    const textoBusqueda = buscar.value.toLowerCase();
    // Obtiene el valor del estado seleccionado en el menú desplegable
    const estadoFiltro = filtroEstado.value;

    // Filtra el arreglo global de todas las tareas comparando tanto el nombre como el estado de cada tarea
    const tareasFiltradas = todasLasTareas.filter(tarea => {
        // Verifica si el nombre de la tarea incluye el texto de búsqueda ingresado por el usuario
        const coincideNombre = tarea.nombre.toLowerCase().includes(textoBusqueda);
        // Verifica si el estado de la tarea coincide con el filtro de estado seleccionado o si el filtro está vacío (todos los estados)
        const coincideEstado = estadoFiltro === "" || tarea.estado === estadoFiltro;
        // La tarea se incluirá en el arreglo filtrado solo si cumple ambas condiciones
        return coincideNombre && coincideEstado;
    });

    // Oculta el mensaje de lista vacía si hay resultados coincidentes en la búsqueda
    vacio.hidden = tareasFiltradas.length > 0;
    
    // Llama a mostratareas para actualizar la tabla con el nuevo resultado del filtrado
    mostrarTareas(tareasFiltradas);
}

// Agrega un escuchador de eventos para el evento de entrada (input) en el campo de búsqueda, ejecutando fijartareas cuando el usuario escribe
buscar.addEventListener("input", filtrarTareas);
// Agrega un escuchador de eventos para el evento de cambio (change) en el menú de filtro de estado, ejecutando fijartareas al elegir una opción
filtroEstado.addEventListener("change", filtrarTareas);

// Ejecuta la función obtenertareas de forma automática al cargar la página para poblar la tabla con las tareas registradas
obtenerTareas();