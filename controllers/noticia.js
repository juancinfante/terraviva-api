const noticiaModel = require('../models/noticiaModel');

const pagination = async (req, res) => {
    const prov = req.params.prov;
    const limit = req.params.limit || 10;
    const page = req.params.page || 1;
    const resp = await noticiaModel.paginate({provincia: prov}, {limit: limit, page: page})
    res.json(resp);
}



const crearNoticia = async (req, res) => {

    try{
        
        let noticia = new noticiaModel(req.body);
        await noticia.save();
        
        res.status(201).json({
            msg: "Creado con exito."
        })

    }catch(error){
        
        res.status(400).json({
            msg: "Conctacte con administrador"
        })
    }
}

const obtenerNoticias = async (req, res) => {
    const limit = req.params.limit || 10;
    const page = req.params.page || 1;
    try {
        try {
            const noticias = await noticiaModel.paginate({}, {limit, page});
            res.status(200).json({
                noticias
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    } catch (error) {
        
    }
}

const obtenerNoticia = async (req, res) => {
    try {
        let noticia = await noticiaModel.find({ _id: req.params.id});
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
        }, {limit: limit, page: page});
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

		await  noticiaModel.findByIdAndDelete(req.params.id);

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
    obtenerNoticia,
    obtenerNoticiaPorPalabra,
    editarNoticia,
    eliminarNoticia,
    pagination
}