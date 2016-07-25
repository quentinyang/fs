var pool = require('../mysql');


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
 */
function create(data) {
    var author = 0;
    var datetime = current();
    var sql = "INSERT INTO fs_version (`repository`,`deployment`,`platform`,`branch`,`version`,`author`,`created`,`updated`,`desc`)" + 
                    `VALUES ("${data.repository}","${data.deployment}", "${data.platform}", "${data.branch}", "", ${author}, "${datetime}", "${datetime}", "")`;
    console.log(sql);
    pool.query(sql, function(err, rows, fields) {
        if (! err) {

        }
        
    });
    console.log('create over');
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

// 根据id更新status值
function updateStatusById(id, status) {
    var datetime = current();
    var sql = `UPDATE fs_version SET status=${status} WHERE id=${id}`;
    pool.query(sql, function(err, rows, fields) {
        if (! err) {
        }
        
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

function getDeploymentById(id, callback) {

    var sql = `SELECT * FROM fs_version WHERE id=${id}`;
    return pool.query(sql, function(err, rows, fields) {
    
        if (! err) {
            console.log(rows);
            callback && callback(err, rows, fields);
        }

    });

}

module.exports = {
    create: create,
    update: update,
    remove: remove,
    getDeployments: getDeployments,
    getDeploymentById: getDeploymentById
}