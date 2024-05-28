const {selectAllTopics} = require('../models/api.model')
exports.getAllTopics = (req,res)=>{
    selectAllTopics()
    .then((topics)=>{
        res.status(200).send({topics})
    })
}

exports.noEndpoint = (req,res,next)=>{
    res.status(404).send({msg: '404 Not Found'})
}