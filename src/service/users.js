import client from "../config/database.js";
import bcrypt from 'bcrypt';
import dotEnv from 'dotenv-safe'
import jwt from 'jsonwebtoken'

dotEnv.config();

export async function findAllUsers(){
    return client.query('SELECT * FROM dbt_userx_piob')
}

export async function createUser(nome, email, senha, role = "common"){
    const existUserQuery = await findUserBy('email', email);
    if(existUserQuery.rowCount == 0){
        const hashPassword = bcrypt.hashSync(senha, parseInt(process.env.SALT_ROUNDS))
        return client.query(`insert into dbt_userx_piob ( nome, email, senha, role) VALUES ('${nome}', '${email}', '${hashPassword}', '${role}')`)
    }
    return "email ja existente"
}


export async function findUserById(id){
    return client.query(`SELECT * FROM dbt_userx_piob WHERE id = ${id}`)
}

export async function findUserBy(searchField, value){
    if(searchField == 'id'){
        return findUserById(value)
    }
    return client.query(`SELECT * from dbt_userx_piob where ${searchField} like '%${value}%'`)
}

export async function login(email, senha){
    const existUserQuery = await findUserBy('email', email);
    if(existUserQuery.rowCount == 0){
        return "Usuario ou senha incorretos"
    }

    const canLogin = bcrypt.compareSync(senha, existUserQuery.rows[0].senha)

    if(!canLogin){
        return "Usuario ou senha incorretos"
    }

    const userId = existUserQuery.rows[0].id
    const userEmail = existUserQuery.rows[0].email
    const userRole = existUserQuery.rows[0].role
    const token = jwt.sign({userId, userEmail, userRole}, process.env.SECRET, {
        expiresIn: 3000,
        algorithm: 'HS512'
    })

    return token
}

export async function updateUser(userId, nome, email){
    const queryUser = await findUserById(userId)
    if(queryUser.rowCount == 0){
        return "notFound"
    }
    const queryUserEmail = await findUserBy('email', email)
    if(queryUserEmail.rowCount != 0){
        return "duplicatedValue"
    }
    return client.query(`UPDATE dbt_userx_piob SET nome='${nome}', email='${email}' WHERE id=${userId}`);
}

export async function updateUserPassword(userId, senha){
    const queryUser = await findUserById(userId)
    if(queryUser.rowCount == 0){
        return "notFound"
    }
    const hashPassword = bcrypt.hashSync(senha, parseInt(process.env.SALT_ROUNDS))
    return client.query(`UPDATE dbt_userx_piob SET senha='${hashPassword}' where id=${userId}`);
}

export async function deleteUser(userId){
    const queryUser = await findUserById(userId)
    if(queryUser.rowCount == 0){
        return "notFound"
    }
    return client.query(`DELETE FROM dbt_userx_piob WHERE id=${userId}`)
}