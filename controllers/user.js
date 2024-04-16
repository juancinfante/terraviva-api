const userModel = require("../models/usuario");


const createUser = async (req, res)  => {
    const { username } = req.body;

    try{
        let userExiste = await userModel.findOne({ username });
        if(userExiste){
            return res.status(400).json({
                msg: "Nombre de usuario ya existe."
            })
        }
            let user = new userModel(req.body);
            await user.save();

            res.status(200).json({
                msg: "Usuario creado."
            });
        
    }catch(error){  
        res.status(400).json({
            msg: error
        })
    }

}

const login = async (req, res) => {
    const {username, contraseña} = req.body;
    try{
        let userExiste = await userModel.findOne({ username });
        if(!userExiste){
            return res.status(400).json({
                msg: "Usuario o contraseña incorrectos"
            })
        }else if(userExiste.contraseña != contraseña){
            return res.status(400).json({
                msg: "Usuario o contraseña incorrectos"
            })
        }
        res.status(201).json({
            msg: "Logeado con exito.",
            id: userExiste._id,
        })
    }catch(error){
        msg: error
    }

}
const obtenerUsuarios = async (req, res) => {
    try {
        try {
            const usuarios = await userModel.find();
            res.status(200).json({
                usuarios
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    } catch (error) {
        console.log(error)
    }
}
const obtenerUsuario = async (req, res) => {
    try {
        let usuario = await userModel.find({ _id: req.params.id});
        res.status(200).json({
            usuario
        })
        
    } catch (error) {
        res.status(500).json({
            msg: "Contacte con administrador."
        })
    }
}
const editarUsuario = async (req, res) => {
	try {
		const usuario = await userModel.findById(req.body.id);

		if (!usuario) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe ninguna noticia con este id.',
			});
		}

		await userModel.findByIdAndUpdate(req.body.id, req.body);

		res.status(200).json({
			ok: true,
			msg: 'Usuario actualizado.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

const eliminarUsuario = async (req, res) => {
	try {
		const usuario = await userModel.findById(req.params.id);

		if (!usuario) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe usuario con este ID',
			});
		}

		await  userModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			ok: true,
			msg: 'Usuario eliminada',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

module.exports = {
    createUser,
    login,
    obtenerUsuarios,
    obtenerUsuario,
    editarUsuario,
    eliminarUsuario
}