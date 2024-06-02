const express = require('express')
const { getAllUsers, getByUserName } = require('../controllers/api.controller')
const userRouter = express.Router()

userRouter.get('/', getAllUsers)

userRouter.get('/:username', getByUserName)

module.exports = userRouter