const express = require('express')
const { getCommentById } = require('../controllers/api.controller')
const commentRouter = express.Router()

commentRouter.delete('/:comment_id', getCommentById)

module.exports = commentRouter