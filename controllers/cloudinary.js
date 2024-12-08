const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDY,
    api_secret: process.env.API_SECRET_CLOUDY,
});

const multer = require('multer');

// Configuración de almacenamiento para multer
const storage = multer.memoryStorage(); // Guardamos la imagen en la memoria temporalmente

// Crea el middleware para manejar el archivo
const upload = multer({ storage: storage });

const subirImagen = async (req, res) => {
    try {
      // Verificamos si se ha recibido una imagen
      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
      }
  
      const folder = req.body.folder || 'default_folder'; // Carpeta por defecto, si no se especifica en el body
      const file = req.file; // La imagen subida
  
      // Subimos la imagen a Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: folder, // Carpeta en Cloudinary
          resource_type: 'image', // Solo para imágenes
        },
        (error, result) => {
          if (error) {
            console.error('Error al subir la imagen:', error);
            return res.status(500).json({ error: 'Error al subir la imagen' });
          }
  
          // Si la imagen se sube correctamente, enviamos la URL
          return res.status(200).json({
            message: 'Imagen subida correctamente',
            url: result.secure_url, // URL de la imagen subida
            public_id: result.public_id, // ID público de la imagen
          });
        }
      );
  
      // Escribimos la imagen en el stream de Cloudinary
      result.end(file.buffer); // Enviamos la imagen bufferizada a Cloudinary
    } catch (error) {
      console.error('Error en el proceso de subida:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  

const obtenerImagenes = async (req, res) => {
    
    const { folder } = req.params; // Cambia por tu carpeta
    
    try {
        const response = await cloudinary.search
            .expression(`folder:${folder}`) // Busca imágenes en la carpeta
            .sort_by('created_at', 'desc')
            .max_results(30)
            .execute();

        res.json(response.resources.map((img) => ({
            url: img.secure_url,
            public_id: img.public_id,
            folder: img.folder,
        })));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener imágenes');
    }
}

const eliminarImagen = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el public_id desde los parámetros de la URL
        const { folder } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'El public_id es obligatorio' });
        }

        // Llamada a Cloudinary para eliminar la imagen
        const result = await cloudinary.uploader.destroy(folder+"/"+id);

        if (result.result === 'ok') {
            return res.status(200).json({ message: 'Imagen eliminada correctamente', id });
        } else {
            return res.status(400).json({ error: 'No se pudo eliminar la imagen, verifica el public_id', id });
        }
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    subirImagen,
    upload,
    obtenerImagenes,
    eliminarImagen
}