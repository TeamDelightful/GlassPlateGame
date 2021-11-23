var express = require('express');
var router = express.Router();

/* GET host page. */
router.get('/', function(req, res, next) {
  res.render('host');
});

module.exports = router;
