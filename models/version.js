var pool = require('../mysql');

var Promise = require('bluebird');
const DEPLOY_STATUS_INIT = 0;

function current() {
    var datetime = new Date();

    var year = _format(datetime.getFullYear());
    var month = _format(datetime.getMonth() + 1);
    var day = _format(datetime.getDate());
    var h = _format(datetime.getHours());
    var m = _format(datetime.getMinutes());
    var s = _format(datetime.getSeconds());
    var ms = _format(datetime.getMilliseconds());
    var q = _format(Math.floor((datetime.getMonth() + 3) / 3));

    function _format(d) {
        return d<10 ? `0${d}` : d;
    }

    return `${year}-${month}-${day} ${h}:${m}:${s}`;
}

/**
 * Create version
 * @param object data
 *      properties:
 *      - repository
 *      - deployment
 *      - platform
 *      - branch
 * @return Promise
 *  - resolve(id)
 */
function create(data) {
    var author = 0;
    var datetime = current();
    var status = DEPLOY_STATUS_INIT;
    var sql = "INSERT INTO fs_version (`repository`,`deployment`,`platform`,`branch`,`version`,`author`,`created`,`updated`,`status`,`desc`)" + 
                    `VALUES ("${data.repository}","${data.deployment}", "${data.platform}", "${data.branch}", "", ${author}, "${datetime}", "${datetime}", ${status}, "")`;
    console.log(sql);
    
    return new Promise((resolve, reject) => {
        pool.query(sql, function(err, rows, fields) {
            console.log('Rows id', rows.insertId);
            if (! err) {
                resolve(rows.insertId);
                console.log('Create a new version: ', rows.insertId);
            } else {
                reject({sql: sql, params: data});
            }
        });
    })
}

/** 
 * Update status
 * @param object data
 *      - status Int
 *      - deployment String
 *      - platform String
 *      - branch String
 */
function update(data) {
    var datetime = current();
    var sql = `UPDATE fs_version SET status=${data.status}, updated="${datetime}" WHERE deployment="${data.deployment}" 
                    AND platform="${data.platform}" AND  branch="${data.branch}" ORDER BY created DESC LIMIT 1`;
    console.log(sql);
    pool.query(sql, function(err, rows, fields) {
        if (! err) {
        }
        
    });
    console.log('update over');
}

/**
 *  根据id更新status值
 * @param data required object
 *  - `id` required int
 *  - `status` required int
 *      - 0: init database
 *      - 1: created repository success
 *      - 2: builded repository success (generated Manifest.json file)
 *      - 3: upload to CDN success
 */
function updateStatusById(data) {
    var datetime = current();
    var sql = `UPDATE fs_version SET status=${data.status}, updated="${datetime}" WHERE id=${data.id}`;
    return new Promise((resolve, reject) => {
        pool.query(sql, function(err, rows, fields) {
            if (! err) {
            }
            resolve(data);
        });
    });
}

function remove(id, callback) {
    var sql = `delete from fs_version where id="${id}"`;
    pool.query(sql, function(err, rows, fields) {
        if (! err) {
            callback && callback(err, rows, fields);
        }
    });
}

function getDeployments(params, callback) {
    var offset = params.offset || 0;
    var limit = params.limit || 20;

    var sql = `select id, repository,deployment,branch,platform,created,updated,status
                    from (select * from fs_version order by updated desc) a
                    group by platform
                    order by updated desc limit ${limit} offset ${offset}`;
    
    pool.query(sql, function(err, rows, fields) {
    
        if (! err) {
            callback && callback(err, rows, fields);
        }

    });
}

function getDeploymentById(id) {

    return new Promise(function(resolve, reject) {
        var sql = `SELECT * FROM fs_version WHERE id=${id} LIMIT 1`;
        pool.query(sql, function(err, rows, fields) {
            if (! err) {
                resolve(rows)
            } else {
                reject({err: err, rows: rows, fields: fields})
            }

        });
    })

}

function setManifest(data) {
    var datetime = current();
    var deployId = data.id;
    return new Promise(function(resolve, reject) {
        var sql = `INSERT INTO fs_manifest (version_id, manifest, created, updated)
                        VALUES (${deployId}, "${manifest}", "${datetime}", "${datetime}")`;
        pool.query(sql, function(err, rows, fields) {
            if (! err) {
                resolve(rows)
            } else {
                reject({err: err, rows: rows, fields: fields})
            }

        });
    })
}

function getManifestByDeployId(id) {
    //TODO
}

module.exports = {
    create: create,
    update: update,
    updateStatusById: updateStatusById,
    remove: remove,
    getDeployments: getDeployments,
    getDeploymentById: getDeploymentById,

    // manifest
    setManifest: setManifest,
    getManifest: getManifestByDeployId
}