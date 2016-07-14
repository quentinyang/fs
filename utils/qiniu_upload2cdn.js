var qiniu = require("qiniu");
var qiniuConfig = require('../config/qiniu');
var fs = require('fs');

// 需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = qiniuConfig.access;
qiniu.conf.SECRET_KEY = qiniuConfig.secret;

// 构建上传策略函数
function generateToken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

// 获取指定目录下所有文件
/**
 * Get all files.
 * @path string required. e.g.: public/
 * @return array
 */
function getAllFiles(path) {
    var files = [];

    function scanDir(path) {
        try{
            var info = fs.statSync(path);
            if (info.isDirectory()) {
                var dirInfo = fs.readdirSync(path);
                dirInfo.forEach(function(item, index, array) {
                    scanDir( path + '/' + item);
                });
            } else if (info.isFile()) {
                files.push(path);
            }

            return info;        
        }catch(e) {
            console.log('Error', e.message)
        }
    }

    console.log('Get path: ', path);
    scanDir(path.replace(/\/$/,''));

    return files;    
}

/**
 * 构造上传函数
 * @param params object
 *  Properties:
 *  - key string  required
 *  - file string required, local filepath
 *  - success function, success callback
 *  - error function, error callback
 * 
 */
function uploadFile(params) {
    var key = params.key;
    var token = generateToken(params.bucket, key);
    var localFile = params.file;

    var extra = new qiniu.io.PutExtra();

    qiniu.io.putFile(token, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log('Success', err, ret);
        params.success && params.success(ret, params);
      } else {
        // 上传失败， 处理返回代码
        console.log("Error", ret, err, params);
        params.error && params.error(ret, params);
      }
  });
}

/**
 * Upload all files from specified directory.
 * @param params object
 * Properties:
 *  - dir string required, directory path e.g.: 'deployments/master/app-site/public/'.
 *  - root string optional, e.g:  'app-site/'.
 *  - force boolean optional, default true. If set true, force to upload.
 * 
 * client.stat results:
 *  - error: { code: 612, error: 'no such file or directory' }
 *  - { fsize: 9, hash: 'Fo7JoAv9CbMZCsayIlHbsaqVoFed', mimeType: 'application/octet-stream', putTime: 14661367563592274 }
 */
function uploadDir(params) {
    var dirPath = params.dir;
    var rootDir = params.root || '/';
    var force = params.force === undefined ? true : params.force;
    var success = params.success;
    var error = params.error;

    var allFiles = getAllFiles(dirPath);

    // 要上传的空间
    var bucket = /app-bureau/.test(rootDir) ? qiniuConfig.bucketBureau : qiniuConfig.bucket;

    //构建bucketmanager对象
    var client = new qiniu.rs.Client();

    allFiles.forEach(function(localFile, index, arr) {
        var key = localFile.replace(dirPath, rootDir);

        console.log('To upload: ', key);
        client.stat(bucket, key, function(err, ret) {
            if (err || force == true) {
                uploadFile({
                    bucket: bucket,
                    key: key,
                    file: localFile,
                    success: success,
                    error: error
                });    
            }
        });
    });
}

module.exports = {
    uploadDir: uploadDir,
    getAllFiles: getAllFiles
}

