"use strict";

require('dotenv').config();
const http = require('./util/http.js');

module.exports = async function (ctx) {
  encryptPassword(ctx);
  return await transmit(ctx);
}

function encryptPassword(ctx) {
  if (ctx.query.password) {
    console.log('query includes password...');  
  }
}

async function transmit(ctx) {
  const method = ctx.request.method;
  const prefix = '/esp';
  const espFunction = ctx.path.slice(ctx.path.indexOf(prefix) + prefix.length);

  const url = process.env.ESP_DB_URL + espFunction;
    
  try {
    const rtn = await http(method, url, ctx);
    ctx.status = rtn.status;

    // ESP specific success processing
    if (Array.isArray(rtn.data)) {
      ctx.body = (rtn.data.length == 1) ? rtn.data[0] : rtn.data;
    } else {
      ctx.body = rtn.data
    }  
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

  } catch(err) {
    ctx.status = err.status;
    ctx.body = err.response.data || err.message;
  }        
}
