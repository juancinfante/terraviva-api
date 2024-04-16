const express = require('express');
const { crearPubli, obtenerPublis, obtenerPubli, editarPubli, eliminarPubli } = require('../controllers/publicidad');
const router = express.Router();


router.post('/publi', crearPubli);
router.get('/publis', obtenerPublis);
router.get('/publi/:id', obtenerPubli);
router.put('/publi', editarPubli);
router.delete('/publi/:id', eliminarPubli);


module.exports = router;