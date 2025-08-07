const express = require('express');
const router = express.Router();

const { crearNoticia, obtenerNoticias, obtenerNoticia, editarNoticia, eliminarNoticia, pagination, obtenerNoticiaPorPalabra, obtenerMasNoticias, actualizarSlugsTodos, obtenerNoticiaPorSlug } = require('../controllers/noticia');

router.post('/crearnoticia', crearNoticia);
router.get('/noticias/:limit/:page', obtenerNoticias);
router.get('/noticia/:id', obtenerNoticia);
router.get('/noticia/slug/:slug', obtenerNoticiaPorSlug);
router.get('/noticia/b/:palabra/:limit/:page', obtenerNoticiaPorPalabra);
router.put('/noticia', editarNoticia);
router.delete('/noticia/:id', eliminarNoticia);
router.get('/noticias/:prov/:limit/:page', pagination);
router.get('/masnoticias/', obtenerMasNoticias);
router.get('/slugs/', actualizarSlugsTodos);

module.exports = router;
