const {selectAllTopics, selectAllEndpoints, selectArticleById, selectAllArticles,selectCommentsByArticleId, insertNewComment} = require('../models/api.model')
exports.getAllTopics = (req,res)=>{
    selectAllTopics()
    .then((topics)=>{
        res.status(200).send({topics})
    })
}

exports.noEndpoint = (req,res)=>{
    res.status(404).send({msg: '404 Route Not Found'})
}

exports.getAllEndpoints = (req,res, next)=>{
    selectAllEndpoints().then((endpoints)=>{
        res.status(200).send({endpoints})
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticleById = (req,res, next)=>{
    const {article_id} = req.params
    selectArticleById(article_id).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getAllArticles = (req, res, next)=>{ 
    selectAllArticles().then((articles)=>{
       res.status(200).send({articles})
    })
    .catch((err)=>{
       next(err)
    })
}

exports.getCommentsByArticleId = (req,res,next)=>{
    const {article_id}= req.params
    selectCommentsByArticleId(article_id)
    .then((comments)=>{
     res.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postCommentByArticleId = (req,res,next)=>{
    const {article_id}= req.params
    const newComment = req.body
    insertNewComment(article_id, newComment).then((comment)=>{
     res.status(201).send({comment})
    })
    .catch((err)=>{
        next(err)
    })
}