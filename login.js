const assert = require('assert');
var character = require('./character');
var mysql_manager = require('./mysql_manager');

module.exports = {
    /**
     * @function
     * @param {int} id
     * @param {string} password
     * @return {Promise} - Promise(login_response)
     * 
     * error: invalid id, invalid password, db timeout
     * crash: param type check failure
     */
    process_login : function (id, password) {
        assert.ok(Number.isInteger(id), "id must integer");
        assert.equal(typeof(password), 'string');

        return new Promise(function(resolve){
            var login_response = {
                account_id: id,
                nickname: "dummy",
                "chat_server_ok": false,
                "chat_server_ip": "0.0.0.0",
                "character_list": [
                    // {
                    //     "dbid": 0,
                    //     "exp": 0
                    // }
                ]
            };

            validate_login(id, password)
            .then(
                function(nickname){
                    login_response.nickname = nickname;

                    var promises = [
                        assign_chat_server(id).then(
                            (chat_server_ip)=>{
                                login_response.chat_server_ok = true;
                                login_response.chat_server_ip = chat_server_ip;
                            })
                            .catch(()=>{})
                        ,
                        character.get_character_list(id).then(
                            (char_list)=>{
                                login_response.character_list = char_list;
                            })
                            .catch(()=>{})
                    ];

                    Promise.all(promises)
                    .then(
                        ()=>{
                            resolve(login_response);
                        });
                }
            );
        });
    }
}

/**
 * assign this user to chat server
 * @function
 * @param {int} id
 * @param {callback} callback - (err, {string} chat_server_ip)
 * 
 * err - redis fail, or chat server full
 */
function assign_chat_server(id){
    return new Promise((resolve, reject)=>{
        //resolve('127.0.0.1');
        reject(new Error("no redis"));
    });
}

/**
 * @function
 * @param {int} id
 * @param {string} password
 * @return {Promise} - Promise({string}nickname)
 */
function validate_login(id, password){
    return new Promise(function(resolve, reject){
        var conn = mysql_manager.createConnection();
        conn.connect(function(err){
            if (err){
                return reject(err);
            }

            conn.query('SELECT nickname FROM user_table WHERE id = ? AND password = ?', 
                [id, password],
                function(err, result){
                    if (err) {
                        return reject(err);
                    }

                    if (result.length < 1){
                        return reject(new Error("login failure: invalid id and password"));
                    } else {
                        return resolve(result[0].nickname);
                    }
                });
        });
    });
}