const mysql  = require("mysql2/promise");

async function connection(){
    return await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "the_wall",
        port: 3306
    });
}

async function executeQuery(query) {
    let connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "the_wall",
        port: 3306
    });
    let [query_result, ] = await connection.query(query);

    return query_result;
}

module.exports = { executeQuery }