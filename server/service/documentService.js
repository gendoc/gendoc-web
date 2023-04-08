const client = require("../db/postgresqlClient");
const {findAccountIdBySessionId, findGoogleAccessTokenByAccountId} = require("./accountService");
const {send} = require("../messagequeue/rabbitMQClient");
const {getDocument, editTables, editSections} = require("../googleApi");

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
        console.error(ex.stack);
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
        console.error(ex.stack);
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
        console.error(ex.stack);
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
        console.error(ex.stack);
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
        console.error(ex.stack);
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
        console.error(ex.stack);
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

const finishUpload =async (sessionId,projectId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)

        const requestObj = {gonggo:"",ggultips:[],target_tables:[]}
        const fileKeys = await findPDFFileKeysByProjectId(projectId);
        for (fileKey of fileKeys){
            if (fileKey.fileType == "GUIDE"){
                requestObj.ggultips.push(generateS3Url(fileKey.fileKey))
            }else if (fileKey.fileType == "NOTICE"){
                requestObj.gonggo =generateS3Url(fileKey.fileKey)
            }
        }


        //서버에 pdf url 목록,테이블 내용 목록 보내주고 완료응답 받기

        //완료응답 받으면 pdf 처리완료로 바꿔

        //첨삭작업 시작
        startCorrectionDocument(projectId)

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

const findPDFFileKeysByProjectId =async (projectId) => {
    try{
        await client.query("BEGIN")
        let qs = await client.query(`select * from guide_file where project_id = $1`,[projectId.toString()])
        const fileKeys = []
        for (row of qs.rows){
            fileKeys.push({fileKey:row.file_key,fileType:"GUIDE"})
        }
        qs = await client.query(`select * from notice_file where project_id = $1`,[projectId.toString()])
        for (row of qs.rows){
            fileKeys.push({fileKey:row.file_key,fileType:"NOTICE"})
        }
        await client.query("COMMIT")
        return docs
    }catch(ex){
        console.error(ex.stack);
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

const generateS3Url = (fileKey) => {
    return "https://gendoc-prod.s3.ap-northeast-2.amazonaws.com/"+fileKey
}

const updatePDFFileState =async (fileInfo) => {
    try{
        await client.query("BEGIN")
        if (fileInfo.document_type=="GUIDE"){
            await client.query(`update guide_file set document_state = $1 where guide_file_id = $2`,["처리 완료",fileInfo.file_id.toString()])
        }else if (fileInfo.document_type=="NOTICE"){
            await client.query(`update notice_file set document_state = $1 where notice_file_id = $2`,["처리 완료",fileInfo.file_id.toString()])
        }else{
            console.log("문서 티입 확인할 것")
        }

        let isPDFProcessingFinish = true
        let qs = await client.query(`select * from guide_file where project_id = $1`,[fileInfo.project_id.toString()]);
        for (row of qs.rows){
            if (row.document_state=="처리중"){
                isPDFProcessingFinish = false
                break
            }
        }

        qs = await client.query(`select * from notice_file where project_id = $1`,[fileInfo.project_id.toString()]);
        if (isPDFProcessingFinish){
            for (row of qs.rows){
                if (row.document_state=="처리중"){
                    isPDFProcessingFinish = false
                    break
                }
            }
        }
        await client.query("COMMIT")

        if (isPDFProcessingFinish){
            console.log("pdf 전체 처리 완료")
            console.log("첨삭작업 시작")
            startCorrectionDocument(fileInfo.project_id)
        }else {
            console.log("pdf 전체 처리 미완료")
        }

        return true
    }catch(ex){
        console.error(ex.stack);
        await client.query("ROLLBACK")
        return false
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

const startCorrectionDocument =async (projectId) => {
    try{
        await client.query("BEGIN")
        await client.query(`update written_file set document_state = $1 where project_id = $2`,["첨삭중",projectId.toString()])
        const qs = await client.query(`select * from written_file where project_id = $1`,[projectId.toString()])
        const writtenFileInfo = qs.rows[0]
        correctionDocument(writtenFileInfo)
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

const correctionDocument =async (writtenFileInfo) => {
    try{
        const googleAccessToken = await findGoogleAccessTokenByAccountId(writtenFileInfo.account_id);
        await editSections(googleAccessToken,writtenFileInfo.document_id)
        await editTables(googleAccessToken,writtenFileInfo.document_id)

        return
    }catch(ex){
        console.error(ex.stack);
    }finally{
        // await client.end()
        console.log("Parsing complete.")
    }
}


module.exports = {insertGuideDocuments,insertWrittenDocument,findGuideDocuments,findWrittenDocuments,insertNoticeDocument,updatePDFFileState,finishUpload,
    findNoticeDocuments}