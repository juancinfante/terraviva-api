const { Schema, model} = require('mongoose');

const usuarioModel = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    foto: {
        type: String,
        required: true
    },
    privilegios:{
        type: [],
        default: []
    },
    contraseña: {
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
})

module.exports = model('usuarios', usuarioModel);