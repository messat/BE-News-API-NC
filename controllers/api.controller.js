const {selectAllTopics, selectAllEndpoints} = require('../models/api.model')
exports.getAllTopics = (req,res)=>{
    selectAllTopics()
    .then((topics)=>{
        res.status(200).send({topics})
    })
}

exports.noEndpoint = (req,res)=>{
    res.status(404).send({msg: '404 Not Found'})
}

exports.getAllEndpoints = (req,res)=>{
    selectAllEndpoints().then((endpoints)=>{
        res.status(200).send({endpoints})
    })
}