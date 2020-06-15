const oracledb = require('oracledb');
const config = {
    user:'TEST',
    password:'test',
    connectString:'localhost:1521/orcl'
};
let sql, binds, options, result;
let connection;

async function getMyConnection() {
    try {
        connection = await oracledb.getConnection(config);
        console.log(connection);
    }catch (e) {
        console.error(e)
    }
}

getMyConnection();



console.log('Connection was successful!');

const stmts = [
    `DROP TABLE no_example`,

    `CREATE TABLE no_example (id NUMBER, data VARCHAR2(20))`
];

for (const s of stmts){
    connection.execute(s);
}

//
// Insert three rows
//

sql = `INSERT INTO no_example VALUES (:1, :2)`;

binds = [
    [101, "Alpha" ],
    [102, "Beta" ],
    [103, "Gamma" ]
];

options = {
    autoCommit: true,
    // batchErrors: true,  // continue processing even if there are data errors
    bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.STRING, maxSize: 20 }
    ]
};

result = connection.executeMany(sql, binds, options);

console.log("Number of rows inserted:", result.rowsAffected);

