var pool = require('../config/db.js')

exports.getUser = function(username){

    return pool.query(
        "select * from users u where u.username = $1",
        [username]
    );
}

exports.addUser = function(username,password,user_desc){

    return pool.query(
        "insert into users (username,password,user_desc) values ($1,$2,$3)",
        [username,password,user_desc]
    )

}