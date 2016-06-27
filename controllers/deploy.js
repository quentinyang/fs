var deployTool = require('../bin/deploy');
var destDir = 'deployments/';
var repositoryBuildConfig = require('../config/gitrepository');
var fs = require('fs');

var versionModel = require('../models/version');
var qiniuUpload = require('../utils/qiniu_upload2cdn');

function index(req, res, next) {
    res.render('deploy', { title: '前端服务化部署(Frontend Servation Deploy)' });
}

function _formatParams(req) {
    var params = req.body;
    
    params.repository = (params.platform == 'retrx-mgt') 
                                        ? repositoryBuildConfig.repository['retrx-mgt']
                                        : repositoryBuildConfig.repository.angejia;

    return params;
}

function create(req, res, next) {
    
    var params = _formatParams(req);    

    if (! params.repository || ! params.branch || ! params.deployment || ! params.platform) {
        res.status(400).send("Parameter Error: " + JSON.stringify(params));
        return;
    }

    console.log('Post Parameter: \n', params);
    deployTool.create(params.repository, params.branch, params.deployment, params.platform, destDir, function (rep, bra, dep, pla, des) {
        var ufaConfig = repositoryBuildConfig[pla];
        ufaConfig.debug = false;
        deployTool.rebuild(rep, bra, dep, pla, des, ufaConfig);
    });

    res.send(params);
}

function update(req, res, next) {
    res.send(200);
}

function rebuild(req, res, next) {

    var params = _formatParams(req);    

    if (! params.repository || ! params.branch || ! params.deployment || ! params.platform) {
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

    res.send([])
}

function deployments(req, res, next) {
    var params = req.params;
    versionModel.getDeployments(params, function(err, rows, fields) {
        res.send(rows);
    });
}

function renderDeployments(req, res, next) {
    var params = req.params;
    versionModel.getDeployments(params, function(err, rows, fields) {
        res.render('partails/deploy_list', {data: rows});
    });
}

module.exports = {
    index: index,
    deployments: deployments,
    renderDeployments: renderDeployments,
    create: create,
    update: update,
    rebuild: rebuild,
    getManifest: getManifest,
    upload2cdn: upload2cdn
};