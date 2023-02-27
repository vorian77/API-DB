"use strict";

const axios = require('axios'); 

module.exports = async function (method, url, queryParms) {
  let options = { 
    method, 
    url, 
    params: queryParms, 
    timeout: 1000 
  };
    
  try {
      console.error('Axios options...', options);
      const response = await axios(options);
      console.error('Axios successful.');
      return response
    } catch(err) {
      err.status = err.response.status;
      throw err;
    }
}
