var express = require('express');
var router = express.Router();
var deployCtrl = require('../controllers/deploy');

/* GET deploy index. */
router.get('/', function(req, res, next) {
  res.render('deploy', { title: '前端服务化部署(Frontend Servation Deploy)' });
});


router.get('/manifest/latest/:platform/:deployment', deployCtrl.getManifest);

router.post('/repository/create', deployCtrl.create);
router.post('/repository/update', deployCtrl.update);
router.post('/repository/rebuild', deployCtrl.rebuild);

router.post('/repository/upload2cdn/:platform', deployCtrl.upload2cdn)

module.exports = router;
