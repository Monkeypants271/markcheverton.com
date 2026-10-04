/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS Node verification script. */
const assert=require('node:assert/strict');const fs=require('node:fs/promises');const path=require('node:path');const crypto=require('node:crypto');
const req=require('node:module').createRequire(process.cwd()+'/package.json');const {unsealData,sealData}=req('iron-session');
(async()=>{
 const base='http://127.0.0.1:3000';const endpoint=base+'/api/story-dogs/presenter/';const dir=path.join(process.cwd(),'.local');const configFile=path.join(dir,'storydogs-presenter.json');
 await fs.mkdir(dir,{recursive:true});let existing;try{existing=await fs.readFile(configFile)}catch{}
 if(existing)throw Error('Refusing to replace existing private presenter configuration.');
 const password=crypto.randomBytes(24).toString('base64url');const salt=crypto.randomBytes(16).toString('hex');const config={passwordHash:`scrypt-32768-8-3$${salt}$${crypto.scryptSync(password,salt,64,{N:32768,r:8,p:3,maxmem:64*1024*1024}).toString('hex')}`,cookieSecret:crypto.randomBytes(48).toString('base64url')};
 const state=path.join(dir,'storydogs-state');const filename=k=>path.join(state,crypto.createHash('sha256').update(k).digest('hex'));let sid;
 const post=(route,body,cookie='',origin=base)=>fetch(endpoint+route,{method:'POST',headers:{Origin:origin,Cookie:cookie,'Content-Type':route==='login'?'application/x-www-form-urlencoded':'application/json'},body:route==='login'?new URLSearchParams(body):JSON.stringify(body),redirect:'manual'});
 try {
 await fs.writeFile(configFile,JSON.stringify(config),{mode:0o600});
 for(const route of ['/story-dogs']){const r=await fetch(base+route);assert.equal(r.status,200);assert.ok((await r.text()).includes('sd-stage-change'));}
 const teacherRedirect=await fetch(base+'/story-dogs/teachers',{redirect:'manual'});assert.equal(teacherRedirect.status,307);assert.equal(teacherRedirect.headers.get('location'),'/story-dogs');
 let r=await fetch(base+'/story-dogs/presenter',{redirect:'manual'});assert.equal(r.status,307);assert.equal(r.headers.get('location'),'/story-dogs/presenter/login');
 assert.equal((await post('punctuate',{passage:'hello'})).status,401);
 assert.equal((await post('login',{email:'wrong@example.com',password})).status,401);
 assert.equal((await post('login',{email:'MARK@CHEVERTONAUTHORVISITS.COM',password},'','https://evil.example')).status,403);
 r=await post('login',{email:'MARK@CHEVERTONAUTHORVISITS.COM',password});assert.equal(r.status,200);
 const cookieHeader=r.headers.get('set-cookie');assert.match(cookieHeader,/HttpOnly/i);assert.match(cookieHeader,/SameSite=Strict/i);const cookie=cookieHeader.split(';')[0];
 const data=await unsealData(cookie.slice(cookie.indexOf('=')+1),{password:config.cookieSecret,ttl:14400});sid=data.sid;
 r=await fetch(base+'/story-dogs/presenter',{headers:{Cookie:cookie},redirect:'manual'});assert.equal(r.status,200);const presenterHTML=await r.text();const providerConfigured=presenterHTML.includes('AI punctuation is configured');assert.ok(providerConfigured||presenterHTML.includes('AI punctuation is not configured'));
 assert.equal((await post('punctuate',{passage:'hello'},cookie,'https://evil.example')).status,403);
 if(!providerConfigured)assert.equal((await post('punctuate',{passage:'hello'},cookie)).status,503); // Never spend provider credit in this security regression test.
 assert.equal((await post('punctuate',{passage:'x'.repeat(3001)},cookie)).status,400);
 const expired=await sealData({...data,expires:Date.now()-1},{password:config.cookieSecret,ttl:14400});
 assert.equal((await fetch(base+'/story-dogs/presenter',{headers:{Cookie:'sd_presenter='+expired},redirect:'manual'})).status,307);
 assert.equal((await post('punctuate',{passage:'hello'},'sd_presenter='+expired)).status,401);
 r=await post('logout',{},cookie);assert.equal(r.status,303);
 assert.equal((await fetch(base+'/story-dogs/presenter',{headers:{Cookie:cookie},redirect:'manual'})).status,307);
 assert.equal((await post('punctuate',{passage:'hello'},cookie)).status,401);
 for(let i=0;i<8;i++) r=await post('login',{email:'wrong@example.com',password:'invalid'});
 assert.equal(r.status,429);
 console.log('PASS: real HTTP public routes, presenter redirect/login case folding, HttpOnly/SameSite cookie, CSRF rejection, unauthenticated AI rejection, explicit missing-provider failure, request limit, expiry, logout revocation, replay rejection, throttling. Temporary random test credentials removed.');
 } finally {await fs.rm(configFile,{force:true});if(sid)await fs.rm(filename('session:'+sid),{force:true});for(const k of ['rate:presenter-login','rate:punctuation','rate:punctuation-daily'])await fs.rm(filename(k),{force:true});}
})().catch(e=>{console.error(e.message);process.exitCode=1});
