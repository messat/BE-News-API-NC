const express = require('express')
const { getCommentsByArticleId, postCommentByArticleId } = require('../controllers/comments-controllers')
const { getArticleById, getAllArticles, updateArticleById, postNewArticle, deleteArticleById } = require('../controllers/articles-controllers')
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