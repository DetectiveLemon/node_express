'use strict';
const pool = require('./pool');
const oracledb = pool.db;
let question = {};

question.checkAnswer = async function(arr){
    let connection;
    try {
        connection = await pool.getConn();
        let r = [];
        for (let i=0; i<arr.length; i++){
            let q = arr[i];
            let sql = "select QUESTION_KEY from question where QUESTION_ID = :id";
            let binds = [q['QUESTION_ID']];
            let options = {
                autoCommit: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT
            };
            let result = await connection.execute(sql, binds, options);
            let row = result.rows[0];
            let t = {
                QUESTION_ID: q['QUESTION_ID'],
                QUESTION_KEY: row['QUESTION_KEY'],
                answer: q['answer'],
                correct: false
            };
            if(q['answer'] === row['QUESTION_KEY']){
                t.correct = true;
            }
            r.push(t);
        }
         return r;
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
}

// question.checkAnswer = async function(n){
//     console.log(n);
//     let connection;
//     try {
//         connection = await pool.getConn();
//         var score = 0;
//         for (var i=0;i<n.length;i++){
//             let sql = "select QUESTION_ID,  QUESTION_KEY from question where QUESTION_ID = :n";
//             let binds = [n[i]['QUESTION_ID']];
//             let options = {
//                 autoCommit: true,
//                 outFormat: oracledb.OUT_FORMAT_OBJECT
//             };
//             let result = await connection.execute(sql, binds, options);
//             console.log(result)
//             // console.log(result.rows[i]['QUESTION_KEY']);
//             if(n[i]['QUESTION_KEY'] === result.rows[0]['QUESTION_KEY']){
//                 score++;
//             }
//         }
//         console.log(score);
//         return score;
//     }catch (e) {
//         console.error(e);
//     }finally {
//         if (connection){
//             try {
//                 await connection.close();
//             }catch (e) {
//                 console.log(e);
//             }
//         }
//     }
// }

question.getRandomQuestions = async function(n) {
    let connection;
    try {
        connection = await pool.getConn();
        let sql = " select * from (select QUESTION_ID, QUESTION_BODY, BRANCH_A, BRANCH_B, BRANCH_C, QUESTION_KEY from question order by dbms_random.value) where rownum <= :n";
        let binds = [n];
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

question.getQuestionById = async function(id){
    let connection;
    try {
        connection = await pool.getConn();
        let sql = " select QUESTION_ID, QUESTION_BODY, BRANCH_A, BRANCH_B, BRANCH_C, QUESTION_KEY from question where QUESTION_ID = :id ";
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


module.exports = question;
