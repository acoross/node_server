var mysql = require('mysql');
var assert = require('assert');

var mysql_conn_info = require('./config').mysql_conn_info;

module.exports = {
    /**
     * @function
     * @return {connection} - mysql connection object
     */
    createConnection : function(){
        return mysql.createConnection(mysql_conn_info);
    }
};