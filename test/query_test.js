'use strict';
const pool = require('../oracle/pool');
const oracledb = require('oracledb')

async function run() {
    let connection;
    try{
        await pool.init();
        connection = await pool.getConn();

        let sql = " select * from (select QUESTION_ID, QUESTION_BODY, BRANCH_A, BRANCH_B, BRANCH_C, QUESTION_KEY from question order by dbms_random.value) where rownum <= 10";
        let binds = [];
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        let result = await connection.execute(sql, binds, options);

        console.log(result.metaData);
        console.log(result.rows);

        await pool.closeAndExit();

    }catch (e) {
        console.error(e);
    }

}

run();
