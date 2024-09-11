/* trunk-ignore-all(prettier) */
const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
init_db();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



async function init_db() {
    const connectionForInit = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });
    try {
        connectionForInit.connect();
        connectionForInit.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME);
        console.log('Database created or already exists.');
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000)
        connectionForInit.changeUser({
            database: process.env.DB_NAME
        });
        //check if there is table for users 
        checkIfTableExists(connectionForInit, 'Users', (err, exists) => {
            if (err) {
                console.error('Error checking table existence:', err);
            } else if (exists) {
                console.log('Table "Users" exists!');
            } else {
                console.log('Table "Users" does not exist.');
                console.log('Running the "CREATE tables" script');
                const filePath = "mysql/" + process.env.DB_SQL_TABLES_FILE_NAME;
                let sql = fs.readFileSync(filePath, 'utf8').toString();
                sql = sql.split(';');
                for (let index = 0; index < sql.length - 1; index++) {
                    const table = sql[index];
                    connectionForInit.query(table);
                }
                try {
                    if (process.env.DB_CREATE_DEFAULT_VALUES === 'true') {
                        const defaultValuesFilePath = "mysql/default_values.sql";
                        let values = fs.readFileSync(defaultValuesFilePath, 'utf8').toString();
                        values = values.split(';');
                        for (let index = 0; index < values.length - 1; index++) {
                            const value = values[index];
                            connectionForInit.query(value);
                        }
                    }
                } catch (error) {
                    console.log('Error during inser default values')
                }



            }
        });
    } catch (error) {
        console.error('Error creating database:', error);
    }
}

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err.stack);
//         return;
//     }
//     console.log('Connected to MySQL');
// });

function checkIfTableExists(conn, tableName, callback) {
    const query = `
    SELECT COUNT(*)
    AS count
    FROM information_schema.tables
    WHERE table_schema = ?
    AND table_name = ?;
  `;

    conn.execute(query, [process.env.DB_NAME, tableName], (err, results) => {
        if (err) {
            return callback(err);
        }
        const exists = results[0].count > 0;
        callback(null, exists);
    });
}

module.exports = connection;
