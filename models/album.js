const { Schema, model} = require('mongoose');
const  mongoosePaginate  = require('mongoose-paginate-v2');

const albumModel = Schema({
    nombre: {
        type: String,
        required: true
    },
    ph: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    fotos: {
        type: [],
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
})
albumModel.plugin(mongoosePaginate);

module.exports = model('galeria', albumModel);