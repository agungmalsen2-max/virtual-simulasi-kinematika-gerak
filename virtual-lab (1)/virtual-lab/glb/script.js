const state={mode:"v",distance:10,speed:60,time:60};
const D={v:{title:"Atur Jarak dan Waktu",instruction:"Hanya jarak dan waktu yang dapat diubah. Kecepatan adalah variabel terikat.",answer:"KECEPATAN",unit:"km/jam",formula:"v = s / t",name:"RUMUS KECEPATAN"},
t:{title:"Atur Jarak dan Kecepatan",instruction:"Hanya jarak dan kecepatan yang dapat diubah. Waktu adalah variabel terikat.",answer:"WAKTU",unit:"jam",formula:"t = s / v",name:"RUMUS WAKTU"},
s:{title:"Atur Waktu dan Kecepatan",instruction:"Hanya waktu dan kecepatan yang dapat diubah. Jarak adalah variabel terikat.",answer:"JARAK",unit:"km",formula:"s = v × t",name:"RUMUS JARAK"}};
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
 $("roadDistance").textContent=state.distance+" km";$("car").style.left=Math.max(4,Math.min(91,state.distance*.9))+"%";
 $("speedVal").textContent=state.speed;$("speedDisplay").textContent=state.speed;$("speedRange").value=state.speed;
 $("needle").style.transform=`rotate(${-135+state.speed/120*270}deg)`;
 $("timeDisplay").textContent=tm(state.time);$("time").value=state.time;
 let mins=state.time%60,h=Math.floor(state.time/60);
 $("minute").style.transform=`rotate(${mins*6}deg)`;$("hour").style.transform=`rotate(${(h%12)*30+mins*.5}deg)`;
 $("answerName").textContent=d.answer;$("unit").textContent=d.unit;$("formulaName").textContent=d.name;$("formula").textContent=d.formula;
 $("dataA").textContent=state.distance+" km";$("dataB").textContent=state.speed+" km/jam";
 let answer,sub,line,interpret;
 if(state.mode==="v"){let t=state.time/3600;let s=state.distance;answer=t?s/t:0;sub=`v = ${id(s)} / ${id(t)}`;line=`v = ${id(answer)} km/jam`;interpret=`Jarak ${id(state.distance)} km dan waktu ${tm(state.time)} menghasilkan kecepatan ${id(answer)} km/jam. Karena kecepatan merupakan variabel terikat, nilainya dihitung dari jarak dan waktu.`;$("labelA").textContent="Jarak (s)";$("labelB").textContent="Waktu (t)";$("dataA").textContent=state.distance+" km";$("dataB").textContent=tm(state.time)}
 if(state.mode==="t"){let s=state.distance;answer=state.speed?s/state.speed*3600:0;sub=`t = ${id(s)} / ${id(state.speed)} × 3600`;line=`t = ${id(answer)} detik (${tm(answer)})`;interpret=`Jarak ${id(state.distance)} km dan kecepatan ${state.speed} km/jam menghasilkan waktu tempuh ${id(answer)} detik. Waktu bukan input dalam eksperimen ini, melainkan hasil perhitungan.`;$("labelA").textContent="Jarak (s)";$("labelB").textContent="Kecepatan (v)";$("dataA").textContent=state.distance+" km";$("dataB").textContent=state.speed+" km/jam";}
 if(state.mode==="s"){let t=state.time/3600;answer=state.speed*t;sub=`s = ${id(state.speed)} × ${id(t)}`;line=`s = ${id(answer)} km`;interpret=`Kecepatan ${state.speed} km/jam selama ${tm(state.time)} menghasilkan jarak ${id(answer)} km. Jarak bukan input dalam eksperimen ini, melainkan hasil yang dipengaruhi oleh waktu dan kecepatan.`;$("labelA").textContent="Kecepatan (v)";$("labelB").textContent="Waktu (t)";$("dataA").textContent=state.speed+" km/jam";$("dataB").textContent=tm(state.time)}
 $("answer").textContent=state.mode==="t"?tm(answer):id(answer);$("unit").textContent=state.mode==="t"?"jam:menit:sekon":d.unit;$("substitution").textContent=sub;$("resultFormula").textContent=line;$("interpretation").textContent=interpret;$("status").textContent=state.mode==="t"?`${d.answer}: ${tm(answer)}`:`${d.answer}: ${id(answer)} ${d.unit}`;
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
let dc=false;function setT(e){let r=$("clock").getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),a=Math.atan2(y,x)*180/Math.PI+90;if(a<0)a+=360;state.time=Math.max(1,Math.min(43200,Math.round(a/360*43200)));render()}
$("clock").addEventListener("mousedown",e=>{dc=true;setT(e)});window.addEventListener("mousemove",e=>{if(dc)setT(e)});window.addEventListener("mouseup",()=>dc=false);
render();
/* ============================================================
   PHYSLAB PROFESSIONAL LEARNING SUITE
   Tambahan ini tidak mengubah rumus utama 3 eksperimen.
   ============================================================ */
const trials=[];
let sim={running:false,elapsed:0,timer:null,rate:30};
let challenge={answer:0,unit:"km/jam"};

function calcExperiment(){
  const tHours=state.time/3600;
  if(state.mode==="v") return {distance:state.distance,time:state.time,speed:tHours?state.distance/tHours:0,dependent:"Kecepatan"};
  if(state.mode==="t") return {distance:state.distance,time:state.speed?state.distance/state.speed*3600:0,speed:state.speed,dependent:"Waktu"};
  return {distance:state.speed*tHours,time:state.time,speed:state.speed,dependent:"Jarak"};
}
function formatNum(n){return (Math.round(n*100)/100).toString().replace(".",",");}
function updateSuite(){
  const m=state.mode;
  const cfg={
    v:{free:"Jarak, Waktu",dep:"Kecepatan",formula:"v = s / t",prompt:"Jika jarak diperbesar sementara waktu tetap, bagaimana kecepatan berubah?",correct:"meningkat"},
    t:{free:"Jarak, Kecepatan",dep:"Waktu",formula:"t = s / v",prompt:"Jika jarak diperbesar sementara kecepatan tetap, bagaimana waktu tempuh berubah?",correct:"meningkat"},
    s:{free:"Waktu, Kecepatan",dep:"Jarak",formula:"s = v × t",prompt:"Jika waktu diperbesar sementara kecepatan tetap, bagaimana jarak tempuh berubah?",correct:"meningkat"}
  }[m];
  $("freeVars").textContent=cfg.free;$("dependentVar").textContent=cfg.dep;$("objectiveFormula").textContent=cfg.formula;$("predictionPrompt").textContent=cfg.prompt;
  $("predictionFeedback").textContent="";$("predictionFeedback").className="feedback";document.querySelectorAll('input[name="prediction"]').forEach(x=>x.checked=false);
  updateChallenge(); updateTable(); drawChart(); resetSimulation(false);
}

const originalRender=render;
render=function(){originalRender();updateSuite();};

function updateChallenge(){
  const q={
    v:{d:30,t:60,question:"Sebuah kendaraan menempuh 30 km dalam 00:01:00. Berapa kecepatannya?",answer:30,unit:"km/jam"},
    t:{d:60,v:30,question:"Kendaraan bergerak dengan kecepatan 30 km/jam untuk menempuh 60 km. Berapa waktu tempuhnya?",answer:7200,unit:"detik"},
    s:{v:40,t:90,question:"Kendaraan bergerak 40 km/jam selama 00:01:30. Berapa jarak yang ditempuh?",answer:1,unit:"km"}
  }[state.mode];
  challenge={answer:q.answer,unit:q.unit};
  $("challengeQuestion").textContent=q.question;$("challengeUnit").textContent=q.unit==="detik"?"detik":q.unit;$("challengeAnswer").value="";$("challengeFeedback").textContent="";$("challengeFeedback").className="feedback";
}

$("checkPrediction").onclick=()=>{
  const picked=document.querySelector('input[name="prediction"]:checked');
  const f=$("predictionFeedback");
  if(!picked){f.textContent="Pilih salah satu prediksi terlebih dahulu.";f.className="feedback bad";return;}
  const correct={v:"meningkat",t:"meningkat",s:"meningkat"}[state.mode];
  if(picked.value===correct){f.textContent="✓ Prediksi benar. Sekarang lakukan percobaan untuk membuktikannya dengan data.";f.className="feedback ok"}
  else{f.textContent="✕ Prediksi belum tepat. Perhatikan variabel mana yang dibuat tetap dan gunakan hubungan matematisnya.";f.className="feedback bad"}
};
$("newChallenge").onclick=updateChallenge;
$("checkChallenge").onclick=()=>{
  const val=Number($("challengeAnswer").value), f=$("challengeFeedback");
  const ok=Math.abs(val-challenge.answer)<=Math.max(.01,Math.abs(challenge.answer)*.02);
  if(ok){f.textContent="✓ Benar! Jawaban Anda sesuai dengan perhitungan fisika.";f.className="feedback ok"}
  else{f.textContent="✕ Belum tepat. Coba periksa kembali rumus dan satuan yang digunakan.";f.className="feedback bad"}
};

function currentSimulationTarget(){
  const x=calcExperiment();
  return {distance:x.distance,time:x.time,speed:x.speed};
}
function setSimulationView(elapsed){
  const target=currentSimulationTarget();
  const duration=Math.max(1,target.time);
  const p=Math.max(0,Math.min(1,elapsed/duration));
  const d=target.distance*p;
  $("simTime").textContent=tm(elapsed);$("simDistance").textContent=formatNum(d)+" km";$("simSpeed").textContent=formatNum(target.speed)+" km/jam";$("simProgress").style.width=(p*100)+"%";$("simCar").style.left=(4+p*88)+"%";
  $("simStatus").textContent=p>=1?"Selesai":sim.running?"Berjalan":"Dijeda";
  if(p>=1){sim.running=false;clearInterval(sim.timer);sim.timer=null;}
}
function resetSimulation(clearOnly=true){
  sim.running=false;sim.elapsed=0;clearInterval(sim.timer);sim.timer=null;setSimulationView(0);if(clearOnly)$("simStatus").textContent="Siap";
}
$("startSim").onclick=()=>{
  if(sim.running)return;
  const target=currentSimulationTarget();
  if(target.time<=0)return;
  sim.running=true;$("simStatus").textContent="Berjalan";
  sim.timer=setInterval(()=>{sim.elapsed+=1*sim.rate/10;setSimulationView(sim.elapsed)},100);
};
$("pauseSim").onclick=()=>{if(sim.running){sim.running=false;clearInterval(sim.timer);sim.timer=null;$("simStatus").textContent="Dijeda"}};
$("resetSim").onclick=()=>resetSimulation(true);

function addTrial(){
  const x=calcExperiment();
  trials.push({distance:x.distance,time:x.time,speed:x.speed});
  updateTable();drawChart();
}
function updateTable(){
  const body=$("dataTable").querySelector("tbody");
  body.innerHTML="";
  trials.forEach((x,i)=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${i+1}</td><td>${formatNum(x.distance)}</td><td>${tm(x.time)}</td><td>${formatNum(x.speed)}</td>`;body.appendChild(tr)});
  if(!trials.length){const tr=document.createElement("tr");tr.innerHTML='<td colspan="4" style="text-align:center;color:#8995a6;padding:18px">Belum ada data percobaan.</td>';body.appendChild(tr)}
}
$("addTrial").onclick=addTrial;
$("clearTrials").onclick=()=>{trials.length=0;updateTable();drawChart()};

function drawChart(){
  const canvas=$("chart"),ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);
  const pad={l:55,r:20,t:20,b:45};const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
  ctx.strokeStyle="#d9e0e8";ctx.lineWidth=1;
  for(let i=0;i<=5;i++){let x=pad.l+cw*i/5,y=pad.t+ch*i/5;ctx.beginPath();ctx.moveTo(x,pad.t);ctx.lineTo(x,pad.t+ch);ctx.stroke();ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);ctx.stroke()}
  const type=$("chartType").value;
  const points=trials.map(x=>type==="st"?[x.time/3600,x.distance]:type==="vt"?[x.time/3600,x.speed]:[x.speed,x.distance]);
  const xLabel=type==="st"?"Waktu (jam)":type==="vt"?"Waktu (jam)":"Kecepatan (km/jam)";
  const yLabel=type==="st"?"Jarak (km)":type==="vt"?"Kecepatan (km/jam)":"Jarak (km)";
  ctx.fillStyle="#667386";ctx.font="11px Segoe UI";ctx.textAlign="center";ctx.fillText(xLabel,pad.l+cw/2,h-12);ctx.save();ctx.translate(15,pad.t+ch/2);ctx.rotate(-Math.PI/2);ctx.fillText(yLabel,0,0);ctx.restore();
  if(points.length<2){ctx.fillStyle="#8995a6";ctx.font="12px Segoe UI";ctx.textAlign="center";ctx.fillText("Simpan minimal dua percobaan untuk melihat grafik.",w/2,h/2);$("chartCaption").textContent="Data yang disimpan akan ditampilkan sebagai titik pada grafik.";return}
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);let xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);if(xmax===xmin){xmax=xmin+1}if(ymax===ymin){ymax=ymin+1};const ex=(xmax-xmin)*.12,ey=(ymax-ymin)*.12;xmin=Math.max(0,xmin-ex);xmax+=ex;ymin=Math.max(0,ymin-ey);ymax+=ey;
  const px=x=>pad.l+(x-xmin)/(xmax-xmin)*cw,py=y=>pad.t+ch-(y-ymin)/(ymax-ymin)*ch;
  ctx.strokeStyle="#2563eb";ctx.lineWidth=2;ctx.beginPath();points.forEach((p,i)=>{if(i===0)ctx.moveTo(px(p[0]),py(p[1]));else ctx.lineTo(px(p[0]),py(p[1]))});ctx.stroke();
  points.forEach(p=>{ctx.beginPath();ctx.fillStyle="#2563eb";ctx.arc(px(p[0]),py(p[1]),5,0,Math.PI*2);ctx.fill()});
  $("chartCaption").textContent=`${points.length} data percobaan ditampilkan. Grafik ${$("chartType").selectedOptions[0].text.toLowerCase()}.`;
}
$("chartType").onchange=drawChart;

$("printResult").onclick=()=>{
  const x=calcExperiment(), rows=trials.map((r,i)=>`<tr><td>${i+1}</td><td>${formatNum(r.distance)}</td><td>${tm(r.time)}</td><td>${formatNum(r.speed)}</td></tr>`).join("");
  const win=window.open("","_blank","width=900,height=700");
  if(!win)return;
  win.document.write(`<html><head><title>Hasil Eksperimen PHYSLAB</title><style>body{font-family:Arial;padding:35px;color:#172033}h1{margin-bottom:3px}small{color:#667386}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ccd4df;padding:9px;text-align:left}th{background:#f1f5f9}section{margin-top:25px}.box{background:#f7f9fb;padding:14px;border:1px solid #e1e7ef;border-radius:8px}textarea{white-space:pre-wrap}</style></head><body><h1>PHYSLAB — Hasil Eksperimen</h1><small>Gerak & Kinematika Dasar</small><section><b>Eksperimen:</b> ${D[state.mode].title}<div class="box">Jarak: ${formatNum(x.distance)} km<br>Waktu: ${tm(x.time)}<br>Kecepatan: ${formatNum(x.speed)} km/jam<br><br><b>Variabel terikat: ${x.dependent}</b></div></section><section><h2>Data Percobaan</h2><table><tr><th>No.</th><th>Jarak (km)</th><th>Waktu</th><th>Kecepatan (km/jam)</th></tr>${rows||'<tr><td colspan="4">Belum ada data.</td></tr>'}</table></section><section><h2>Analisis</h2><div class="box">${($("analysisText").value||"Belum diisi.").replace(/</g,"&lt;")}</div><h2>Kesimpulan</h2><div class="box">${($("conclusionText").value||"Belum diisi.").replace(/</g,"&lt;")}</div></section><script>window.print()<\/script></body></html>`);win.document.close();
};

/* render ulang setelah seluruh komponen tambahan tersedia */
render();
