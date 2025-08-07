const { Schema, model} = require('mongoose');

const  mongoosePaginate  = require('mongoose-paginate-v2');


const noticiaModel = Schema({
    provincia: {
        type: String,
        required: true
    },
    img_portada: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    editor: {
        type: String,
        required: true
    },
    fotoEditor: {
        type: String,
        required: true
    },
    slugTitulo: {
        type: String,
        required: true
    },
    slugProvincia: {
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
})

noticiaModel.plugin(mongoosePaginate);
noticiaModel.index({ created_at: -1 });
module.exports = model('noticias', noticiaModel);