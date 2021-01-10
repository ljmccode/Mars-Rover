const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));


// API call
app.get('/:rovername', async (req, res) => {
    try {
        const { rovername } = req.params;
        let roverInfo = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rovername}/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send ({ roverInfo });
    } catch (err) {
        console.log('error: ', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));