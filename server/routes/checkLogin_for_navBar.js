const route = require('express')()
const other_data_module = require('../model/other_data/other_data_module')

route.get('/', async (req, res) => {
    try {
        let { faq } = req.query
        const token = req.cookies.jwtToken;

        let resData = {

        }
        if (faq) {
            const other_data_faqArray = await other_data_module.find({ documentName: "faq" }) || [];
            resData = { ...resData, other_data_faqArray }
        }
        if (!token) {
            resData = { ...resData, isLogin: false }
        } else if (token) {
            resData = { ...resData, isLogin: true }
        }
        res.status(200).json({
            success: true,
            msg: resData
        })
    } catch (error) {

    }
})

module.exports = route