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
