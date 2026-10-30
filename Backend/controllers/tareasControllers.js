// Importa el modelo de tareas, que contiene la lógica para gestionarlos datos de las tareas
const tareaModel = require('../models/tareaModels');

// Función asíncrona para registrar una nueva tarea enviada desde un formulario
async function registrarTarea(req, res) {
    try {
        // Extrae las propiedades nombre, descripcion y estado del cuerpo de la petición (req.body)
        const { 
            nombre, 
            descripcion,
            estado 
            } = req.body;

        // Valida que el nombre y la descripción sean textos válidos y no estén vacíos o contengan solo espacios en blanco
        if (typeof nombre !== 'string' || nombre.trim() === '' || typeof descripcion !== 'string' || descripcion.trim() === '') {
            // Si la validación falla, responde al cliente con un estado 400 (Bad Request) y un mensaje de error
            return res.status(400).send('Datos de la tarea son inválidos');
        }

        // Llama a la función registrarTarea del modelo, pasando el nombre y descripción limpios (sin espacios al inicio o final) y el estado
        const tarea = await tareaModel.registrarTarea(
            nombre.trim(),
            descripcion.trim(),
            estado
        );

        // Crea un objeto con los parámetros de la nueva tarea creada para enviarlos en la URL
        const parametros = new URLSearchParams({
            id: tarea.id,
            nombre: tarea.nombre,
            descripcion: tarea.descripcion,
            estado: tarea.estado
        });

        // Redirige al usuario a la página de la lista de tareas, pasando los datos de la nueva tarea como parámetros de consulta en la URL
        res.redirect('/lista.html?' + parametros.toString());

    } catch (error) {
        // En caso de que ocurra un error en el servidor durante el proceso, imprime el error en la consola
        console.error('Error al registrar la tarea:', error);
        // Responde con un estado 500 (Internal Server Error) y un mensaje de error
        res.status(500).send('Error al registrar la tarea');
    }
}

// Función asíncrona para obtener todas las tareas registradas
async function obtenerTareas(req, res) {
    try {
        // Llama a la función del modelo para recuperar todas las tareas almacenadas
        const tareas = await tareaModel.obtenerTodasLasTareas();
        // Convierte cada tarea en una línea de texto con el formato id|nombre|descripcion|estado
        const lineas = tareas.map(t => `${t.id}|${t.nombre}|${t.descripcion}|${t.estado}`);
        // Envía la lista al cliente como texto plano, una tarea por línea, con un estado 200 (OK) implícito
        res.type('text/plain').send(lineas.join('\n'));
    } catch (error) {
        // En caso de error al recuperar las tareas, imprime el error en la consola
        console.error('Error al obtener las tareas:', error);
        // Responde con un estado 500 (Internal Server Error)
        res.status(500).send('Error al obtener las tareas');
    }
}

// Función asíncrona para cambiar el estado de una tarea existente
async function actualizarEstado(req, res) {
    try {
        // Extrae el nuevo estado del cuerpo de la petición (req.body)
        const { estado } = req.body;

        // Define los únicos estados permitidos para una tarea
        const estadosValidos = ['Pendiente', 'En proceso', 'Terminada'];

        // Si el estado recibido no es uno de los permitidos, responde con un estado 400 (Bad Request)
        if (!estadosValidos.includes(estado)) {
            return res.status(400).send('Estado inválido');
        }

        // Llama al modelo pasando el ID recibido en la URL (req.params.id) y el nuevo estado
        const tarea = await tareaModel.actualizarEstado(req.params.id, estado);

        // Si el modelo no encontró la tarea, responde con un estado 404 (Not Found)
        if (!tarea) {
            return res.status(404).send('Tarea no encontrada');
        }

        // Envía un mensaje de texto al cliente confirmando que el estado fue actualizado
        res.send('Estado actualizado');
    } catch (error) {
        // En caso de error en el servidor, imprime el error en la consola
        console.error('Error al actualizar el estado:', error);
        // Responde con un estado 500 (Internal Server Error)
        res.status(500).send('Error al actualizar el estado');
    }
}

// Exporta las funciones del controlador para que puedan ser utilizadas en el archivo de rutas (tareasRoutes.js)
module.exports = {
    registrarTarea,
    obtenerTareas,
    actualizarEstado
};