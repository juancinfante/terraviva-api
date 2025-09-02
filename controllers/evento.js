const { default: slugify } = require('slugify');
const eventoModel = require('../models/eventoModel');

// const crearEvento = async (req, res) => {

//     try{

//         let evneto = new eventoModel(req.body);
//         await evneto.save();
        
//         res.status(201).json({
//             msg: "Creado con exito."
//         })

//     }catch(error){
        
//         res.status(400).json({
//             msg: "Conctacte con administrador"
//         })
//     }
// }

// const crearEvento = async (req, res) => {
//   try {
//     const { titulo, provincia, ...resto } = req.body;

//     const slugTitulo = slugify(titulo, { lower: true, strict: true });
//     const slugProvincia = slugify(provincia, { lower: true, strict: true });

//     const evento = new eventoModel({
//       titulo,
//       provincia,
//       slugTitulo,
//       slugProvincia,
//       ...resto,
//     });

//     await evento.save();

//     res.status(201).json({
//       msg: "Creado con éxito.",
//       evento
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(400).json({
//       msg: "Contacte con el administrador",
//     });
//   }
// };

const crearEvento = async (req, res) => {
  try {
    const { titulo, provincia, ...resto } = req.body;

    const slugTitulo = slugify(titulo, { lower: true, strict: true });
    const slugProvincia = slugify(provincia, { lower: true, strict: true });

    // Verificar si ya existe un evento con el mismo slug
    const existeEvento = await eventoModel.findOne({
      slugTitulo,
    });

    if (existeEvento) {
      return res.status(400).json({
        msg: "Ya existe un evento con este título.",
      });
    }

    const evento = new eventoModel({
      titulo,
      provincia,
      slugTitulo,
      slugProvincia,
      ...resto,
    });

    await evento.save();

    res.status(201).json({
      msg: "Creado con éxito.",
      evento,
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: "Contacte con el administrador",
    });
  }
};


// const paginationEventos = async (req, res) => {
//     const prov = req.params.prov;
//     const limit = parseInt(req.params.limit) || 10;
//     const page = parseInt(req.params.page) || 1;
//     const today = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD

//     try {
//         const resp = await eventoModel.paginate(
//             { provincia: prov, fecha: { $gte: today } }, // Filtrar por provincia y fecha igual o mayor a hoy
//             { 
//                 limit, 
//                 page, 
//                 sort: { fecha: 1 } // Ordenar por fecha en orden ascendente
//             }
//         );
//         res.status(200).json(resp);
//     } catch (error) {
//         res.status(400).json({
//             msg: error.message
//         });
//     }
// };

const paginationEventos = async (req, res) => {
  const prov = req.params.prov;
  const limit = parseInt(req.params.limit) || 10;
  const page = parseInt(req.params.page) || 1;
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  try {
    const resp = await eventoModel.paginate(
      { slugProvincia: prov, fecha: { $gte: today } },
      { 
        limit, 
        page, 
        sort: { fecha: 1, _id: 1 } // ✅ orden estable
      }
    );
    res.status(200).json(resp);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: error.message });
  }
};



// const obtenerEventos = async (req, res) => {
//     const limit = parseInt(req.params.limit) || 10;
//     const page = parseInt(req.params.page) || 1;
//     const today = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato yyyy-mm-dd
    
//     try {
//         const eventos = await eventoModel.paginate(
//             { fecha: { $gte: today } }, // Filtrar eventos cuya fecha es mayor o igual a la fecha de hoy
//             {
//                 limit,
//                 page,
//                 sort: { fecha: 1 } // Ordenar por fecha en orden ascendente
//             }
//         );
//         res.status(200).json({
//             eventos
//         });
//     } catch (error) {
//         res.status(400).json({
//             msg: error.message
//         });
//     }
// };

const obtenerEventoPorSlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const evento = await eventoModel.findOne({
      $expr: {
        $eq: [
          { $toLower: "$slugTitulo" },
          slug
        ]
      }
    });

    if (!evento) {
      return res.status(404).json({ msg: "Evento no encontrado." });
    }

    res.status(200).json({ evento });

  } catch (error) {
    res.status(500).json({
      msg: "Contacte con administrador."
    });
  }
};

const obtenerEventos = async (req, res) => {
  const limit = parseInt(req.params.limit) || 10;
  const page = parseInt(req.params.page) || 1;
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  try {
    const eventos = await eventoModel.paginate(
      { fecha: { $gte: today } },
      {
        limit,
        page,
        sort: { fecha: 1, _id: 1 } // orden estable
      }
    );
    res.status(200).json({ eventos });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const obtenerEventosPorProvincia = async (req, res) => {
  const limit = parseInt(req.params.limit) || 10;
  const page = parseInt(req.params.page) || 1;
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  try {
    const eventos = await eventoModel.paginate(
      { fecha: { $gte: today } },
      { slugProvincia: req.params.slug},
      {
        limit,
        page,
        sort: { fecha: 1, _id: 1 } // orden estable
      }
    );
    res.status(200).json({ eventos });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const obtenerEvento = async (req, res) => {
    try {
        let evento = await eventoModel.find({ _id: req.params.id});
        res.status(200).json({
            evento
        })
        
    } catch (error) {
        res.status(500).json({
            msg: "Contacte con administrador."
        })
    }
}

// const editarEvento = async (req, res) => {
// 	try {
// 		const eventoEditar = await eventoModel.findById(req.body.id);

// 		if (!eventoEditar) {
// 			return res.status(404).json({
// 				ok: false,
// 				msg: 'No existe ningun evento con este id.',
// 			});
// 		}

// 		await eventoModel.findByIdAndUpdate(req.body.id, req.body);

// 		res.status(200).json({
// 			ok: true,
// 			msg: 'Evento editado.',
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({
// 			ok: false,
// 			msg: 'hable con el administrador',
// 		});
// 	}
// };

const editarEvento = async (req, res) => {
  try {
    const eventoEditar = await eventoModel.findById(req.body.id);

    if (!eventoEditar) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ningún evento con este id.',
      });
    }

    // Si cambió el título, actualizar slugTitulo
    if (req.body.titulo && req.body.titulo !== eventoEditar.titulo) {
      req.body.slugTitulo = slugify(req.body.titulo, { lower: true, strict: true });
    }

    // Si cambió la provincia, actualizar slugProvincia
    if (req.body.provincia && req.body.provincia !== eventoEditar.provincia) {
      req.body.slugProvincia = slugify(req.body.provincia, { lower: true, strict: true });
    }

    await eventoModel.findByIdAndUpdate(req.body.id, req.body, { new: true });

    res.status(200).json({
      ok: true,
      msg: 'Evento editado.',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const eliminarEvento = async (req, res) => {
	try {
		const eventoEliminar = await eventoModel.findById(req.params.id);

		if (!eventoEliminar) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe evento con este ID',
			});
		}

		await  eventoModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			ok: true,
			msg: 'Evento eliminado',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

const actualizarSlugsTodosEventos = async (req, res) => {
  try {
    const cursor = eventoModel.find().cursor();

    for (let evento = await cursor.next(); evento != null; evento = await cursor.next()) {
      const nuevoSlugTitulo = slugify(evento.titulo || '', {
        lower: true,
        strict: true
      });

      const nuevoSlugProvincia = slugify(evento.provincia || '', {
        lower: true,
        strict: true
      });

      const cambios = {};

      if (!evento.slugTitulo || evento.slugTitulo !== nuevoSlugTitulo) {
        cambios.slugTitulo = nuevoSlugTitulo;
      }

      if (!evento.slugProvincia || evento.slugProvincia !== nuevoSlugProvincia) {
        cambios.slugProvincia = nuevoSlugProvincia;
      }

      if (Object.keys(cambios).length > 0) {
        await eventoModel.updateOne({ _id: evento._id }, { $set: cambios });
      }
    }

    console.log('Slugs actualizados.');
    res.status(200).json({ msg: 'Slugs actualizados' });
  } catch (error) {
    console.error('Error al actualizar slugs:', error);
    res.status(500).json({ msg: 'Error al actualizar slugs', error });
  }
};

module.exports = {
    crearEvento,
    obtenerEventos,
    editarEvento,
    eliminarEvento,
    obtenerEvento,
    paginationEventos,
    obtenerEventoPorSlug,
    actualizarSlugsTodosEventos
}