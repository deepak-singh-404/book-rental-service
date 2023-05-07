const { queryDb } = require("../database")

const customerSignup = async (req, res, next) => {
    try {
        const { first_name, last_name, phone_number, email, city_id } = req.body

        let query = `SELECT id
        FROM customer
        WHERE phone_number = "${phone_number}" OR email = "${email}";`
        let dbResponse = await queryDb(query)

        if (dbResponse && dbResponse.length > 0) {
            return res.status(409).json({ message: "Already Exist." })
        }

        query = `INSERT into customer(first_name, last_name, phone_number, email, city_id)
        VALUES ("${first_name}", "${last_name}", "${phone_number}", "${email}", "${city_id}")`
        await queryDb(query)

        return res.status(201).json({ message: "Created successfully." })
    }
    catch (err) {
        return res.status(200).json({ message: "Internal Server Error.", error: err.message })
    }
}

const getCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.query
        let query = `SELECT *
        FROM customer
        WHERE id="${customerId}"`
        let dbResponse = await queryDb(query)
        if (dbResponse && dbResponse.length === 0) {
            return res.status(200).json({ message: "Not Found." })
        }
        return res.status(200).json({ data: dbResponse[0] })
    }
    catch (err) {
        return res.status(200).json({ message: "Internal Server Error.", error: err.message })
    }
}


module.exports = { customerSignup, getCustomer }