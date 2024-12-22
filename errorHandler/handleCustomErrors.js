
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