export default function badRequest(){
    const error = {
        "Status": 400,
        "Content": [
            {"Mensagem": "Request mal formatada"}
        ]
    }
    return error;
}