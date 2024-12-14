const express = require('express')
const apiRouter = express.Router()
const { endpointDocumentation } = require('../controllers/api.controller')

apiRouter
        .get('/', endpointDocumentation)


module.exports = apiRouter