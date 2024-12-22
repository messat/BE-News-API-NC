const { selectAllUsers, selectByUserName } = require('../models/users-models')

exports.getAllUsers = async (req,res,next)=>{
    try {
        const users = await selectAllUsers()
        res.status(200).send({users})
    }
    catch (err) {
        next(err)
    }
}

exports.getByUserName = async (req,res,next)=>{
    const {username} = req.params
    try {
        const user = await selectByUserName(username)
        res.status(200).send({user})
        }
    catch (err){
        next(err)
    }
}