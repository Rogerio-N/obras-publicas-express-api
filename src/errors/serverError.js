export default function serverError(){
    const error = {
        "Status": 500,
        "Content": [{
            "Mensagem": "Erro inesperado no servidor"
        }]
    }
    return error;
}