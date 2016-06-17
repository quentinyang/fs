var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'fs'
});

connection.connect();
function query(sql, success, error) {
    

    connection.query(sql, function(err, rows, fields) {
        if (err) {
            error && error(err);
            throw err;
        }
        console.log('eeeeee')
        success && success(rows);
        connection.end();
        // console.log('The solution is: ', rows[0].solution);
    });


    

}



// query('Select * from ga_player', function(data) {
// console.log('data', data);
// });

module.exports = {
    query: query,
};