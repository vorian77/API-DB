"use strict";

const axios = require('axios'); 
const qs = require('qs'); 

module.exports = async function (method, url, ctx) {
  let options = { method, url };

  switch(method.toLowerCase()) {
    case 'get':
      options.params = ctx.query;
      break;

    default:  // put, post, delete, patch
      options.data = qs.stringify(ctx.request.body);
  }
    
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

