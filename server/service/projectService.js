const client = require("../db/postgresqlClient");
const {findAccountIdBySessionId} = require("./accountService");

const insertProject =async (sessionId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)

        const queryResult = await client.query(`insert into project (account_id) values ($1) returning *`,[accountId.toString()]);
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