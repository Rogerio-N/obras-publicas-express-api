import client from "../config/database.js"

export async function findAllThemes(){
    return client.query(`SELECT * FROM dbt_themesx_piob`)
}

export async function findActiveThemes(ativo){
    return client.query(`SELECT * FROM dbt_themesx_piob WHERE ativo=${ativo}`);
}

export async function createTheme(nome, url, ativo = true){
    return client.query(`INSERT INTO dbt_themesx_piob (nome, url, ativo) VALUES ('${nome}', '${url}', ${ativo})`);
}

export async function findThemeById(id){
    return client.query(`SELECT * FROM dbt_themesx_piob WHERE id=${id}`)
}

export async function deleteTheme(id){
    const existTheme = await findThemeById(id);
    if(existTheme.rowCount == 0){
        return "notFound"
    }
    return client.query(`DELETE FROM dbt_themesx_piob WHERE id=${id}`)
}

export async function updateThemeInfo(id, nome, url, ativo){
    const existTheme = await findThemeById(id);
    if(existTheme.rowCount == 0){
        return "notFound"
    }
    return client.query(`UPDATE dbt_themesx_piob SET nome='${nome}', url='${url}', ativo=${ativo} WHERE id=${id}`)
}

export async function updateThemeActiveness(id, ativo){
    const existTheme = await findThemeById(id);
    if(existTheme.rowCount == 0){
        return "notFound"
    }
    return client.query(`UPDATE dbt_themesx_piob SET ativo=${ativo} WHERE id=${id}`)
}