const client = require("../db/postgresqlClient");

const findAccountIdBySessionId =async (sessionId) => {
    try{
        await client.query("BEGIN")
        const queryResult = await client.query(`
      WITH ins AS (
        INSERT INTO account (session_id)
        VALUES ($1)
        ON CONFLICT (session_id) DO NOTHING
        RETURNING account_id
      )
      SELECT account_id FROM ins
      UNION ALL
      SELECT account_id FROM account WHERE session_id = $1
      LIMIT 1;
    `,[sessionId]);
        await client.query("COMMIT")

        return queryResult.rows[0].account_id
    }catch(ex){
        console.log("Failed to execute sendPostMessage"+ex)
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}



module.exports = {findAccountIdBySessionId}