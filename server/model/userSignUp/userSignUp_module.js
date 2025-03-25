const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile_number: { type: Number },
    email_address: { type: String, required: true },
    password: { type: String },
    withdrawable_amount: { type: String },
    deposit_amount: { type: String },
    pending_withdrawal_amount: { type: String },
    total_withdrawal_amount: { type: String },
    withdrawal_account_information: { type: String },
    refer_by: { type: String },
    withdrawal_method: { type: String },
    zip_code: { type: Number },
    state: { type: String },
    city: { type: String },
    userName: { type: String },
    address: { type: String },
    google_id: { type: String },
    isBan: { type: Boolean },
    banUserDeleteOn: { type: Date },
    lastModified: { type: Date, default: Date.now } // ✅ Auto-delete field
});

// ✅ Auto update `lastModified` before save & update
userSchema.pre(['save', 'updateOne', 'findOneAndUpdate', 'updateMany', 'findByIdAndUpdate'], function (next) {
    this.set({ lastModified: new Date() });
    next();
});

// ✅ Auto update `lastModified` on `findOne` & `findById`
userSchema.post(['findOne', 'findById'], async function (doc) {
    if (doc) await doc.updateOne({ $set: { lastModified: new Date() } });
});

// ✅ Function to drop & recreate TTL index automatically
async function updateTTLIndex(expireAfterSeconds = 86400) {
    const collection = mongoose.connection.db.collection('usersignups'); // ✅ Change this to your collection name
    await collection.dropIndex("lastModified_1").catch(() => { }); // ✅ Drop old index if exists
    await collection.createIndex({ lastModified: 1 }, { expireAfterSeconds }); // ✅ Create new index
    console.log(`✅ TTL Index Updated: ${expireAfterSeconds} sec`);
}

// ✅ Auto update TTL index when server starts
mongoose.connection.once("open", () => {
    updateTTLIndex(31536000); // 🔥 Change TTL time here (1 Year = 31536000 sec)
});

const userSignUp_module = mongoose.model('userSignUp', userSchema);
module.exports = userSignUp_module;
