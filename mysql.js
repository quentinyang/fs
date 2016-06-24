var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 1,
  host     : '192.168.169.16',
  user     : 'quentin',
  password : 'admin',
  database : 'fs'
});

function query(sql, success, error) {

    pool.query(sql, function(err, rows, fields) {
        if (err) {
            error && error(err);
            throw err;
        }

        success && success(err, rows, fields);

    });

}

module.exports = {
    query: query,
};