const state={mode:"v",distance:10,speed:60,time:60};
const D={v:{title:"Atur Jarak dan Waktu",instruction:"Hanya jarak dan waktu yang dapat diubah. Kecepatan adalah variabel terikat.",answer:"KECEPATAN",unit:"km/jam",formula:"v = s / t",name:"RUMUS KECEPATAN"},
t:{title:"Atur Jarak dan Kecepatan",instruction:"Hanya jarak dan kecepatan yang dapat diubah. Waktu adalah variabel terikat.",answer:"WAKTU",unit:"jam",formula:"t = s / v",name:"RUMUS WAKTU"},
s:{title:"Atur Waktu dan Kecepatan",instruction:"Hanya waktu dan kecepatan yang dapat diubah. Jarak adalah variabel terikat.",answer:"JARAK",unit:"m",formula:"s = v × t",name:"RUMUS JARAK"}};
const $=x=>document.getElementById(x);
function tm(x){
  x=Math.max(0,Math.round(x));
  const h=Math.floor(x/3600), m=Math.floor((x%3600)/60), sec=x%60;
  return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");
}
function id(x){return (Math.round(x*100)/100).toString().replace(".",",")}
function render(){
 let d=D[state.mode];
 $("title").textContent=d.title;$("instruction").textContent=d.instruction;
 document.querySelectorAll(".choice").forEach(x=>x.classList.toggle("selected",x.dataset.mode===state.mode));
 $("distanceCard").classList.toggle("hidden",state.mode==="s");
 $("speedCard").classList.toggle("hidden",state.mode==="v");
 $("timeCard").classList.toggle("hidden",state.mode==="t");
 $("distanceVal").textContent=state.distance;$("distance").value=state.distance;
 let p=(state.distance-0.1)/99.9*100;$("handle").style.left=p+"%";$("fill").style.width=p+"%";
 $("roadDistance").textContent=state.distance+" m";$("car").style.left=Math.max(4,Math.min(91,state.distance*.9))+"%";
 $("speedVal").textContent=state.speed;$("speedDisplay").textContent=state.speed;$("speedRange").value=state.speed;
 $("needle").style.transform=`rotate(${-135+state.speed/120*270}deg)`;
 $("timeDisplay").textContent=tm(state.time);$("time").value=state.time;
 let mins=state.time%60,h=Math.floor(state.time/60);
 $("minute").style.transform=`rotate(${mins*6}deg)`;$("hour").style.transform=`rotate(${(h%12)*30+mins*.5}deg)`;
 $("answerName").textContent=d.answer;$("unit").textContent=d.unit;$("formulaName").textContent=d.name;$("formula").textContent=d.formula;
 $("dataA").textContent=state.distance+" m";$("dataB").textContent=state.speed+" km/jam";
 let answer,sub,line,interpret;
 if(state.mode==="v"){let t=state.time/3600;let s=state.distance;answer=t?s/t:0;sub=`v = ${id(s)} / ${id(t)}`;line=`v = ${id(answer)} km/jam`;interpret=`Jarak ${id(state.distance)} km dan waktu ${tm(state.time)} menghasilkan kecepatan ${id(answer)} km/jam. Karena kecepatan merupakan variabel terikat, nilainya dihitung dari jarak dan waktu.`;$("labelA").textContent="Jarak (s)";$("labelB").textContent="Waktu (t)";$("dataA").textContent=state.distance+" km";$("dataB").textContent=tm(state.time)}
 if(state.mode==="t"){let s=state.distance;answer=state.speed?s/state.speed*3600:0;sub=`t = ${id(s)} / ${id(state.speed)} × 3600`;line=`t = ${id(answer)} detik (${tm(answer)})`;interpret=`Jarak ${id(state.distance)} km dan kecepatan ${state.speed} km/jam menghasilkan waktu tempuh ${id(answer)} detik. Waktu bukan input dalam eksperimen ini, melainkan hasil perhitungan.`;$("labelA").textContent="Jarak (s)";$("labelB").textContent="Kecepatan (v)";$("dataA").textContent=state.distance+" km";$("dataB").textContent=state.speed+" km/jam";}
 if(state.mode==="s"){let t=state.time/3600;answer=state.speed*t;sub=`s = ${id(state.speed)} × ${id(t)}`;line=`s = ${id(answer)} km`;interpret=`Kecepatan ${state.speed} km/jam selama ${tm(state.time)} menghasilkan jarak ${id(answer)} km. Jarak bukan input dalam eksperimen ini, melainkan hasil yang dipengaruhi oleh waktu dan kecepatan.`;$("labelA").textContent="Kecepatan (v)";$("labelB").textContent="Waktu (t)";$("dataA").textContent=state.speed+" km/jam";$("dataB").textContent=tm(state.time)}
 $("answer").textContent=state.mode==="t"?tm(answer):id(answer);$("unit").textContent=state.mode==="t"?"jam:menit:sekon":d.unit;$("substitution").textContent=sub;$("resultFormula").textContent=line;$("interpretation").textContent=interpret;$("status").textContent=`${d.answer}: ${id(answer)} ${d.unit}`;
}
document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;render()});
$("distance").oninput=e=>{state.distance=+e.target.value;render()};
$("speedRange").oninput=e=>{state.speed=+e.target.value;render()};
$("time").oninput=e=>{state.time=+e.target.value;render()};
$("reset").onclick=()=>{state.distance=10;state.speed=60;state.time=60;render()};

/* drag distance */
let dd=false;function setD(e){let r=$("track").getBoundingClientRect(),x=Math.max(0,Math.min(r.width,e.clientX-r.left));state.distance=Math.round((0.1+x/r.width*99.9)*10)/10;render()}
$("handle").onmousedown=()=>dd=true;window.onmousemove=e=>{if(dd)setD(e)};window.onmouseup=()=>dd=false;
/* drag speedometer dial */
let ds=false;function setS(e){let r=$("speed").getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),a=Math.atan2(y,x)*180/Math.PI+90;a=Math.max(-135,Math.min(135,a));state.speed=Math.max(1,Math.round((a+135)/270*120));render()}
$("speedometer").addEventListener("mousedown",e=>{ds=true;setS(e)});window.addEventListener("mousemove",e=>{if(ds)setS(e)});window.addEventListener("mouseup",()=>ds=false);
/* drag clock */
let dc=false;function setT(e){let r=$("clock").getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),a=Math.atan2(y,x)*180/Math.PI+90;if(a<0)a+=360;state.time=Math.max(1,Math.min(720,Math.round(a/360*43200)));render()}
$("clock").addEventListener("mousedown",e=>{dc=true;setT(e)});window.addEventListener("mousemove",e=>{if(dc)setT(e)});window.addEventListener("mouseup",()=>dc=false);
render();