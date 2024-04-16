const express = require('express');
const { crearAlbum, obtenerAlbums, eliminarAlbum, obtenerAlbum, editarAlbum } = require('../controllers/album');
const router = express.Router();


router.post('/crearalbum', crearAlbum);
router.get('/albums/:limit/:page', obtenerAlbums);
router.delete('/album/:id', eliminarAlbum);
router.get('/album/:id', obtenerAlbum);
router.put('/album', editarAlbum);

 
module.exports = router;