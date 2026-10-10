/* Mengirim tinggi konten ke halaman induk agar iframe GLB menyesuaikan tinggi otomatis.
   Tidak mengubah logika PHYSLAB sama sekali. */
(function(){
  if(window.parent===window)return;
  function send(){
    var h=Math.max(document.body.scrollHeight,document.body.offsetHeight);
    window.parent.postMessage({type:"glb-height",height:h},"*");
  }
  window.addEventListener("load",send);
  window.addEventListener("resize",send);
  if(window.ResizeObserver)new ResizeObserver(send).observe(document.body);
  setInterval(send,800);
})();
