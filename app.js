const express = require('express')
const app = express()

const {getAllTopics, noEndpoint, getAllEndpoints, getArticleById, getAllArticles} = require('./controllers/api.controller')
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require('./errorHandler/api.errorHandler')

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.all('/api/*', noEndpoint)

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handleServerErrors)


module.exports = app