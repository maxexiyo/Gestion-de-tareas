// Importa la librería Express para crear y configurar el servidor
const express = require('express');
// Importa el módulo Path de Node.js para manejar y unir rutas de archivos y directorios
const path = require('path');
// Importa el archivo de rutas donde se definen los endpoints para las tareas
const tareasRoutes = require('./routes/tareasRoutes');
// Inicializa la aplicación Express creando una instancia del servidor
const app = express();

// Define el middleware para servir los archivos de Frontend
app.use(express.static(path.join(__dirname, '../Frontend')));
// Configura el middleware para analizar los datos enviados a través de formularios HTML 
app.use(express.urlencoded({ extended: true }));

// Define la ruta raíz ("/") que responde con el archivo index.html principal cuando se accede a la URL del servidor
app.get('/', (req, res) => {
    // Envía el archivo index.html ubicado en la carpeta Frontend al cliente
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

// Registra todas las rutas definidas en tareasRoutes en la aplicación principal, aplicándolas a partir de la raíz
app.use('/', tareasRoutes);

// Configura el servidor para que escuche las peticiones entrantes en el puerto 3000
app.listen(3000, () => {
    // Imprime un mensaje en la consola indicando que el servidor está activo y funcionando
    console.log('Servidor ejecutándose en el puerto 3000');
});