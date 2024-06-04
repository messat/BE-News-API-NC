const express = require('express')
const app = express()
const {apiRouter, articlesRouter, topicRouter, commentRouter, userRouter} = require('./routes/index-router')
const { noEndpoint} = require('./controllers/api.controller')
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require('./errorHandler/api.errorHandler')

app.use(express.json())

app.use('/api/topics', topicRouter)

app.use('/api', apiRouter)

app.use('/api/articles', articlesRouter)

app.use('/api/comments', commentRouter)

app.use('/api/users', userRouter)


app.all('/api/*', noEndpoint)

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handleServerErrors)


module.exports = app