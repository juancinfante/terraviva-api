const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {dbConnection} = require('./database/config');
const bodyParser = require('body-parser');

require('dotenv').config();
mongoose.set('strictQuery', false);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const PORT = 4001 || process.env.PORT;
app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto: " + PORT);
})

app.use(express.json());
app.use(cors());

dbConnection();

app.use('/api', require('./routes/usuario'));
app.use('/api', require('./routes/album'));
app.use('/api', require('./routes/noticia'));
app.use('/api', require('./routes/evento'));
app.use('/api', require('./routes/publicidad'));



