const { default: axios } = require("axios");

const AxiosService = async (url) => {
  return new Promise(async (resolve, reject) => {
    const _url = url == null ? url : encodeURI(url);
    try {
      const response = await axios.get(_url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip,deflate",
        },
      });
      if (response.status === 200) {
        return resolve(response);
      }
      return reject(response);
    } catch (error) {
      return reject(error.message);
    }
  });
};

module.exports = { AxiosService };
