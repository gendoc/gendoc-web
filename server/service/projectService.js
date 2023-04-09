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
        console.error(ex.stack);
        await client.query("ROLLBACK")
        return false
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}



const findProjects =async (sessionId) => {
    try{
        await client.query("BEGIN")
        const accountId = await findAccountIdBySessionId(sessionId)
        const qs = await client.query(`select project.project_id,project.project_name,project.creation_time,notice_file.document_state 
from project left join notice_file on project.project_id = notice_file.project_id where project.account_id = $1`,[accountId.toString()])
        const projects = []
        for (row of qs.rows){
            const project = {}
            const qs2 = await client.query(`select * from written_file where project_id = $1`,[row.project_id.toString()])
            project.projectId = row.project_id
            project.projectName = row.project_name
            project.creationTime = row.creation_time
            project.projectState = qs2.rows[0].document_state
            project.chatDoc = false
            if (row.document_state=="처리 완료"){
                project.chatDoc = true
            }
            projects.push(project)
        }
        await client.query("COMMIT")
        return projects
    }catch(ex){
        console.error(ex.stack);
        await client.query("ROLLBACK")
    }finally{
        // await client.end()
        console.log("Cleaned.")
    }
}

module.exports = {insertProject,
    findProjects
}