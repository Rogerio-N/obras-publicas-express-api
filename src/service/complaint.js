import client from '../config/database.js';
import { findThemeById } from './themes.js';
import { findUserById } from './users.js';

export async function findAllComplaints() {
    return client.query(`SELECT * FROM dbt_complaintx_piob order by id ASC`)
}

export async function createComplaint(rua, bairro, numero, dataDenuncia, dataFinalizacao, status, idUser, idTheme, cep, descricao, imageUrl, resposta) {
    if((rua == undefined || rua == null) || (bairro == undefined || bairro == null) || (numero == undefined || numero == null) || (dataDenuncia == undefined || dataDenuncia == null) || (dataFinalizacao == undefined || dataFinalizacao == null) || (status == undefined || status == null) || (idUser == undefined || idUser == null) || (idTheme == undefined || idTheme == null)){
        return "badRequest"
    }
    if(status!= "Aguardando resposta" && status!="Em andamento" && status!="Negada" && status!="Finalizada"){
        return "badRequest"
    }
    const findUserQuery = await findUserById(idUser);
    if(findUserQuery.rowCount == 0){
        return "notFound user"
    }
    const findThemeQuery = await findThemeById(idTheme);
    if(findThemeQuery.rowCount == 0){
        return "notFound theme"
    }
    return client.query(`INSERT INTO dbt_complaintx_piob (
        cep, 
        rua, 
        bairro, 
        numero, 
        descricao, 
        imageUrl, 
        dataDenuncia, 
        dataFinalizacao, 
        resposta, 
        status, 
        idUser, 
        idTheme) VALUES(
           ' ${cep}',
            '${rua}',
            '${bairro}',
            '${numero}',
            '${descricao}',
            '${imageUrl}',
            '${dataDenuncia}',
            '${dataFinalizacao}',
            '${resposta}',
            '${status}',
            ${idUser},
            ${idTheme}
        )`)
}

export async function findComplaintById(complantId){
    return client.query(`SELECT * FROM dbt_complaintx_piob WHERE id=${complantId}`);
}

export async function findAllUserComplaint(userId){
    const userQuery = await findUserById(userId);
    if(userQuery.rowCount == 0){
        return "notFound"
    }
    return client.query(`SELECT * FROM dbt_complaintx_piob WHERE idUser=${userId} order by id ASC`)
}

export async function findOneUserComplaint(userId, complaintId){
    const userQuery = await findUserById(userId);
    if(userQuery.rowCount == 0){
        return "notFound user"
    }
    const complaintIdQuery = await findComplaintById(complaintId);
    if(complaintIdQuery.rowCount == 0){
        return "notFound complaint"
    }
    return client.query(`SELECT * FROM dbt_complaintx_piob WHERE idUser=${userId} AND id=${complaintId}`)
}

export async function updateComplaintStatus(complaintId, newStatus){
    const complaintIdQuery = await findComplaintById(complaintId);
    if(complaintIdQuery.rowCount == 0){
        return "notFound"
    }
    if(newStatus!= "Aguardando resposta" && newStatus!="Em andamento" && newStatus!="Negada" && newStatus!="Finalizada"){
        return "badRequest"
    }
    return client.query(`UPDATE dbt_complaintx_piob SET status='${newStatus}' where id=${complaintId}`)
}