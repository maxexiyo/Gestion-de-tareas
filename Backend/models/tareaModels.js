// Importa el módulo que maneja la lectura y escritura directa en el archivo de texto
const archivo = require('../config/Archivo');

// Inicializa un arreglo en memoria para almacenar temporalmente los objetos de las tareas en ejecución
let tareas = [];
// Inicializa un contador numérico para generar identificadores únicos para cada nueva tarea
let siguienteId = 1;

// Define la función para cargar las tareas existentes desde el archivo de texto al iniciar la aplicación
function cargarTareas() {
    // Obtiene un arreglo de strings, donde cada string representa una línea del archivo de texto
    const lineas = archivo.leerLineas();
    // Transforma cada línea del archivo en un objeto de tarea, separando sus valores por el carácter "|"
    tareas = lineas.map(linea => {
        const [id, nombre, descripcion, estado] = linea.split('|');
        // Retorna un objeto con las propiedades estructuradas y el ID convertido a tipo numérico
        return {
            id: Number(id),
            nombre,
            descripcion,
            estado
        };
    });

    // Si existen tareas cargadas, calcula el ID más alto y establece el siguiente ID como el máximo más uno
    if (tareas.length > 0) {
        const maxId = Math.max(...tareas.map(t => t.id));
        siguienteId = maxId + 1;
    }
}

// Define la función para guardar el estado actual del arreglo de tareas en el archivo de texto
function guardarTareas() {
    // Mapea el arreglo de tareas a un arreglo de strings, donde las propiedades de cada tarea se unen con el carácter "|"
    const lineas = tareas.map(t => `${t.id}|${t.nombre}|${t.descripcion}|${t.estado}`);
    // Escribe el arreglo de strings en el archivo, uniendo cada elemento con un salto de línea
    archivo.escribirLineas(lineas);
}

// Función asíncrona para registrar y persistir una nueva tarea
async function registrarTarea(nombre, descripcion, estado) {
    // Crea un objeto para la nueva tarea asignándole el ID actual y uniendo sus atributos
    const tarea = {
        id: siguienteId++,
        nombre,
        descripcion,
        estado
    };

    // Agrega el nuevo objeto de tarea a la lista en memoria
    tareas.push(tarea);
    // Llama a la función para guardar la lista actualizada en el archivo de texto
    guardarTareas();

    // Retorna el objeto de la tarea recién creada
    return tarea;
}

// Función asíncrona para buscar una tarea específica dentro del arreglo en memoria utilizando su ID
async function obtenerTarea(id) {
    // Busca en el arreglo la primera tarea cuyo ID coincida con el ID proporcionado (convertido a número)
    // Si no se encuentra ninguna tarea, la función retorna un valor nulo
    return tareas.find(t => t.id === Number(id)) || null;
}

// Función asíncrona para obtener la lista completa de todas las tareas registradas
async function obtenerTodasLasTareas() {
    // Retorna el arreglo completo que contiene todos los objetos de tarea
    return tareas;
}

// Función asíncrona para cambiar el estado de una tarea existente y persistir el cambio
async function actualizarEstado(id, estado) {
    // Busca la tarea por su ID (convertido a número) dentro del arreglo en memoria
    const tarea = tareas.find(t => t.id === Number(id));
    // Si no existe ninguna tarea con ese ID, retorna un valor nulo
    if (!tarea) {
        return null;
    }
    // Actualiza el estado de la tarea encontrada
    tarea.estado = estado;
    // Guarda la lista actualizada en el archivo de texto
    guardarTareas();
    // Retorna la tarea con su nuevo estado
    return tarea;
}

// Ejecuta la función cargartareas de forma automática al importar o cargar el módulo por primera vez
cargarTareas();

// Exporta las funciones para que puedan ser utilizadas en el controlador
module.exports = {
    registrarTarea,
    obtenerTarea,
    obtenerTodasLasTareas,
    actualizarEstado
};