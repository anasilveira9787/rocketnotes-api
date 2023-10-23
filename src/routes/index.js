const { Router } = require("express");

const usersRouter = require("./users.routes")

const routes = Router();

// esse arquivo reune todas as rotas

routes.use("/users", usersRouter);

module.exports = routes;