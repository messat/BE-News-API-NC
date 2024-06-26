
exports.handleCustomErrors = ((err, req, res, next)=>{
    if(err.status === 404 && err.msg === '404 Not Found'){
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
    if(err.code === '22P02' || err.code === '23502' || err.code === '23503'
    ){
        res.status(400).send({msg: '400 Invalid Input'})
    }
    next(err)
})

exports.handleServerErrors = ((err, req, res, next)=>{
    res.status(500).send({msg: 'Internal Server Error'})
})