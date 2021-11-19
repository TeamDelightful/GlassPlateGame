var express = require('express');
var router = express.Router();

/* GET game page. */
router.get('/', function(req, res, next) {
  res.render('header');
});

module.exports = router;
