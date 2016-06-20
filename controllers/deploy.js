var deployTool = require('../bin/deploy');
var destDir = 'deployments/';
var repositoryBuildConfig = require('../config/gitrepository');
var fs = require('fs');
var pool = require('../mysql');

var qiniuUpload = require('../utils/qiniu_upload2cdn');

function deploy() {
    pool.query('SELECT * FROM fs_version', function(err, rows, fields) {
        console.log('MYSQL');
        
        console.log('The solution is: ', rows);
    });
}

function index(req, res, next) {
  res.render('deploy', { title: '前端服务化部署(Frontend Servation Deploy)' });
}

function create(req, res, next) {
    var params = req.body;

    if (! params.repository || ! params.branch || ! params.deployment || !params.platform) {
        res.status(400).send("Parameter Error: " + JSON.stringify(params));
        return;
    }

    console.log('Post Parameter: \n', params);
    deployTool.create(params.repository, params.branch, params.deployment, params.platform, destDir);

    res.send(params);
}

function update(req, res, next) {
    res.send(200);
}

function rebuild(req, res, next) {

    var params = req.body;

    if (! params.repository || ! params.branch || ! params.deployment || !params.platform) {
        res.status(400).send("Parameter Error: " + JSON.stringify(params));
        return;
    }

    var ufaConfig = repositoryBuildConfig[params.platform];

    ufaConfig.debug = params.debug ? (params.debug.toString() == "true") : false;

    console.log('Post Parameter: \n', params, ufaConfig);

    deployTool.rebuild(params.repository, params.branch, params.deployment, params.platform, destDir, ufaConfig);

    res.send({params: params, ufa: ufaConfig});

}

function getManifest(req, res, next) {

    var params = req.params;
    var platform = params.platform;
    var deployment = params.deployment || 'production';
    var combinedPath = platform;
    if (repositoryBuildConfig[platform] && repositoryBuildConfig[platform].middlePath) {
        combinedPath = repositoryBuildConfig[platform].middlePath + '/' + platform;
    }

    var manifestPath = 'deployments/master/' + deployment + '/' + combinedPath + '/storage/assets/manifest.json';

    if (fs.existsSync(manifestPath)) {
        res.send(require('../' + manifestPath));
        return;
    }
    res.status(404).send([]);
}

function upload2cdn (req, res, next) {
    var params = req.params;
    var platform = params.platform;
    var deployment = 'production';

    var combinedPath = platform;
    if (repositoryBuildConfig[platform] && repositoryBuildConfig[platform].middlePath) {
        combinedPath = repositoryBuildConfig[platform].middlePath + '/' + platform;
    }

    var dir = 'deployments/master/' + deployment + '/' + combinedPath + '/public';
    var root = platform;
    var force = false;

    qiniuUpload.uploadDir(dir, root, force);

    res.send(200)
}

module.exports = {
    index: index,
    deploy: deploy,
    create: create,
    update: update,
    rebuild: rebuild,
    getManifest: getManifest,
    upload2cdn: upload2cdn
};