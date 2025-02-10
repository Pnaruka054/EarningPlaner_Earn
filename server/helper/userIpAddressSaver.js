const ipAddress_records_module = require('../model/IPAddress/useripAddresses_records_module');
const userSignUp_module = require('../model/userSignUp/userSignUp_module')

async function useripAddressSaver(req, userDB_id) {
    let ipAddress = req.ip
    let userData_fromIP = await ipAddress_records_module.findOne({ userDB_id });
    if (!userData_fromIP) {
        await new ipAddress_records_module({ ipAddress, userDB_id }).save()
        return false
    } else {
        return true
    }
}


module.exports = useripAddressSaver