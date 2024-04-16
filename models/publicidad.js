const { Schema, model} = require('mongoose');

const publicidadModel = Schema({
    nombre_cliente: {
        type: String,
        required: true
    },
    ingreso: {
        type: String,
        required: true
    },
    egreso: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    foto: {
        type: String,
        required: true
    },
    colocar_en: {
        type: [],
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
})

module.exports = model('publicidad', publicidadModel);