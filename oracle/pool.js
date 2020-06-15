const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
let isInit = false;

module.exports = {
    db: oracledb,
    pool: null,
    init: async function () {
        try {
            await oracledb.createPool({
                user: dbConfig.user,
                password: dbConfig.password,
                connectString: dbConfig.connectString,
                // edition: 'ORA$BASE', // used for Edition Based Redefintion
                // events: false, // whether to handle Oracle Database FAN and RLB events or support CQN
                // externalAuth: false, // whether connections should be established using External Authentication
                // homogeneous: true, // all connections in the pool have the same credentials
                // poolAlias: 'default', // set an alias to allow access to the pool via a name.
                // poolIncrement: 1, // only grow the pool by one connection at a time
                poolMax: 32, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
                poolMin: 5, // start with no connections; let the pool shrink completely
                // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
                // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
                // queueMax: 500, // don't allow more than 500 unsatisfied getConnection() calls in the pool queue
                // queueTimeout: 60000, // terminate getConnection() calls queued for longer than 60000 milliseconds
                // sessionCallback: myFunction, // function invoked for brand new connections or by a connection tag mismatch
                // stmtCacheSize: 30, // number of statements that are cached in the statement cache of each connection
                _enableStats: true // record pool usage statistics that can be output with pool._logStats()
            });
            // let connection = await oracledb.getConnection();
            // await connection.execute(`ALTER SESSION SET TIME_ZONE='+8:00'`);
            isInit = true;
            this.pool = oracledb.getPool();
            console.log('Connection pool started');
        }catch (e) {
            console.error(e);
        }
    },

    getConn: async function(){
        try{
            if (!isInit)
                await this.init();

            // this.pool._logStats();
            return await oracledb.getConnection();
        }catch (e) {
            console.error(e);
        }

    },

    closeAndExit: async  function(){
        if (isInit)
            await oracledb.getPool().close(3);
        console.log('Pool closed');
        process.exit(0);
    }

};
