const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {dbConnection} = require('./database/config');
const bodyParser = require('body-parser');

require('dotenv').config();
mongoose.set('strictQuery', false);

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());

dbConnection();

const PORT = 4001 || process.env.PORT;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto: " + PORT);
})



app.use('/api', require('./routes/usuario'));
app.use('/api', require('./routes/album'));
app.use('/api', require('./routes/noticia'));
app.use('/api', require('./routes/evento'));
app.use('/api', require('./routes/publicidad'));



