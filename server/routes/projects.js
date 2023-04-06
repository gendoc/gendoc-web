var express = require('express');
const {insertProject, findProjects} = require("../service/projectService");

var router = express.Router();


router.post('/', async function(req, res, next) {
  try {
    const {projectName} = req.body;
    const {sessionID} = req
    console.log(sessionID)
    const projectId = await insertProject(sessionID,projectName);
    res.send(JSON.stringify({projectId:projectId}));
  }catch (e){
    console.log(e)
  }

});

router.get('/', async function(req, res, next) {
  try {
    const {sessionID} = req
    console.log(sessionID)
    const projects = await findProjects(sessionID);

    res.send(JSON.stringify({projects:projects}));
  }catch (e){
    console.log(e)
  }

});


module.exports = router;
