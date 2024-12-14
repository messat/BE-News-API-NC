const express = require('express')
const { deleteComment, updateVotesByCommentId} = require('../controllers/api.controller')
const commentRouter = express.Router()

commentRouter
    .route('/:comment_id')
    .delete(deleteComment)
    .patch(updateVotesByCommentId)



module.exports = commentRouter