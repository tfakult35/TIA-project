var pool = require('../config/db.js')

exports.getUser = function(username){

    return pool.query(
        "select * from users u where u.username = $1",
        [username]
    );
}

exports.addUser = function(username,password){

    return pool.query(

    )

}