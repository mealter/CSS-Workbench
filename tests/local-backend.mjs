// Test adapter. Execute Code.gs against in-memory Sheets, Properties and Utilities.
import vm from 'node:vm';
import fs from 'node:fs';
import {createHash,createHmac,randomBytes} from 'node:crypto';
import handler from '../netlify/functions/api.mjs';
class Tab {
  rows=[];
  getLastRow(){return this.rows.length;}
  getLastColumn(){return Math.max(0,...this.rows.map(r=>r.length));}
  getMaxColumns(){return 100;}
  getMaxRows(){return 1000;}
  getRange(r,c,h=1,w=1){
    const tab=this;
    return {
      getValues:()=>Array.from({length:h},(_,i)=>Array.from({length:w},(_,j)=>tab.rows[r-1+i]?.[c-1+j]??'')),
      getValue:()=>tab.rows[r-1]?.[c-1]??'',
      setValue(value){return this.setValues([[value]]);},
      setValues(matrix){matrix.forEach((row,i)=>{tab.rows[r-1+i]??=[];row.forEach((x,j)=>tab.rows[r-1+i][c-1+j]=x);});return this;},
      setFontWeight(){return this;},setNumberFormat(){return this;},
      createTextFinder:value=>({matchEntireCell(){return this;},findNext(){const i=tab.rows.findIndex((v,i)=>i>=r-1&&v[c-1]===value);return i<0?null:{getRow:()=>i+1};}})
    };
  }
  appendRow(values){this.rows.push(values);}
  setFrozenRows(){}
}
export function fixture() {
  const tabs={},settings=new Map(),secret=randomBytes(32).toString('hex');
  Object.assign(process.env,{SITE_ORIGIN:'http://localhost',GAS_URL:'https://script.invalid/exec',GAS_SECRET:secret,SESSION_SECRET:randomBytes(32).toString('hex')});
  settings.set('GAS_SECRET',secret);
  const db={getSheetByName:k=>tabs[k],getSheets:()=>Object.values(tabs),insertSheet:k=>(tabs[k]=new Tab())};
  tabs.Users=new Tab();
  const ctx=vm.createContext({
    SpreadsheetApp:{openById:()=>db,flush(){}},
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
    PropertiesService:{getScriptProperties:()=>({getProperty:k=>settings.get(k),setProperties:o=>Object.entries(o).forEach(([k,v])=>settings.set(k,v))})},
    Utilities:{DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(algo,v)=>[...createHash(algo).update(v).digest()],
      computeHmacSha256Signature:(v,k)=>[...createHmac('sha256',k).update(v).digest()]},
    ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>text})}
  });
  vm.runInContext(fs.readFileSync(new URL('../apps-script/Code.gs',import.meta.url),'utf8'),ctx);
  ctx.setup();ctx.setup();
  const original=global.fetch;
  const control={quota:false};
  global.fetch=async (url,options)=>{
    if(url!==process.env.GAS_URL)return original(url,options);
    return new Response(control.quota?'{"error":503}':ctx.doPost({postData:{contents:options.body}}));
  };
  const api=(data,cookie='',headers={})=>handler(new Request(process.env.SITE_ORIGIN+'/api/workbench',{method:'POST',
    headers:{origin:process.env.SITE_ORIGIN,'content-type':'application/json',cookie,...headers},body:JSON.stringify(data)}),{ip:'127.0.0.1'});
  return {api,tabs,ctx,control,close:()=>{global.fetch=original;}};
}

