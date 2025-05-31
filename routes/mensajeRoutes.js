const express = require('express');
const router = express.Router();

const { crearMensaje, obtenerHistorial } = require('../controllers/mensajeControllers');

// Cambia /chat por /
router.post('/', crearMensaje);
router.get('/historial', obtenerHistorial);

module.exports = router;

