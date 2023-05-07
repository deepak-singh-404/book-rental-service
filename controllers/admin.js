const { queryDb } = require("../database")

const createCity = async (req, res, next) => {
    try {
        const { name, state, state_code, country, country_code } = req.body

        let query = `SELECT name
        FROM city
        WHERE name = "${name}" AND state_code = "${state_code}" AND country_code = "${country_code}";`

        let dbResponse = await queryDb(query)
        if (dbResponse && dbResponse.length !== 0) {
            return res.status(409).json({ message: "Already Exist." })
        }

        query = `INSERT into city(name, state, state_code, country, country_code)
        VALUES ("${name}", "${state}", "${state_code}", "${country}", "${country_code}");`

        const savedCity = await queryDb(query)
        return res.status(201).json({ message: "Created successfully", data: savedCity.insertId})
    }
    catch (err) {
        return res.status(500).json({ error: err.message, message: "Internal Server Error." })
    }
}

const getCity = async (req, res, next) => {
    try {
        const { cityName, cityId } = req.query
        let query = `SELECT *
        FROM city
        WHERE name LIKE "%${cityName}%"`

        let dbResponse = await queryDb(query)

        if (dbResponse && dbResponse.length == 0) {
            return res.status(200).json({ message: "Not Found." })
        }
        return res.status(200).json({ data: dbResponse[0] })
    }
    catch (err) {
        return res.status(500).json({ error: err.message, message: "Internal Server Error." })
    }
}

module.exports = { createCity, getCity }