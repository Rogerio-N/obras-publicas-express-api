import express from "express";
import badRequest from "../errors/badRequest.js";
import notFound from "../errors/notFound.js";
import verifyJWT from "../middleware/auth.js";
import { createComplaint, findAllComplaints, findAllUserComplaint, findOneUserComplaint, updateComplaintStatus } from "../service/complaint.js";
export const complaintRouter = express.Router();

complaintRouter.get('/', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const complaintQuery = await findAllComplaints();
    if(complaintQuery.rowCount == 0){
        return res.status(notFound().Status).json(notFound("denuncia"))
    }
    const success = {
        "Status": 200,
        "Content": complaintQuery.rows
    }
    return res.status(200).json(success);
});

complaintRouter.post('/create', verifyJWT, async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const requestBody = JSON.parse(req.body);
    const complaintCreateQuery = await createComplaint(requestBody.rua, requestBody.bairro, requestBody.numero, requestBody.dataDenuncia, requestBody.dataFinalizacao, requestBody.status, requestBody.idUser, requestBody.idTheme, requestBody.cep, requestBody.descricao, requestBody.imageUrl, requestBody.resposta)
    if(complaintCreateQuery == "badRequest"){
        return res.status(badRequest().Status).json(badRequest())
    }else if(complaintCreateQuery == "notFound theme"){
        return res.status(notFound().Status).json(notFound("tema"))
    }else if(complaintCreateQuery == "notFound user"){
        return res.status(notFound().Status).json(notFound("usuario"))
    }
    const success = {
        "Status": 200,
        "Content": [{"Mensagem": "Denuncia criada com sucesso"}]
    }
    return res.status(200).json(success);
});

complaintRouter.get('/find/all/:userId', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const complaintQuery = await findAllUserComplaint(req.params.userId);
    if(complaintQuery=="notFound"){
        return res.status(notFound().Status).json(notFound("usuario"))
    }else if(complaintQuery.rowCount == 0){
        return res.status(notFound().Status).json(notFound("denuncia"))
    }
    const success = {
        "Status": 200,
        "Content": complaintQuery.rows
    }
    return res.status(200).json(success);
});

complaintRouter.get('/find/one/:userId/:complaintId', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const complaintQuery = await findOneUserComplaint(req.params.userId, req.params.complaintId);
    if(complaintQuery == "notFound complaint"){
        return res.status(notFound().Status).json(notFound("denuncia"))
    }else if(complaintQuery == "notFound user"){
        return res.status(notFound().Status).json(notFound("usuario"))
    }else if(complaintQuery.rowCount == 0){
        return res.status(notFound().Status).json(notFound("denuncia para esse usuario foi"))
    }
    const success = {
        "Status": 200,
        "Content": complaintQuery.rows
    }
    return res.status(200).json(success);
})

complaintRouter.patch('/update/one/:complaintId', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    const statusQuery = await updateComplaintStatus(req.params.complaintId, JSON.parse(req.body).newStatus);
    if(statusQuery == "badRequest"){
        return res.status(badRequest().Status).json(badRequest())
    }else if(statusQuery == "notFound"){
        return res.status(notFound().Status).json(notFound("denuncia"))
    }
    const success = {
        "Status": 200,
        "Content": [{"Mensagem": "Denuncia atualizada com sucesso"}]
    }
    return res.status(200).json(success);
})