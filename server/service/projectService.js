const client = require("../db/postgresqlClient");
const {findAccountIdBySessionId} = require("./accountService");

const insertProject =async (sessionId,projectName) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)

        const queryResult = await client.query(`insert into project (account_id,project_name) values ($1,$2) returning *`,[accountId.toString(),projectName]);
        const projectId = queryResult.rows[0].project_id
        await client.query("COMMIT")

        return projectId
    }catch(ex){
        console.log("Failed to execute sendPostMessage"+ex)
        await client.query("ROLLBACK")
        return false
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

module.exports = {insertProject}