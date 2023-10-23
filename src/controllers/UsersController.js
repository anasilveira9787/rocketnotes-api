const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite");
const { application } = require("express");


class UsersController {

    // index - GET para listar vários registros
    // show - GET para exibir um registro específico
    // create - POST para criar um registro
    // update - PUT para atualizar um registro
    // delete - DELETE para deletar um registro

    async create(request, response) {

    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExists) {
            throw new AppError("Este email já está em uso");
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])

        return response.status(201).json("Usuário criado com sucesso");
    
}

    async update(request, response) {
        const {name, email, password, old_password} = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);



        if(!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Esse e-mail já está em uso");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para redefinir a senha")
        }

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword){
                throw new AppError("A senha antiga está incorreta");
            }

            user.password = await hash(password, 8)

        }




        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
        [user.name, user.email, user.password, id]);

        console.log(user)
        return response.status(200).json('Usuário editado com sucesso');


    }

}

module.exports = UsersController;