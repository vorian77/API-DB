"use strict";

const { http } = require('@vorian77/node_utilities');

module.exports.testEcho = function (ctx) {
  const rtn = 'Query Param(s): ' + JSON.stringify(ctx.query);
  console.log(rtn);
  ctx.body = rtn;
  ctx.status = 200;
}

module.exports.testHttp = async function (ctx) {
  const method = ctx.request.method;
  const url = ctx.query.url;
  const query = ctx.query;

  try {
    const response = await http(method, url, query);
    ctx.status = response.status;
    ctx.body = response.statusText;
  } catch(err) {
    throw err;
  }
}
