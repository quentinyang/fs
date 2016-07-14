var deployTool = require('../bin/deploy');
var destDir = 'deployments/';
var repositoryBuildConfig = require('../config/gitrepository');
var fs = require('fs');

var versionModel = require('../models/version');
var qiniuUpload = require('../utils/qiniu_upload2cdn');

var versionModel = require('../models/version');

// 首页
function index(req, res, next) {
    res.render('deploy', {title: '前端服务化部署(Frontend Servation Deploy)'});
}

function _formatParams(req) {
    var params = req.body;

    params.destDir = destDir;
    params.repository = (params.platform == 'retrx-mgt') 
                                        ? repositoryBuildConfig.repository['retrx-mgt']
                                        : repositoryBuildConfig.repository.angejia;

    return params;
}

// 快捷部署，包含create, npm install, gulp-ufa, upload cdn, db log.
function publish(req, res, next) {
    var params = req.params || {};
    var platform = params.platform;
    var branch = params.branch || 'master';

    switch(platform) {
        case 'angejia':
        case 'app-site':
        case 'app-crm':
        case 'app-bureau':
        case 'app-platform':
            _publish('app-site', branch, function(params) {
                
                deployTool.rebuild((function(params){
                    var ufaConfig = repositoryBuildConfig['app-crm'];
                    ufaConfig.debug = false;
                    return {
                        repository: params.repository,
                        branch: params.branch,
                        deployment: params.deployment,
                        platform: 'app-crm',
                        destDir: params.destDir,
                        ufaConfig: ufaConfig,
                        success: function(params) {
                            console.log('_publish-crm', params);
                            upload2Qiniu({
                                platform: 'app-crm',
                                error: function(err, ret) {
                                    versionModel.update({
                                        repository: params.repository,
                                        branch: params.branch, 
                                        platform: 'app-crm',
                                        deployment: params.deployment,
                                        status: 0
                                    });
                                }
                            });
                        }
                    };
                })(params));

                deployTool.rebuild((function(params){
                    var ufaConfig = repositoryBuildConfig['app-bureau'];
                    ufaConfig.debug = false;
                    return {
                        repository: params.repository,
                        branch: params.branch,
                        deployment: params.deployment,
                        platform: 'app-bureau',
                        destDir: params.destDir,
                        ufaConfig: ufaConfig,
                        success: function(params) {
                            console.log('_publish-bureau', params);
                            upload2Qiniu({
                                platform: 'app-bureau',
                                error: function(err, ret) {
                                    versionModel.update({
                                        repository: params.repository,
                                        branch: params.branch, 
                                        platform: 'app-bureau',
                                        deployment: params.deployment,
                                        status: 0
                                    });
                                }
                            });
                        }
                    };
                })(params));

                deployTool.rebuild((function(params){
                    var ufaConfig = repositoryBuildConfig['app-platform'];
                    ufaConfig.debug = false;
                    return {
                        repository: params.repository,
                        branch: params.branch,
                        deployment: params.deployment,
                        platform: 'app-platform',
                        destDir: params.destDir,
                        ufaConfig: ufaConfig,
                        success: function(params) {
                            console.log('_publish-platform', params);
                            upload2Qiniu({
                                    platform: 'app-platform',
                                    error: function(err, ret) {
                                        versionModel.update({
                                            repository: params.repository,
                                            branch: params.branch, 
                                            platform: 'app-platform',
                                            deployment: params.deployment,
                                            status: 0
                                        });
                                    }
                            });
                        }
                    };
                })(params));
            });
            break;
        case 'retrx-mgt':
        default:
            _publish(platform, branch);
            break;
    }

    res.send(params);

}

function _publish(platform, branch, callback) {

        var success = function (params) {

            deployTool.rebuild((function(params){
                var ufaConfig = repositoryBuildConfig[params.platform];
                ufaConfig.debug = false;
                return {
                    repository: params.repository,
                    branch: params.branch,
                    deployment: params.deployment,
                    platform: params.platform,
                    destDir: params.destDir,
                    ufaConfig: ufaConfig,
                    success: function() {
                        console.log('_publish', params);
                        upload2Qiniu({
                            platform: params.platform,
                            error: function(err, ret) {
                                versionModel.update({
                                    repository: params.repository,
                                    branch: params.branch, 
                                    platform: params.platform,
                                    deployment: params.deployment,
                                    status: 0
                                });
                            }
                        });
                    }
                };
            })(params));

            callback && callback(params);
        };

        deployTool.create({
            repository: repositoryBuildConfig.repository[platform == 'retrx-mgt' ? platform : 'angejia'],
            branch: branch,
            deployment: 'production',
            platform: platform,
            destDir: destDir,
            success: success
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
        res.send(require('../' + manifestPath));
        return;
    }
    res.status(404).send([]);
}

function upload2Qiniu(params) {
    var deployment = params.deployment || 'production';
    var platform = params.platform;
    var combinedPath = platform;
    var uploadDir = 'public/'

    if (repositoryBuildConfig[platform] && repositoryBuildConfig[platform].middlePath) {
        combinedPath = repositoryBuildConfig[platform].middlePath + '/' + platform;
        uploadDir = repositoryBuildConfig[platform].dest;
    }

    var dir = 'deployments/master/' + deployment + '/' + combinedPath + '/' + uploadDir;
    var rootDir = platform + '/dist/';
    var force = false;

    qiniuUpload.uploadDir({dir: dir, root: rootDir, force: force, success: params.success, error: params.error});

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

module.exports = {
    index: index,
    deployments: deployments,
    renderDeployments: renderDeployments,
    publish: publish,
    create: create,
    update: update,
    rebuild: rebuild,
    getManifest: getManifest,
    upload2cdn: upload2cdn
};