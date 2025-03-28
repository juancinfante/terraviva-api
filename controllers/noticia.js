const noticiaModel = require('../models/noticiaModel');

const pagination = async (req, res) => {
    const prov = req.params.prov;
    const limit = parseInt(req.params.limit) || 10; // Asegura que 'limit' sea un número
    const page = parseInt(req.params.page) || 1;    // Asegura que 'page' sea un número

    try {
        const resp = await noticiaModel.paginate(
            { provincia: prov }, // Filtrar por provincia
            {
                select: 'provincia img_portada titulo descripcion', // Seleccionar campos específicos
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

const crearNoticia = async (req, res) => {

    try {

        let noticia = new noticiaModel(req.body);
        await noticia.save();

        res.status(201).json({
            msg: "Creado con exito."
        })

    } catch (error) {

        res.status(400).json({
            msg: "Conctacte con administrador"
        })
    }
}


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
                select: "img_portada provincia titulo created_at editor", // Solo devuelve estos campos
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
        const skip = 5; // Salta las primeras 5 noticias (hasta la posición 6)
        const limit = 9; // Trae 9 noticias (de la 6 a la 14 inclusive)

        // Consulta con proyección para devolver solo 'imagen' y 'titulo'
        const noticias = await noticiaModel.find({})
            .sort({ _id: -1 })       // Orden descendente por _id
            .skip(skip)              // Salta los primeros 5 documentos
            .limit(limit)            // Limita la cantidad a 9 documentos
            .select("img_portada provincia titulo") // Devuelve solo estos campos
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

const obtenerNoticiaPorPalabra = async (req, res) => {
    const limit = req.params.limit || 10;
    const page = req.params.page || 1;
    try {
        let noticia = await noticiaModel.paginate({
            $or: [
                { titulo: { $regex: req.params.palabra, $options: 'i' } },
                { descripcion: { $regex: req.params.palabra, $options: 'i' } },
                { texto: { $regex: req.params.palabra, $options: 'i' } }
            ]
        }, { limit: limit, page: page, sort: { _id: -1 } });
        res.status(200).json({
            noticia
        });
    } catch (error) {
        res.status(500).json({
            msg: "Contacte con administrador."
        });
    }
}

const editarNoticia = async (req, res) => {
    try {
        const noticiaEditar = await noticiaModel.findById(req.body.id);

        if (!noticiaEditar) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna noticia con este id.',
            });
        }

        await noticiaModel.findByIdAndUpdate(req.body.id, req.body);

        res.status(200).json({
            ok: true,
            msg: 'Noticia editada.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador',
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
    obtenerNoticiaPorPalabra,
    editarNoticia,
    eliminarNoticia,
    pagination
}