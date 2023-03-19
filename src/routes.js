const { Router } = require('express')

/* CONTROLLERS */

const ControllerUsers = require('./app/controllers/ControllerUsers')
const ControllerServices = require('./app/controllers/ControllerServices')

const routes = Router()

/* MIDDLEWARES */

const authMiddleware = require('./app/middlewares/auth')

/* USERS */

routes.post("/user", ControllerUsers.storage)
routes.post("/user/login", ControllerUsers.login)
routes.put("/user", authMiddleware,  ControllerUsers.update)

/* SERVICES */

routes.post("/service", authMiddleware, ControllerServices.storage)
routes.get("/service", authMiddleware, ControllerServices.get)
routes.put("/service/:id", authMiddleware, ControllerServices.update)
routes.delete("/service/:id", authMiddleware, ControllerServices.delete)

module.exports = routes