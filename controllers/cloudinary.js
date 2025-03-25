const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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
      const { id } = req.body; // El id viene en el cuerpo de la solicitud

      if (!id) {
          return res.status(400).json({
              message: 'El public_id es requerido para eliminar la imagen'
          });
      }

      console.log('Intentando eliminar imagen con public_id:', id); // Para depurar

      // Elimina la imagen usando el id
      const result = await cloudinary.uploader.destroy(id);

      console.log('Resultado de Cloudinary:', result); // Para depurar

      // Verifica el resultado de la eliminación
      if (result.result === 'ok') {
          res.json({
              message: 'Banner eliminado exitosamente',
              public_id: id
          });
      } else {
          res.status(404).json({
              message: 'No se encontró la imagen con ese public_id',
              public_id: id,
              result: result.result
          });
      }
  } catch (error) {
      console.error('Error al eliminar el banner:', error);
      res.status(500).json({
          error: 'Error al eliminar el banner',
          message: error.message
      });
  }
};

const obtenerBanners = async (req, res) => {
  try {
      const folderPath = 'terraviva/banners'; // Solo terraviva para ver si hay algo ahí
      // O usa '' (vacío) para buscar en toda la cuenta
      
      console.log('Buscando en carpeta:', folderPath);
      
      const response = await cloudinary.search
          .expression(`folder:${folderPath}`)
          .sort_by('created_at', 'desc')
          .max_results(30)
          .execute();

      console.log('Total de recursos:', response.total_count);
      console.log('Recursos:', response.resources);

      if (response.total_count === 0) {
          return res.status(404).json({
              message: 'No se encontraron banners en la carpeta especificada',
              folder: folderPath
          });
      }

      const banners = response.resources.map((img) => ({
          url: img.secure_url,
          public_id: img.public_id,
          folder: img.folder,
      }));

      res.json(banners);
  } catch (error) {
      console.error('Error al obtener banners:', error);
      res.status(500).json({ 
          error: 'Error al obtener los banners',
          message: error.message 
      });
  }
};


module.exports = {
    subirImagen,
    upload,
    obtenerImagenes,
    eliminarImagen,
    obtenerBanners
}