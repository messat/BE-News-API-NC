const {selectAllTopics, selectAllEndpoints, selectArticleById, selectAllArticles,selectCommentsByArticleId, insertNewComment,updateVotesByArticleId, deleteCommentById, selectAllUsers, selectByUserName, updateComment, addNewArticle} = require('../models/api.model')

exports.getAllTopics = async (req,res)=>{
    const topics = await selectAllTopics()
    res.status(200).send({topics})
}

exports.noEndpoint = (req,res)=>{
    if (req.method !== "GET"){
        res.status(405).send({msg: "405 Method Not Allowed"})
    }
    res.status(404).send({msg: "404 Route Not Found"})
}

exports.endpointDocumentation = async (req,res, next)=>{
    const endpoints = await selectAllEndpoints()
    res.status(200).send({endpoints})    
}

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

exports.getCommentsByArticleId = async (req,res,next)=>{
    const {article_id}= req.params
    try {
        const comments = await selectCommentsByArticleId(article_id)
        res.status(200).send({comments})
    }
    catch (err){
        next(err)
    }
}

exports.postCommentByArticleId = async (req,res,next)=>{
    const {article_id}= req.params
    const {username, body} = req.body
    try {
        const comment = await insertNewComment(article_id, username, body)
        res.status(201).send({comment})
    }
     catch (err){
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

exports.deleteComment = async (req,res,next)=>{
    const {comment_id} = req.params
    try {
        await deleteCommentById(comment_id)
        res.status(204).send()
    }
    catch (err) {
       next(err)
    }
}

exports.getAllUsers = async (req,res,next)=>{
    try {
        const users = await selectAllUsers()
        res.status(200).send({users})
    }
    catch (err) {
        next(err)
    }
}

exports.getByUserName = async (req,res,next)=>{
    const {username} = req.params
    try {
        const user = await selectByUserName(username)
        res.status(200).send({user})
        }
    catch (err){
        next(err)
    }
}

exports.updateVotesByCommentId = async (req,res,next)=>{
    const {comment_id} = req.params
    const {inc_votes} = req.body
    try {
        const comment = await updateComment(comment_id, inc_votes)
        res.status(200).send({comment})
    }
    catch(err){
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