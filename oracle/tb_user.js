'use strict';
const pool = require('./pool');
const oracledb = pool.db;
let user = {};

user.getUserById = async function (id) {
    let connection;
    try {
        connection = await pool.getConn();
        let sql = " select * from tb_user where en_id = :id";
        let binds = [id];
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };
        let result = await connection.execute(sql, binds, options);
        return result.rows;
    }catch (e) {
        console.error(e);
    }finally {
        if (connection){
            try {
                await connection.close();
            }catch (e) {
                console.log(e);
            }
        }
    }

};

module.exports = user;
