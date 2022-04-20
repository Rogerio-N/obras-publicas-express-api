import express from "express";
import notFound from "../errors/notFound.js";
import serverError from "../errors/serverError.js";
import verifyJWT from "../middleware/auth.js";
import { createTheme, deleteTheme, findActiveThemes, findAllThemes, updateThemeActiveness, updateThemeInfo } from "../service/themes.js";

export const themesRouter = express.Router();

themesRouter.get('/', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const themesQuery = await findAllThemes();
    if(themesQuery.rowCount == 0){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }
    const success = {
        "Status": 200,
        "Content": themesQuery.rows
    }
    return res.status(200).json(success);
})

themesRouter.post('/create', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const bodyRequest = JSON.parse(req.body);
    const createThemeQuery = await createTheme(bodyRequest.nome, bodyRequest.url, bodyRequest.ativo)
    if(createThemeQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    const success = {
        "Status": 200,
        "Content": [{"Mensagem": "Tema criado com sucesso"}]
    }
    return res.status(200).json(success);
})

themesRouter.delete('/delete/one/:themeId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const deleteQuery = await deleteTheme(req.params.themeId)
    if(deleteQuery == "notFound"){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }else if(deleteQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    const success = {
        "Status": 200,
        "Content": [{"Mensagem": "Tema excluido com sucesso"}]
    }
    return res.status(200).json(success);
})

themesRouter.put('/update/all/:themeId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const updateQuery = await updateThemeInfo(req.params.themeId, JSON.parse(req.body).nome, JSON.parse(req.body).url, JSON.parse(req.body).ativo)
    if(updateQuery == "notFound"){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }else if(updateQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    const success = {
        "Status": 200,
        "Content": [{"Mensagem": "Tema atualizado com sucesso"}]
    }
    return res.status(200).json(success);
})

themesRouter.patch('/update/one/:themeId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const updateActivenessQuery = await updateThemeActiveness(req.params.themeId, JSON.parse(req.body).ativo)
    if(updateActivenessQuery == "notFound"){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }else if(updateActivenessQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    const success = {
        "Status": 200,
        "Content": [{"Mensagem": "Tema atualizado com sucesso"}]
    }
    return res.status(200).json(success);
});

themesRouter.get('/find/active/:ativo', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const themesQuery = await findActiveThemes(req.params.ativo);
    if(themesQuery.rowCount == 0){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }
    const success = {
        "Status": 200,
        "Content": themesQuery.rows
    }
    return res.status(200).json(success);
})