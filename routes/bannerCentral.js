const express = require('express');
const { crearBanner, obtenerBanners, editarBanner, editarLinkEvento } = require('../controllers/bannerCentral');
const router = express.Router();


router.post('/crear-banner', crearBanner);
router.get('/get-banners', obtenerBanners);
router.put('/edit-banners/:bannerId', editarBanner);
router.put('/edit-link/:bannerId', editarLinkEvento);


 
module.exports = router;