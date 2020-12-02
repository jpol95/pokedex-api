require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const POKEDEX = require('./pokedex.json')


const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(helmet())

app.use(cors())

const PORT = process.env.PORT || 8000

app.listen(PORT, () => { 
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]



app.use(function validateBearerToken(req, res, next){
    const bearerToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if (!bearerToken || bearerToken.split(" ")[1] !== apiToken){
        return res.status(401).json({error: 'Unauthorized Request'})
    }
    next()
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  

function handleGetTypes(req, res){
res.json(validTypes)
}

app.get("/types", handleGetTypes)

app.get("/pokemon", handleGetPokemon)

function handleGetPokemon(req, res){
    let {name="", type} = req.query
    if (type !== undefined && !validTypes.includes(type)){
        return res.status(400).send("Please provide a valid type")
    }
    const results = POKEDEX.pokemon.filter(current => {
       let includesName = current.name.toLowerCase().includes(name.toLowerCase())
       let includesType = type === undefined ? true: current.type.map(current => current.toLowerCase()).includes(type.toLowerCase())
       return includesName && includesType
    })

    res.send(results)
}