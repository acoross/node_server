var mysql = require('mysql');
var assert = require('assert');

var mysql_conn_info = require('./config').mysql_conn_info;

module.exports = {
    /**
     * @function
     * @param {function} callback - function(err)
     */
    test : function(callback){
        assert.equal(typeof(callback), 'function');

        var conn = mysql.createConnection(mysql_conn_info);

        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err);
            }

            return callback(null);
        });
    }
};