const express = require('express')
const { getAllArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, fetchArticleById } = require('../controllers/api.controller')
const articlesRouter = express.Router()

articlesRouter.get('/', getAllArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(fetchArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

module.exports =articlesRouter