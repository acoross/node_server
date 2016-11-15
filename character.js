var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mysql_manager = require('./mysql_manager');

module.exports = {
    /**
     * get character list from tb_character by id
     * @function
     * @param {int} id
     * @return {Promise<CharacterInfo>}
     */
    get_character_list: async(function(id) {
        var conn = mysql_manager.createConnection();
        await (conn.connectAsync());
        return await (conn.queryAsync(
            'select dbid, char_id, exp from tb_character WHERE user_id = ?', [id]));
    })
};