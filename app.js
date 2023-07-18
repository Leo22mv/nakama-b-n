const express = require('express');

// Cors
const cors = require("cors");
const corsOptions = {
    origin: "https://nakama-0.web.app"
};

// Conexión a la base de datos
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'bpodzu5lm79venak7jnl-mysql.services.clever-cloud.com',
    user: 'upspzoivzzkywpvi',
    password: 'yV5sm7YRL9c19ZmZecgM',
    database: 'bpodzu5lm79venak7jnl',
    port: 3306
    // host: 'localhost',
    // user: 'root',
    // password: '159753258456Leo',
    // database: 'nakama'
});

connection.connect((error) => {
    if (error) {
      console.error('Error al conectar a la base de datos: ' + error.stack);
      return;
    }
    console.log('Conexión exitosa a la base de datos MySQL.');
});

// App
const app = express();
app.use(cors());
app.use(express.json());

// Definir el modelo Producto
const productoSchema = `
  CREATE TABLE IF NOT EXISTS Producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    urlFoto VARCHAR(255),
    precio DECIMAL(10, 2),
    categoria VARCHAR(255),
    serie VARCHAR(255),
    stock INT
  )
`;

// Crear la tabla Producto si no existe
connection.query(productoSchema, (error, results, fields) => {
  if (error) throw error;
  console.log('Tabla Producto creada o existente');
});

// Endpoints
app.post('/agregar', (req, res) => {
    const producto = req.body;
    const query = 'INSERT INTO Producto SET ?';
    connection.query(query, producto, (error, results, fields) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
});

app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM Producto';
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
});

app.delete(`/productos/:id`, (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Producto WHERE id = ?';
    connection.query(query, id, (error, results, fields) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
});

// }
// Despliegue
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor API escuchando en http://localhost:${port}`);
});