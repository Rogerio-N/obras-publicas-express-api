export default function duplicatedValue(fieldName){
    const duplicate = {
        "Status": 409,
        "Messagem": `${fieldName} já cadastrado`
    }
    return duplicate;
}