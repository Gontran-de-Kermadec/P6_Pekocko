require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const app = express();
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')


mongoose.connect(process.env.DATABASE_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
mongoose.set('useCreateIndex', true) // regler un probleme de depreciation

app.use(helmet()); //ajoute une couche de sécurité contre attaque XSS

//middleware empechant le blocage causé par CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


//instruction pour sauver les images dans fichier statique image
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json())


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);




module.exports = app;