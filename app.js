"use strict";

const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env')});
const fs = require('fs');
const https = require('https');

const Koa = require('koa');
const Router = require('koa-router');

const esp = require('./esp.js');
const { testEcho, testHttp } = require('./tests.js');

// router
const router = new Router();
router.all('/', (ctx) => { ctx.body = 'Hello from the KidSmart API-ESP Database!'});
router.all('/test/echo', (ctx) => { testEcho(ctx); });
router.all('/test/http', async (ctx) => { await testHttp(ctx); });
router.all('/esp(.*)', async (ctx) => { await esp(ctx); });

// app
const app = new Koa();
app.use(router.routes());
  
// https listener - certificates  
var options = {
  pfx: fs.readFileSync(process.env.HTTPS_CERT),
  passphrase: process.env.HTTPS_CERT_PW
}

// https listener - listener
const HTTPS_PORT = process.env.HTTPS_PORT
https
  .createServer(options, app.callback())
  .listen(HTTPS_PORT, () => { console.log(`Server listening on port: ${HTTPS_PORT}`) });
