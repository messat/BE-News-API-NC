const express = require('express')
const app = express()

const {getAllTopics, noEndpoint} = require('./controllers/api.controller')

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api/*', noEndpoint)


module.exports = app