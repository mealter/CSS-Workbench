// Optional test-only dependency: playwright-core, with a locally installed Chrome.
import http from 'node:http';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {fixture} from './local-backend.mjs';
import handler from '../netlify/functions/api.mjs';
const {chromium}=createRequire(import.meta.url)('playwright-core');
const f=fixture(), server=http.createServer(async(req,res)=>{
  if(req.url==='/api/workbench'){
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const r=await handler(new Request(process.env.SITE_ORIGIN+req.url,{method:req.method,headers:req.headers,body:Buffer.concat(chunks)}),{ip:'127.0.0.1'});
    res.writeHead(r.status,Object.fromEntries(r.headers));res.end(await r.text());return;
  }
  const name=req.url==='/'?'index.html':req.url.slice(1);
  if(!['index.html','account.css','account.js','curriculum.js'].includes(name)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'css':'text/css','js':'text/javascript','html':'text/html'})[name.split('.').pop()]+'; charset=utf-8');
  res.end(await fs.readFile(new URL('../public/'+name,import.meta.url)));
});
await new Promise(r=>server.listen(0,'localhost',r));
const origin=process.env.SITE_ORIGIN='http://localhost:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
const errors=[];
async function open(context) {
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://fonts.**',r=>r.abort());
  await page.goto(origin);return page;
}
async function sign(page,name,register=false) {
  if(register)await page.click('#switchAuth');
  await page.fill('#username',name);await page.fill('#password','school-pass');
  if(register)await page.fill('#confirmation','school-pass');
  await page.click('#submitAuth');await page.waitForSelector('#home');
}
const synced=p=>p.waitForFunction(()=>document.querySelector('#sync').textContent==='Barcha o‘zgarishlar saqlandi');
const route=async(p,path)=>{await p.evaluate(path=>{location.hash=path;},path);await p.waitForFunction(path=>location.hash==='#'+path,path);};
try{
  const a=await browser.newContext(),p=await open(a);
  await p.evaluate(()=>localStorage.setItem('cssworkbench.v1',JSON.stringify({done:{},code:{'borders/border-style':'legacy'},answers:{}})));
  await sign(p,'student01',true);
  assert.equal(await p.locator('#importOld').isVisible(),true);
  await route(p,'borders-1');await p.waitForSelector('#ta');
  assert.notEqual(await p.inputValue('#ta'),'legacy');
  p.once('dialog',dialog=>dialog.accept());await p.click('#importOld');await synced(p);
  assert.equal(await p.inputValue('#ta'),'legacy');
  await p.fill('#ta','/* draft */');await synced(p);await p.reload();await p.waitForSelector('#ta');assert.equal(await p.inputValue('#ta'),'/* draft */');
  const b=await browser.newContext(),q=await open(b);await sign(q,'student01');await route(q,'borders-1');await q.waitForSelector('#ta');
  assert.equal(await q.inputValue('#ta'),'/* draft */');
  await a.setOffline(true);await p.fill('#ta','/* offline */');await q.fill('#ta','/* newer */');await synced(q);
  await a.setOffline(false);await p.waitForSelector('#resolve');await p.click('#keepLocal');await synced(p);
  f.control.quota=true;await p.fill('#ta','/* quota */');await p.waitForFunction(()=>document.querySelector('#sync').textContent.includes('xatolik'));
  f.control.quota=false;await synced(p);await q.reload();await q.waitForSelector('#ta');assert.equal(await q.inputValue('#ta'),'/* quota */');
  const curriculum=await p.evaluate(()=>TOPICS.flatMap(t=>t.steps.map((s,i)=>({path:t.id+'-'+(i+1),quiz:s.questions?.map(q=>q.answer)}))));
  const failures=[];
  for(const step of curriculum){
    await route(p,step.path);
    const result=await p.evaluate(step=>{
      if(step.quiz){
        step.quiz.forEach((a,i)=>document.querySelector('input[name=q'+i+'][value="'+a+'"]').click());
        document.querySelector('#qBtn').click();return document.querySelector('#qBtn').dataset.mode;
      }
      document.querySelector('#solBtn').click();document.querySelector('#useSol').click();document.querySelector('#checkBtn').click();
      return document.querySelector('#checkBtn').dataset.mode;
    },step);
    if(result!=='next') failures.push(step.path);
  }
  await synced(p);console.log('Curriculum steps',curriculum.length,'solution failures',failures);
  assert.deepEqual(failures,[]);
  assert.equal(f.tabs.Progress.rows[1][3],1);
  await p.click('#logout');await p.waitForSelector('#credentials:not([inert])');await p.setViewportSize({width:360,height:780});
  for(const theme of ['light','dark']){
    await p.emulateMedia({colorScheme:theme});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.equal(await p.locator('#credentials').evaluate(e=>getComputedStyle(e).backgroundColor),theme==='light'?'rgb(255, 255, 255)':'rgb(21, 27, 38)');
  }
  await p.evaluate(()=>{location.hash='home';});await sign(p,'student02',true);
  assert.match(await p.textContent('#percent'),/ 0%/);
  await route(p,'borders-1');assert.notEqual(await p.inputValue('#ta'),'/* quota */');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await p.click('button[data-tab="code"]');
  f.control.quota=true;await p.fill('#ta','/* student02 unsent */');
  await p.waitForFunction(()=>document.querySelector('#sync').textContent.includes('xatolik'));
  await p.click('#logout');await p.waitForSelector('#credentials:not([inert])');
  assert.equal((await a.cookies()).some(c=>c.name==='__Host-workbench'),false);
  f.control.quota=false;await route(p,'home');await sign(p,'student01');
  assert.match(await p.textContent('#percent'),/100%/);await route(p,'borders-1');
  assert.notEqual(await p.inputValue('#ta'),'/* student02 unsent */');
  await p.click('#logout');await p.waitForSelector('#credentials:not([inert])');await route(p,'home');
  await sign(p,'student02');await route(p,'borders-1');await synced(p);
  assert.equal(await p.inputValue('#ta'),'/* student02 unsent */');
  assert.deepEqual(errors,[]);console.log('Browser account, offline, quota, conflict, theme, mobile and curriculum checks passed.');
} finally {await browser.close();server.close();f.close();}

