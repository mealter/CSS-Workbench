import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {startPreview} from './preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright-core');
const preview=await startPreview();
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
const page=await browser.newPage({viewport:{width:1366,height:768}});
const solutions=JSON.parse(await fs.readFile(new URL('./reference-solutions.json',import.meta.url),'utf8'));
const dir=new URL('../review/v1.1/',import.meta.url);
const png=name=>decodeURIComponent(new URL(name+'.png',dir).pathname).replace(/^\/(\w:)/,'$1');
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const at=async(hash)=>{await page.evaluate(h=>{location.hash=h;},hash);await page.waitForTimeout(75);};
const visible=async(sel)=>{await page.locator(sel).waitFor({state:'visible'});};
async function selectText(selector){
  await page.locator(selector).first().evaluate(e=>{
    const range=document.createRange();range.selectNodeContents(e);const s=getSelection();s.removeAllRanges();s.addRange(range);
  });
  assert.ok(await page.evaluate(()=>getSelection().toString().length>0));
}
try{
  await page.route('https://fonts.**',r=>r.abort());
  await page.goto(preview.origin);await page.click('#switchAuth');
  await page.fill('#username','reviewstudent');await page.fill('#password','school-pass');await page.fill('#confirmation','school-pass');
  await page.focus('#username');await page.keyboard.press('Control+a');
  await page.screenshot({path:png('after-auth')});
  await page.emulateMedia({colorScheme:'dark'});
  await page.screenshot({path:png('after-auth-dark')});
  await page.click('#submitAuth');await visible('#home');await at('borders');await visible('#topicView');await at('borders-1');
  const ta=page.locator('#ta');
  if(process.argv.includes('--goals')){
    const lessons=await page.evaluate(()=>TOPICS.flatMap(t=>t.steps.flatMap((s,i)=>s.questions?[]:[{path:t.id+'-'+(i+1),id:t.id+'-'+s.id,key:t.id+'/'+s.id}])));
    for(const lesson of lessons){
      await at(lesson.path);await ta.fill(solutions[lesson.key]);await page.waitForTimeout(200);
      const host=page.locator('#hostYou');
      await host.evaluate(e=>{
        Object.assign(e.style,{position:'fixed',inset:'0 auto auto 0',width:'440px',height:'650px',zIndex:2000});
        const stage=e.shadowRoot.querySelector('.stage');
        const end=Math.max(...Array.from(stage.children,child=>child.getBoundingClientRect().bottom));
        e.style.height=Math.ceil(Math.max(end+24,100))+'px';
      });
      await host.screenshot({path:'public/goals/'+lesson.id+'.png'});
      await host.evaluate(e=>e.removeAttribute('style'));
    }
    await at('borders-1');await page.click('#resetBtn');await page.click('#resetBtn');
  }
  for(const theme of ['light','dark']){
    await page.emulateMedia({colorScheme:theme});
    await ta.focus();await page.keyboard.press('Control+Home');await page.keyboard.press('Shift+ArrowDown');await page.keyboard.press('Shift+ArrowDown');
    await page.screenshot({path:png('after-editor-'+theme)});
    assert.ok(await ta.evaluate(e=>e.value.slice(e.selectionStart,e.selectionEnd).includes('\n')));
    const rect=await ta.boundingBox();
    await page.mouse.move(rect.x+18,rect.y+18);await page.mouse.down();await page.mouse.move(rect.x+100,rect.y+58,{steps:8});await page.mouse.up();
    assert.ok(await ta.evaluate(e=>e.selectionEnd>e.selectionStart));
    await ta.press('Control+a');assert.ok(await ta.evaluate(e=>e.selectionEnd-e.selectionStart===e.value.length));
    await page.click('#tabHtml');await selectText('#htmlView');await page.click('#tabCss');
    for(const sel of ['.prose p','.ex','.task p']) await selectText(sel);
  }
  {
    await page.emulateMedia({colorScheme:'light'});await ta.fill('/* draft */');await page.click('#toolbarCheck');
    assert.equal(await page.locator('#status').getAttribute('data-s'),'fail');
    assert.ok(await page.locator('#hl span').count());
    assert.equal(await page.locator('#solBtn,#solBox,#useSol').count(),0);
    assert.equal(await page.evaluate(()=>TOPICS.some(t=>t.steps.some(s=>'solution' in s))),false);
    await page.click('#hintBtn');await visible('#hintBox');
    const savedRequests=[];
    page.on('request',r=>{if(r.url().endsWith('/api/workbench') && r.postDataJSON()?.action==='saveProgress')savedRequests.push(r);});
    await ta.fill(solutions['borders/border-style']);await ta.press('Control+Enter');
    assert.equal(await page.locator('#status').getAttribute('data-s'),'pass');
    await page.waitForFunction(()=>document.querySelector('#sync').textContent.includes('saqlandi'));
    const count=savedRequests.length;assert.ok(count>0);
    await page.click('#toolbarCheck');await ta.press('Control+Enter');await page.waitForTimeout(200);
    assert.equal(savedRequests.length,count);
    await ta.fill(Array.from({length:90},(_,i)=>'/* '+i+' */ '+'x'.repeat(140)).join('\n'));
    await ta.press('Control+End');await page.waitForTimeout(150);
    assert.ok(await ta.evaluate(e=>e.scrollTop>0 && e.scrollLeft>0));
    assert.ok(await ta.evaluate(e=>{
      const hl=document.querySelector('#hl'),gut=document.querySelector('#gutIn');
      const offset=element=>new DOMMatrixReadOnly(getComputedStyle(element).transform);
      return offset(hl).m41===-e.scrollLeft && offset(hl).m42===-e.scrollTop &&
        offset(gut).m42===-e.scrollTop && getComputedStyle(gut).lineHeight===getComputedStyle(e).lineHeight;
    }));
    await ta.press('Control+Home');await ta.press('End');await ta.press('Tab');await ta.press('Escape');await ta.press('Tab');
    assert.equal(await ta.evaluate(e=>document.activeElement===e),false);
    await page.click('#resetBtn');await page.click('#resetBtn');
    for(const [w,h] of [[1920,1080],[1366,768],[1280,720],[768,1024],[360,780]]){
      await page.setViewportSize({width:w,height:h});
      for(const theme of ['light','dark']){
        await page.emulateMedia({colorScheme:theme});
        if(w<760)await page.click('[role=tab][data-tab=code]');
        await visible('#toolbarCheck');
        const button=await page.locator('#toolbarCheck').boundingBox();
        assert.ok(button.x>=0 && button.x+button.width<=w && button.y+button.height<=h);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await page.screenshot({path:png('layout-'+w+'-'+theme)});
        await page.click('#tabHtml');await visible('#htmlView');await page.click('#tabCss');
      }
    }
    await at('borders-5');await visible('#quizIn');await selectText('.q-text');await selectText('.opt-text');
    await page.screenshot({path:png('mobile-quiz')});
    await page.emulateMedia({colorScheme:'light'});await selectText('.q-text');await selectText('.opt-text');
    await at('borders-1');await page.click('[data-tab=preview][role=tab]');await page.click('#tabGoal');await visible('#hostGoal img');
    assert.ok(await page.locator('#hostGoal img').evaluate(e=>e.complete && e.naturalWidth>0));
    assert.deepEqual(errors,[]);
  }
  console.log('v1.1 UI review passed');
}finally{await browser.close();preview.close();}



