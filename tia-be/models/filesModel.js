var pool = require('../config/db.js')

//------ RETURNS ALL user_id'S FILLES WITH APPROPRIATE AV (privl), AND THEIR PARENT FILES | null ------
//------> DOESNT RETURN FILES WITH GROUP_ACCESS HERE UNLESS privl=5
exports.getUserFileHeaders = function(user_id, privl){
    return pool.query(
        `SELECT f.file_id, f.file_name, av.access_value, f.created_time, f.modified_time, f.topic, fh.file_id1 as parent_id, g.group_name 
        FROM files f 
        JOIN user_files uf ON f.file_id = uf.file_id
        JOIN access_values av ON f.file_id = av.file_id
        LEFT JOIN file_hierarchy fh ON f.file_id = fh.file_id2
        LEFT JOIN group_files gf ON f.file_id = gf.file_id
        LEFT JOIN groups g ON gf.group_id = g.group_id
        WHERE uf.user_id = $1 AND av.access_value <= $2`,
        [user_id,privl]
    )  
}

//------ GET OWNER OF file_id ------
exports.getFileOwner = function(file_id){
    return pool.query(
        'SELECT uf.user_id FROM user_files uf WHERE uf.file_id = $1',
        [file_id]   
    )
}


//------ GET CONTENT OF file_id, APPR privl, ALSO CHECKS GROUPS ------
exports.getFileContent = function(file_id, privl, groups){
    return pool.query(
        `SELECT f.content
        FROM files f
        JOIN access_values av ON f.file_id = av.file_id
        LEFT JOIN group_files gf ON f.file_id = gf.file_id
        WHERE f.file_id = $1 AND ((av.access_value <= $2)
        OR (av.access_value = 2 AND gf.group_id = ANY($3)))`,
        [file_id,privl,groups]
    )
}


//------ CREATE NEW FILE BY user_id ------
//------> BY TRANSACTION: CONTENT ="", TOPIC ="", ACCESS VALUE = 5, NAME = file_name, MOD_TIME = current time, PARENT FILE = parent_id(can be null)

exports.createNewFile = async function(user_id,file_name, parent_file_id){
    const client = await pool.connect();
    try{
        client.query('BEGIN');

        const insertFileResult = await client.query(
            `INSERT INTO files (file_name, modified_time, topic, content)
            VALUES ($1, NOW(),'','')
            RETURNING file_id, modified_time`,
            [file_name]
        )

        const file_id = insertFileResult.rows[0].file_id;

        await client.query(
            `INSERT INTO user_files (user_id, file_id)
            VALUES ($1, $2)`,
            [user_id,file_id]
        )

        await client.query(
            `INSERT INTO access_values (file_id, access_value)
            VALUES ($1,5)`,
            [file_id]
        )

        if(parent_file_id !== null){
            await client.query(
                `INSERT INTO file_hierarchy (file_id1,file_id2)
                VALUES ($1,$2)`,
                [parent_file_id,file_id]
            )
        }

        await client.query('COMMIT');
        return insertFileResult.rows[0];


    }catch(e){
        await client.query('ROLLBACK');
        throw e;
    }finally{
        client.release();
    }

}


//------ SET THE CONTENT OF file_id - CHANGE THE MODIFIED TIME ------

exports.setContent = async function(file_id, content){
    return pool.query(
        `UPDATE files
        SET content = $2, modified_time = NOW() 
        WHERE file_id = $1`,
        [file_id, content])
}

// ---------- REMOVE FILE ------------

//I HAVE TO DELETE ALL CHILDREN --- DO I?
exports.removeFile = async function(file_id){
    return pool.query(
        `DELETE FROM files f
        WHERE f.file_id = $1`,
        [file_id]
    )
}


//-------RENAME FILE -------------

exports.renameFile = async function(file_id, file_name){
    return pool.query(
        "UPDATE files SET file_name = $2 WHERE file_id = $1",
        [file_id,file_name]
    )
}


//-------SET PRIVL-----------
exports.setPrivl = async function(file_id,privl){
    return pool.query(
        "UPDATE access_values SET access_value = $2 WHERE file_id = $1",
        [file_id, privl]
    )
}