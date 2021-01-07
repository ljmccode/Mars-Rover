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

// want to show most recent images taken of that rover

// example API call
app.get('/apod', async (req, res) => {
    
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        // sending image json to the /apod route
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

// API calls to each rover
app.get('/curiosity', async (req, res) => {
    try {
        let curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send ({ curiosity })
    } catch (err) {
        console.log('error: ', err);
    }
})

app.get('/opportunity', async (req, res) => {
    try {
        let opportunity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send ({ opportunity })
    } catch (err) {
        console.log('error: ', err);
    }
})

app.get('/spirit', async (req, res) => {
    try {
        let spirit = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send ({ spirit })
    } catch (err) {
        console.log('error: ', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));