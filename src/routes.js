const { Router } = require('express')

const ControllerUsers = require('./app/controllers/ControllerUsers')

const routes = Router()

const authMiddleware = require('./app/middlewares/auth')

/* USERS */

routes.post("/user", ControllerUsers.storage)
routes.post("/user/login", ControllerUsers.login)
routes.put("/user", authMiddleware,  ControllerUsers.update)

module.exports = routes