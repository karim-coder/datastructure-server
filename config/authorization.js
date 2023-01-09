module.exports = {
  admin: {
    authNotRequire: [
      "/admin",
      "/verify/otp",
      "/process/verify/otp",
      "/process/mobileno/login",
      "/process/current/version",
      "/accountLogin",
      "/islogin",
    ], // admin mush validate authorization require for this end points then only they can process
    language: [],
  },
  user: {
    authNotRequire: ["/accountLogin", "/create", "/islogin", "/logout"],
    language: [],
  },
};
