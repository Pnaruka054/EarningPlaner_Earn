const route = require('express')()
const other_data_module = require('../model/other_data/other_data_module')
const withdrawal_records_module = require('../model/withdraw/withdrawal_records_module')
const userSignUp_module = require('../model/userSignUp/userSignUp_module')

route.get("/", async (req, res) => {
  try {
    const { faq, paymentProof, privacy_policy, dmca, terms_of_use } = req.query;
    const token = req.cookies.jwtToken;
    let resData = {};

    // If FAQ data is requested
    if (faq) {
      const other_data_faqArray =
        (await other_data_module.find({ documentName: "faq" })) || [];
      const other_data_homepage_Array =
        (await other_data_module.find({ documentName: "homepage" })) || [];
      resData = { ...resData, other_data_faqArray, other_data_homepage_Array };
    }
    // If Payment Proof data is requested
    else if (paymentProof) {
      // Find all withdrawal records with a "Success" status
      const withdrawalRecords = await withdrawal_records_module.find({
        withdrawal_status: "Success",
      });

      // Helper function: Mask username to show first 4 characters, then "x" (with a random max between 6 and 8)
      const maskUserName = (userName) => {
        if (!userName) return "";
        if (userName.length <= 4) return userName;
        const randomMax = Math.floor(Math.random() * 3) + 6; // Generates 6, 7, or 8
        const firstFour = userName.slice(0, 4);
        if (userName.length > randomMax) {
          return firstFour + "x".repeat(randomMax - 4);
        }
        return firstFour + "x".repeat(userName.length - 4);
      };

      // Map each withdrawal record to its corresponding payment proof data
      let paymentProof_data = await Promise.all(
        withdrawalRecords.map(async (record) => {
          const userData = await userSignUp_module.findById(record.userDB_id);
          return {
            userName: maskUserName(userData?.userName),
            withdrawal_method: record.withdrawal_method,
            balance: record.balance,
            time: record.time,
          };
        })
      );

      // Reverse to display the most recent records first
      paymentProof_data = paymentProof_data.reverse();
      resData = { ...resData, paymentProof_data };
    } else if (privacy_policy) {
      const other_data_privacy_policy = await other_data_module.findOne({ documentName: "privacy_policy" });
      resData = { ...resData, privacy_policy_data: other_data_privacy_policy.privacy_policy };
    } else if (dmca) {
      const other_data_dmca = await other_data_module.findOne({ documentName: "dmca" });
      resData = { ...resData, dmca_data: other_data_dmca.dmca };
    } else if (terms_of_use) {
      const other_data_terms_of_use = await other_data_module.findOne({ documentName: "terms_of_use" });
      resData = { ...resData, terms_of_use_data: other_data_terms_of_use.terms_of_use };
    }

    // Set login status based on token existence
    resData = { ...resData, isLogin: !!token };

    return res.status(200).json({
      success: true,
      msg: resData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while processing your request.",
    });
  }
});

module.exports = route