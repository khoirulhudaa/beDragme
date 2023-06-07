const privacyPolicy = async (req, res) => {
    await res.render('privacyPolicy')
}

const termsOfService = async (req, res) => {
    await res.render('termsOfService')
}

module.exports = {
    privacyPolicy,
    termsOfService
}