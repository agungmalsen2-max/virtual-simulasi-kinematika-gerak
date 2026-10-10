/* Membuka bagian GLB (PHYSLAB) saat kartu Eksperimen 04 dipilih.
   Iframe dimuat sekali saja (lazy) dan tinggi mengikuti isi halaman GLB. */
(function(){
  var f=document.getElementById("glbFrame");
  if(!f)return;
  function load(){if(!f.getAttribute("src"))f.setAttribute("src",f.dataset.src)}
  document.querySelectorAll('[data-page="glb"]').forEach(function(b){b.addEventListener("click",load)});
  window.addEventListener("message",function(e){
    if(e.source!==f.contentWindow||!e.data||e.data.type!=="glb-height")return;
    f.style.height=Math.ceil(e.data.height)+"px";
  });
})();
