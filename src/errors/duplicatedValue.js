export default function duplicatedValue(fieldName){
    const duplicate = {
        "Status": 409,
        "Content": [{
            "Messagem": `${fieldName} já cadastrado`
        }]
    }
    return duplicate;
}