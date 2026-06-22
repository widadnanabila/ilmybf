const HEARTS = ['💜','💜','💜','🤍','💫','🌸','💜'];
function spawnHeart() {
  const cur = document.querySelector('.page.active');
  if (cur && cur.id === 'page2') return;
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  h.style.fontSize = (12 + Math.random() * 16) + 'px';
  h.style.left = (Math.random() * 100) + 'vw';
  const dur = 4 + Math.random() * 5;
  h.style.animationDuration = dur + 's';
  h.style.animationDelay = '0s';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), (dur + 0.5) * 1000);
}
for (let i = 0; i < 20; i++) setTimeout(spawnHeart, i * 120);
setInterval(spawnHeart, 350);

let hasVisitedPage3 = false;
let scrollObserver = null;

function goTo(from, to) {
  document.getElementById('page' + from).classList.remove('active');
  document.getElementById('page' + to).classList.add('active');
  if (to === 3) {
    startMusic(); hasVisitedPage3 = true;
    const wrap = document.getElementById('pg3Scroll');
    wrap.scrollTop = 0;
    document.querySelectorAll('.photo-row').forEach(r => r.classList.remove('visible'));
    setTimeout(initScrollObserver, 100);
  }
  if (from === 3) { stopMusic(); showEnvelopeStep(); }
  if (to === 2 && from === 1) resetPage2();
}

function initScrollObserver() {
  if (scrollObserver) scrollObserver.disconnect();
  const wrap = document.getElementById('pg3Scroll');
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); scrollObserver.unobserve(e.target); }
    });
  }, { root: wrap, threshold: 0.12 });
  document.querySelectorAll('.photo-row').forEach(r => scrollObserver.observe(r));
}

function showEnvelopeStep() {
  document.getElementById('step-envelope').style.display = 'flex';
  document.getElementById('step-love').classList.remove('show');
  document.getElementById('step-gift').classList.remove('show');
  document.getElementById('step-gift').style.display = '';
  document.getElementById('step-letter').classList.remove('show');
  btnNo.style.opacity = '0'; btnNo.style.pointerEvents = 'none'; noVisible = false;
  document.getElementById('btn-back-from3').classList.add('visible');
}

const btnNo = document.getElementById('btnNo');
let noVisible = false;

function resetPage2() {
  document.getElementById('step-envelope').style.display = 'flex';
  document.getElementById('step-love').classList.remove('show');
  document.getElementById('step-gift').classList.remove('show');
  document.getElementById('step-gift').style.display = '';
  document.getElementById('step-letter').classList.remove('show');
  btnNo.style.opacity = '0'; btnNo.style.pointerEvents = 'none'; noVisible = false;
  document.getElementById('btn-back-from3').classList.remove('visible');
}

function showLove() {
  document.getElementById('step-envelope').style.display = 'none';
  document.getElementById('step-love').classList.add('show');
  placeNoInitial();
  btnNo.style.opacity = '1'; btnNo.style.pointerEvents = 'auto'; noVisible = true;
}

function placeNoInitial() {
  const yes = document.querySelector('.btn-yes');
  const yr = yes.getBoundingClientRect();
  btnNo.style.transition = 'none';
  btnNo.style.left = (yr.right + 16) + 'px';
  btnNo.style.top  = yr.top + 'px';
}

function runAway() {
  if (!noVisible) return;
  const W = window.innerWidth, H = window.innerHeight;
  const bW = 130, bH = 48;
  const yr = document.querySelector('.btn-yes').getBoundingClientRect();
  const qr = document.querySelector('.love-question').getBoundingClientRect();
  const fx1 = Math.min(yr.left,qr.left)-60, fx2 = Math.max(yr.right,qr.right)+60;
  const fy1 = qr.top-30, fy2 = yr.bottom+30;
  let x, y, tries=0;
  do {
    const side = Math.floor(Math.random()*4);
    if      (side===0){x=Math.random()*(W-bW);y=10+Math.random()*80;}
    else if (side===1){x=Math.random()*(W-bW);y=H-bH-10-Math.random()*80;}
    else if (side===2){x=10+Math.random()*100;y=Math.random()*(H-bH);}
    else              {x=W-bW-10-Math.random()*100;y=Math.random()*(H-bH);}
    tries++;
  } while(tries<20 && x+bW>fx1 && x<fx2 && y+bH>fy1 && y<fy2);
  btnNo.style.transition='left 0.22s cubic-bezier(0.34,1.56,0.64,1),top 0.22s cubic-bezier(0.34,1.56,0.64,1)';
  btnNo.style.left=x+'px'; btnNo.style.top=y+'px';
}

function showGift() {
  document.getElementById('step-love').classList.remove('show');
  btnNo.style.opacity='0'; btnNo.style.pointerEvents='none'; noVisible=false;
  document.getElementById('step-gift').classList.add('show');
}

function openGift() {
  launchConfetti();
  document.getElementById('confettiSound').play();
  document.getElementById('step-gift').style.display='none';
  document.getElementById('step-letter').classList.add('show');
}

function launchConfetti() {
  const colors=['#f9a8d4','#ec4899','#fde68a','#a78bfa','#6ee7b7','#fff','#fb7185','#c084fc'];
  for(let i=0;i<120;i++){
    setTimeout(()=>{
      const c=document.createElement('div');
      c.className='confetti-piece';
      c.style.left=(Math.random()*100)+'vw';
      c.style.width=(6+Math.random()*8)+'px';
      c.style.height=(10+Math.random()*10)+'px';
      c.style.background=colors[Math.floor(Math.random()*colors.length)];
      c.style.borderRadius=Math.random()>0.5?'50%':'2px';
      const dur=1.5+Math.random()*2.5;
      c.style.animationDuration=dur+'s';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),dur*1000+200);
    },i*20);
  }
}

const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const progressFill = document.getElementById('progressFill');
const START_TIME = 15;

function startMusic(){ audio.currentTime=START_TIME; audio.play(); playBtn.textContent='⏸'; }
function stopMusic(){ audio.pause(); audio.currentTime=START_TIME; playBtn.textContent='▶'; }
function toggleMusic(){
  if(audio.paused){ audio.play(); playBtn.textContent='⏸'; }
  else{ audio.pause(); playBtn.textContent='▶'; }
}
audio.addEventListener('timeupdate',()=>{
  if(audio.duration) progressFill.style.width=(audio.currentTime/audio.duration*100)+'%';
});
function seekMusic(e){
  const rect=e.currentTarget.getBoundingClientRect();
  audio.currentTime=((e.clientX-rect.left)/rect.width)*audio.duration;
}