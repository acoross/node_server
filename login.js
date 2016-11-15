const assert = require('assert');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var character = require('./character');
var mysql_manager = require('./mysql_manager');

/**
 * assign this user to chat server
 * @function
 * @param {int} id
 * @param {callback} callback - (err, {string} chat_server_ip)
 * 
 * err - redis fail, or chat server full
 */
function assign_chat_server(id) {
    return new Promise((resolve, reject) => {
        //resolve('127.0.0.1');
        resolve({ ok: false, ip: "0.0.0.0" });
    });
}

/**
 * @function
 * @param {int} id
 * @param {string} password
 * @return {Promise} - Promise({string}nickname)
 */
var validate_login = async(function(id, password) {
    var conn = mysql_manager.createConnection();
    await (conn.connectAsync());

    var result = await (conn.queryAsync('SELECT nickname FROM user_table WHERE id = ? AND password = ?', [id, password]));
    if (result.length < 1) {
        return "";
    } else {
        return result[0].nickname;
    }
});

class LoginResponse {
    constructor(id, nickname) {
        this.account_id = id;
        this.nickname = "dummy";
        this.chat_server_ok = false;
        this.chat_server_ip = "0.0.0.0";
        this.character_list = [];
    }
};

module.exports = {
    /**
     * @function
     * @param {int} id
     * @param {string} password
     * @return {Promise<LoginResponse>}
     */
    process_login: async(function(id, password) {
        assert.ok(Number.isInteger(id), "id must integer");
        assert.equal(typeof(password), 'string');

        var login_response = new LoginResponse(id);

        login_response.nickname = await (validate_login(id, password));

        var chat_server_result = await (assign_chat_server(id));
        login_response.chat_server_ok = chat_server_result.ok;
        login_response.chat_server_ip = chat_server_result.ip;

        login_response.character_list = await (character.get_character_list(id));

        return login_response;
    })
}