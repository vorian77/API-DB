"use strict";

const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env')});
const fs = require('fs');
const https = require('https');
const qs = require('qs'); 

const Koa = require('koa');
const Router = require('koa-router');

const { http_request, espConnect } = require('./esp.js');

//environment parms
const HTTPS_PORT = process.env.HTTPS_PORT
const HTTPS_CERT = process.env.HTTPS_CERT
const HTTPS_CERT_PW = process.env.HTTPS_CERT_PW

// router
const router = new Router();
router.get('/', (ctx) => { ctx.body = 'Hello from the KidSmart ESP database API!'});
router.get('/test/echo', (ctx) => { echo(ctx); });
router.all('/test/http_request', async (ctx) => { await http_request(ctx); });
router.all('/esp(.*)', async (ctx) => { await espConnect(ctx); });

// app
const app = new Koa();
app.use(router.routes());
  
// https listener - certificates  
var options = {
  pfx: fs.readFileSync(HTTPS_CERT),
  passphrase: HTTPS_CERT_PW
}

// https listener - listener
https
  .createServer(options, app.callback())
  .listen(HTTPS_PORT, () => { console.log(`Server listening on port: ${HTTPS_PORT}`) });

function echo(ctx) {
  const rtn = 'Query Param(s): ' + qs.stringify(ctx.query);
  console.log(rtn);
  ctx.body = rtn;
}
