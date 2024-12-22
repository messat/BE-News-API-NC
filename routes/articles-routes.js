const express = require('express')
const { getAllArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, updateArticleById,postNewArticle, deleteArticleById} = require('../controllers/api.controller')
const articlesRouter = express.Router()

articlesRouter
    .route('/')
    .get(getAllArticles)
    .post(postNewArticle)           

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(updateArticleById)
    .delete(deleteArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

module.exports =articlesRouter