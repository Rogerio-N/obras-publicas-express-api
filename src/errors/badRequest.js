export default function badRequest(){
    const error = {
        "Status": 400,
        "Mensagem": "Request mal formatada"
    }
    return error;
}