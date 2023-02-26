"use strict";

const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env')});
const fs = require('fs');
const https = require('https');

const Koa = require('koa');
const Router = require('koa-router');

const esp = require('./esp.js');

//environment parms
const HTTPS_PORT = process.env.HTTPS_PORT
const HTTPS_CERT = process.env.HTTPS_CERT
const HTTPS_CERT_PW = process.env.HTTPS_CERT_PW

// router
const router = new Router();
router.get('/', (ctx) => { ctx.body = 'Hello from the KidSmart ESP API (database)!'});
router.get('/test/echo', (ctx) => { echo(ctx); });
router.all('/esp(.*)', async (ctx) => { await esp(ctx); });

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
  const rtn = 'Query Param(s): ' + JSON.stringify(ctx.query);
  console.log(rtn);
  ctx.body = rtn;
}
