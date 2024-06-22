const express = require('express')
const { getAllTopics } = require('../controllers/api.controller')
const topicRouter = express.Router()

topicRouter
        .get('/', getAllTopics)

module.exports= topicRouter