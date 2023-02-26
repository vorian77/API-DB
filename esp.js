"use strict";

require('dotenv').config();
const { espConnect } = require('@vorian77/node_utilities');

module.exports = async function (ctx) {
  const method = ctx.request.method;
  const prefix = '/esp';
  const espFunction = ctx.path.slice(ctx.path.indexOf(prefix) + prefix.length);
  
  const response = await espConnect(method, espFunction, ctx.query);
  ctx.status = response.status;
  ctx.body = response.body;
}
