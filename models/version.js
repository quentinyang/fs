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
module.exports = {
    create: create,
    update: update,
    remove: remove
}