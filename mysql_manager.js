var Promise = require('bluebird');
var mysql = require('mysql');

var mysql_conn_info = require('./config').mysql_conn_info;

module.exports = {
    /**
     * @function
     * @return {connection} - mysql connection object
     */
    createConnection : function(){
        return Promise.promisifyAll(mysql.createConnection(mysql_conn_info));
    }
};