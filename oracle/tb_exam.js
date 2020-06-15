'use strict';
const pool = require('./pool');
const oracledb = pool.db;
const tb_exam_qu = require('./tb_exam_qu');
let tb_exam = {};

tb_exam.create = async function (en_id, info, hours) {
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "select NVL( MAX(exam_id), 0 ) as id from TB_EXAM";
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };
        let result = await connection.execute(sql, [], options);
        // console.log(result);
        let exam_id = result.rows[0]['ID'] + 1;
        let begin = new Date();
        let end = begin.getTime() + 3600 * 1000 * hours;
        end = new Date(end);
        sql = "insert into tb_exam(exam_id, en_id, info, begin_time, end_time) values( :exam_id, :en_id, :info, :begin, :end )";
        let binds = [
            exam_id,
            en_id,
            info,
            begin,
            end
        ];

        // console.log(await connection.execute("select dbtimezone,sessiontimezone from dual"));
        await connection.execute(sql, binds, options);
        return exam_id;
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.log(e);
            }
        }
    }

}

tb_exam.getAllByEnId = async function(en_id){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "select * from TB_EXAM where en_id = :en_id order by exam_id asc";
        let binds = [
            en_id
        ];
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        let result = await connection.execute(sql, binds, options);

        return result.rows;
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.log(e);
            }
        }
    }

}

tb_exam.getById = async function(exam_id){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "select * from TB_EXAM where exam_id = :exam_id";
        let binds = [
            exam_id
        ];
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        let result = await connection.execute(sql, binds, options);

        return result.rows;
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.log(e);
            }
        }
    }

}

tb_exam.finish = async function(exam_id, score){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "SELECT END_TIME FROM TB_EXAM WHERE EXAM_ID = :EXAM_ID";
        let binds = {
            exam_id: exam_id
        };
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        // console.log(await connection.execute("select dbtimezone,sessiontimezone from dual"));
        let result;
        result = await connection.execute(sql, binds, options);
        let submit_time = result.rows[0]['END_TIME'];
        submit_time = submit_time.getTime() < Date.now() ? submit_time : new Date();

        sql = "UPDATE TB_EXAM SET SCORE = :SCORE, SUBMIT_TIME = :SUBMIT_TIME WHERE EXAM_ID = :EXAM_ID";
        binds = {
            score: score,
            exam_id: exam_id,
            submit_time: submit_time
        };
        await connection.execute(sql, binds, options);
        // console.log(result);
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.log(e);
            }
        }
    }

}

tb_exam.check = async function(){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "SELECT EXAM_ID, END_TIME FROM TB_EXAM WHERE SUBMIT_TIME IS NULL AND SCORE IS NULL ";
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };
        let result;
        result = await connection.execute(sql, [], options);
        if (result.rows.length === 0){
            return ;
        }

        console.log('checking');
        let arr = result.rows;
        console.log('nums need to check:' + arr.length);
        for (let r of arr){
            if (Date.now() >= r['END_TIME'].getTime()){
                console.log('calculating exam:' + r['EXAM_ID']);
                let score = await tb_exam_qu.calcScore(r['EXAM_ID']);
                console.log('finishing exam:' + r['EXAM_ID']);
                await this.finish(r['EXAM_ID'], score);
            }

        }

        console.log('check done');

    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.log(e);
            }
        }
    }
}


module.exports = tb_exam;
