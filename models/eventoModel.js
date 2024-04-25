const { Schema, model} = require('mongoose');
const  mongoosePaginate  = require('mongoose-paginate-v2');

const eventoModel = Schema({
    titulo: {
        type: String,
        required: true
    },
    flayer: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
})

eventoModel.plugin(mongoosePaginate);

module.exports = model('eventos', eventoModel);