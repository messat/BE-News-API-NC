const express = require('express')
const { getCommentById, updateVotesByCommentId} = require('../controllers/api.controller')
const commentRouter = express.Router()

commentRouter
    .route('/:comment_id')
    .delete(getCommentById)
    .patch(updateVotesByCommentId)



module.exports = commentRouter