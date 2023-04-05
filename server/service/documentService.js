const client = require("../db/postgresqlClient");
const {findAccountIdBySessionId} = require("./accountService");

const insertGuideDocuments =async (sessionId, files) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        for (file of files){
            await client.query(`insert into guide_file (file_name,file_key,account_id) values ($1,$2,$3)`,[file.fileName,file.fileKey,accountId.toString()])
        }
        await client.query("COMMIT")

        return true
    }catch(ex){
        console.log("Failed to execute sendPostMessage"+ex)
        await client.query("ROLLBACK")
        return false
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

const insertWrittenDocument =async (sessionId, file) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        await client.query(`insert into written_file (file_name,document_id,account_id) values ($1,$2,$3)`,[file.fileName,file.documentId,accountId.toString()])
        await client.query("COMMIT")

        return true
    }catch(ex){
        console.log("Failed to execute sendPostMessage"+ex)
        await client.query("ROLLBACK")
        return false
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

module.exports = {insertGuideDocuments,insertWrittenDocument}