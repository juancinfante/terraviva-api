const publicidadModel = require("../models/publicidad");



const crearPubli = async (req, res) => {
    try{
        let publi = new publicidadModel(req.body);
        await publi.save();
        
        res.status(201).json({
            msg: "Creado con exito."
        })

    }catch(error){
        
        res.status(400).json({
            msg: "Conctacte con administrador"
        })
    }
}

const obtenerPublis = async (req, res) => {
    try {
        try {
            const publis = await publicidadModel.find();
            res.status(200).json({
                publis
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    } catch (error) {
        
    }
}

const obtenerPubli = async (req, res) => {
    try {
        let publi = await publicidadModel.find({ _id: req.params.id});
        res.status(200).json({
            publi
        })
        
    } catch (error) {
        res.status(500).json({
            msg: "Contacte con administrador."
        })
    }
}

const editarPubli = async (req, res) => {
	try {
		const publi = await publicidadModel.findById(req.body.id);

		if (!publi) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe ningun publicidad con este id.',
			});
		}

		await publicidadModel.findByIdAndUpdate(req.body.id, req.body);

		res.status(200).json({
			ok: true,
			msg: 'Publicidad editada.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

const eliminarPubli = async (req, res) => {
	try {
		const publi = await publicidadModel.findById(req.params.id);

		if (!publi) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe evento con este ID',
			});
		}

		await  publicidadModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			ok: true,
			msg: 'Eliminado',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

module.exports = {
    crearPubli,
    obtenerPublis,
    editarPubli,
    eliminarPubli,
    obtenerPubli
}