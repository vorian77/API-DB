"use strict"

const { httpAxios } = require("./util/http.js")

module.exports.testEcho = function (ctx) {
  const rtn = "Query Param(s): " + JSON.stringify(ctx.query)
  console.log(rtn)
  ctx.body = rtn
  ctx.status = 200
}

module.exports.testHttp = async function (ctx) {
  const method = ctx.request.method
  const url = ctx.query.url
  const dataQuery = ctx.query
  const dataBody = ctx.request.body

  try {
    const response = await httpAxios(method, url, dataQuery, dataBody)
    ctx.status = response.status
    ctx.body = response.statusText
  } catch (err) {
    throw err
  }
}
