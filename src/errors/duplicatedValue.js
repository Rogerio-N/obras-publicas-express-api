export default function duplicatedValue(fieldName){
    const duplicate = {
        "Status": 409,
        "Content": [{
            "Mensagem": `${fieldName} já cadastrado`
        }]
    }
    return duplicate;
}