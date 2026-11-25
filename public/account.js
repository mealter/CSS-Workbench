'use strict';
function createAccount({legacyKey,topics,read,restore}) {
  const el=id=>document.getElementById(id);
  const saved='Barcha o‘zgarishlar saqlandi', saving='Saqlanmoqda...', offline='Internet aloqasi mavjud emas', failed='Sinxronlashda xatolik yuz berdi';
  const login='Tizimga kirish', register='Ro‘yxatdan o‘tish';
  const steps=topics.flatMap(t=>t.steps.map(s=>t.id+'/'+s.id));
  let user='',revision=0,dirty=false,busy=false,registering=false,timer=0,delay=0,conflict=null,serial=0,closing=false;
  let draftKey='',base='',otherKey='',invalid=false;
  const identityKey=legacyKey+'.session-change';
  window.addEventListener('storage',event=>{
    if(event.key===identityKey) location.reload();
  });
  const status=t=>{el('sync').textContent=t;};
  const prefix=()=>legacyKey+'.'+user+'.draft.';
  function persist() {
    try {localStorage.setItem(draftKey,JSON.stringify({state:read(),revision}));return true;}
    catch {status('Qurilmada joy yetarli emas. Sahifani yopmang.');return false;}
  }
  async function api(action,data={}) {
    const res=await fetch('/api/workbench',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action,...data}),signal:AbortSignal.timeout(30000)});
    const b=await res.json();
    if(!res.ok) throw Object.assign(Error(b.message||failed),{status:res.status});
    return b;
  }
  function updatePercent() {
    el('percent').textContent='Bajarildi: '+Math.round(100*steps.filter(k=>read().done[k]).length/steps.length)+'%';
  }
  function queue(ms) {
    clearTimeout(timer);
    if(user && dirty && !conflict && !closing) timer=setTimeout(sync,ms);
  }
  function changed(now) {
    if(!user || closing) return;
    updatePercent();
    if(!dirty && JSON.stringify(read())===base) return;
    serial++; dirty=true; invalid=false;
    status(navigator.onLine?saving:offline); persist(); queue(delay || (now?0:4000));
  }
  function showConflict(snapshot) {
    conflict=snapshot;
    el('conflictText').textContent='Boshqa nusxa ham saqlangan. Qaysi nusxani ishlatasiz?';
    el('resolve').hidden=false; status('Nusxani tanlang.');
  }
  async function sync() {
    if(!user||!dirty||busy||closing||conflict||invalid) return;
    if(!navigator.onLine){status(offline);return;}
    const version=serial, sent=JSON.stringify(read());
    busy=true;status(saving);
    try {
      const result=await api('saveProgress',{expectedUser:user,state:JSON.parse(sent),revision});
      revision=result.revision;base=sent;delay=0;
      if(version===serial){dirty=false;localStorage.removeItem(draftKey);status(saved);}
      else {persist();queue(1000);}
    } catch(e) {
      if(e.status===401){location.reload();return;}
      if(e.status===409) {
        try {showConflict(await api('getProgress',{expectedUser:user}));return;} catch(err){if(err.status===401){location.reload();return;}}
      }
      invalid=e.status===413||e.status===422;
      if(invalid){status(e.message);return;}
      delay=Math.min(120000,Math.max(2000,delay*2));
      status(!navigator.onLine?offline:failed);
      queue(delay);
    } finally {busy=false;}
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
    const tab=sessionStorage.getItem(tabKey)||crypto.randomUUID();
    draftKey=prefix()+tab;
    // Use a fresh key for writes so even duplicated browser tabs keep separate drafts.
    const previous=draftKey;
    const next=crypto.randomUUID(); sessionStorage.setItem(tabKey,next);draftKey=prefix()+next;
    const cached=JSON.parse(localStorage.getItem(previous)||'null');
    revision=snapshot.revision;base=JSON.stringify(snapshot.state);
    el('auth').hidden=true;el('app').hidden=false;el('who').textContent=user;
    restore(cached?cached.state:snapshot.state);updatePercent();status(saved);
    if(cached) {
      revision=cached.revision;dirty=true;
      if(persist()) localStorage.removeItem(previous);
      if(revision!==snapshot.revision && JSON.stringify(read())!==base) showConflict(snapshot);
      else queue(0);
    }
    showImport();
    el('password').value=el('confirmation').value='';
  }
  el('importOld').onclick=async()=>{
    if(busy||conflict||closing) return;
    const key=otherKey||legacyKey;
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
  el('keepLocal').onclick=()=>{revision=conflict.revision;conflict=null;el('resolve').hidden=true;dirty=true;persist();queue(0);};
  el('useCloud').onclick=()=>{
    if(!confirm('Qurilmadagi nusxa bulutdagi nusxa bilan almashtirilsinmi?'))return;
    revision=conflict.revision;base=JSON.stringify(conflict.state);restore(conflict.state);
    dirty=false;conflict=null;el('resolve').hidden=true;localStorage.removeItem(draftKey);updatePercent();status(saved);
  };
  el('logout').onclick=async()=>{
    if(closing) return;
    if(dirty && !persist()) return;
    closing=true;el('app').inert=true;clearTimeout(timer);
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
  window.addEventListener('online',()=>{delay=0;queue(0);if(user&&!dirty)status(saved);});
  window.addEventListener('offline',()=>{if(user)status(offline);});
  setInterval(()=>{if(dirty&&!busy&&!delay)sync();},60000);
  return {changed,async start(){
    loading(true);
    try{const s=await api('getSession');await enter(s.user,await api('getProgress',{expectedUser:s.user}));}
    catch(e){if(e.status!==401)el('authMsg').textContent='Hisobni yuklab bo‘lmadi. Ulanishni tekshirib, sahifani yangilang.';}
    finally{loading(false);}
  }};
}

