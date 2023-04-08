const path = require('path');
const process = require('process');
const docs = require('@googleapis/docs')
const {google} = require('googleapis');
const auth = new google.auth.OAuth2();
const fs = require('fs');


const getDocument = async (accessToken, documentId) => {

    auth.setCredentials({access_token: accessToken});
    const client = await google.docs({version: 'v1', auth});
    const res = await client.documents.get({
        documentId: documentId,
    });
    return res.data

}

const editTables = async (accessToken,documentId) => {
    auth.setCredentials({access_token: accessToken});
    const client = await google.docs({version: 'v1', auth});
    const doc = await getDocument(accessToken, documentId);


    let section = ""
    let endIndex = 1
    let documentPushCount = 0

    for (let [index, element] of doc.body.content.entries()) {

        if (element.table != null) {
            let tableContent = ""
            let tablePushCount = 0
            for (tableRow of element.table.tableRows){
                for (tableCell of tableRow.tableCells){
                    for(content of tableCell.content){
                        if (content.paragraph!=null){
                            for (ele of content.paragraph.elements){
                                try {
                                    tableContent+=ele.textRun.content.replace("\n","")
                                }catch (e){
                                }
                            }
                        }
                    }
                    tableContent+="\n"
                }
            }

            const tableStartIndex = element.table.tableRows[0].startIndex
            // console.log(tableRow.endIndex)
            // console.log(tableContent)
            // console.log("--------------------------------------------")
            const correctionSection = await getCorrectionSection()
            await insertText(client,documentId,tableStartIndex+documentPushCount+2,correctionSection)
            documentPushCount+=(correctionSection.length+3)

        }

    }
}

 // editTables("ya29.a0Ael9sCOj4CDD78iky3OW8bAlcgLIfC6hvgYmRPETQPlGE8X3mZAv2tfuyzH_LwCSTdSpkg4coDZP-AUio-6U9FntrxVFmc8GIbmKJ8BeQ_pI0icpditNz6i_gVRH7mif-6mtgiP4rkQKzHYLOGFIKFE_xLrPAwaCgYKAcsSARASFQF4udJhxSJJvguiJVy0YS48P8NF7A0165",
 //     "1r_f9zXwkIfKJbi3u8cDqQv-lQeGpATJnus2QaFkV98M")

const editSections = async (accessToken,documentId) => {
    auth.setCredentials({access_token: accessToken});
    const client = await google.docs({version: 'v1', auth});
    const doc = await getDocument(accessToken, documentId);


    const sections = []
    let section = ""
    let endIndex = 1
    let pushCount = 0
    let fontSizeSum = 0
    let textCount = 0
    for (let element of doc.body.content) {

        if (element.paragraph != null && element.endIndex - element.startIndex > 1) {
            for (ele of element.paragraph.elements) {
                try {
                    fontSizeSum+=ele.textRun.textStyle.fontSize.magnitude
                    textCount+=1
                } catch (e) {
                }
            }
        }

    }
    const averageFontSize=fontSizeSum/textCount

    for (let element of doc.body.content) {

        if (element.paragraph != null && element.endIndex - element.startIndex > 1) {
            let isBold = false
            let paragraphText = ""
            for (ele of element.paragraph.elements) {
                try {
                    if (ele.textRun.textStyle.bold == true && ele.textRun.textStyle.fontSize.magnitude>averageFontSize) {
                        isBold = true
                    }
                } catch (e) {
                }
                try {
                    paragraphText += ele.textRun.content
                } catch (e) {
                }
            }
            if (isBold) {
                if (section!=""){
                    sections.push({section: section, endIndex: endIndex})
                    const correctionSection = await getCorrectionSection()
                    await insertText(client,documentId,endIndex+pushCount-1,correctionSection)
                    pushCount+=(correctionSection.length+3)
                    section = ""
                }

            }
            section += paragraphText
            endIndex = element.endIndex
        }

    }
    if (section!=""){
        sections.push({section: section, endIndex: endIndex})
        const correctionSection = await getCorrectionSection()
        await insertText(client,documentId,endIndex+pushCount-1,correctionSection)
        pushCount+=(correctionSection.length+3)
    }

    for (section of sections) {
        console.log(section)
    }



}

async function getCorrectionSection(){
    return "여기가 첨삭된 부분"
}

const insertText = async (client,documentId,index,text) =>{
    const requests = [
        {
            insertText: {
                location: {
                    segmentId:"",
                    index: index, // 삽입될 위치의 시작 인덱스
                },
                text: `\n\n${text}\n`, // 텍스트와 줄바꿈 문자(\n)을 추가합니다.
            },
        },
    ];

    await client.documents.batchUpdate({
        documentId,
        requestBody: {
            requests,
        },
    });
}

// editSections()

module.exports = {
    getDocument,editSections,editTables
}

