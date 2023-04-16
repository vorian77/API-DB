"use strict"

const axios = require("axios")
const qs = require("qs")

async function httpEsp(method, url, ctx) {
  return await httpAxios(method, url, ctx.query, ctx.request.body)
}

async function httpAxios(method, url, dataQuery, dataBody) {
  const data =
    method.toLowerCase() == "get"
      ? { params: dataQuery }
      : { data: qs.stringify(dataBody) }

  const options = { method, url, ...data }
  try {
    console.error("Axios options...", options)
    const response = await axios(options)
    console.error("Axios successful.")
    return response
  } catch (err) {
    err.status = err.response.status
    throw err
  }
}

exports.httpEsp = httpEsp
exports.httpAxios = httpAxios
