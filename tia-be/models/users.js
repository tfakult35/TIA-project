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

//looks up friendship
exports.checkFriendship = function(user_id1, user_id2){
    const [u1, u2] = user_id1 < user_id2 ? [user_id1, user_id2] : [user_id2, user_id1];
    console.log("CHECKFREINDSHIT:", user_id1);
    console.log("CHECKFREINDSHIT:", user_id2);
    return pool.query(
        "select * from friendships where user_id1 = $1 AND user_id2 = $2",
        [u1,u2]
    )  
}

exports.getUserGroups = function(user_id){
    return pool.query(
        'SELECT * FROM group_members gm WHERE gm.user_id = $1',
        [user_id]
    )
}