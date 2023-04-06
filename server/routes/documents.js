var express = require('express');
const {insertGuideDocuments, insertWrittenDocument, findGuideDocuments, findWrittenDocuments, insertNoticeDocument,
  findNoticeDocuments
} = require("../service/documentService");
var router = express.Router();


router.post('/guide', async function(req, res, next) {
  try {
    const {files,projectId} = req.body;
    const {sessionID} = req
    console.log(sessionID)
    await insertGuideDocuments(sessionID,files,projectId)
    res.send('respond with a resource');
  }catch (e){
    console.log(e)
  }

});

router.post('/notice', async function(req, res, next) {
  try {
    const {file,projectId} = req.body;
    const {sessionID} = req
    console.log(sessionID)
    await insertNoticeDocument(sessionID,file,projectId)
    res.send('respond with a resource');
  }catch (e){
    console.log(e)
  }

});


router.post('/written', async function(req, res, next) {
  try {
    const {file,projectId} = req.body;
    const {sessionID} = req
    console.log(sessionID)
    await insertWrittenDocument(sessionID,file,projectId)
    res.send('respond with a resource');
  }catch (e){
    console.log(e)
  }

});

router.get('/guide/:projectId', async function(req, res, next) {
  try {
    const {sessionID} = req
    const {projectId} = req.params;
    console.log(sessionID)
    const docs = await findGuideDocuments(sessionID,projectId);

    res.send(JSON.stringify({documents:docs}));
  }catch (e){
    console.log(e)
  }

});

router.get('/notice/:projectId', async function(req, res, next) {
  try {
    const {sessionID} = req
    const {projectId} = req.params;
    console.log(sessionID)
    const docs = await findNoticeDocuments(sessionID,projectId);

    res.send(JSON.stringify({documents:docs}));
  }catch (e){
    console.log(e)
  }

});

router.get('/written/:projectId', async function(req, res, next) {
  try {
    const {sessionID} = req
    const {projectId} = req.params;
    console.log(sessionID)
    const docs = await findWrittenDocuments(sessionID,projectId);

    res.send(JSON.stringify({documents:docs}));
  }catch (e){
    console.log(e)
  }

});

module.exports = router;
