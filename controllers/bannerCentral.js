const bannerCentral = require("../models/bannerCentral");

const crearBanner = async (req, res) => {
    try{
        let banner = new bannerCentral(req.body);
        await banner.save();
        
        res.status(201).json({
            msg: "Creado con exito."
        })

    }catch(error){
        
        res.status(400).json({
            msg: "Conctacte con administrador"
        })
    }
}

const obtenerBanners = async (req, res) => {
    try {
        try {
            const banners = await bannerCentral.find();
            res.status(200).json({
                banners
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    } catch (error) {
        
    }
}

const editarBanner = async (req, res) => {
    const { bannerId } = req.params; // ID del modelo a editar
    const { tipo, image_url } = req.body; // Tipo de banner ('bannerFull' o 'bannerMobile') y la URL

    try {
        // Validar tipo
        if (!['bannerFull', 'bannerMobile'].includes(tipo)) {
            return res.status(400).json({ msg: 'Tipo inválido' });
        }

        // Buscar y actualizar el modelo
        const banner = await bannerCentral.findById(bannerId);
        if (!banner) {
            return res.status(404).json({ msg: 'No se encontró el banner con el ID proporcionado.' });
        }
        console.log(banner)

        banner[tipo] = image_url; // Actualiza el campo correspondiente
        await banner.save();

        res.status(200).json({ msg: `Imagen asignada como ${tipo} con éxito.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al asignar el banner, contacte al administrador.' });
    }
};

const editarLinkEvento = async (req, res) => {
    const { bannerId } = req.params; // ID del modelo a editar
    const { link_evento } = req.body; // Tipo de banner ('bannerFull' o 'bannerMobile') y la URL

    try {

        // Buscar y actualizar el modelo
        const banner = await bannerCentral.findById(bannerId);
        if (!banner) {
            return res.status(404).json({ msg: 'No se encontró el banner con el ID proporcionado.' });
        }
        banner.url = link_evento; // Actualiza el campo correspondiente
        await banner.save();

        res.status(200).json({ msg: `Link actualizado` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al asignar el banner, contacte al administrador.' });
    }
};

module.exports = {
    crearBanner,
    obtenerBanners,
    editarBanner,
    editarLinkEvento
}