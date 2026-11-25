import {randomBytes,createHmac,timingSafeEqual,scrypt} from 'node:crypto';
import {promisify} from 'node:util';
import progress from '../../server/progress.cjs';
const {empty,validate,fail} = progress;
const derive = promisify(scrypt);
const cookie = '__Host-workbench';
const lifetime = 7*24*3600;
const equal = (a,b) => typeof a === 'string' && typeof b === 'string' && Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a),Buffer.from(b));
const key = name => {
  const value = process.env[name];
  if (!value || value.length < 40) throw Error('configuration');
  return value;
};
const mac = value => createHmac('sha256',key('SESSION_SECRET')).update(value).digest('base64url');
const nameOK = u => typeof u === 'string' && /^[a-z][a-z0-9_]{2,31}$/.test(u);
const passOK = p => typeof p === 'string' && p.length >= 8 && p.length <= 128;
async function encode(password,salt=randomBytes(16).toString('hex')) {
  const hash = await derive(password,salt,64,{N:32768,r:8,p:3,maxmem:64*1024*1024});
  return ['scrypt',32768,8,3,salt,hash.toString('hex')].join('$');
}
const dummy = ['scrypt',32768,8,3,'0'.repeat(32),'0'.repeat(128)].join('$');
function session(req) {
  const raw = (req.headers.get('cookie') || '').split(/;\s*/).find(x=>x.startsWith(cookie+'='))?.slice(cookie.length+1) || '';
  const [user,tag,exp,sig] = raw.split('.');
  if (!nameOK(user) || !(Number(exp)>Date.now()/1000) || !equal(sig,mac([user,tag,exp].join('.')))) fail(401,'Qayta tizimga kiring.');
  return {user,tag};
}
function reply(data,status=200,token) {
  const headers={'Cache-Control':'no-store'};
  if(token!==undefined) headers['Set-Cookie']=cookie+'='+token+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+(token?lifetime:0);
  return Response.json(data,{status,headers});
}
async function sheets(op,data) {
  const result = await fetch(process.env.GAS_URL,{method:'POST',body:JSON.stringify({op,...data,secret:key('GAS_SECRET')}),signal:AbortSignal.timeout(20000)});
  if (!result.ok) throw Error('upstream');
  const answer = await result.json();
  if(answer.error) {
    const messages={401:'Qayta tizimga kiring.',409:'Bu foydalanuvchi nomi band yoki natijalar yangilangan.',429:'Urinishlar ko‘payib ketdi. Biroz kuting.'};
    if(messages[answer.error]) fail(answer.error,messages[answer.error]);
    throw Error('upstream');
  }
  return answer;
}
export default async function handler(req,context) {
  try {
    if(req.method!=='POST') return reply({},405);
    const raw=await req.text();
    if(Buffer.byteLength(raw)>600000) fail(413,'Saqlanadigan ma’lumot juda katta.');
    if(!(req.headers.get('content-type')||'').startsWith('application/json')) return reply({},415);
    let b; try { b=JSON.parse(raw); } catch { return reply({},400); }
    if(!b || typeof b!=='object') return reply({},400);
    if(b.action==='adminHash' && equal(req.headers.get('x-workbench-secret'),key('GAS_SECRET')) && passOK(b.password))
      return reply({hash:await encode(b.password)});
    if(!process.env.SITE_ORIGIN || req.headers.get('origin')!==process.env.SITE_ORIGIN) return reply({},403);
    if(b.action==='logout') return reply({},200,'');
    if(b.action==='login'||b.action==='register'){
      const user=typeof b.username==='string'?b.username.trim().toLowerCase():'';
      if(!nameOK(user)) fail(400,'Nom 3–32 belgidan iborat bo‘lsin. Lotin harfi bilan boshlang. Harf, raqam yoki pastki chiziq ishlating.');
      if(!passOK(b.password)) fail(400,'Parol 8–128 belgidan iborat bo‘lsin.');
      if(b.action==='register' && b.confirmation!==b.password) fail(400,'Parollar mos kelmadi.');
      const ip=mac(context.ip || 'unknown');
      const found=await sheets('attempt',{user,ip});
      let hash=found.hash || dummy;
      let snapshot;
      if(b.action==='register'){
        hash=await encode(b.password);
        snapshot=await sheets('create',{user,hash,summary:validate(empty())});
      } else {
        if(!equal(await encode(b.password,hash.split('$')[4]),hash) || !found.hash) fail(401,'Nom yoki parol noto‘g‘ri.');
        snapshot=await sheets('read',{user,credential:hash});
      }
      const payload=[user,createHmac('sha256',key('GAS_SECRET')).update(hash).digest('hex'),Math.floor(Date.now()/1000)+lifetime].join('.');
      return reply({user,...snapshot},200,payload+'.'+mac(payload));
    }
    const {user,tag}=session(req);
    if(b.action==='getSession') return reply({user});
    if(!['getProgress','saveProgress'].includes(b.action)) return reply({},400);
    if(b.expectedUser!==user) fail(401,'Hisob o‘zgardi. Qayta tizimga kiring.');
    // The storage service compares a credential fingerprint on every protected read/write.
    const fingerprint=tag;
    if(b.action==='getProgress') return reply(await sheets('read',{user,fingerprint}));
    if(!Number.isSafeInteger(b.revision)||b.revision<0) return reply({},400);
    const summary=validate(b.state);
    return reply(await sheets('save',{user,fingerprint,state:b.state,summary,revision:b.revision}));
  } catch(e) {return reply({message:e.status?e.message:'Xizmat vaqtincha ishlamayapti. Keyinroq qayta urinib ko‘ring.'},e.status||503);}
}
export const config={path:'/api/workbench'};

