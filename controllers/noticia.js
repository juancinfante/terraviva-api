const { default: slugify } = require('slugify');
const noticiaModel = require('../models/noticiaModel');

// async function actualizarSlugsTodos() {
//   try {
//     const cursor = noticiaModel.find().cursor();

//     for (let noticia = await cursor.next(); noticia != null; noticia = await cursor.next()) {
//       const nuevoSlugTitulo = slugify(noticia.titulo || '', {
//         lower: true,
//         strict: true
//       });

//       const nuevoSlugProvincia = slugify(noticia.provincia || '', {
//         lower: true,
//         strict: true
//       });

//       const cambios = {};
//       if (!noticia.slugTitulo || noticia.slugTitulo !== nuevoSlugTitulo) {
//         cambios.slugTitulo = nuevoSlugTitulo;
//       }
//       if (!noticia.slugProvincia || noticia.slugProvincia !== nuevoSlugProvincia) {
//         cambios.slugProvincia = nuevoSlugProvincia;
//       }

//       if (Object.keys(cambios).length > 0) {
//         await noticiaModel.updateOne({ _id: noticia._id }, { $set: cambios });
//       }
//     }

//     console.log('Slugs actualizados.');
//   } catch (error) {
//     console.error('Error al actualizar slugs:', error);
//   }
// }

async function actualizarSlugsTodos() {
  try {
    const noticias = await noticiaModel.find()
      .sort({ _id: -1 }) // ordenar por los más recientes
      .limit(5);         // limitar a los últimos 5

    for (const noticia of noticias) {
      const nuevoSlugTitulo = slugify(noticia.titulo || '', {
        lower: true,
        strict: true
      });

      const nuevoSlugProvincia = slugify(noticia.provincia || '', {
        lower: true,
        strict: true
      });

      const cambios = {};
      if (!noticia.slugTitulo || noticia.slugTitulo !== nuevoSlugTitulo) {
        cambios.slugTitulo = nuevoSlugTitulo;
      }
      if (!noticia.slugProvincia || noticia.slugProvincia !== nuevoSlugProvincia) {
        cambios.slugProvincia = nuevoSlugProvincia;
      }

      if (Object.keys(cambios).length > 0) {
        await noticiaModel.updateOne({ _id: noticia._id }, { $set: cambios });
      }
    }

    console.log('Slugs actualizados para las últimas 5 noticias.');
  } catch (error) {
    console.error('Error al actualizar slugs:', error);
  }
}

const pagination = async (req, res) => {
    const prov = req.params.prov;
    const limit = parseInt(req.params.limit) || 10; // Asegura que 'limit' sea un número
    const page = parseInt(req.params.page) || 1;    // Asegura que 'page' sea un número

    try {
        const resp = await noticiaModel.paginate(
            { slugProvincia: prov }, // Filtrar por provincia
            {
                select: 'provincia img_portada titulo descripcion slugTitulo', // Seleccionar campos específicos
                limit: limit,    // Número de documentos por página
                page: page,      // Página solicitada
                sort: { _id: -1 } // Orden descendente por ID
            }
        );
        res.json(resp); // Devuelve la respuesta paginada
    } catch (error) {
        res.status(400).json({
            msg: error.message || "Error al realizar la paginación",
        });
    }
}

// const crearNoticia = async (req, res) => {

//     try {

//         let noticia = new noticiaModel(req.body);
//         await noticia.save();

//         res.status(201).json({
//             msg: "Creado con exito."
//         })

//     } catch (error) {

//         res.status(400).json({
//             msg: "Conctacte con administrador"
//         })
//     }
// }

const crearNoticia = async (req, res) => {
  try {
    const { titulo, provincia, ...resto } = req.body;

    const slugTitulo = slugify(titulo, { lower: true, strict: true });
    const slugProvincia = slugify(provincia, { lower: true, strict: true });

    const noticia = new noticiaModel({
      titulo,
      provincia,
      slugTitulo,
      slugProvincia,
      ...resto
    });

    await noticia.save();

    res.status(201).json({
      msg: "Creado con éxito.",
      noticia
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: "Contacte con el administrador",
    });
  }
};


const obtenerNoticias = async (req, res) => {
    const limit = parseInt(req.params.limit) || 10; // Número de noticias por página
    const page = parseInt(req.params.page) || 1;   // Página solicitada

    try {
        // Consulta con proyección para devolver solo 'imagen' y 'titulo'
        const noticias = await noticiaModel.paginate(
            {}, // Sin filtro adicional
            {
                sort: { _id: -1 },  // Orden descendente por _id
                limit,              // Límite de documentos por página
                page,               // Página actual
                select: "img_portada provincia titulo created_at editor slugTitulo", // Solo devuelve estos campos
                lean: true,         // Devuelve objetos JSON planos
            }
        );

        res.status(200).json(noticias); // Respuesta con las noticias
    } catch (error) {
        res.status(400).json({
            msg: error.message || "Error al obtener las noticias",
        });
    }
};


const obtenerMasNoticias = async (req, res) => {
    try {
        // Calcula el rango deseado: desde la noticia 6 hasta la 14
        const skip = 3; // Salta las primeras 3 noticias (hasta la posición 6)
        const limit = 11; // Trae 9 noticias (de la 3 a la 11 inclusive)

        // Consulta con proyección para devolver solo 'imagen' y 'titulo'
        const noticias = await noticiaModel.find({})
            .sort({ _id: -1 })       // Orden descendente por _id
            .skip(skip)              // Salta los primeros 5 documentos
            .limit(limit)            // Limita la cantidad a 9 documentos
            .select("img_portada provincia titulo slugTitulo") // Devuelve solo estos campos
            .lean();                 // Devuelve objetos planos

        res.status(200).json(noticias); // Devuelve las noticias seleccionadas
    } catch (error) {
        res.status(400).json({
            msg: error.message || "Error al obtener las noticias",
        });
    }
};


const obtenerNoticia = async (req, res) => {
    try {
        let noticia = await noticiaModel.find({ _id: req.params.id });
        res.status(200).json({
            noticia
        })

    } catch (error) {
        res.status(500).json({
            msg: "Contacte con administrador."
        })
    }
}

const obtenerNoticiaPorSlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const noticia = await noticiaModel.findOne({
      $expr: {
        $eq: [
          { $toLower: "$slugTitulo" },
          slug
        ]
      }
    });

    if (!noticia) {
      return res.status(404).json({ msg: "Noticia no encontrada." });
    }

    res.status(200).json({ noticia });

  } catch (error) {
    res.status(500).json({
      msg: "Contacte con administrador."
    });
  }
};

const obtenerNoticiaPorPalabra = async (req, res) => {
    const limit = req.params.limit || 10;
    const page = req.params.page || 1;
    try {
        let noticia = await noticiaModel.paginate({
            $or: [
                { titulo: { $regex: req.params.palabra, $options: 'i' } },
                { descripcion: { $regex: req.params.palabra, $options: 'i' } },
                { texto: { $regex: req.params.palabra, $options: 'i' } },
                // { slugProvincia, slugTitulo}
            ]
        }, { limit: limit, page: page, sort: { _id: -1 } });
        res.status(200).json({
            noticia
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Contacte con administrador."
        });
    }
}

// const editarNoticia = async (req, res) => {
//     try {
//         const noticiaEditar = await noticiaModel.findById(req.body.id);

//         if (!noticiaEditar) {
//             return res.status(404).json({
//                 ok: false,
//                 msg: 'No existe ninguna noticia con este id.',
//             });
//         }

//         await noticiaModel.findByIdAndUpdate(req.body.id, req.body);

//         res.status(200).json({
//             ok: true,
//             msg: 'Noticia editada.',
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'hable con el administrador',
//         });
//     }
// };

const editarNoticia = async (req, res) => {
  try {
    const noticiaEditar = await noticiaModel.findById(req.body.id);

    if (!noticiaEditar) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ninguna noticia con este id.',
      });
    }

    // Si cambió el título, actualizar slugTitulo
    if (req.body.titulo && req.body.titulo !== noticiaEditar.titulo) {
      req.body.slugTitulo = slugify(req.body.titulo, { lower: true, strict: true });
    }

    // Si cambió la provincia, actualizar slugProvincia
    if (req.body.provincia && req.body.provincia !== noticiaEditar.provincia) {
      req.body.slugProvincia = slugify(req.body.provincia, { lower: true, strict: true });
    }

    await noticiaModel.findByIdAndUpdate(req.body.id, req.body, { new: true });

    res.status(200).json({
      ok: true,
      msg: 'Noticia editada.',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const eliminarNoticia = async (req, res) => {
    try {
        const productoEliminar = await noticiaModel.findById(req.params.id);

        if (!productoEliminar) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe noticia con este ID',
            });
        }

        await noticiaModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            ok: true,
            msg: 'Noticia eliminada',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador',
        });
    }
};

module.exports = {
    crearNoticia,
    obtenerNoticias,
    obtenerMasNoticias,
    obtenerNoticia,
    obtenerNoticiaPorSlug,
    obtenerNoticiaPorPalabra,
    editarNoticia,
    eliminarNoticia,
    pagination,
    actualizarSlugsTodos
}