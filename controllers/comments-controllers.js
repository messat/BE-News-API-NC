const { selectCommentsByArticleId, deleteCommentById, insertNewComment, updateComment } = require('../models/comments-models')

exports.getCommentsByArticleId = async (req,res,next)=>{
    const {article_id} = req.params
    const { limit, p } = req.query
    try {
        const comments = await selectCommentsByArticleId(article_id, limit, p)
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