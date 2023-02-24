"use strict";

require('dotenv').config();
const http_request = require('@vorian77/node_utilities');

module.exports.espConnect = async function (ctx) {
  await setPath(ctx);
  await encryptPassword(ctx);
  await transmit(ctx);
}

// functions
async function setPath(ctx) {
  // set path as the esp web service name
  const prefix = '/esp';
  ctx.path = ctx.path.slice(ctx.path.indexOf(prefix) + prefix.length);
}

async function encryptPassword(ctx) {
  if (ctx.query.password) {
    console.log('has pw');  
  } 
}

async function transmit(ctx) {
  const method = ctx.request.method;
  const url = process.env.ESP_DB_URL + ctx.path;
  const parms = ctx.query;
    
  try {
    const rtn = await http_request(method, url, parms);

    // ESP specific success processing
    if (Array.isArray(rtn.data)) {
        ctx.body = (rtn.data.length == 1) ? rtn.data[0] : rtn.data;
    } else {
      ctx.body = rtn.data
    } 

    ctx.status = rtn.status
      
  } catch(err) {
    console.log('espConnect error...');
    const body = JSON.stringify(err.response.data) || err.response.statusText || err.message;
    const status = parseInt(err.response.status);
    
    const newErr = new Error(body);
    newErr.status = status;
    throw newErr;
  }        
}

module.exports.http_request = async function (ctx) {
  const method = ctx.query.method;
  const url = ctx.query.url;
  try {
    const response = await http_request(method, url, ctx.query);
    ctx.body = response.statusText;
    ctx.status = response.status;
  } catch(err) {
    throw err;
  }
}