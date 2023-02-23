require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});
const Koa = require('koa');
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Router = require('koa-router');
const axios = require('axios'); 
const qs = require('qs'); 

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 8080;

router.get('/', (ctx) => { ctx.body = 'Hello From Google App Engine Test!'});
router.get('/echo', (ctx) => { echo(ctx); });
router.post('/request', async (ctx) => { await request(ctx); });

app
  .use(parser())
  .use(cors())
  .use(router.routes())
  .listen(port, () => { console.log(`Server listening on port: ${port}`)})
  
function echo(ctx) {
  const rtn = `echo value: ${ctx.query.parmValue}`; 
  console.log(rtn);
  ctx.body = rtn;
}

async function request(ctx) {
  const url = "https://esp1.kssc.com:8443/ws_test"
  const queryParms = qs.stringify(ctx.query);
  const options = { method: "post", url, data: queryParms }
  
  console.log('Axios options...', options);
  const rtn = await axios(options);
  console.log('Axios successful.');
  ctx.body = rtn.data[0];
}