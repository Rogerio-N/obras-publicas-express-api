export default function unauthorized() {
    const error = {
        "Status": 401,
        "Content": [{
            "Mensagem": "Usuario ou senha invalidos"
        }]
    }

    return error;
}