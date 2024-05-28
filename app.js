const express = require('express')
const app = express()

const {getAllTopics, noEndpoint, getAllEndpoints} = require('./controllers/api.controller')

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/*', noEndpoint)


module.exports = app