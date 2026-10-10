const $=id=>document.getElementById(id), fmt=(x,n=2)=>Number(x).toFixed(n);
function page(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll("[data-page]").forEach(x=>x.onclick=()=>page(x.dataset.page));
const DPR=window.devicePixelRatio||1;
function canvas(c){let r=c.getBoundingClientRect(),w=r.width,h=w*.625;c.width=w*DPR;c.height=h*DPR;let x=c.getContext("2d");x.setTransform(DPR,0,0,DPR,0,0);return{x,w,h}}
function ground(ctx,w,y){ctx.strokeStyle="#596579";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(w-20,y);ctx.stroke();ctx.font="12px Arial";ctx.fillStyle="#687389";ctx.fillText("y = 0",38,y+20)}
function arrow(ctx,x1,y1,x2,y2,label){ctx.strokeStyle="#5571aa";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.font="12px Arial";ctx.fillStyle="#5571aa";ctx.fillText(label,x2+5,y2)}

// GJB
let gj={t:0,run:false,pause:false,res:[]};
function gjv(){return{h:+$("gjbH").value,g:+$("gjbG").value}}
function gjtheory(){let v=gjv(),t=Math.sqrt(2*v.h/v.g);$("gjbTT").textContent=fmt(t)+" s";$("gjbVT").textContent=fmt(v.g*t)+" m/s"}
function gjdraw(){let c=canvas($("gjbCanvas")),v=gjv(),ctx=c.x;ctx.clearRect(0,0,c.w,c.h);let gy=c.h-48,top=35,s=(gy-top)/v.h;ground(ctx,c.w,gy);let y=Math.max(0,v.h-.5*v.g*gj.t*gj.t),py=gy-y*s;ctx.fillStyle="#2c62ce";ctx.beginPath();ctx.arc(c.w/2,py,14,0,7);ctx.fill();ctx.fillStyle="#4d5870";ctx.fillText("h = "+fmt(y)+" m",c.w/2+20,py);arrow(ctx,c.w/2-60,py-30,c.w/2-60,py+30,"g")}
function gjupdate(){let v=gjv(),y=Math.max(0,v.h-.5*v.g*gj.t*gj.t),speed=Math.sqrt(Math.max(0,2*v.g*(v.h-y)));$("gjbT").textContent=fmt(gj.t)+" s";$("gjbY").textContent=fmt(y)+" m";$("gjbV").textContent=fmt(speed)+" m/s";$("gjbA").textContent=fmt(v.g)+" m/s²";$("gjbInfo").textContent=y<=0?"Mencapai tanah":"Sedang jatuh";gjdraw()}
function gjloop(ts){if(!gj.run||gj.pause)return;let dt=Math.min((ts-gj.last)/1000,.04);gj.last=ts;gj.t+=dt;let v=gjv(),end=Math.sqrt(2*v.h/v.g);if(gj.t>=end){gj.t=end;gjfinish();return}gjupdate();requestAnimationFrame(gjloop)}
function gjfinish(){let v=gjv(),t=Math.sqrt(2*v.h/v.g);if($("gjbMode").value==="measured")t*=1+(Math.random()-.5)*.018;gj.t=t;gj.run=false;gj.res.push({h:v.h,t,g:2*v.h/(t*t)});gjrender();gjcalc();gjupdate()}
$("gjbStart").onclick=()=>{gj.t=0;gj.run=true;gj.pause=false;gj.last=performance.now();requestAnimationFrame(gjloop)}
$("gjbPause").onclick=()=>{gj.pause=!gj.pause;if(!gj.pause){gj.last=performance.now();requestAnimationFrame(gjloop)}}
$("gjbReset").onclick=()=>{gj.run=false;gj.t=0;gjupdate()}
$("gjbAdd").onclick=()=>{let v=gjv(),t=Math.sqrt(2*v.h/v.g);if($("gjbMode").value==="measured")t*=1+(Math.random()-.5)*.018;gj.res.push({h:v.h,t,g:2*v.h/(t*t)});gjrender();gjcalc()}
function gjrender(){let b=$("gjbTable").querySelector("tbody");b.innerHTML=gj.res.map((r,i)=>`<tr><td>${i+1}</td><td>${fmt(r.h)}</td><td>${fmt(r.t,3)}</td><td>${fmt(r.t*r.t,4)}</td><td>${fmt(r.g,3)}</td></tr>`).join("")}
function gjcalc(){if(!gj.res.length)return;$("gjbAvg").textContent=fmt(gj.res.reduce((a,r)=>a+r.g,0)/gj.res.length,3)+" m/s²";let a=gj.res.reduce((s,r)=>s+r.g,0)/gj.res.length,e=Math.abs(a-9.81)/9.81*100;$("gjbErr").textContent=fmt(e,2)+" %";$("gjbCon").textContent=e<2?"Hasil mendekati nilai teori 9,81 m/s².":"Data perlu dievaluasi kembali."}
$("gjbGraph").onclick=()=>{let c=canvas($("gjbChart")),ctx=c.x;ctx.clearRect(0,0,c.w,c.h);ctx.strokeStyle="#cbd2df";ctx.beginPath();ctx.moveTo(55,20);ctx.lineTo(55,c.h-45);ctx.lineTo(c.w-25,c.h-45);ctx.stroke();ctx.fillStyle="#596579";ctx.font="12px Arial";ctx.fillText("h (m)",10,28);ctx.fillText("t² (s²)",c.w-70,c.h-18);if(!gj.res.length){ctx.fillText("Tambahkan hasil percobaan.",70,70);return}let mx=Math.max(...gj.res.map(r=>r.t*r.t)),my=Math.max(...gj.res.map(r=>r.h));gj.res.forEach(r=>{let x=55+r.t*r.t/mx*(c.w-85),y=c.h-45-r.h/my*(c.h-75);ctx.fillStyle="#2c62ce";ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.fill()})}
gjtheory();gjupdate();

// GVA
let gv={t:0,run:false,pause:false,res:[]};
function gvv(){return{v0:+$("gvaV0").value,y0:+$("gvaY0").value,g:+$("gvaG").value}}
function gvcalc(){let v=gvv(),tp=v.v0/v.g,ym=v.y0+v.v0*v.v0/(2*v.g),tt=tp+Math.sqrt(2*ym/v.g);$("gvaTP").textContent=fmt(tp)+" s";$("gvaYM").textContent=fmt(ym)+" m";$("gvaTT").textContent=fmt(tt)+" s";return{tp,ym,tt}}
function gvdraw(){let c=canvas($("gvaCanvas")),v=gvv(),d=gvcalc(),ctx=c.x;ctx.clearRect(0,0,c.w,c.h);let gy=c.h-48,top=30,s=(gy-top)/Math.max(d.ym,.1);ground(ctx,c.w,gy);let y=Math.max(0,v.y0+v.v0*gv.t-.5*v.g*gv.t*gv.t),py=gy-y*s;ctx.fillStyle="#7a50c4";ctx.beginPath();ctx.arc(c.w/2,py,14,0,7);ctx.fill();ctx.fillStyle="#596579";ctx.fillText("y = "+fmt(y)+" m",c.w/2+20,py)}
function gvupdate(){let v=gvv(),y=Math.max(0,v.y0+v.v0*gv.t-.5*v.g*gv.t*gv.t),vel=v.v0-v.g*gv.t;$("gvaT").textContent=fmt(gv.t)+" s";$("gvaY").textContent=fmt(y)+" m";$("gvaV").textContent=fmt(vel)+" m/s";$("gvaA").textContent="−"+fmt(v.g)+" m/s²";$("gvaInfo").textContent=vel>0?"Bergerak naik":Math.abs(vel)<.08?"Titik tertinggi":"Bergerak turun";gvdraw()}
function gvloop(ts){if(!gv.run||gv.pause)return;let dt=Math.min((ts-gv.last)/1000,.04);gv.last=ts;gv.t+=dt;let d=gvcalc();if(gv.t>=d.tt){gv.t=d.tt;gv.run=false}gvupdate();if(gv.run)requestAnimationFrame(gvloop)}
$("gvaStart").onclick=()=>{gv.t=0;gv.run=true;gv.pause=false;gv.last=performance.now();requestAnimationFrame(gvloop)}
$("gvaPause").onclick=()=>{gv.pause=!gv.pause;if(!gv.pause){gv.last=performance.now();requestAnimationFrame(gvloop)}}
$("gvaReset").onclick=()=>{gv.run=false;gv.t=0;gvupdate()}
$("gvaAdd").onclick=()=>{let v=gvv(),d=gvcalc();gv.res.push({v0:v.v0,tp:d.tp,ym:d.ym,tt:d.tt});$("gvaTable").querySelector("tbody").innerHTML=gv.res.map((r,i)=>`<tr><td>${i+1}</td><td>${fmt(r.v0)}</td><td>${fmt(r.tp,3)}</td><td>${fmt(r.ym,3)}</td><td>${fmt(r.tt,3)}</td></tr>`).join("")}
["gvaV0","gvaY0","gvaG"].forEach(id=>$(id).oninput=gvupdate);gvupdate();

// Parabola
let pa={t:0,run:false,pause:false,trail:[],res:[]};
function pav(){return{v0:+$("parV0").value,a:+$("parAngle").value,y0:+$("parY0").value,g:+$("parG").value}}
function pacalc(){let v=pav(),a=v.a*Math.PI/180,vx=v.v0*Math.cos(a),vy=v.v0*Math.sin(a),tt=(vy+Math.sqrt(vy*vy+2*v.g*v.y0))/v.g,tp=vy/v.g,ym=v.y0+vy*vy/(2*v.g);return{vx,vy,tt,tp,ym,R:vx*tt}}
function padraw(){let c=canvas($("parCanvas")),v=pav(),d=pacalc(),ctx=c.x;ctx.clearRect(0,0,c.w,c.h);let gy=c.h-42,top=25,sx=(c.w-75)/Math.max(d.R,1),sy=(gy-top)/Math.max(d.ym,1);ground(ctx,c.w,gy);ctx.strokeStyle="#d1d8e4";ctx.beginPath();for(let t=0;t<=d.tt;t+=d.tt/100){let x=40+d.vx*t*sx,y=gy-Math.max(0,v.y0+d.vy*t-.5*v.g*t*t)*sy;t?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();if(pa.trail.length){ctx.strokeStyle="#2c62ce";ctx.beginPath();pa.trail.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}let x=d.vx*pa.t,y=Math.max(0,v.y0+d.vy*pa.t-.5*v.g*pa.t*pa.t),px=40+x*sx,py=gy-y*sy;ctx.fillStyle="#df7045";ctx.beginPath();ctx.arc(px,py,10,0,7);ctx.fill();arrow(ctx,px,py,px+35,py,"vₓ");arrow(ctx,px,py,px,py+30,"g")}
function paupdate(){let v=pav(),d=pacalc(),vy=d.vy-v.g*pa.t,x=d.vx*pa.t,y=Math.max(0,v.y0+d.vy*pa.t-.5*v.g*pa.t*pa.t);$("parT").textContent=fmt(pa.t)+" s";$("parX").textContent=fmt(x)+" m";$("parY").textContent=fmt(y)+" m";$("parVx").textContent=fmt(d.vx)+" m/s";$("parVy").textContent=fmt(vy)+" m/s";$("parSpeed").textContent=fmt(Math.hypot(d.vx,vy))+" m/s";$("parFT").textContent=fmt(d.tt)+" s";$("parYM").textContent=fmt(d.ym)+" m";$("parR").textContent=fmt(d.R)+" m";$("parInfo").textContent=pa.t<d.tp?"Bergerak naik":"Bergerak turun";let r=$("parCanvas").getBoundingClientRect(),gy=r.width*.625-42,sx=(r.width-75)/Math.max(d.R,1),sy=(r.width*.625-67)/Math.max(d.ym,1);pa.trail.push([40+x*sx,gy-y*sy]);if(pa.trail.length>180)pa.trail.shift();padraw()}
function paloop(ts){if(!pa.run||pa.pause)return;let dt=Math.min((ts-pa.last)/1000,.04);pa.last=ts;pa.t+=dt;let d=pacalc();if(pa.t>=d.tt){pa.t=d.tt;pa.run=false}paupdate();if(pa.run)requestAnimationFrame(paloop)}
$("parStart").onclick=()=>{pa.t=0;pa.trail=[];pa.run=true;pa.pause=false;pa.last=performance.now();requestAnimationFrame(paloop)}
$("parPause").onclick=()=>{pa.pause=!pa.pause;if(!pa.pause){pa.last=performance.now();requestAnimationFrame(paloop)}}
$("parReset").onclick=()=>{pa.run=false;pa.t=0;pa.trail=[];paupdate()}
$("parAdd").onclick=()=>{let v=pav(),d=pacalc();pa.res.push({a:v.a,v0:v.v0,tt:d.tt,ym:d.ym,R:d.R});$("parTable").querySelector("tbody").innerHTML=pa.res.map((r,i)=>`<tr><td>${i+1}</td><td>${fmt(r.a,0)}°</td><td>${fmt(r.v0)}</td><td>${fmt(r.tt,3)}</td><td>${fmt(r.ym,3)}</td><td>${fmt(r.R,3)}</td></tr>`).join("")}
["parV0","parAngle","parY0","parG"].forEach(id=>$(id).oninput=()=>{pa.trail=[];paupdate()});paupdate();
window.onresize=()=>{gjdraw();gvdraw();padraw()}
