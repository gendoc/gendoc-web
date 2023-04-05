var express = require('express');
const client = require("../db/postgresqlClient");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {

  console.log(req.sessionID)
  res.render('index', { title: 'Express' });
});

module.exports = router;
