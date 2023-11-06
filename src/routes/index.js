const { Router } = require("express");

const usersRouter = require("./users.routes")
const notesRouter = require("./notes.routes")

const routes = Router();

// esse arquivo reune todas as rotas

routes.use("/users", usersRouter);
routes.use("/notes", notesRouter);

module.exports = routes;