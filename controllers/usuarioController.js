const Usuario = require('../models/Usuario');

// Registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const existeUsuario = await Usuario.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña,
      fechaRegistro: new Date()
    });

    await nuevoUsuario.save();

    return res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      }
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ fechaRegistro: -1 });
    return res.json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  registrarUsuario,
  obtenerUsuarios
};


