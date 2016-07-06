var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: '前端服务化平台（FS）'});
});

module.exports = router;
