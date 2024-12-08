const albumModel = require("../models/album");


const crearAlbum = async (req, res) => {
	try {
		let album = new albumModel(req.body);
		await album.save();

		res.status(200).json({
			msg: "Album creado."
		});

	} catch (error) {
		res.status(400).json({
			msg: error
		})
	}

}


const obtenerAlbums = async (req, res) => {
    const limit = parseInt(req.params.limit) || 10; // Asegurarte de convertir el valor a número
    const page = parseInt(req.params.page) || 1;
    try {
        const albums = await albumModel.paginate(
            {}, // Filtro (puedes agregar condiciones aquí si es necesario)
            {
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
const editarAlbum = async (req, res) => {
	try {
		const album = await albumModel.findById(req.body.id);

		if (!album) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe ningun album con este id.',
			});
		}

		await albumModel.findByIdAndUpdate(req.body.id, req.body);

		res.status(200).json({
			ok: true,
			msg: 'Album actualizado.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};


module.exports = {
	crearAlbum,
	obtenerAlbums,
	obtenerAlbum,
	eliminarAlbum,
	editarAlbum
}