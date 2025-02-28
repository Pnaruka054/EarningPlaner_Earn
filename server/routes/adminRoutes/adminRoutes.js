const route = require('express')()
const adminDashboardController = require('../../controllers/adminController/adminController')

route.get("/getDashboardData", adminDashboardController.getDashboardData)
route.get("/getViewAdsData", adminDashboardController.getViewAdsData)
route.get("/getShortLinkData", adminDashboardController.getShortLinkData)
route.get("/adminLogout", adminDashboardController.adminLogout)
route.get("/getWithdrawalsData", adminDashboardController.getWithdrawalsData)
route.get("/getUserData", adminDashboardController.getUserData)

route.post("/adminLogin", adminDashboardController.adminLogin)
route.post("/post_newAnnouncement_data", adminDashboardController.post_newAnnouncement_data)
route.post("/post_newFaq_data", adminDashboardController.post_newFaq_data)
route.post("/post_withdrawalMethod_data", adminDashboardController.post_withdrawalMethod_data)
route.post("/post_viewAds_directLink_data", adminDashboardController.post_viewAds_directLink_data)
route.post("/post_ShortenLink_data", adminDashboardController.post_ShortenLink_data)

route.patch("/update_referral_data", adminDashboardController.update_referral_data)
route.patch("/patch_announcement_data", adminDashboardController.patch_announcement_data)
route.patch("/patch_faq_data", adminDashboardController.patch_faq_data)
route.patch("/patch_withdrawalMethod_data", adminDashboardController.patch_withdrawalMethod_data)
route.patch("/update_viewAds_data", adminDashboardController.update_viewAds_data)
route.patch("/patch_viewAds_directLink_data", adminDashboardController.patch_viewAds_directLink_data)
route.patch("/update_ShortLink_data", adminDashboardController.update_ShortLink_data)
route.patch("/patch_ShortenLink_data", adminDashboardController.patch_ShortenLink_data)
route.patch("/updateWithdrawalsData", adminDashboardController.updateWithdrawalsData)

route.delete("/delete_announcement_data", adminDashboardController.delete_announcement_data)
route.delete("/delete_faq_data", adminDashboardController.delete_faq_data)
route.delete("/delete_withdrawalMethod_data", adminDashboardController.delete_withdrawalMethod_data)
route.delete("/delete_viewAds_directLink_data", adminDashboardController.delete_viewAds_directLink_data)
route.delete("/delete_ShortenLink_data", adminDashboardController.delete_ShortenLink_data)

module.exports = route