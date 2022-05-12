
export default function notFound(fieldName){
    const error = {
        "Status": 404,
        "Content":[{
            "Mensagem": `Nenhum(a) ${fieldName} encontrado na busca`
        }]
    }
    return error;
}