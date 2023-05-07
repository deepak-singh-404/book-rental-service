const mysql = require('mysql');

const mysqlDbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'rootuser',
    database: 'online_book_rental',
    port: 3306,
    connectionLimit: 10,
    multipleStatements: true
}

const pool = mysql.createPool(mysqlDbConfig)

const queryDb = (query) => {
    console.log(query)
    return new Promise((resolve, reject) => {
        pool.query(query, async (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results)
        })
    })
}

const queryDbWithTransaction = (listOFQueries) => {
    return new Promise(async (resolve, reject) => {
        connection = await pool.getConnection();

        // start a transaction
        await connection.beginTransaction();
        try {
            for (let query of listOFQueries) {
                await connection.query(query)
            }
            await connection.commit();
        }
        catch (err) {
            if (connection) {
                await connection.rollback();
            }
            reject(err)
        }
        finally {
            if (connection) {
                connection.release()
            }
            resolve(true)
        }
    })
}

const dbInitialize = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const createCustomerTableQuery =
                `CREATE TABLE customer (
                        id INT NOT NULL AUTO_INCREMENT,
                        first_name VARCHAR(45) NULL,
                        last_name VARCHAR(45) NULL,
                        phone_number VARCHAR(45) NULL,
                        email VARCHAR(45) NULL,
                        city_id INT NULL,
                        PRIMARY KEY (id));`
            const createCityTableQuery =
                `CREATE TABLE city (
                        id INT NOT NULL AUTO_INCREMENT,
                        name VARCHAR(45) NULL,
                        state VARCHAR(45) NULL,
                        state_code VARCHAR(45) NULL,
                        country VARCHAR(45) NULL,
                        country_code INT NULL,
                        PRIMARY KEY (id));`
            const createCustomerProductMappingTableQuery =
                `CREATE TABLE customer_product_mapping (
                        id INT NOT NULL AUTO_INCREMENT,
                        product_id INT NOT NULL,
                        city_id INT NOT NULL,
                        published_by INT NOT NULL,
                        rented_by INT NULL,
                        rented_on DATETIME NULL,
                        rented_till DATETIME NULL,
                        rent_duration INT NULL,
                        status VARCHAR(45) NULL,
                        rent_per_month INT NULL,
                        agreed_rent INT NULL,
                        security_deposit INT NULL,
                        PRIMARY KEY (id));`
            const createProductTableQuery =
                `CREATE TABLE product (
                        id INT NOT NULL AUTO_INCREMENT,
                        title VARCHAR(45) NULL,
                        description TEXT NULL,
                        genre VARCHAR(45) NULL,
                        cover_page VARCHAR(450) NULL,
                        author VARCHAR(45) NULL,
                        language VARCHAR(45) NULL,
                        product_condition VARCHAR(45) NULL,
                        edition VARCHAR(45) NULL,
                        status VARCHAR(45) NULL,
                        PRIMARY KEY (id));`

            try {
                await queryDb(createCustomerTableQuery)
            }
            catch (err) {
                console.log('ERROR: createCustomerTableQuery: ', err.message)
            }
            try {
                await queryDb(createCityTableQuery)
            }
            catch (err) {
                console.log('ERROR: createCityTableQuery: ', err.message)
            }
            try {
                await queryDb(createCustomerProductMappingTableQuery)
            }
            catch (err) {
                console.log('ERROR: createCustomerProductMappingTableQuery: ', err.message)
            }
            try {
                await queryDb(createProductTableQuery)
            }
            catch (err) {
                console.log('ERROR: createProductTable: ', err.message)
            }
            resolve(true)
        }
        catch (err) {
            reject(err)
        }
    })
}


module.exports = { queryDb, dbInitialize, queryDbWithTransaction }

// ALTER TABLE `online_book_rental`.`city` 
// CHANGE COLUMN `coutry` `country` VARCHAR(45) NULL DEFAULT NULL ;
