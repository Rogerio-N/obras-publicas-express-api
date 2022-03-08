export default function serverError(){
    const error = {
        "Status": 500,
        "Mensagem": "Erro inesperado no servidor"
    }
    return error;
}