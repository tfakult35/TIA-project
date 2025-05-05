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