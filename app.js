"use strict";

const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env')});
const fs = require('fs');
const https = require('https');

const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const Router = require('koa-router');

const { testEcho, testHttp } = require('./tests.js');
const esp = require('./esp.js');
const appGyver = require('./appGyver.js');

// router
const router = new Router();
router.all('/', (ctx) => { ctx.body = 'Hello from the KidSmart API-ESP Database!'});
router.all('/test/echo', (ctx) => { testEcho(ctx); });
router.all('/test/http', async (ctx) => { await testHttp(ctx); });
router.all('/esp(.*)', async (ctx) => { await esp(ctx); });
router.all('/ag(.*)', async (ctx) => { await appGyver(ctx); });

// app
const app = new Koa();
app
  .use(handleErrors)
  .use(cors())
  .use(koaBody())
  .use(router.routes());

// error handler for all processing within app
async function handleErrors(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    console.error(err.stack);
    ctx.body = { 
      status: ctx.status,
      message: err.stack 
    };
  }
};

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
