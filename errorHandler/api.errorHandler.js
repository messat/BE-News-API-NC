
exports.handleCustomErrors = ((err, req, res, next)=>{
    if(err.status === 404 && err.msg === '404 Not Found'){
        res.status(err.status).send(err)
    }
    next(err)
})

exports.handlePsqlErrors = ((err, req, res, next)=>{
    if(err.code === '22P02'){
        res.status(400).send({msg: '400 Invalid Input'})
    }
    next(err)
})

exports.handleServerErrors = ((err, req, res, next)=>{
    res.status(500).send({msg: 'Internal Server Error'})
})