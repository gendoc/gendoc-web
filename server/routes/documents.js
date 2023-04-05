var express = require('express');
const {insertGuideDocuments} = require("../service/documentService");
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

module.exports = router;
