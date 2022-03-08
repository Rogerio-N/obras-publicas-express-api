import express from "express";
import notFound from "../errors/notFound.js";
import serverError from "../errors/serverError.js";
import verifyJWT from "../middleware/auth.js";
import { createTheme, deleteTheme, findActiveThemes, findAllThemes, updateThemeActiveness, updateThemeInfo } from "../service/themes.js";

export const themesRouter = express.Router();

themesRouter.get('/', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const themesQuery = await findAllThemes();
    if(themesQuery.rowCount == 0){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }
    return res.status(200).json(themesQuery.rows);
})

themesRouter.post('/create', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const bodyRequest = req.body;
    const createThemeQuery = await createTheme(bodyRequest.nome, bodyRequest.url, bodyRequest.ativo)
    if(createThemeQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json("Tema criado com sucesso")
})

themesRouter.delete('/delete/one/:themeId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const deleteQuery = await deleteTheme(req.params.themeId)
    if(deleteQuery == "notFound"){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }else if(deleteQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json("Tema excluido com sucesso")
})

themesRouter.put('/update/all/:themeId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const updateQuery = await updateThemeInfo(req.params.themeId, req.body.nome, req.body.url, req.body.ativo)
    if(updateQuery == "notFound"){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }else if(updateQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json("Tema atualizado com sucesso")
})

themesRouter.patch('/update/one/:themeId', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const updateActivenessQuery = await updateThemeActiveness(req.params.themeId, req.body.ativo)
    if(updateActivenessQuery == "notFound"){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }else if(updateActivenessQuery.rowCount == 0){
        return res.status(serverError().Status).json(serverError())
    }
    return res.status(200).json("Tema atualizado com sucesso")
});

themesRouter.get('/find/active/:ativo', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const themesQuery = await findActiveThemes(req.params.ativo);
    if(themesQuery.rowCount == 0){
        return res.status(notFound('tema').Status).json(notFound('tema'))
    }
    return res.status(200).json(themesQuery.rows);
})