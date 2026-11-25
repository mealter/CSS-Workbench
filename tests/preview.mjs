import http from 'node:http';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {fixture} from './local-backend.mjs';
import handler from '../netlify/functions/api.mjs';

// Loopback-only review server. Student data exists only in this process.
export async function startPreview(port=0) {
  const f=fixture();
  const server=http.createServer(async(req,res)=>{
    try {
      if(req.url==='/api/workbench'){
        const chunks=[];for await(const chunk of req) chunks.push(chunk);
        const r=await handler(new Request(process.env.SITE_ORIGIN+req.url,{method:req.method,headers:req.headers,body:Buffer.concat(chunks)}),{ip:'127.0.0.1'});
        res.writeHead(r.status,Object.fromEntries(r.headers));res.end(await r.text());return;
      }
      const name=req.url==='/'?'index.html':req.url.slice(1);
      if(!['index.html','account.css','account.js','curriculum.js'].includes(name) && !/^goals\/[a-z0-9-]+\.png$/.test(name)){
        res.writeHead(404);res.end();return;
      }
      const bytes=await fs.readFile(new URL('../public/'+name,import.meta.url));
      res.setHeader('Content-Type',({'css':'text/css','js':'text/javascript','html':'text/html','png':'image/png'})[name.split('.').pop()]);
      res.end(bytes);
    } catch {res.writeHead(404);res.end();}
  });
  await new Promise((resolve,reject)=>server.once('error',reject).listen(port,'localhost',resolve));
  const origin=process.env.SITE_ORIGIN='http://localhost:'+server.address().port;
  return {f,origin,close(){server.close();f.close();}};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  console.log((await startPreview(Number(process.env.PORT)||4173)).origin);
}

