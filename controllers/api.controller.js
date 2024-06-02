const {selectAllTopics, selectAllEndpoints, selectArticleById, selectAllArticles,selectCommentsByArticleId, insertNewComment,updateVotesByArticleId, deleteCommentById, selectAllUsers} = require('../models/api.model')
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
    const {topic, sort_by, order} = req.query
        selectAllArticles(topic, sort_by, order).then((articles)=>{
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

exports.fetchArticleById = (req,res,next)=>{
    const {article_id}= req.params
    const newVotes = req.body
    updateVotesByArticleId(article_id, newVotes).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getCommentById = (req,res,next)=>{
    const {comment_id} = req.params
    deleteCommentById(comment_id).then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
       next(err)
    })
}

exports.getAllUsers = (req,res,next)=>{
    selectAllUsers().then((users)=>{
     res.status(200).send({users})
    })
    .catch((err)=>{
        next(err)
    })
}