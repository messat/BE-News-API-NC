const express = require('express')
const apiRouter = express.Router()
const { getAllEndpoints } = require('../controllers/api.controller')

apiRouter.get('/', getAllEndpoints)


module.exports = apiRouter