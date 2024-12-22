const express = require('express')
const apiRouter = express.Router()
const { endpointDocumentation } = require('../controllers/api-controllers')

apiRouter
        .get('/', endpointDocumentation)


module.exports = apiRouter