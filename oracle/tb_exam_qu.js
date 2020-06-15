'use strict';
const pool = require('./pool');
const oracledb = pool.db;
let tb_exam_qu = {};

tb_exam_qu.create = async function (exam_id, arr_qu) {
    let connection;
    try {
        connection = await pool.getConn();
        let qu;
        for (qu of arr_qu){
            qu['EXAM_ID'] = exam_id;
        }
        // console.log(arr_qu);
        let binds = arr_qu;
        // let binds = [
        //     {
        //         EXAM_ID: 8,
        //         QUESTION_ID: 65,
        //         QUESTION_BODY: '机动车在城市非禁止鸣喇叭的区域使用喇叭时，连续按鸣不允许超过3次，且每次按鸣不准超过：',
        //         BRANCH_A: '0.5秒',
        //         BRANCH_B: '1秒',
        //         BRANCH_C: '1.5秒'
        //     }
        // ];
        let sql = "insert into tb_exam_qu(EXAM_ID, QUESTION_ID, QUESTION_BODY, BRANCH_A, BRANCH_B, BRANCH_C, QUESTION_KEY) " +
            "values( :EXAM_ID, :QUESTION_ID, :QUESTION_BODY, :BRANCH_A, :BRANCH_B, :BRANCH_C, :QUESTION_KEY )";
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };
        await connection.executeMany(sql, binds, options);

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

};

tb_exam_qu.getAllByExamId = async function(exam_id){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "select * from tb_exam_qu where exam_id = :exam_id";
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

};

tb_exam_qu.setAnswer = async function(arr){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "update tb_exam_qu set answer = :answer, submit = 1 where exam_id = :EXAM_ID and question_id = :QUESTION_ID and submit = 0";
        let binds = arr;
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        let result = await connection.executeMany(sql, binds, options);

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

};

tb_exam_qu.calcScore = async function(exam_id){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "SELECT Count(*) AS SCORE FROM TB_EXAM_QU WHERE EXAM_ID = :EXAM_ID AND QUESTION_KEY = ANSWER AND SUBMIT = 1";
        let binds = [
            exam_id
        ];
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        let result = await connection.execute(sql, binds, options);
        return result.rows[0]['SCORE'];

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

};

tb_exam_qu.setSubmit = async function(exam_id){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = "UPDATE TB_EXAM_QU SET SUBMIT = 1 WHERE EXAM_ID = :EXAM_ID";
        let binds = [
            exam_id
        ];
        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        await connection.execute(sql, binds, options);

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

};

module.exports = tb_exam_qu;
