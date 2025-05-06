const e = require('express');
var pool = require('../config/db.js')

/*---------SEARCH USERS BY PREFIX------- */

exports.searchGroups = async function(prefix){
    return pool.query(
    `SELECT g.group_name
    FROM groups g
    WHERE g.group_name ILIKE $1
    ORDER BY g.group_name`,
    [prefix + '%'])
}

exports.getGroup = async function(group_name){
    return pool.query(
    `SELECT *
    FROM groups g
    WHERE g.group_name = $1
    `,
    [group_name])
}

exports.getGroupMembers = async function(group_name){
    return pool.query(
        `SELECT u.username
        FROM groups g
        JOIN group_members gm ON g.group_id = gm.group_id
        JOIN users u ON gm.user_id = u.user_id
        WHERE g.group_name =$1
        ORDER BY u.username
        `,[group_name]
    )
}


exports.leaveGroup = async function(user_id, group_id){
    const grpMemberResult = await pool.query(
        `SELECT * FROM group_members gm WHERE group_id = $1`,
        [group_id]
    )

    //WHEN THE LAST MEMBER DELETE GROUP
    if(grpMemberResult.rowCount === 1){

        return pool.query(
            `DELETE FROM groups WHERE groups.group_id = $1`,
            [group_id]
        )
    }

    //WHEN NOT THE LAST DELETE MEMBERSHIP AND UPDATE ALL FILES WITH THE GROUP
    
    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        await client.query(
            `DELETE
            FROM group_files gf
            WHERE gf.group_id = $2 AND gf.file_id IN 
            (SELECT f.file_id FROM files f JOIN user_files uf ON uf.file_id = f.file_id WHERE uf.user_id = $1)`,
            [user_id,group_id]
        )

        await client.query(
            `DELETE
            FROM group_members
            WHERE user_id = $1 AND group_id = $2`,
            [user_id, group_id]
        )
        
        await client.query('COMMIT');

    }catch (e){
        await client.query('ROLLBACK');
        throw(e);
    }finally{
        client.release();
    }
   

}

exports.createGroup = async function(user_id,group_name){

    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        const insertGroupResult = await client.query(
            `INSERT INTO groups (group_name, group_desc)
            VALUES ($1, '')
            RETURNING group_id`,
            [group_name]
        )

        const group_id = insertGroupResult.rows[0].group_id;

        await client.query(
            `INSERT INTO group_members (group_id, user_id)
            VALUES ($1, $2)`,
        [group_id, user_id]);
    
        await client.query('COMMIT');

    }catch (e){
        await client.query('ROLLBACK');
        throw(e);
    }finally{
        client.release();
    }
}