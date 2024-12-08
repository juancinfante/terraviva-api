const express = require('express');
const { obtenerImagenes, eliminarImagen, subirImagen, upload } = require('../controllers/cloudinary');
const router = express.Router();


router.get('/getimages/:folder', obtenerImagenes);
router.post('/image/:id', eliminarImagen);
router.post('/upload-image',upload.single('file'), subirImagen);


 
module.exports = router;