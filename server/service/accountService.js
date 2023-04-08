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
        console.error(ex.stack);
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

const findGoogleAccessTokenByAccountId =async (accountId) => {
    try{
        await client.query("BEGIN")
        const queryResult = await client.query(`select * from account where account_id = $1`,[accountId]);
        await client.query("COMMIT")

        return queryResult.rows[0].google_access_token
    }catch(ex){
        console.error(ex.stack);
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

const updateAccessToken =async (sessionId,accessToken) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        await client.query(`update account set google_access_token = $1 where account_id = $2`,[accessToken,accountId.toString()])
        await client.query("COMMIT")

        return
    }catch(ex){
        console.error(ex.stack);
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}



module.exports = {findAccountIdBySessionId,updateAccessToken,findGoogleAccessTokenByAccountId
}