const { default: slugify } = require("slugify");
const albumModel = require("../models/album");


// const crearAlbum = async (req, res) => {
// 	try {
// 		let album = new albumModel(req.body);
// 		await album.save();

// 		res.status(200).json({
// 			msg: "Album creado."
// 		});

// 	} catch (error) {
// 		res.status(400).json({
// 			msg: error
// 		})
// 	}
// }

const crearAlbum = async (req, res) => {
  try {
    const { nombre, ...resto } = req.body;

    const slug = slugify(nombre, { lower: true, strict: true });

    const album = new albumModel({
      nombre,
      slugTitulo: slug,
      ...resto,
    });

    await album.save();

    res.status(200).json({
      msg: "Álbum creado.",
      album,
    });

  } catch (error) {
    res.status(400).json({
      msg: "Error al crear álbum.",
      error: error.message,
    });
  }
};


const actualizarSlugsGaleria = async(req, res) => {
  try {
    const cursor = albumModel.find().cursor();

    for (let album = await cursor.next(); album != null; album = await cursor.next()) {
      const nuevoSlugTitulo = slugify(album.nombre || '', {
        lower: true,      // 🔽 convierte todo a minúscula
        strict: true      // 🔽 elimina caracteres especiales como tildes
      });

      const cambios = {};

      if (!album.slugTitulo || album.slugTitulo !== nuevoSlugTitulo) {
        cambios.slugTitulo = nuevoSlugTitulo;
      }

      if (Object.keys(cambios).length > 0) {
        await albumModel.updateOne({ _id: album._id }, { $set: cambios });
      }
    }

    console.log('Slugs actualizados.');
  } catch (error) {
    console.error('Error al actualizar slugs:', error);
  }
}


const obtenerAlbums = async (req, res) => {
    const limit = parseInt(req.params.limit) || 10; // Asegurarte de convertir el valor a número
    const page = parseInt(req.params.page) || 1;
    try {
        const albums = await albumModel.paginate(
            {}, // Filtro (puedes agregar condiciones aquí si es necesario)
            {
				select: 'nombre ph fecha portada created_at slugTitulo ', 
                limit,
                page,
                sort: { fecha: -1 } // Ordena por fecha de creación en orden descendente
            }
        );
        res.status(200).json({
            albums
        });
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
};

const eliminarAlbum = async (req, res) => {
	try {
		const album = await albumModel.findById(req.params.id);

		if (!album) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe album con este ID',
			});
		}

		await albumModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			ok: true,
			msg: 'Album eliminado.',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

const obtenerAlbum = async (req, res) => {
	try {
		let album = await albumModel.find({ _id: req.params.id });
		res.status(200).json({
			album
		})

	} catch (error) {
		res.status(500).json({
			msg: "Contacte con administrador."
		})
	}
}

const obtenerAlbumPorSlug = async (req, res) => {
  try {
	const slug = req.params.slug.toLowerCase();

	const album = await albumModel.findOne({
	  $expr: {
		$eq: [
		  { $toLower: "$slugTitulo" },
		  slug
		]
	  }
	});

	if (!album) {
	  return res.status(404).json({ msg: "Album no encontrado." });
	}

	res.status(200).json({ album });

  } catch (error) {
	res.status(500).json({
	  msg: "Contacte con administrador."
	});
  }
};

// const editarAlbum = async (req, res) => {
// 	try {
// 		const album = await albumModel.findById(req.body.id);

// 		if (!album) {
// 			return res.status(404).json({
// 				ok: false,
// 				msg: 'No existe ningun album con este id.',
// 			});
// 		}

// 		await albumModel.findByIdAndUpdate(req.body.id, req.body);

// 		res.status(200).json({
// 			ok: true,
// 			msg: 'Album actualizado.',
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({
// 			ok: false,
// 			msg: 'hable con el administrador',
// 		});
// 	}
// };

const editarAlbum = async (req, res) => {
  try {
    const album = await albumModel.findById(req.body.id);

    if (!album) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ningún álbum con este id.',
      });
    }

    // Verificar si el nombre cambió
    if (req.body.nombre && req.body.nombre !== album.nombre) {
      const nuevoSlug = slugify(req.body.nombre, { lower: true, strict: true });
      req.body.slugTitulo = nuevoSlug;
    }

    await albumModel.findByIdAndUpdate(req.body.id, req.body, { new: true });

    res.status(200).json({
      ok: true,
      msg: 'Álbum actualizado.',
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.',
    });
  }
};


module.exports = {
	crearAlbum,
	obtenerAlbums,
	obtenerAlbum,
	eliminarAlbum,
	editarAlbum,
	actualizarSlugsGaleria,
	obtenerAlbumPorSlug
}