import express from "express";
import duplicatedValue from "../errors/duplicatedValue.js";
import notFound from "../errors/notFound.js";
import serverError from "../errors/serverError.js";
import unauthorized from "../errors/unauthorized.js";
import verifyJWT from "../middleware/auth.js";
import { createUser, deleteUser, findAllUsers, findUserBy, login, updateUser, updateUserPassword } from "../service/users.js";

export const userRouter = express.Router();

userRouter.get('/', verifyJWT, async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const showUsers = await findAllUsers();
    if(showUsers.rowCount == 0){
        return res.status(notFound('Usuario').Status).json(notFound('usuario'))
    }
    return res.status(200).json(showUsers.rows);
});

userRouter.get('/find/:queryParam/:queryValue', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const showUsers = await findUserBy(req.params.queryParam, req.params.queryValue);
    if(showUsers.rowCount == 0){
        return res.status(notFound('Usuario').Status).json(notFound('usuario'))
    }
    return res.status(200).json(showUsers.rows);
})

userRouter.post('/create', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const userBody = JSON.parse(req.body);
    const createUserQuery = await createUser(userBody.nome, userBody.email, userBody.senha, userBody.role);
    if(createUserQuery == "email ja existente"){
        return res.status(duplicatedValue("email").Status).json(duplicatedValue("email"))
    }else if(createUserQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json("Usuario criado com sucesso")
});

userRouter.post('/login', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const userBody = JSON.parse(req.body);
    const createUserQuery = await login(userBody.email, userBody.senha);
    if(createUserQuery=="Usuario ou senha incorretos"){
        return res.status(unauthorized().Status).json(unauthorized())
    }
    return res.status(200).json({
        auth: true,
        message: createUserQuery
    })
});

userRouter.put('/update/all/:userId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const requestBody = JSON.parse(req.body);
    const updateUserQuery = await updateUser(req.params.userId, requestBody.nome, requestBody.email);
    if(updateUserQuery == "notFound"){
        return res.status(notFound('usuario').Status).json(notFound('usuario'))
    }else if(updateUserQuery == "duplicatedValue"){
        return res.status(duplicatedValue('email').Status).json(duplicatedValue('email'));
    }else if(updateUserQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json("Usuario atualizado com sucesso")
})

userRouter.patch('/update/one/:userId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const requestBody = JSON.parse(req.body);
    const updateUserPasswordQuery = await updateUserPassword(req.params.userId, requestBody.senha);
    if(updateUserPasswordQuery == "notFound"){
        return res.status(notFound('usuario').Status).json(notFound('usuario'))
    }else if(updateUserPasswordQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json(updateUserPasswordQuery.rows)
})

userRouter.delete('/delete/one/:userId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const deleteUserQuery = await deleteUser(req.params.userId);
    if(deleteUserQuery=="notFound"){
        return res.status(notFound('usuario').Status).json(notFound('usuario'))
    }else if(deleteUserQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json('Usuario excluido com sucesso')
})