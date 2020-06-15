// Using a fixed Oracle time zone helps avoid machine and deployment differences
process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {

    let connection;

    try {
        let result, date;

        connection = await oracledb.getConnection(dbConfig);

        console.log('Creating table');

        const stmts = [
            `DROP TABLE no_datetab`,

            `CREATE TABLE no_datetab(
         id NUMBER,
         timestampcol TIMESTAMP,
         timestamptz  TIMESTAMP WITH TIME ZONE,
         timestampltz TIMESTAMP WITH LOCAL TIME ZONE,
         datecol DATE)`
        ];

        for (const s of stmts) {
            try {
                await connection.execute(s);
            } catch (e) {
                if (e.errorNum != 942)
                    console.error(e);
            }
        }

        let options = {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        };

        // When bound, JavaScript Dates are inserted using TIMESTAMP WITH LOCAL TIMEZONE
        date = new Date();
        console.log('Inserting JavaScript date: ' + date);
        result = await connection.execute(
            `INSERT INTO no_datetab (id, timestampcol, timestamptz, timestampltz, datecol)
       VALUES (1, :ts, :tstz, :tsltz, :td)`,
            {ts: date, tstz: date, tsltz: date, td: date}, options);
        console.log('Rows inserted: ' + result.rowsAffected);

        console.log('Query Results:');
        result = await connection.execute(
            `SELECT id, timestampcol, timestamptz, timestampltz, datecol,
              TO_CHAR(CURRENT_DATE, 'DD-Mon-YYYY HH24:MI') AS CD
       FROM no_datetab
       ORDER BY id`, [], options);
        console.log(result.rows);

        console.log('Altering session time zone');
        await connection.execute(`ALTER SESSION SET TIME_ZONE='+8:00'`);  // resets ORA_SDTZ value

        date = new Date();
        console.log('Inserting JavaScript date: ' + date);
        result = await connection.execute(
            `INSERT INTO no_datetab (id, timestampcol, timestamptz, timestampltz, datecol)
       VALUES (2, :ts, :tstz, :tsltz, :td)`,
            {ts: date, tstz: date, tsltz: date, td: date}, options);
        console.log('Rows inserted: ' + result.rowsAffected);

        console.log('Query Results:');
        result = await connection.execute(
            `SELECT id, timestampcol, timestamptz, timestampltz, datecol,
              TO_CHAR(CURRENT_DATE, 'DD-Mon-YYYY HH24:MI') AS CD
       FROM no_datetab
       ORDER BY id`, [], options);
        console.log(result.rows);

        // Show the queried dates are of type Date
        let ts = result.rows[0]['TIMESTAMPCOL'];
        ts.setDate(ts.getDate() + 8);
        console.log('TIMESTAMP manipulation in JavaScript:', ts);

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

run();
