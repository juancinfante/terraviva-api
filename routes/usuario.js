const express = require('express');
const router = express.Router();

const { createUser, login, obtenerUsuarios, obtenerUsuario, editarUsuario, eliminarUsuario } = require('../controllers/user');

router.post('/createuser', createUser);
router.post('/login', login);
router.get('/usuarios', obtenerUsuarios);
router.get('/usuario/:id', obtenerUsuario);
router.put('/usuario', editarUsuario);
router.delete('/usuario/:id', eliminarUsuario);
 
module.exports = router;