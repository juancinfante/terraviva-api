const mongoose = require('mongoose');

const dbConnection = async (req,res) => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log("Conectado a la base de datos.");
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}

module.exports = {dbConnection};