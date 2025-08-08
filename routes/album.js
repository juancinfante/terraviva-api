const express = require('express');
const { crearAlbum, obtenerAlbums, eliminarAlbum, obtenerAlbum, editarAlbum, actualizarSlugsGaleria, obtenerAlbumPorSlug } = require('../controllers/album');
const router = express.Router();


router.post('/crearalbum', crearAlbum);
router.get('/albums/:limit/:page', obtenerAlbums);
router.delete('/album/:id', eliminarAlbum);
router.get('/album/:id', obtenerAlbum);
router.get('/album/slug/:slug', obtenerAlbumPorSlug);
router.put('/album', editarAlbum);
router.post('/album/actualizarslugs', actualizarSlugsGaleria);

 
module.exports = router;