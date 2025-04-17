var pool = require('../config/db.js')

exports.getUser = function(username){

    return pool.query(
        "select * from users u where u.username = $1",
        [username]
    );
}

// -------- REGISTER --------
exports.addUser = function(username,password,user_desc){

    return pool.query(
        "insert into users (username,password,user_desc) values ($1,$2,$3)",
        [username,password,user_desc]
    )

}


// -------- CHECKS IF user_id1 AND user_id2 ARE FRIENDS --------
exports.checkFriendship = function(user_id1, user_id2){
    const [u1, u2] = user_id1 < user_id2 ? [user_id1, user_id2] : [user_id2, user_id1];
    console.log("CHECKFREINDSHIT:", user_id1);
    console.log("CHECKFREINDSHIT:", user_id2);
    return pool.query(
        "select * from friendships where user_id1 = $1 AND user_id2 = $2",
        [u1,u2]
    )  
}

// -------- GET user_id'S GROUPS --------
exports.getUserGroups = function(user_id){
    return pool.query(
        'SELECT * FROM group_members gm WHERE gm.user_id = $1',
        [user_id]
    )
}


exports.getFriends = function(user_id){
    return pool.query(
        `SELECT u.username as friend
        FROM users u 
        JOIN friendships f ON f.user_id1 = u.user_id
        WHERE u.user_id = $1
        
        UNION

        SELECT u.username as friend
        FROM users u
        JOIN friendships f ON f.user_id2 = u.user_id
        WHERE u.user_id = $2`,
        [user_id]
    )
}