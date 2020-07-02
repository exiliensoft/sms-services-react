const axios = require("axios");
const config = require("../config")

module.exports = () => {
  let returnValue = { token: "" };
  const ytelAccessToken = async (_) => {
    returnValue.token = await axios.post(
      "https://api-beta.ytel.com/auth/v2/token/",
      {
        captcha: "",
        grantType: "resource_owner_credentials",
        password: config.ytelPassword,
        refreshToken: "",
        username: config.ytelUsername,
      }
    );
  };
  ytelAccessToken();
  setInterval(() => {
    ytelAccessToken();
  }, 25 * 1000 * 60);
  return returnValue;
};
