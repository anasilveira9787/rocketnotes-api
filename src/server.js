require("express-async-errors")

const migrationsRun = require('./database/sqlite/migrations')

const AppError = require("./utils/AppError") // importando o AppError

const express = require("express"); // importando express

const routes = require("./routes")

const app = express(); // inicializando o express
app.use(express.json()); // define que as informações serão passadas por JSON


app.use(routes);


migrationsRun();


app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.log(error);

    return response.status(500).json({
        status:"error",
        message: "Internal Server Error",
    });

});

const PORT = 3333; // definindo o endereço da porta

app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`)); // define e inicializa o servidor