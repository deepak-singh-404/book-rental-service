const { queryDb } = require("../database")

const publishProduct = async (req, res, next) => {
    try {
        const { title, description, genre, cover_page, author,
            language, product_condition, edition,
            city_id, rent_per_month, published_by, security_deposit } = req.body

        // let query = `START TRANSACTION;
        //     INSERT INTO product(title, description, genre, cover_page, author, language, product_condition, edition)
        //     VALUES ("${title}", "${description}", "${genre}", "${cover_page}", "${author}", "${language}", "${product_condition}", "${edition}");
        //     COMMIT;`
        let query = ` INSERT INTO product(title, description, genre, cover_page, author, language, product_condition, edition)
        VALUES ("${title}", "${description}", "${genre}", "${cover_page}", "${author}", "${language}", "${product_condition}", "${edition}");`
        const savedProduct = await queryDb(query)

        query = `INSERT INTO customer_product_mapping(product_id, city_id, published_by, 
            rented_by, rented_on, rented_till, rent_duration, status, rent_per_month, agreed_rent, security_deposit)
            VALUES ("${savedProduct.insertId}", "${city_id}", "${published_by}",
             NULL, NULL, NULL, NULL, "${"PUBLISHED"}", "${rent_per_month}", NULL, "${security_deposit}");`
        await queryDb(query)
        return res.status(200).json({ message: "Created Successfully" })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error.", error: err.message })
    }
}

const getProductsByCity = async (req, res, next) => {
    try {
        const { city_id } = req.query
        let query = `SELECT *
        FROM product p
        JOIN customer_product_mapping cpm ON p.id = cpm.product_id
        WHERE cpm.city_id = "${city_id}";`
        let dbResponse = await queryDb(query)
        return res.status(200).json({ message: "Fetched successfully.", data: dbResponse })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error.", error: err.message })
    }
}

const getPublishedProductsByCustomer = async (req, res, next) => {
    try {
        const { customer_id } = req.query
        let query = `SELECT *
        FROM product p
        JOIN customer_product_mapping cpm ON p.id = cpm.product_id
        WHERE cpm.published_by = "${customer_id}";`
        let dbResponse = await queryDb(query)
        return res.status(200).json({ message: "Fetched successfully.", data: dbResponse })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error.", error: err.message })
    }
}

const rentProduct = async (req, res, next) => {
    try {
        const { product_id, rented_by, rent_duration, agreed_rent } = req.body

        let query = `UPDATE customer_product_mapping
        SET rented_by = "${rented_by}",
            rented_on = NOW(),
            rented_till = NULL,
            rent_duration = "${rent_duration}",
            agreed_rent = "${agreed_rent}",
            status = "RENTED"
        WHERE product_id = "${product_id}";`
        await queryDb(query)
        return res.status(200).json({ message: "Done." })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error.", error: err.message })
    }

}

const getAllRentedProduct = async (req, res, next) => {
    try {
        const { customer_id } = req.query
        let query = `SELECT *
            FROM product p
            JOIN customer_product_mapping cpm ON p.id = cpm.product_id
            WHERE cpm.rented_by = "${customer_id}";`
        let dbResponse = await queryDb(query)
        return res.status(200).json({ message: "Fetched successfully.", data: dbResponse })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error.", error: err.message })
    }
}

module.exports = {
    publishProduct, getProductsByCity,
    getPublishedProductsByCustomer, rentProduct, getAllRentedProduct
}