var pool = require('../config/db.js')


exports.getGroupFileHeaders = function(group_id){

    return pool.query(
        `
        SELECT f.file_id, f.file_name, av.access_value, f.created_time, f.modified_time, f.topic, fh.file_id1 as parent_id, g.group_name
        FROM files f
        JOIN group_files gf ON f.file_id = gf.file_id
        JOIN groups g ON gf.group_id = g.group_id
        JOIN access_values av ON f.file_id = av.file_id
        LEFT JOIN file_hierarchy fh ON f.file_id = fh.file_id2 
        WHERE gf.group_id = $1 AND av.access_value = 2
        ORDER BY f.file_name
        `,[group_id]

    )
}

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
        WHERE uf.user_id = $1 AND av.access_value <= $2
        ORDER BY f.file_name, av.access_value`,
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
        await client.query('BEGIN');

        const insertFileResult = await client.query(
            `INSERT INTO files (file_name, modified_time, topic, content)
            VALUES ($1, NOW(),'','')
            RETURNING file_id, modified_time`,
            [file_name]
        )

        const file_id = insertFileResult.rows[0].file_id;
        var group_name = null;

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

            const groupResult = await client.query(
                `SELECT g.group_id, g.group_name
                FROM group_files gf 
                JOIN groups g ON g.group_id = gf.group_id
                WHERE gf.file_id = $1`,
                [parent_file_id]
            )

            if(groupResult.rowCount > 0){
                const group_id = groupResult.rows[0].group_id;
                group_name = groupResult.rows[0].group_name;

                await client.query(
                    `INSERT INTO group_files (group_id,file_id)
                    VALUES ($1,$2)`,
                    [group_id,file_id]
                )
            }
            
        }

        await client.query('COMMIT');
        return {
            file_id,
            modified_time: insertFileResult.rows[0].modified_time,
            group_name
        };


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




//--- for checking limit --- if parent has higher privl level- then not accept
exports.privlCheck = async function(file_id,privl,client=pool){
    return client.query(
        `SELECT 1
        FROM file_hierarchy fh
        JOIN access_values av ON av.file_id = fh.file_id1
        WHERE fh.file_id2 = $1 AND av.access_value > $2
        `, [file_id,privl]
    )
}

exports.childPrivlCheck = async function(file_id,privl,client=pool){
    return client.query(
        `WITH RECURSIVE descendants AS (
            SELECT file_id2 
            FROM file_hierarchy
            WHERE file_id1 = $1

            UNION
            
            SELECT fh.file_id2
            FROM file_hierarchy fh
            JOIN descendants d ON fh.file_id1 = d.file_id2
        )
        SELECT av.file_id
        FROM descendants d
        JOIN access_values av ON av.file_id = d.file_id2
        WHERE av.access_value < $2`,
        [file_id,privl]
    )
}


//-------SET PRIVL-----------
exports.setPrivl = async function(file_id,privl){
    const client = await pool.connect();

    

    try{

        await client.query('BEGIN');

        await exports.privlCheck(file_id,privl,client);

        await exports.childPrivlCheck(file_id,privl,client)

        await client.query(
            "UPDATE access_values SET access_value = $2 WHERE file_id = $1",
            [file_id, privl])
        


        await client.query('COMMIT');

    }
    catch(e){
        await client.query('ROLLBACK');
        throw e;

    }finally{
        client.release();
    }
}

exports.checkIfRootNote = async function(file_id){
    return pool.query(
        `SELECT 1
        FROM file_hierarchy fh
        WHERE file_id2 = $1`,
        [file_id]
    )
}



/*----FOR ALL DESCENDANTS---*/
//UPDATE
exports.changeGroupForFile = async function(file_id,group_id){

    const inGroup = await pool.query(
        `SELECT 1
        FROM group_files gf
        WHERE gf.file_id = $1`,[file_id]);

    if(inGroup.rowCount === 0){
        return pool.query(
            `WITH RECURSIVE descendants AS (
                SELECT file_id2 
                FROM file_hierarchy
                WHERE file_id1 = $1
    
                UNION
                
                SELECT fh.file_id2
                FROM file_hierarchy fh
                JOIN descendants d ON fh.file_id1 = d.file_id2
            )
            INSERT INTO group_files (group_id, file_id)
            
            SELECT $2::int, file_id2
            FROM descendants
            UNION
            SELECT $2::int, $1`,
            [file_id, group_id]
        );
    }

    return pool.query(
        `WITH RECURSIVE descendants AS (
            SELECT file_id2 
            FROM file_hierarchy
            WHERE file_id1 = $1

            UNION
            
            SELECT fh.file_id2
            FROM file_hierarchy fh
            JOIN descendants d ON fh.file_id1 = d.file_id2
        )
        UPDATE group_files
        SET group_id = $2
        WHERE file_id IN (
            SELECT file_id2
            FROM descendants
            UNION
            SELECT $1) `,
        [file_id, group_id]
    )
}

//DELETE
exports.removeGroupFromFile = async function(file_id){
    return pool.query(
        `WITH RECURSIVE descendants AS (
            SELECT file_id2 
            FROM file_hierarchy
            WHERE file_id1 = $1

            UNION
            
            SELECT fh.file_id2
            FROM file_hierarchy fh
            JOIN descendants d ON fh.file_id1 = d.file_id2
        )
        DELETE 
        FROM group_files
        WHERE file_id IN (
            SELECT file_id2
            FROM descendants
            UNION
            SELECT $1) `,
        [file_id]
    )
}