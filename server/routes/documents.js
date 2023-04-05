var express = require('express');
const {insertGuideDocuments, insertWrittenDocument} = require("../service/documentService");
var router = express.Router();


router.post('/guide', async function(req, res, next) {
  try {
    const {files} = req.body;
    const {sessionID} = req
    console.log(sessionID)
    await insertGuideDocuments(sessionID,files)
    res.send('respond with a resource');
  }catch (e){
    console.log(e)
  }

});

router.post('/written', async function(req, res, next) {
  try {
    const {file} = req.body;
    const {sessionID} = req
    console.log(sessionID)
    await insertWrittenDocument(sessionID,file)
    res.send('respond with a resource');
  }catch (e){
    console.log(e)
  }

});

module.exports = router;
