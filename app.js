const express = require('express')
const app = express()
const cors = require('cors');
const {apiRouter, articlesRouter, topicRouter, commentRouter, userRouter} = require('./routes/index-router')
const { noEndpoint } = require('./controllers/api-controllers')
const { handleCustomErrors } = require('./errorHandler/handleCustomErrors')
const { handlePsqlErrors } = require('./errorHandler/handlePsqlErrors')
const { handleServerErrors } = require('./errorHandler/handleServerErrors')

app.use(cors());

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