var qiniu = require("qiniu");
var qiniuConfig = require('../config/qiniu');
var fs = require('fs');

// 需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = qiniuConfig.access;
qiniu.conf.SECRET_KEY = qiniuConfig.secret;

// 要上传的空间
var bucket = qiniuConfig.bucket;

// 构建上传策略函数
function generateToken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

// 获取指定目录下所有文件
/**
 * Get all files.
 * @path string required.
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

    scanDir(path);

    return files;    
}

//构造上传函数
function uploadFile(token, key, localFile) {

    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log('Success', ret);
      } else {
        // 上传失败， 处理返回代码
        console.log("Error", localFile, err);
      }
  });
}

/**
 * Upload all files from specified directory.
 * @param string dirPath required  e.g.: 'deployments/master/app-site/public'.
 * @param string rootDir optional e.g:  'app-site'.
 * @param boolean force optional e.g.: true. If set true, force to upload.
 * client.stat results:
 *  - error: { code: 612, error: 'no such file or directory' }
 *  - { fsize: 9, hash: 'Fo7JoAv9CbMZCsayIlHbsaqVoFed', mimeType: 'application/octet-stream', putTime: 14661367563592274 }
 */
function uploadDir(dirPath, rootDir, force) {
    var allFiles = getAllFiles(dirPath);
    var rootDir = rootDir || '';

    //构建bucketmanager对象
    var client = new qiniu.rs.Client();

    allFiles.forEach(function(localFile, index, arr) {
        var key = localFile.replace(dirPath, rootDir);
        var token = generateToken(bucket, key);

        client.stat(bucket, key, function(err, ret) {
            if (err || force == true) {
                uploadFile(token, key, localFile);    
            }
        });
    });
}

module.exports = {
    uploadDir: uploadDir
}

