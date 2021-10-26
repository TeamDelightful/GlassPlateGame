var express = require('express');
var router = express.Router();

/* GET joingame page. */
router.get('/', function(req, res, next) {
  res.render('joingame');
});

module.exports = router;
