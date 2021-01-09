const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const { clearScreenDown } = require('readline')
require('dotenv').config({path: path.resolve(__dirname, '../../.env')})


const app = express()
const port = 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))


// your API calls

// API calls to each rover
app.get('/curiosity', async (req, res) => {
    try {
        let roverInfo = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send ({ roverInfo })
    } catch (err) {
        console.log('error: ', err);
    }
})

app.get('/opportunity', async (req, res) => {
    try {
        let roverInfo = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send ({ roverInfo })
    } catch (err) {
        console.log('error: ', err);
    }
})

app.get('/spirit', async (req, res) => {
    try {
        let roverInfo = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send ({ roverInfo })
    } catch (err) {
        console.log('error: ', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));