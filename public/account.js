'use strict';
function createAccount({legacyKey,topics,read,restore}) {
  const el=id=>document.getElementById(id);
  const saved='Barcha o‘zgarishlar saqlandi', saving='Saqlanmoqda...', offline='Internet aloqasi mavjud emas', failed='Sinxronlashda xatolik yuz berdi';
  const login='Tizimga kirish', register='Ro‘yxatdan o‘tish';
  const steps=new Map(topics.flatMap(t=>t.steps.map(s=>[t.id+'/'+s.id,s])));
  let user='',revision=0,dirty=false,busy=false,registering=false,timer=0,delay=0,conflict=null,serial=0,closing=false;
  let lastSnapshot='',localOK=true,inFlight=null;
  let draftKey='',base='',otherKey='',invalid=false;
  const identityKey=legacyKey+'.session-change';
  window.addEventListener('storage',event=>{
    if(event.key===identityKey) location.reload();
  });
  function status(t){
    el('sync').textContent=conflict?'Nusxani tanlang.':t;
    el('pending').hidden=!dirty;
    el('pending').textContent=localOK?'Qurilmada saqlandi. Google Sheets hali tasdiqlamadi.':'Qurilmada saqlanmadi. Sahifani yopmang.';
    el('manualSync').disabled=busy||!!conflict||closing||invalid||!navigator.onLine;
  }
  function stamp(receipt){
    const confirmed=receipt.syncedAt||receipt.lastUpdated;
    if(!confirmed)return;
    const date=new Date(confirmed);
    el('lastSync').dateTime=date.toISOString();
    el('lastSync').textContent='Oxirgi sinxronlash: '+date.toLocaleString('uz-UZ');
  }
  const prefix=()=>legacyKey+'.'+user+'.draft.';
  function persist() {
    try {localStorage.setItem(draftKey,JSON.stringify({state:read(),revision}));localOK=true;return true;}
    catch {localOK=false;status('Qurilmada joy yetarli emas. Sahifani yopmang.');return false;}
  }
  async function api(action,data={},keepalive=false) {
    const res=await fetch('/api/workbench',{method:'POST',credentials:'same-origin',keepalive,headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action,...data}),signal:AbortSignal.timeout(30000)});
    const b=await res.json();
    if(!res.ok) throw Object.assign(Error(b.message||failed),{status:res.status});
    return b;
  }
  function updatePercent(percentage=summarizeProgress(steps,read(),true).percentage) {
    el('percent').textContent='Bajarildi: '+Number((percentage*100).toFixed(1))+'%';
  }
  function queue(ms) {
    clearTimeout(timer);
    if(user && dirty && !conflict && !closing) timer=setTimeout(sync,ms);
  }
  function changed(now) {
    if(!user || closing) return;
    updatePercent();
    const next=JSON.stringify(read());
    if(next===lastSnapshot){if(now && dirty)queue(0);return;}
    lastSnapshot=next;
    serial++; dirty=true; invalid=false;
    persist();status(navigator.onLine?(busy?saving:'Sinxronlash kutilmoqda'):offline);queue(delay || (now?0:4000));
  }
  function showConflict(snapshot) {
    conflict=snapshot;
    el('conflictText').textContent='Boshqa nusxa ham saqlangan. Qaysi nusxani ishlatasiz?';
    el('resolve').hidden=false; status('Nusxani tanlang.');
  }
  function sync(keepalive=false) {
    if(busy)return inFlight;
    if(!user||!dirty||closing||conflict||invalid)return;
    inFlight=send(keepalive);
    return inFlight;
  }
  async function send(keepalive) {
    if(!navigator.onLine){status(offline);return;}
    const version=serial, sent=JSON.stringify(read());
    clearTimeout(timer);busy=true;status(saving);
    try {
      const payload={expectedUser:user,state:JSON.parse(sent),revision};
      const small=keepalive && new Blob([JSON.stringify(payload)]).size<60000;
      const result=await api('saveProgress',payload,small);
      revision=result.revision;base=sent;delay=0;stamp(result);
      if(version===serial){dirty=false;localStorage.removeItem(draftKey);updatePercent(result.percentage);status(saved);}
      else {persist();status('Sinxronlash kutilmoqda');queue(0);}
    } catch(e) {
      if(e.status===401){location.reload();return;}
      if(e.status===409) {
        try {showConflict(await api('getProgress',{expectedUser:user}));return;} catch(err){if(err.status===401){location.reload();return;}}
      }
      invalid=e.status===413||e.status===422;
      if(invalid){status(e.message);return;}
      delay=Math.min(120000,Math.max(2000,delay*2));
      status(!navigator.onLine?offline:failed);
      queue(delay+Math.floor(Math.random()*delay/2));
    } finally {busy=false;status(el('sync').textContent);}
  }
  function listDrafts() {
    return Object.keys(localStorage).filter(k=>k.startsWith(prefix()) && k!==draftKey);
  }
  function showImport() {
    otherKey=listDrafts()[0]||'';
    let legacy=false;
    try {legacy=Object.values(JSON.parse(localStorage.getItem(legacyKey)||'{}')).some(x=>x && Object.keys(x).length);}catch{}
    el('importOld').hidden=!otherKey && !legacy;
    el('importOld').textContent=otherKey?'Qurilmadagi qoralamani ochish':'Eski natijalarni import qilish';
  }
  async function enter(name,snapshot) {
    user=name;
    const tabKey=legacyKey+'.'+user+'.tab';
    const previous=sessionStorage.getItem(tabKey);
    const previousKey=previous && prefix()+previous;
    const candidates=listDrafts();
    if(previousKey && candidates.includes(previousKey)){
      candidates.splice(candidates.indexOf(previousKey),1);candidates.unshift(previousKey);
    }
    // Keep the lease until the browser discards this document. Reuse an
    // abandoned key in place, even if localStorage has no space for a copy.
    function claim(key){
      return new Promise((resolve,reject)=>{
        navigator.locks.request(key,{ifAvailable:true},lock=>{
          resolve(Boolean(lock));
          if(lock)return new Promise(()=>{});
        }).catch(reject);
      });
    }
    let cached=null;
    for(const key of candidates){
      if(navigator.locks ? !(await claim(key)) : key!==previousKey)continue;
      const raw=localStorage.getItem(key);
      if(raw){cached=JSON.parse(raw);draftKey=key;break;}
    }
    if(!cached){
      draftKey=prefix()+crypto.randomUUID();
      if(navigator.locks)await claim(draftKey);
    }
    sessionStorage.setItem(tabKey,draftKey.slice(prefix().length));
    revision=snapshot.revision;base=JSON.stringify(snapshot.state);
    el('auth').hidden=true;el('app').hidden=false;el('who').textContent=user;
    const state=cached?cached.state:snapshot.state;
    const fraction=summarizeProgress(steps,state,true).percentage;
    restore(state);updatePercent(fraction);stamp(snapshot);
    lastSnapshot=JSON.stringify(state);
    dirty=lastSnapshot!==base || (typeof snapshot.percentage==='number' && fraction!==snapshot.percentage);
    if(dirty){
      revision=cached?cached.revision:snapshot.revision;
      persist();status('Sinxronlash kutilmoqda');
      if(revision!==snapshot.revision && lastSnapshot!==base) showConflict(snapshot);
      else queue(0);
    }else{localStorage.removeItem(draftKey);status(saved);}
    showImport();
    el('password').value=el('confirmation').value='';
  }
  async function importDraft(key){
    if(busy||conflict||closing) return;
    if(!confirm(otherKey?'Saqlanmagan qoralamani ochasizmi?':'Bu qurilmadagi eski natijalar siznikimi? Hisobingizga qo‘shilsinmi?')) return;
    clearTimeout(timer);el('app').inert=true;
    try {
      const original=localStorage.getItem(key),item=JSON.parse(original);
      const data=otherKey?item.state:item;
      const current=read(),merged={};
      for(const field of ['done','code','answers']) merged[field]={...data[field],...current[field]};
      // A legacy pass and a newer unfinished answer set may refer to the same quiz.
      for(const topic of topics) for(const step of topic.steps){
        const id=topic.id+'/'+step.id;
        if(step.questions && !step.questions.every((q,i)=>merged.answers[id]?.[i]===q.answer)) delete merged.done[id];
      }
      if(otherKey){if(dirty && !confirm('Joriy qoralama o‘rniga tanlangan nusxa ochilsinmi?')) return;
        const cloud=await api('getProgress',{expectedUser:user});
        restore(data);revision=item.revision;changed(true);showConflict(cloud);
      } else {restore(merged);changed(true);}
      if(persist() && localStorage.getItem(key)===original) localStorage.removeItem(key);
      showImport();
    } catch {status(failed);}
    finally {el('app').inert=false;if(dirty&&!conflict)queue(0);}
  };
  el('importOld').onclick=()=>{
    const key=otherKey||legacyKey;
    if(key!==legacyKey && navigator.locks){
      return navigator.locks.request(key,{ifAvailable:true},lock=>{
        if(lock)return importDraft(key);
        status('Qoralama boshqa ochiq sahifada tahrirlanmoqda.');
      });
    }
    return importDraft(key);
  };
  el('keepLocal').onclick=()=>{revision=conflict.revision;conflict=null;el('resolve').hidden=true;dirty=true;persist();queue(0);};
  el('useCloud').onclick=()=>{
    if(!confirm('Qurilmadagi nusxa bulutdagi nusxa bilan almashtirilsinmi?'))return;
    revision=conflict.revision;base=JSON.stringify(conflict.state);lastSnapshot=base;stamp(conflict);restore(conflict.state);
    dirty=false;conflict=null;el('resolve').hidden=true;localStorage.removeItem(draftKey);updatePercent();status(saved);
  };
  el('logout').onclick=async()=>{
    if(closing) return;
    if(dirty && !persist()) return;
    el('app').inert=true;clearTimeout(timer);
    if(navigator.onLine && dirty && !conflict && !invalid){
      if(inFlight)await inFlight;
      if(dirty)await sync();
    }
    closing=true;clearTimeout(timer);
    try {await api('logout');localStorage.setItem(identityKey,crypto.randomUUID());location.reload();} catch {closing=false;el('app').inert=false;status(failed);queue(2000);}
  };
  function mode() {
    el('repeat').hidden=!registering;el('confirmation').required=registering;
    el('authTitle').textContent=el('submitAuth').textContent=registering?register:login;
    el('switchAuth').textContent=registering?login:register;
    el('password').autocomplete=registering?'new-password':'current-password';
    el('authMsg').textContent='';
  }
  el('switchAuth').onclick=()=>{registering=!registering;mode();};
  el('visible').onchange=()=>{el('password').type=el('confirmation').type=el('visible').checked?'text':'password';};
  function loading(on){el('credentials').inert=on;el('credentials').setAttribute('aria-busy',String(on));}
  el('credentials').onsubmit=async e=>{
    e.preventDefault();
    let warning='';
    if(!/^[a-z][a-z0-9_]{2,31}$/i.test(el('username').value.trim())) warning='Nom 3–32 belgidan iborat bo‘lsin. Lotin harfi bilan boshlang. Harf, raqam yoki pastki chiziq ishlating.';
    else if(el('password').value.length<8) warning='Parol kamida 8 belgidan iborat bo‘lsin.';
    else if(registering && el('password').value!==el('confirmation').value) warning='Parollar mos kelmadi.';
    if(warning){el('authMsg').textContent=warning;return;}
    loading(true);el('authMsg').textContent='Kuting...';
    try {
      const result=await api(registering?'register':'login',{username:el('username').value,password:el('password').value,confirmation:el('confirmation').value});
      localStorage.setItem(identityKey,crypto.randomUUID());
      await enter(result.user,result);
    }catch(err){el('authMsg').textContent=err.status?err.message:'Xizmatga ulanib bo‘lmadi. Qayta urinib ko‘ring.';}
    finally{loading(false);}
  };
  el('manualSync').onclick=async()=>{
    if(busy || conflict || closing)return;
    delay=0;
    if(dirty){await sync();return;}
    inFlight=refresh();await inFlight;
  };
  async function refresh(){
    busy=true;status(saving);
    try{
      const cloud=await api('getProgress',{expectedUser:user});
      // The editor remains live during this explicit refresh.
      if(dirty){
        if(cloud.revision!==revision)showConflict(cloud);
        return;
      }
      revision=cloud.revision;base=JSON.stringify(cloud.state);
      const fraction=summarizeProgress(steps,cloud.state,true).percentage;
      const canonical=JSON.stringify(cloud.state);
      if(canonical!==lastSnapshot)restore(cloud.state);
      lastSnapshot=canonical;updatePercent(fraction);stamp(cloud);
      dirty=canonical!==base || fraction!==cloud.percentage;
      if(dirty)persist();
      status(dirty?'Sinxronlash kutilmoqda':saved);
    }catch(e){if(e.status===401)location.reload();else status(navigator.onLine?failed:offline);}
    finally{busy=false;status(el('sync').textContent);if(dirty&&!conflict)queue(0);}
  }
  function flushOnLeave(){
    if(dirty){persist();if(navigator.onLine && !delay)sync(true);}
  }
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushOnLeave();});
  window.addEventListener('pagehide',flushOnLeave);
  window.addEventListener('online',()=>{delay=0;queue(0);if(user&&!dirty)status(saved);});
  window.addEventListener('offline',()=>{if(user)status(offline);});
  setInterval(()=>{if(dirty&&!busy&&!delay)sync();},60000);
  return {changed,async start(){
    loading(true);
    try{const s=await api('getSession',{withProgress:true});await enter(s.user,s);}
    catch(e){if(e.status!==401)el('authMsg').textContent='Hisobni yuklab bo‘lmadi. Ulanishni tekshirib, sahifani yangilang.';}
    finally{loading(false);}
  }};
}

