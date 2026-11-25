const USER_HEADERS = ['Username','PasswordHash'];
const PROGRESS_HEADERS = ['Username','CompletedLessons','TotalLessons','CompletionPercentage','QuizMarks','ProgressJSON','LastUpdated','CompletedQuizzes','TotalQuizzes','MaximumQuizMarks','Revision'];
const blankState = () => ({done:{},code:{},answers:{}});
const props = () => PropertiesService.getScriptProperties();
const book = () => SpreadsheetApp.openById(props().getProperty('SHEET_ID'));
function locked(fn) {
  const lock=LockService.getScriptLock();
  lock.waitLock(8000);
  try { return fn(); } finally { try { SpreadsheetApp.flush(); } finally { lock.releaseLock(); } }
}
function setup() {
  locked(() => {
    const ss=book();
    for(const [name,headers] of [['Users',USER_HEADERS],['Progress',PROGRESS_HEADERS]]) {
      let tab=ss.getSheetByName(name);
      if(!tab) {
        const first=ss.getSheets()[0];
        tab=name==='Users' && ss.getSheets().length===1 && first.getLastRow()===0 ? first.setName(name) : ss.insertSheet(name);
      }
      if(tab.getLastRow() && JSON.stringify(tab.getRange(1,1,1,headers.length).getValues()[0])!==JSON.stringify(headers)) throw Error('Unexpected headers: '+name);
      tab.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');
      tab.setFrozenRows(1);
      tab.getRange('A2:A').setNumberFormat('@');
      if(name==='Progress'){
        tab.getRange('D2:D').setNumberFormat('0.0%');
        tab.getRange('G2:G').setNumberFormat('yyyy-mm-dd hh:mm:ss');
      }
    }
  });
}
function rowFor(tab,user) {
  const n=tab.getLastRow()-1;
  if(n<1) return 0;
  const hit=tab.getRange(2,1,n,1).createTextFinder(user).matchEntireCell(true).findNext();
  return hit?hit.getRow():0;
}
function readRow(tab,row) {
  const n=tab.getLastColumn();
  const headers=tab.getRange(1,1,1,n).getValues()[0];
  const cells=tab.getRange(row,1,1,n).getValues()[0];
  let json=cells[5];
  for(let i=2;headers.includes('JSON '+i);i++) json+=String(cells[headers.indexOf('JSON '+i)]||'').slice(1);
  return {state:JSON.parse(json),revision:cells[10]};
}
function writeRow(tab,row,user,state,s,revision) {
  if(row>tab.getMaxRows()) tab.insertRowsAfter(tab.getMaxRows(),100);
  const json=JSON.stringify(state);
  const pieces=[];
  for(let i=0;i<json.length;) {
    let end=Math.min(i+40000,json.length);
    if(end<json.length && /[\uD800-\uDBFF]/.test(json[end-1])) end--;
    pieces.push(json.slice(i,end)); i=end;
  }
  const headers=tab.getRange(1,1,1,tab.getLastColumn()).getValues()[0];
  const values=[user,s.practice,s.lessons,s.percentage,s.marks,pieces[0],new Date(),s.passed,s.quizzes,s.max,revision];
  const extras=Object.entries(s.individual).map(([k,v])=>['Quiz '+k,v]);
  pieces.slice(1).forEach((part,i)=>extras.push(['JSON '+(i+2),'~'+part]));
  const oldWidth=headers.length;
  for(const [name,value] of extras) {
    if(!headers.includes(name)) headers.push(name);
    values[headers.indexOf(name)]=value;
  }
  if(headers.length>tab.getMaxColumns()) tab.insertColumnsAfter(tab.getMaxColumns(),headers.length-tab.getMaxColumns());
  if(headers.length>oldWidth) tab.getRange(1,oldWidth+1,1,headers.length-oldWidth).setValues([headers.slice(oldWidth)]).setFontWeight('bold');
  // One row write replaces both summary and all chunks, including stale trailing chunks.
  tab.getRange(row,1,1,headers.length).setValues([headers.map((_,i)=>values[i]===undefined?'':values[i])]);
}
function reject(code) {throw Object.assign(new Error('request'),{code});}
function fingerprint(hash,secret) {
  return Utilities.computeHmacSha256Signature(hash,secret).map(x=>('0'+((x+256)%256).toString(16)).slice(-2)).join('');
}
// Fixed-size, durable counters in Script Properties. Collisions share a limit.
function throttle(user,ip) {
  const windowId=Math.floor(Date.now()/600000);
  const bucket=v=>(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,v)[0]+256)%256;
  const p=props(), updates={};
  for(const [id,limit] of [['u'+bucket(user),12],['i'+bucket(ip),160]]) {
    const [window,count]=(p.getProperty(id)||'0/0').split('/').map(Number);
    const next=window===windowId?count+1:1;
    if(next>limit) reject(429);
    updates[id]=windowId+'/'+next;
  }
  p.setProperties(updates);
}
function operation(b,secret) {
  if(typeof b.user!=='string'|| !/^[a-z][a-z0-9_]{2,31}$/.test(b.user)) reject(400);
  const ss=book(),users=ss.getSheetByName('Users'),tab=ss.getSheetByName('Progress');
  const u=rowFor(users,b.user);
  const hash=u?users.getRange(u,2).getValue():'';
  if(b.op==='attempt'){throttle(b.user,b.ip);return {hash};}
  const row=rowFor(tab,b.user);
  if(b.op==='create'){
    if(u) reject(409);
    if(!/^scrypt\$32768\$8\$3\$[0-9a-f]{32}\$[0-9a-f]{128}$/.test(b.hash)) reject(400);
    const state=blankState();
    writeRow(tab,row||tab.getLastRow()+1,b.user,state,b.summary,0);
    SpreadsheetApp.flush();
    users.appendRow([b.user,b.hash]);
    return {state,revision:0};
  }
  if(!u || !(b.op==='read' && b.credential===hash || b.fingerprint===fingerprint(hash,secret))) reject(401);
  if(!row) throw Error('missing progress');
  const old=readRow(tab,row);
  if(b.op==='read') return old;
  if(b.op!=='save') reject(400);
  if(JSON.stringify(old.state)===JSON.stringify(b.state)) return {revision:old.revision};
  if(b.revision!==old.revision) reject(409);
  writeRow(tab,row,b.user,b.state,b.summary,old.revision+1);
  return {revision:old.revision+1};
}
function doPost(e) {
  let result;
  try {
    if(!e.postData || e.postData.contents.length>1000000) reject(400);
    const b=JSON.parse(e.postData.contents),secret=props().getProperty('GAS_SECRET');
    if(!secret||secret.length<40||secret!==b.secret) reject(403);
    result=locked(()=>operation(b,secret));
  }catch(err){result={error:err.code||503};}
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
// Run only from the bound editor. No web route dispatches this function.
function resetStudentPassword() {
  const ui=SpreadsheetApp.getUi();
  const answer=ui.prompt('Parolni yangilash','Foydalanuvchi nomini kiriting.',ui.ButtonSet.OK_CANCEL);
  if(answer.getSelectedButton()!==ui.Button.OK) return;
  const user=answer.getResponseText().trim().toLowerCase();
  if(!/^[a-z][a-z0-9_]{2,31}$/.test(user)) throw Error('Invalid username');
  const password=Utilities.getUuid().replace(/-/g,'');
  const origin=props().getProperty('SITE_ORIGIN');
  if(!/^https:\/\/[a-z0-9.-]+$/.test(origin)) throw Error('Check SITE_ORIGIN');
  const response=UrlFetchApp.fetch(origin+'/api/workbench',{method:'post',contentType:'application/json',followRedirects:false,
    headers:{'x-workbench-secret':props().getProperty('GAS_SECRET')},payload:JSON.stringify({action:'adminHash',password})});
  const {hash}=JSON.parse(response.getContentText());
  if(!/^scrypt\$32768\$8\$3\$[0-9a-f]{32}\$[0-9a-f]{128}$/.test(hash)) throw Error('Invalid gateway response');
  locked(()=>{
    const tab=book().getSheetByName('Users'),row=rowFor(tab,user);
    if(!row) throw Error('User not found');
    tab.getRange(row,2).setValue(hash);
  });
  ui.alert('Yangi parolni o‘quvchiga shaxsan bering: '+password);
}

