/* eslint-disable no-undef */
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

// Esquemas y modelos
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'operator'], default: 'operator' },
  active: { type: Boolean, default: true }, // campo agregado
}, { timestamps: true });

const ControllerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  phases: { type: Number, required: true, min: 1, max: 8 },
  actions: [
    {
      description: { type: String, required: true },
      command: { type: String, required: true }
    }
  ],
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  lastUpdated: { type: Date, default: Date.now }
});

const FormControllerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  phases: { type: Number, required: true, min: 1, max: 4 },
  actions: [
    {
      description: { type: String, required: true },
      command: { type: String, required: true }
    }
  ]
});

const User = mongoose.model('User', UserSchema);
const Controller = mongoose.model('Controller', ControllerSchema);
const FormController = mongoose.model('FormController', FormControllerSchema);

// Datos iniciales
const initializeData = async () => {
  try {
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

    const controllersCount = await Controller.countDocuments();
    if (controllersCount === 0) {
      await Controller.insertMany([
        { name: 'Controlador Centro', location: 'Plaza Principal', phoneNumber: '111', phases: 4, actions: [] },
        { name: 'Controlador Norte', location: 'Avenida Libertad', phoneNumber: '222', phases: 3, actions: [] }
      ]);
      console.log('🚦 Controladores de ejemplo creados');
    }
  } catch (err) {
    console.error('Error inicializando datos:', err);
  }
};

await initializeData();

// --- RUTAS --- //

// Login
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

// Crear usuario
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

// Obtener usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Actualizar usuario
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

// Eliminar usuario
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

// Activar/Desactivar usuario
app.put('/api/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.active = !user.active;
    await user.save();

    res.json({ message: `Usuario ${user.active ? 'activado' : 'desactivado'}`, user });
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear controlador
app.post('/api/controllers', async (req, res) => {
  const { name, phoneNumber, location, phases, actions } = req.body;

  if (!name || !phoneNumber || !location || !phases || !actions) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const newController = await Controller.create({
      name,
      phoneNumber,
      location,
      phases,
      actions
    });
    res.status(201).json(newController);
  } catch (err) {
    console.error('Error creando controlador:', err);
    res.status(500).json({ message: 'Error al crear controlador' });
  }
});

// Obtener controladores
app.get('/api/controllers', async (req, res) => {
  try {
    const controllers = await Controller.find();
    res.json(controllers);
  } catch (err) {
    console.error('Error obteniendo controladores:', err);
    res.status(500).json({ message: 'Error al obtener controladores' });
  }
});

// Eliminar controlador
app.delete('/api/controllers/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const controller = await Controller.findById(_id);
    if (!controller) {
      return res.status(404).json({ message: 'Controlador no encontrado' });
    }

    await Controller.findByIdAndDelete(_id);
    res.json({ status: 'success', message: 'Controlador eliminado' });
  } catch (err) {
    console.error('Error eliminando controlador:', err);
    res.status(500).json({ message: 'Error al eliminar controlador' });
  }
});

// Guardar controlador desde formulario
app.post('/api/form-controllers', async (req, res) => {
  const { name, phoneNumber, location, phases, actions } = req.body;

  if (!name || !phoneNumber || !location || !phases || !actions) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const newFormController = await FormController.create({
      name,
      phoneNumber,
      location,
      phases,
      actions
    });
    res.status(201).json(newFormController);
  } catch (err) {
    console.error('Error creando formulario de controlador:', err);
    res.status(500).json({ message: 'Error al crear formulario de controlador' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚦 Sistema de Control de Semáforos - Backend');
});

// Middleware de error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
