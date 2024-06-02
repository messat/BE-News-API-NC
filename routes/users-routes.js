const express = require('express')
const { getAllUsers } = require('../controllers/api.controller')
const userRouter = express.Router()

userRouter.get('/', getAllUsers)

module.exports = userRouter