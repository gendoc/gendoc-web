const client = require("../db/postgresqlClient");
const {findAccountIdBySessionId} = require("./accountService");
const {send} = require("../messagequeue/rabbitMQClient");

const insertGuideDocuments =async (sessionId, files,projectId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        for (file of files){
            const qs = await client.query(`insert into guide_file (file_name,file_key,account_id,project_id) values ($1,$2,$3,$4) returning *`,[file.fileName,file.fileKey,accountId.toString(),projectId.toString()])
            console.log("qs : "+qs)
            const doc = qs.rows[0]
            doc.file_id = doc.guide_file_id;
            delete doc.guide_file_id;
            doc.document_type = "GUIDE"
            await send("pdfQueue",JSON.stringify(doc),"inputPdf")
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

const insertNoticeDocument =async (sessionId, file,projectId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        const qs = await client.query(`insert into notice_file (file_name,file_key,account_id,project_id) values ($1,$2,$3,$4) returning *`,[file.fileName,file.fileKey,accountId.toString(),projectId.toString()])
        const doc = qs.rows[0]
        doc.file_id = doc.notice_file_id;
        delete doc.notice_file_id;
        doc.document_type = "NOTICE"
        await send("pdfQueue",JSON.stringify(doc),"inputPdf")
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

const insertWrittenDocument =async (sessionId, file,projectId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        await client.query(`insert into written_file (file_name,document_id,account_id,project_id) values ($1,$2,$3,$4)`,[file.fileName,file.documentId,accountId.toString(),projectId.toString()])
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

const findGuideDocuments =async (sessionId,projectId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        const qs = await client.query(`select * from guide_file where account_id = $1 and project_id = $2`,[accountId.toString(),projectId.toString()])
        const docs = []
        for (row of qs.rows){
            const doc = {}
            doc.fileName = row.file_name
            doc.fileKey = row.file_key
            doc.accountId = row.account_id
            doc.uploadTime = row.upload_time
            doc.documentState = row.document_state
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

const findNoticeDocuments =async (sessionId,projectId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        const qs = await client.query(`select * from notice_file where account_id = $1 and project_id = $2`,[accountId.toString(),projectId.toString()])
        const docs = []
        for (row of qs.rows){
            const doc = {}
            doc.fileName = row.file_name
            doc.fileKey = row.file_key
            doc.accountId = row.account_id
            doc.uploadTime = row.upload_time
            doc.documentState = row.document_state
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

const findWrittenDocuments =async (sessionId,projectId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        const qs = await client.query(`select * from written_file where account_id = $1 and project_id = $2`,[accountId.toString(),projectId.toString()])
        const docs = []
        for (row of qs.rows){
            const doc = {}
            doc.fileName = row.file_name
            doc.documentId = row.document_id
            doc.accountId = row.account_id
            doc.uploadTime = row.upload_time
            doc.documentState = row.document_state
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
module.exports = {insertGuideDocuments,insertWrittenDocument,findGuideDocuments,findWrittenDocuments,insertNoticeDocument,
    findNoticeDocuments}