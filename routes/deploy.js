var express = require('express');
var router = express.Router();
var deployCtrl = require('../controllers/deploy');

/* GET deploy index. */
router.get('/', deployCtrl.index);

// 获取指定平台和部署环境的manifest
router.get('/manifest/latest/:platform/:deployment/:branch', deployCtrl.getManifest);
// 获取部署列表
router.get('/list', deployCtrl.deployments);
// 获取部署列表html
router.get('/list.html', deployCtrl.renderDeployments);

// 创建部署
router.post('/repository/create', deployCtrl.create);
// 更新部署
router.post('/repository/update', deployCtrl.update);
// 重新部署
router.post('/repository/rebuild', deployCtrl.rebuild);

// 上传到CDN
router.post('/repository/upload2cdn/:platform', deployCtrl.upload2cdn)

/* 外部部署需要用到的API */
// 快速发布
router.post('/publish/:platform/:branch', deployCtrl.publish);
// 获取部署ID对应的manifest文件内容
router.get('/publish/:id', deployCtrl.detail);
// TODO::可能并不需要
router.get('/publish/manifest/:id', deployCtrl.getManifestById);

module.exports = router;
