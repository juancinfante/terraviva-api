const eventoModel = require('../models/eventoModel');

const crearEvento = async (req, res) => {

    try{

        let evneto = new eventoModel(req.body);
        await evneto.save();
        
        res.status(201).json({
            msg: "Creado con exito."
        })

    }catch(error){
        
        res.status(400).json({
            msg: "Conctacte con administrador"
        })
    }
}

const paginationEventos = async (req, res) => {
    const prov = req.params.prov;
    const limit = req.params.limit || 10;
    const page = req.params.page || 1;
    const resp = await eventoModel.paginate({provincia: prov}, {limit: limit, page: page,sort: { _id: -1 }})
    res.json(resp);
}

const obtenerEventos = async (req, res) => {
    const limit = req.params.limit || 10;
    const page = req.params.page || 1;
    try {
        try {
            const eventos = await eventoModel.paginate({}, {limit, page, sort: { _id: -1 }});
            res.status(200).json({
                eventos
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    } catch (error) { 
    }
}

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

const editarEvento = async (req, res) => {
	try {
		const eventoEditar = await eventoModel.findById(req.body.id);

		if (!eventoEditar) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe ningun evento con este id.',
			});
		}

		await eventoModel.findByIdAndUpdate(req.body.id, req.body);

		res.status(200).json({
			ok: true,
			msg: 'Evento editado.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
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

module.exports = {
    crearEvento,
    obtenerEventos,
    editarEvento,
    eliminarEvento,
    obtenerEvento,
    paginationEventos
}