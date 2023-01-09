module.exports={
  login:{
    otpValidation:300, // 5 minutes
    "2FactorAuthentication":true,
    maxBadPasswordAttempt: 3,
    maxOTPAttempt: 5, //count
    loginAttempt: 5, //count
    accountLockDuration: 5, //duration in minutes
    userAccessValidation: 3600, //to access user related api //valid for one hour
  }
}
