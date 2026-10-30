// Importa el módulo nativo de file system de Node.js para crear archivos del sistema
const fs = require('fs');
// Importa el módulo nativo 'path' para manejar y unificar de manera segura las rutas de los archivos
const path = require('path');

// Define la ruta absoluta hacia el archivo de texto donde se almacenan los datos de las tareas
const RUTA = path.join(__dirname, '../data/tareas.txt');

// Función que lee todas las líneas individuales guardadas en el archivo de texto
function leerLineas() {
    // Primero verifica si el archivo de texto existe en la ruta especificada; si no existe, retorna una lista vacía
    if (!fs.existsSync(RUTA)) {
        return [];
    }
    // Lee el contenido completo del archivo de forma síncrona especificando la codificación de caracteres UTF-8
    const contenido = fs.readFileSync(RUTA, 'utf8');
    // Divide el contenido del archivo en líneas individuales, eliminando los retornos de carro (Windows) y los saltos de línea, y filtra excluyendo líneas vacías
    return contenido.split(/\r?\n/).filter(linea => linea.trim() !== '');
}

// Función que escribe y reemplaza el contenido total del archivo de texto utilizando un arreglo de nuevas líneas
function escribirLineas(lineas) {
    // Convierte el arreglo de líneas en un único string donde cada elemento se separa por un salto de línea
    // y escribe este string en el archivo de forma síncrona
    fs.writeFileSync(RUTA, lineas.join('\n'), 'utf8');
}

// Exporta las funciones leerLineas y escribirlineas para que puedan ser utilizadas en otras partes de la aplicación
module.exports = {
    leerLineas,
    escribirLineas
};