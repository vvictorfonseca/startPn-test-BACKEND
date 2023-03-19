const { Router } = require('express')

/* CONTROLLERS */

const ControllerUsers = require('./app/controllers/ControllerUsers')
const ControllerServices = require('./app/controllers/ControllerServices')
const ControllerSessions = require('./app/controllers/ControllerSessions')

const routes = Router()

/* MIDDLEWARES */

const authMiddleware = require('./app/middlewares/auth')

/* SESSIONS */

routes.get("/session/:userId", authMiddleware, ControllerSessions.getByUserId)
routes.delete("/session/:userId", authMiddleware, ControllerSessions.delete)

/* USERS */

routes.post("/user", ControllerUsers.storage)
routes.post("/user/login", ControllerUsers.login)
routes.put("/user", authMiddleware,  ControllerUsers.update)

/* SERVICES */

routes.post("/service", authMiddleware, ControllerServices.storage)
routes.get("/service", authMiddleware, ControllerServices.get)
routes.get("/service/:string", authMiddleware, ControllerServices.getServicesByDescription)
routes.put("/service/:id", authMiddleware, ControllerServices.update)
routes.delete("/service/:id", authMiddleware, ControllerServices.delete)

module.exports = routes