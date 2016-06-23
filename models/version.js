var pool = require('../mysql');

function create(data) {
    var author = 0;
    var datetime = new Date().toLocaleString('zh-cn', {hour12: false});
    var sql = "INSERT INTO fs_version (`deployment`,`platform`,`branch`,`version`,`author`,`created`,`updated`,`desc`)" + 
                    `VALUES ("${data.deployment}", "${data.platform}", "${data.branch}", "", ${author}, "${datetime}", "${datetime}", "")`;
    console.log(sql);
    pool.query(sql, function(err, rows, fields) {
        if (! err) {

        }
        
    });
    console.log('create over');
}

function update(data) {
    var datetime = new Date().toLocaleString('zh-cn', {hour12: false});
    var sql = `UPDATE fs_version SET status=${data.status}, updated="${datetime}" WHERE deployment="${data.deployment}" 
                    AND platform="${data.platform}" AND  branch="${data.branch}" ORDER BY created DESC LIMIT 1`;
    console.log(sql);
    pool.query(sql, function(err, rows, fields) {
        if (! err) {
        }
        
    });
    console.log('update over');
}

function remove() {

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

module.exports = {
    create: create,
    update: update,
    remove: remove,
    getDeployments: getDeployments,
}