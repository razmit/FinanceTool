require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const port = process.env.PORT;
const cors = require("cors");
const multer = require("multer");


// Configura dónde se guardan las facturas de entradas
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = file.originalname.split('.').pop(); // Construye nuevo nombre de la imagen
    cb(null, `factura-${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// Aquí se guardan las facturas de salidas
const storageSalidas = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/salidas/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `salida-${Date.now()}.${ext}`);
  },
});
const uploadSalida = multer({ storage: storageSalidas });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

 // Conexión a la DB
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  decimalNumbers: true
});

app.use(
  session({
    name: "sid", // Nombre de la cookie
    secret: process.env.SESSION_SECRET, // define en tu .env
    store: new MySQLStore({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 hora
    },
  })
);

// Manejar login
app.post("/api/auth/login", async (req, res) => {
  
  console.log("Yes maafaka");

  const { username, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE name = ?", [
    username,
  ]);
  const user = rows[0];
  console.log("Usuarios desde la BD: ",user.name,' ',user.password);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ message: "Usuario o contraseña incorrectos." });
  }

  // Regenerar sesión y guardar datos
  // Según StackOverflow, regenerar la ID de la sesión evita ataques de session hijacking. No es necesario para este proyecto pero no cae de más aprender.
  req.session.regenerate((err) => {
    if (err) {
      console.error("Error en regenerate:", err);
      return res.status(500).json({ message: "Error interno de sesión." });
    }

    // Datos siendo asignados provenientes de la BD
    req.session.userId = user.id;
    req.session.username = user.name; 

    console.log("sesión después de asignar userId y username:", req.session);

    // Fuerza guardado antes de responder
    req.session.save((errSave) => {
      if (errSave) {
        console.error("Error al guardar la sesión:", errSave);
        return res
          .status(500)
          .json({ message: "No se pudo guardar la sesión." });
      }
      console.log("Sesión guardada en la store:", req.session);
      return res.json({ message: "Autenticación exitosa." });
    });
  });
});

// Manejar logout

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({ message: "No se pudo cerrar sesión." });
    res.clearCookie("sid");
    res.json({ message: "Sesión cerrada." });
  });
});

// Obtener usuario local

app.get("/api/auth/me", (req, res) => {
  console.log("→ Cookies recibidas:", req.headers.cookie);
  console.log("→ req.session:", req.session);
  
  if (!req.session.userId) {
    return res.status(401).json({ message: "No autenticado." });
  }
  res.json({
    id: req.session.userId,
    username: req.session.username,
  });
});

// Verifica exista un user logged in

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  return res.status(401).json({ message: "Acceso denegado." });
}

// **--**--** ENTRADAS **--**--** //

// GET /api/entradas — devuelve todas las entradas del usuario
app.get('/api/entradas', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const [rows] = await pool.query(
      `SELECT id, tipo, monto, fecha, factura_path 
         FROM entries 
        WHERE user_id = ? 
     ORDER BY fecha DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando entradas:', err);
    res.status(500).json({ message: 'No se pudo obtener las entradas.' });
  }
});

// POST /api/entradas
app.post(
  '/api/entradas',
  isAuthenticated,       // solo usuarios logueados
  upload.single('factura'),
  async (req, res) => {
    const { tipo, monto, fecha } = req.body;
    const facturaPath = req.file?.path || null;
    const userId = req.session.userId;
    try {
      const [result] = await pool.query(
        `INSERT INTO entries 
         (user_id, tipo, monto, fecha, factura_path)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, tipo, monto, fecha, facturaPath]
      );
      res.json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error guardando entrada.' });
    }
  }
);


// **--**--** RETIROS **--**--** //

// GET /api/salidas — devuelve todas las salidas del usuario
app.get('/api/salidas', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const [rows] = await pool.query(
      `SELECT id, tipo, monto, fecha, factura_path 
         FROM withdrawal 
        WHERE user_id = ? 
     ORDER BY fecha DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando salidas:', err);
    res.status(500).json({ message: 'No se pudo obtener las salidas.' });
  }
});

// POST /api/salidas
app.post(
  "/api/salidas",
  isAuthenticated,
  uploadSalida.single("factura"),
  async (req, res) => {
    try {
      const { tipo, monto, fecha } = req.body;
      const userId = req.session.userId;

      // Obtener totales actuales para sacar el balance disponible
      const [[{ totalEntradas }]] = await pool.query(
        "SELECT COALESCE(SUM(monto),0) AS totalEntradas FROM entries WHERE user_id = ?",
        [userId]
      );
      const [[{ totalSalidas }]] = await pool.query(
        "SELECT COALESCE(SUM(monto),0) AS totalSalidas FROM withdrawal WHERE user_id = ?",
        [userId]
      );

      const montoReq = Number(monto);

      console.log("Total entradas: "+totalEntradas+". Total salidas: "+totalSalidas+". Monto Req: "+montoReq+". Monto total de salidas a comparar: "+(totalSalidas+montoReq));
      
      // Validar contra balance (salidas pasadas + la nueva)
      if (totalEntradas < totalSalidas + montoReq) {
        const balanceActual = totalEntradas - totalSalidas;
        return res.status(400).json({
          message: `Saldo insuficiente. Tu balance actual es ${balanceActual.toFixed(
            2
          )}`,
        });
      }

      // Si pasa validación, grabar la withdrawal
      const facturaPath = req.file?.path || null;
      const [result] = await pool.query(
        `INSERT INTO withdrawal
         (user_id, tipo, monto, fecha, factura_path)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, tipo, montoReq, fecha, facturaPath]
      );

      return res.json({ id: result.insertId });
    } catch (err) {
      console.error("Error al guardar salida:", err);
      return res.status(500).json({ message: "Error guardando la salida." });
    }
  }
);

// Test
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
})