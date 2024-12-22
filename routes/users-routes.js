const express = require('express')
const { getAllUsers, getByUserName } = require('../controllers/users-controllers')
const userRouter = express.Router()

userRouter.get('/', getAllUsers)

userRouter.get('/:username', getByUserName)

module.exports = userRouter