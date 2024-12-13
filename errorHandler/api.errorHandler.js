
exports.handleCustomErrors = ((err, req, res, next)=>{
    if(err.status === 404 && err.msg === '404 Route Not Found'){
        res.status(err.status).send(err)
    } else if(err.status === 400 && err.msg === '400 Bad Request'){
        res.status(err.status).send(err)
    } else if(err.status === 401 && err.msg === '401 Not Authenticated'){
        res.status(err.status).send(err)
    } else if(err.status === 404 && err.msg === '404 ID does not exist'){
        res.status(err.status).send(err)
    }
    next(err)
})

exports.handlePsqlErrors = ((err, req, res, next)=>{
    if(err.code === '22P02'){
        res.status(400).send({msg: '400 Invalid text input: Expected numeric value.'})
    } else if(err.code == "23502"){
        res.status(400).send({msg: "400 Bad Request: A required field is missing or null."})
    } else if(err.code === "23503"){
        res.status(400).send({msg: "400 Bad Request: Enter a valid author(username)."})
    }
    next(err)
})

exports.handleServerErrors = ((err, req, res, next)=>{
    res.status(500).send({msg: 'Internal Server Error'})
})