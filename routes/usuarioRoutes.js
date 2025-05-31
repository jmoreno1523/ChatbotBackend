// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Registro
router.post('/registrar', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const nuevoUsuario = new Usuario({ nombre, correo, contraseña });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo, contraseña });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({ mensaje: 'Login exitoso', nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
});

module.exports = router;


