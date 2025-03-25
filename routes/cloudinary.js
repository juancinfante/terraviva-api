const express = require('express');
const { obtenerImagenes, eliminarImagen, subirImagen, upload, obtenerBanners } = require('../controllers/cloudinary');
const router = express.Router();


router.get('/getimages/:folder', obtenerImagenes);
router.delete('/image/', eliminarImagen);
router.post('/upload-image',upload.single('file'), subirImagen);
router.get('/banners', obtenerBanners);


 
module.exports = router;