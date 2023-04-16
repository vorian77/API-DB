"use strict"

require("dotenv").config()
const { httpEsp, httpAxios } = require("./util/http.js")

module.exports = async function (ctx) {
  encryptPassword(ctx)
  return await transmit(ctx)
}

function encryptPassword(ctx) {
  if (ctx.query.password) {
    console.log("query includes password...")
  }
}

async function transmit(ctx) {
  const method = ctx.request.method
  const prefix = "/esp"
  const espFunction = ctx.path.slice(ctx.path.indexOf(prefix) + prefix.length)

  const url = process.env.ESP_DB_URL + espFunction

  try {
    const rtn = await httpEsp(method, url, ctx)
    ctx.status = rtn.status

    // ESP specific success processing
    if (Array.isArray(rtn.data)) {
      ctx.body = rtn.data.length == 1 ? rtn.data[0] : rtn.data
    } else {
      ctx.body = rtn.data
    }
    await postProcess(ctx, espFunction)
  } catch (err) {
    console.error(err.message)
    ctx.status = err.status
    ctx.body = err.response.data || err.message
  }
}

async function postProcess(ctx, espFunction) {
  if (espFunction.toLowerCase() == "/ws_cm_ssr_site") {
    await postProcessSiteChangeAlert(ctx)
  }
}

async function postProcessSiteChangeAlert(ctx) {
  const method = "POST"
  const URL = "https://moed-yo-api.theappfactory.com/msg/send_email_alert_esp"
  const dataQuery = {}
  const dataBody = {
    applicantId: ctx.request.body.applicantId,
    alertType: "Site Change",
    content: "The applicant selected or changed their site.",
  }
  const rtn = await httpAxios(method, URL, dataQuery, dataBody)
  console.log("esp", "done")
}
