var express = require('express');
var router = express.Router();

/* GET creategame page. */
router.get('/', function(req, res, next) {
  res.render('creategame');
});

module.exports = router;
