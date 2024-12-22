const { selectArticleById, selectAllArticles, updateVotesByArticleId, addNewArticle, deleteSingleArticle } = require('../models/articles-models')

exports.getArticleById = async (req,res, next)=>{
    const {article_id} = req.params
    try {
        const article = await selectArticleById(article_id)
        res.status(200).send({article})
    }
    catch (err) {
        next(err)
    }
}

exports.getAllArticles = async (req, res, next)=>{ 
    const {topic, sort_by, order, limit, p} = req.query
    const arrOfKeysQuery = Object.keys(req.query)
    try {
        const articles = await selectAllArticles(topic, sort_by, order, arrOfKeysQuery, limit, p)
        if(articles.status){
            res.status(articles.status).send(articles)
        }
        res.status(200).send({articles})
    }
    catch (err) {
        next(err)
    }
}

exports.updateArticleById = async (req,res,next)=>{
    const {article_id}= req.params
    const {inc_votes} = req.body
    try {
        const article = await updateVotesByArticleId(article_id, inc_votes)
        res.status(200).send({article})
    } 
    catch (err){
        next(err)
    }
}

exports.postNewArticle = async (req,res,next)=>{
    const {author, title, body, topic, article_img_url = "https://www.techpowerup.com/img/LKhb6Bdk2RzjfBlV.jpg"}= req.body
    try {
        const article = await addNewArticle(author, title, body, topic, article_img_url)
            res.status(201).send({article})
    }
    catch(err){
        next(err)
    }
}

exports.deleteArticleById = async (req,res,next) => {
    const {article_id} = req.params
    try {
        await deleteSingleArticle(article_id)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}