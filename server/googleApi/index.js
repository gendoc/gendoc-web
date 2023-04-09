const path = require('path');
const process = require('process');
const docs = require('@googleapis/docs')
const {google} = require('googleapis');
const auth = new google.auth.OAuth2();
const fs = require('fs');
const {proofRead} = require("../service/nlpService");


const getDocument = async (accessToken, documentId) => {

    auth.setCredentials({access_token: accessToken});
    const client = await google.docs({version: 'v1', auth});
    const res = await client.documents.get({
        documentId: documentId,
    });
    return res.data

}

const getTargetTables = async (accessToken, documentId) => {

    auth.setCredentials({access_token: accessToken});
    const client = await google.docs({version: 'v1', auth});
    const doc = await getDocument(accessToken, documentId);


    let section = ""
    let endIndex = 1
    let documentPushCount = 0
    const targetTables = []

    for (let [index, element] of doc.body.content.entries()) {

        if (element.table != null) {
            let tableContent = ""
            let tablePushCount = 0
            for (tableRow of element.table.tableRows) {
                for (tableCell of tableRow.tableCells) {

                    for (content of tableCell.content) {
                        if (content.paragraph != null) {
                            for (ele of content.paragraph.elements) {
                                try {
                                    // tableContent += ele.textRun.content.replace("\n", "")
                                    tableContent += ele.textRun.content
                                } catch (e) {
                                }
                            }
                        }
                    }


                    // tableContent += "\n"
                }
            }

            // console.log(tableRow.endIndex)
            // console.log(tableContent)
            // console.log("--------------------------------------------")
            targetTables.push(tableContent)

        }

    }
    return targetTables
}
// getTargetTables("ya29.a0Ael9sCNEkn8XanGMFns36LeftONileis_lqHnvkbZt9FbvZKRPuBWT2P2CyfBroXMwoYLwKR-u1yX1zS9YBGJYnVbh6WLxcmsoGzgxtaQYJGMoI6wnbiy1I2PZz5dTzSIPo92bpnBdSlwaNKBb-CBiVUctijaCgYKAUwSARASFQF4udJhcKTa-sg_5CxspdzVmJCLaQ0163",
//     "1r_f9zXwkIfKJbi3u8cDqQv-lQeGpATJnus2QaFkV98M")
const editTables = async (accessToken, documentId, nlpSessionId) => {
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

            for (tableRow of element.table.tableRows) {
                for (tableCell of tableRow.tableCells) {
                    for (content of tableCell.content) {
                        if (content.paragraph != null) {
                            for (ele of content.paragraph.elements) {
                                try {
                                    // tableContent += ele.textRun.content.replace("\n", "")
                                    tableContent += ele.textRun.content
                                } catch (e) {
                                }
                            }
                        }
                    }

                    // tableContent += "\n"
                }
            }

            const tableStartIndex = element.table.tableRows[0].startIndex
            // console.log(tableRow.endIndex)
            // console.log(tableContent)
            // console.log("--------------------------------------------")
            // [Fix(id='fa754002c341c3cb', original_value='이것저것사업', new_value='', reference='제조, 지식서비스, 융합 중 하나만 선택해야 합니다.', location=-1)]
            const correctionSections = await getCorrectionSections("TABLE", tableContent, tableStartIndex, nlpSessionId)
            for (let correctionSection of correctionSections) {
                await insertText(client, documentId, correctionSection.location + documentPushCount + 2, correctionSection.new_value)
                documentPushCount += (correctionSection.new_value.length + 3)
            }


        }


    }
}

// editTables("ya29.a0Ael9sCOj4CDD78iky3OW8bAlcgLIfC6hvgYmRPETQPlGE8X3mZAv2tfuyzH_LwCSTdSpkg4coDZP-AUio-6U9FntrxVFmc8GIbmKJ8BeQ_pI0icpditNz6i_gVRH7mif-6mtgiP4rkQKzHYLOGFIKFE_xLrPAwaCgYKAcsSARASFQF4udJhxSJJvguiJVy0YS48P8NF7A0165",
//     "1r_f9zXwkIfKJbi3u8cDqQv-lQeGpATJnus2QaFkV98M")

const editSections = async (accessToken, documentId, nlpSessionId) => {
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
                    fontSizeSum += ele.textRun.textStyle.fontSize.magnitude
                    textCount += 1
                } catch (e) {
                }
            }
        }

    }
    const averageFontSize = fontSizeSum / textCount

    for (let element of doc.body.content) {

        if (element.paragraph != null && element.endIndex - element.startIndex > 1) {
            let isBold = false
            let paragraphText = ""
            for (ele of element.paragraph.elements) {
                try {
                    if (ele.textRun.textStyle.bold == true && ele.textRun.textStyle.fontSize.magnitude > averageFontSize) {
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
                if (section != "") {
                    sections.push({section: section, endIndex: endIndex})
                    const correctionSection = await getCorrectionSections()
                    await insertText(client, documentId, endIndex + pushCount - 1, correctionSection)
                    pushCount += (correctionSection.length + 3)
                    section = ""
                }

            }
            section += paragraphText
            endIndex = element.endIndex
        }

    }
    if (section != "") {
        sections.push({section: section, endIndex: endIndex})
        const correctionSection = await getCorrectionSections()
        await insertText(client, documentId, endIndex + pushCount - 1, correctionSection)
        pushCount += (correctionSection.length + 3)
    }

    for (section of sections) {
        console.log(section)
    }


}


// # {
// #   "section_type": "PARAGRAPH", // ["PARAGRAPH","TABLE"] 둘 중 하나
// #   "contents": "문단 혹은 테이블 내용",
// #   "start_index": 123, // 문단 or 테이블 시작인덱스
// #   "session_id": "session_id"
// # }
// [Fix(id='fa754002c341c3cb', original_value='이것저것사업', new_value='', reference='제조, 지식서비스, 융합 중 하나만 선택해야 합니다.', location=-1)]
async function getCorrectionSections(sectionType, contents, startIndex, nlpSessionId) {
    const request = {section_type: sectionType, contents: contents, start_index: startIndex, session_id: nlpSessionId}
    return await proofRead(request)
}

const insertText = async (client, documentId, index, text) => {
    const requests = [
        {
            insertText: {
                location: {
                    segmentId: "",
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
    getDocument, editSections, editTables, getTargetTables,
}

