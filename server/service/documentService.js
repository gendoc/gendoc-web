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

const findGuideDocuments =async (sessionId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        const qs = await client.query(`select * from guide_file where account_id = $1`,[accountId.toString()])
        const docs = []
        for (row of qs.rows){
            const doc = {}
            doc.fileName = row.file_name
            doc.fileKey = row.file_key
            doc.accountId = row.account_id
            doc.uploadTime = row.upload_time
            docs.push(doc)
        }
        await client.query("COMMIT")
        return docs
    }catch(ex){
        console.log("Failed to execute sendPostMessage"+ex)
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

const findWrittenDocuments =async (sessionId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        const qs = await client.query(`select * from written_file where account_id = $1`,[accountId.toString()])
        const docs = []
        for (row of qs.rows){
            const doc = {}
            doc.fileName = row.file_name
            doc.fileKey = row.document_id
            doc.accountId = row.account_id
            doc.uploadTime = row.upload_time
            docs.push(doc)
        }
        await client.query("COMMIT")

        return docs
    }catch(ex){
        console.log("Failed to execute sendPostMessage"+ex)
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}
module.exports = {insertGuideDocuments,insertWrittenDocument,findGuideDocuments,findWrittenDocuments}