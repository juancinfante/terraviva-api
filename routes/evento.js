const express = require('express');
const { crearEvento, obtenerEventos, obtenerEvento, editarEvento, eliminarEvento, paginationEventos, actualizarSlugsTodosEventos, obtenerEventoPorSlugTitulo, obtenerEventosPorProvincia } = require('../controllers/evento');
const router = express.Router();


router.post('/evento', crearEvento);
router.get('/eventos/:limit/:page', obtenerEventos);
router.get('/evento/:id', obtenerEvento);
router.put('/evento', editarEvento);
router.delete('/evento/:id', eliminarEvento);
router.get('/eventos/:prov/:limit/:page', paginationEventos);
// router.get('/eventos/slug/titulo/:slug', obtenerEventoPorSlugTitulo);
// router.get('/eventos/provincia/:slug', obtenerEventosPorProvincia);
// router.get('/eventos/slugs', actualizarSlugsTodosEventos);


module.exports = router;