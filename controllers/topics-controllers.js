const { selectAllTopics, insertNewTopic } = require('../models/topics-models')

exports.getAllTopics = async (req,res)=>{
    const topics = await selectAllTopics()
    res.status(200).send({topics})
}

exports.postNewTopic = async (req,res,next) => {
    const {slug, description} = req.body
    try {
        const newTopic = await insertNewTopic(slug, description)
        res.status(201).send({topic: newTopic})
    } catch (err) {
        next(err)
    }
}