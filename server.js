import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/traffic_control', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  }
};

await connectDB();

// Modelos
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'operator'], default: 'operator' },
}, { timestamps: true });

const ControllerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phases: { type: Number, required: true, min: 1, max: 8 },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  lastUpdated: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Controller = mongoose.model('Controller', ControllerSchema);

// Datos iniciales
const initializeData = async () => {
  try {
    // Usuario admin
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'Administrador',
        email: 'admin@example.com',
        idNumber: '1234567890',
        password: 'Admin123!',
        role: 'admin'
      });
      console.log('👤 Usuario admin creado');
    }

    // Controladores de ejemplo
    const controllersCount = await Controller.countDocuments();
    if (controllersCount === 0) {
      await Controller.insertMany([
        { name: 'Controlador Centro', location: 'Plaza Principal', phases: 4 },
        { name: 'Controlador Norte', location: 'Avenida Libertad', phases: 3 }
      ]);
      console.log('🚦 Controladores de ejemplo creados');
    }
  } catch (err) {
    console.error('Error inicializando datos:', err);
  }
};

await initializeData();

// --- RUTAS --- //

// Autenticación
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: 'fake-jwt-token'
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// Rutas para usuarios
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, idNumber, password, role } = req.body;
    
    if (!name || !email || !idNumber || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { idNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email o cédula ya registrados' });
    }

    const user = await User.create({ name, email, idNumber, password, role });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creando usuario:', err);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, idNumber, password, role } = req.body;
    
    const updateData = { name, email, idNumber, role };
    if (password) updateData.password = password;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error eliminando usuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

// Controladores (se mantienen igual)
app.get('/api/controllers', async (req, res) => {
  try {
    const controllers = await Controller.find();
    res.json(controllers);
  } catch (err) {
    console.error('Error obteniendo controladores:', err);
    res.status(500).json({ message: 'Error al obtener controladores' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚦 Sistema de Control de Semáforos - Backend');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
