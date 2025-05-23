const e = require('express');
var pool = require('../config/db.js')

exports.getUser = function(username){

    return pool.query(
        "select * from users u where u.username = $1",
        [username]
    );
}

exports.getUserById = function(user_id){
    return pool.query(
        "select * from users u where u.user_id = $1",
        [user_id]
    );
}

exports.updateUserDesc = function(user_id, user_desc){
    return pool.query(
        "UPDATE users SET user_desc = $2 WHERE user_id = $1",
        [user_id,user_desc]
    )
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

// --------- GET user_id FRIENDS ---------
exports.getFriends = function(user_id){
    console.log(user_id);
    return pool.query(
        `SELECT u.username as friend
        FROM users u
        JOIN friendships f ON f.user_id1 = u.user_id
        WHERE f.user_id2 = $1

        UNION

        SELECT u.username as friend
        FROM users u
        JOIN friendships f ON f.user_id2 = u.user_id
        WHERE f.user_id1 = $1`,
        [user_id]
    )
}


//-----RETURNS HOW MANY FILES DOES USER HAVE, FOR LIMITS -----
exports.getAmountOfNotes = function(user_id){
    return pool.query(
    `SELECT COUNT(*) AS file_count
    FROM user_files
    WHERE user_id = $1 `,
    [user_id])
}

//-----GETS ALL USERS RECIEVED FRIENDS REQUESTS ------
exports.getAllFriendsRequests = function(user_id){
    return pool.query(
        `SELECT u.username as friend
        FROM friends_requests fr
        JOIN users u ON u.user_id = fr.user_id_req
        WHERE fr.user_id_rec = $1`,
        [user_id]

    )
}

//------ RETURNS REQUEST user_id_req -> user_id_rec----
exports.getFriendsRequests = function(user_id_req, user_id_rec){
    return pool.query(
        `SELECT fr.user_id_req, fr.user_id_rec
        FROM friends_requests fr
        WHERE fr.user_id_req = $1 AND fr.user_id_rec = $2`,
        [user_id_req, user_id_rec]

    )
}



//--------- CREATES A FRIENDS REQUEST ------------
exports.createFriendsRequests = function(user_id_req, user_id_rec){
    return pool.query(
        "insert into friends_requests (user_id_req,user_id_rec) values ($1,$2)",
        [user_id_req,user_id_rec]
    )
}

//--------- ACCEPTS FRIEND REQUEST, deletes from friends_requests, inserts into friendships --------------
exports.acceptFriendsRequests = async function(user_id_req, user_id_rec){
    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        client.query(
            `DELETE 
            FROM friends_requests fr
            WHERE fr.user_id_req = $1 AND fr.user_id_rec = $2`,
        [user_id_req, user_id_rec]);

        const [u1, u2] = user_id_req < user_id_rec ? [user_id_req, user_id_rec] : [user_id_rec, user_id_req];

        //add friendship
        client.query( 
            `INSERT INTO friendships(user_id1, user_id2) 
            VALUES ($1,$2)`,    
        [u1, u2]);
    
        await client.query('COMMIT');

    }catch (e){
        await client.query('ROLLBACK');
    }finally{
        client.release();
    }
}

//----------DELETES FRIENDSHIP ---------------

exports.deleteFriendship = async function(user_id1, user_id2){
    const [u1, u2] = user_id1 < user_id2 ? [user_id1, user_id2] : [user_id2, user_id1];
 
    return pool.query(
        "DELETE FROM friendships f WHERE f.user_id1 = $1 AND f.user_id2 = $2",
        [u1,u2]
    )      
}


//------CANCELS FRIEND REQUEST ------------
// both rec and req

exports.deleteFriendsRequests = async function(user_id1, user_id2){
    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        client.query(
            `DELETE 
            FROM friends_requests fr
            WHERE fr.user_id_req = $1 AND fr.user_id_rec = $2`,
        [user_id1, user_id2]);

        client.query(
            `DELETE 
            FROM friends_requests fr
            WHERE fr.user_id_req = $1 AND fr.user_id_rec = $2`,
        [user_id2, user_id1]);
    
        await client.query('COMMIT');

    }catch (e){
        await client.query('ROLLBACK');
    }finally{
        client.release();
    }
}

/*---------SEARCH USERS BY PREFIX------- */

exports.searchUsers = async function(prefix){
    return pool.query(
    `SELECT u.username
    FROM users u
    WHERE u.username ILIKE $1
    ORDER BY u.username`,
    [prefix + '%'])
}



/*-----------GET GROUPS -------------*/
exports.getGroups = async function(user_id){
    return pool.query(
        `SELECT g.group_name
        FROM groups g
        JOIN group_members gm ON g.group_id = gm.group_id
        WHERE gm.user_id = $1
        ORDER BY g.group_name`,
        [user_id]
    )
    
}


/*-----------GET GROUPS REQS -------------*/
exports.getGroupsReqs = async function(user_id){
    return pool.query(
        `SELECT g.group_name
        FROM groups g
        JOIN groups_requests gr ON g.group_id = gr.group_id
        WHERE gr.user_id = $1
        ORDER BY g.group_name`,
        [user_id]
    )
    
}



/*------CHECK IF IN GROUP ------*/

exports.groupCheck = async function(user_id,group_id){
    return pool.query(
        `SELECT 1
        FROM group_members gm
        WHERE gm.user_id = $1 AND gm.group_id =$2`,
        [user_id,group_id]
    )
}

exports.sendGroupInvite = async function(user_id,group_id){
    return pool.query(
        `INSERT INTO groups_requests (group_id, user_id)
        VALUES ($2,$1)
        `,
        [user_id,group_id]
    )
}

exports.acceptGroupInvite = async function(user_id,group_name, accept){
    
    


    const client = await pool.connect();

    
    try{


        await client.query('BEGIN');

        const result1 =  await client.query(
            `SELECT g.group_id
            FROM groups g
            WHERE g.group_name = $1`,
            [group_name])

        
        const group_id = result1.rows[0].group_id; 

        await client.query(
            `DELETE 
            FROM groups_requests gr
            WHERE gr.user_id = $1 AND gr.group_id= $2`,
        [user_id, group_id]);
        
        if(accept === true){
            await client.query(
                `INSERT INTO group_members (group_id, user_id) 
                VALUES ($1,$2)`,
            [group_id, user_id]);
        }
    
        await client.query('COMMIT');

    }catch (e){
        await client.query('ROLLBACK');
    }finally{
        client.release();
    }

    
}