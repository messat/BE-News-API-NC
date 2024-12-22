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