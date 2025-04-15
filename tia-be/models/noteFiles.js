var pool = require('../config/db.js')

//returns users (user_id) files with appr privl level, and their parent file
exports.getUserFiles = function(user_id, privl){
    return pool.query(
        `SELECT f.file_id, f.file_name, f.created_time, f.modified_time, f.topic, fh.file_id1 as parent_id 
        FROM files f 
        JOIN user_files uf ON f.file_id = uf.file_id
        JOIN access_values av ON f.file_id = av.file_id
        LEFT JOIN file_hierarchy fh ON f.file_id = fh.file_id2
        WHERE uf.user_id = $1 AND av.access_value <= $2`,
        [user_id,privl]
    )  
}

exports.getFileOwner = function(file_id){
    return pool.query(
        'SELECT uf.user_id FROM user_files uf WHERE uf.file_id = $1',
        [file_id]   
    )
}

