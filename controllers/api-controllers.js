const { selectAllEndpoints } = require('../models/api-models')

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