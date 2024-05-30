const express = require('express')
const app = express()

const {getAllTopics, noEndpoint, getAllEndpoints, getArticleById, getAllArticles, getCommentsByArticleId, postCommentByArticleId, fetchArticleById, getCommentById, getAllUsers} = require('./controllers/api.controller')
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require('./errorHandler/api.errorHandler')

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', fetchArticleById)

app.delete('/api/comments/:comment_id', getCommentById)

app.get('/api/users', getAllUsers)

app.all('/api/*', noEndpoint)

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handleServerErrors)


module.exports = app