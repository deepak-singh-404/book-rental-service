const express = require('express');

const { createCity, getCity } = require('../controllers/admin');
const { customerSignup, getCustomer } = require('../controllers/customer');
const { publishProduct, getProductsByCity, getPublishedProductsByCustomer, rentProduct, getAllRentedProduct } = require('../controllers/product');
const router = express.Router()


router.get("/health", async (req, res) => {
    try {
        return res.status(200).json({
            "server": "Healthy"
        })
    }
    catch (err) {
        return res.status(500).json({ "error": err.message })
    }
})

//Admin
router.post("/createCity", createCity);
router.get("/getCity", getCity);

//Customer
router.post("/customerSignup", customerSignup);
router.get("/getCustomer", getCustomer);
router.post("/publishProduct", publishProduct);
router.get("/getProductsByCity", getProductsByCity);
router.get("/getPublishedProductsByCustomer", getPublishedProductsByCustomer);
router.post("/rentProduct", rentProduct);
router.get("/getAllRentedProduct", getAllRentedProduct)


module.exports = router