var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 1,
  host     : 'localhost',
  user     : 'root',
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