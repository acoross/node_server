var mysql_manager = require('./mysql_manager');

module.exports = {
    /**
     * get character list from tb_character by id
     * @function
     * @param {int} id
     * @return {Promise} - Promise([{int}dbid, {int}char_id, {int}exp])
     */
    get_character_list : function(id){
        return new Promise((resolve, reject)=>{
            var conn = mysql_manager.createConnection();
            conn.connect(function(err){
                if (err) return reject(err);

                conn.query('select dbid, char_id, exp from tb_character WHERE user_id = ?',
                    [id],
                    function(err, result){
                        if (err) return reject(err);

                        return resolve(result);
                    });
            });
        });
    }
};