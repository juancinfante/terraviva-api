const express = require('express');
const { crearBanner, editarBanner, editarLinkEvento, obtenerBanner } = require('../controllers/bannerCentral');
const router = express.Router();


router.post('/crear-banner', crearBanner);
router.get('/get-banner', obtenerBanner);
router.put('/edit-banners/:bannerId', editarBanner);
router.put('/edit-link/:bannerId', editarLinkEvento);


 
module.exports = router;