const express = require('express')
const { getAllTopics, postNewTopic } = require('../controllers/topics-controllers')
const topicRouter = express.Router()

topicRouter
        .get('/', getAllTopics)
        .post('/', postNewTopic)

module.exports= topicRouter