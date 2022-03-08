export default function unauthorized() {
    const error = {
        "Status": 401,
        "Mensagem": "Usuario ou senha invalidos"
    }

    return error;
}