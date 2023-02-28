"use strict";

const esp = require('./esp.js');

module.exports = async function (ctx) {
  // AppGyver uses query parms for all http methods
  if (ctx.request.method.toLowerCase() != 'get') { ctx.request.body = ctx.query };
  console.log(ctx.url);
  ctx.url = ctx.url.replace("/ag", "/esp");
  await esp(ctx);    
}
