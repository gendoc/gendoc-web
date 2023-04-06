var express = require('express');
const {insertProject} = require("../service/projectService");

var router = express.Router();


router.post('/', async function(req, res, next) {
  try {
    const {files} = req.body;
    const {sessionID} = req
    console.log(sessionID)
    const projectId = await insertProject(sessionID);
    res.send(JSON.stringify({projectId:projectId}));
  }catch (e){
    console.log(e)
  }

});


module.exports = router;
