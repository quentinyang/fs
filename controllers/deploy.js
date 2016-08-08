var fs = require('fs');
var Promise = require('bluebird');
var deploy =  Promise.promisifyAll(require('../bin/deploy'))

var deployTool = require('../bin/deploy');
var destDir = 'deployments/';
var repositoryBuildConfig = require('../config/gitrepository');

var versionModel = require('../models/version');
var qiniuUpload = require('../utils/qiniu_upload2cdn');

// 首页
function index(req, res, next) {
    res.render('deploy', {title: '前端服务化部署(Frontend Servation Deploy)'});
}

function _formatParams(req) {
    var params = req.body;

    params.destDir = destDir;// Global
    params.repository = _getRepositoryByPlatform(params.platform);

    return params;
}

/**
 * 根据平台获取仓库地址
 * @param platform string. 'app-site', 'retrx-mgt', 'angejia'
 * @dependence: Global `repositoryBuildConfig`
 * @return strings
 */
function _getRepositoryByPlatform(platform) {
    var index;
    switch(platform) {
        case 'app-site':
        case 'app-crm':
        case 'app-bureau':
        case 'app-platform':
            index = 'angejia';
            break;
        default:
            index = platform;
            break;
    }
    return repositoryBuildConfig.repository[index];
}

// 快捷部署，包含create, npm install, gulp-ufa, upload cdn, db log.
function publish(req, res, next) {
    var params = req.params || {};
    var platform = params.platform;
    var branch = params.branch || 'master';

    // 先拿到deploy id返回
    // create database data for deploy id
    var deploy = deployTool.createDeployLog({
            repository: _getRepositoryByPlatform(platform),
            branch: branch,
            deployment: 'production',
            platform: platform,
            destDir: destDir
    }).then((params) => {
            // send response to client immediately with deploy id.
            res.send(params);
            // 返回参数，以便后续使用
            return Promise.resolve(params);
    });

    switch(platform) {
        case 'angejia':
        case 'app-site':
        case 'app-crm':
        case 'app-bureau':
        case 'app-platform':
            deploy.then((params) => {
                console.log('==========Start: app-site, Last Params: ==========', params)
                params.platform = 'app-site';
                return _deployWorkFlow(params);
            }).then((params) => {
                console.log('==========Start: app-crm, Last Params: ==========', params)
                params.platform = 'app-crm';
                return _deployWorkFlow(params);
            }).then((params) => {
                console.log('==========Start: app-bureau, Last Params: ==========', params)
                params.platform = 'app-bureau';
                return _deployWorkFlow(params);
            }).then((params) => {
                console.log('==========Start: app-platform, Last Params: ==========', params)
                params.platform = 'app-platform';
                return _deployWorkFlow(params);
            }).then((params) => {
                versionModel.updateStatusById({id: params.id, status: 3});
            });
            break;
        case 'retrx-mgt':
        default:
            deploy.then((params) => {
                return _deployWorkFlow(params);
            }).then((params) => {
                versionModel.updateStatusById({id: params.id, status: 3});
            });
            break;
    }

}

function _deployWorkFlow(params) {
    console.log('Deploy work flow: ', params);

    return deployTool.create(params).then((params) => {

                // build this repository
                var ufaConfig = repositoryBuildConfig[params.platform];
                ufaConfig.debug = false;
                params.ufaConfig = ufaConfig;

                return deployTool.rebuild(params).then((params) => {
                        console.log('Upload to QiNiu: ', params);
                        return new Promise((solve, reject) => {
                            upload2Qiniu({
                                platform: params.platform
                            });

                            solve(params);
                        });

                });

    });
}

function create(req, res, next) {
    
    var params = _formatParams(req);    

    if (! params.repository || ! params.branch || ! params.deployment || ! params.platform) {
        res.status(400).send("Parameter Error: " + JSON.stringify(params));
        return;
    }

    console.log('Post Parameter: \n', params);
    params.success = function (params) {
        var ufaConfig = repositoryBuildConfig[params.platform];
        ufaConfig.debug = false;
        params.ufaConfig = ufaConfig;
        delete params.success;
        deployTool.rebuild(params);
    };
    
    deployTool.create(params);

    res.send(params);
}

function update(req, res, next) {
    // TODO::update
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

    params.ufaConfig = ufaConfig;

    console.log('Post Parameter: \n', params);

    deployTool.rebuild(params);

    res.send({params: params, ufa: ufaConfig});

}

function getManifest(req, res, next) {
    var params = req.params;
    var platform = params.platform;
    var deployment = params.deployment || 'production';
    var branch = params.branch || 'master';
    var combinedPath = platform;
    if (repositoryBuildConfig[platform] && repositoryBuildConfig[platform].middlePath) {
        combinedPath = repositoryBuildConfig[platform].middlePath + '/' + platform;
    }

    var manifestPath = `deployments/${branch}/${deployment}/${combinedPath}/storage/assets/manifest.json`;
    console.log(manifestPath);

    if (fs.existsSync(manifestPath)) {
        var jsonContent = fs.readFileSync(manifestPath).toString();
        res.send(JSON.parse(jsonContent));
        // res.send(require('../' + manifestPath));
        return;
    }
    res.status(404).send([]);
}

function upload2Qiniu(params) {
    var deployment = params.deployment || 'production';
    var platform = params.platform;
    var combinedPath = platform;
    var uploadDir = 'public/';

    if (repositoryBuildConfig[platform]) {

        if (repositoryBuildConfig[platform].middlePath) {
            combinedPath = repositoryBuildConfig[platform].middlePath + '/' + platform;
        }
        
        uploadDir = repositoryBuildConfig[platform].dest;

    }

    var dir = 'deployments/master/' + deployment + '/' + combinedPath + '/' + uploadDir;
    var rootDir = platform + '/dist/';
    var force = false;

    var uploadParams = {dir: dir, root: rootDir, force: force, success: params.success, error: params.error};
    console.log('Upload to Qiniu parameters:', uploadParams);
    qiniuUpload.uploadDir(uploadParams);

}

function upload2cdn (req, res, next) {
    var params = req.params;

    upload2Qiniu({platform: params.platform});

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

/**
 * 获取部署详情
 */
function detail(req, res, next) {
    var id = req.params.id;

    versionModel.getDeploymentById(id).then((data) => {
        if (data.length > 0) {
            res.send(data[0]);
            return;
        }
        res.status(404).send({});
        
    });
}

function getManifestById(req, res, next) {
    var id = req.params.id;

    // get detail
    versionModel.getDeploymentById(id).then(function(data) {
        console.log(data)
        var platform = data.platform;
        var branch = data.branch;
    });

}

module.exports = {
    index: index,
    deployments: deployments,
    renderDeployments: renderDeployments,
    publish: publish,
    detail: detail,
    create: create,
    update: update,
    rebuild: rebuild,
    getManifest: getManifest,
    getManifestById: getManifestById,
    upload2cdn: upload2cdn
};