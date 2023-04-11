var express = require('express');
const {updateAccessToken} = require("../service/accountService");
var router = express.Router();

/* GET users listing. */
router.patch('/access-token', async function(req, res, next) {
  const {accessToken} = req.body;
  const {sessionID} = req
  console.log("patch token: "+accessToken)
  await updateAccessToken(sessionID,accessToken)
  res.send('respond with a resource');
});

module.exports = router;
