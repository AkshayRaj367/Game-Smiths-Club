/* Game Smiths Club - Interactivity & Animations */
(function(){
  const root = document.documentElement;
  const modeBtn = document.getElementById('modeToggle');
  const musicBtn = document.getElementById('musicToggle');
  const bgm = document.getElementById('bgm');

  // Night/Day mode toggle
  modeBtn?.addEventListener('click',()=>{
    if(root.classList.contains('day')){ root.classList.remove('day'); modeBtn.textContent='☼'; }
    else { root.classList.add('day'); modeBtn.textContent='☾'; }
  });

  // Music toggle (requires a valid audio src)
  let musicOn=false;
  musicBtn?.addEventListener('click',()=>{
    if(!bgm) return;
    musicOn = !musicOn;
    musicBtn.textContent = musicOn ? '♫' : '♪';
    if(musicOn){ bgm.volume=0.25; bgm.play().catch(()=>{}); } else { bgm.pause(); }
  });

  // Countdown to October 17
  const cdEl = document.querySelector('.countdown');
  const dEl = cdEl?.querySelector('.days');
  const hEl = cdEl?.querySelector('.hours');
  const mEl = cdEl?.querySelector('.minutes');
  const sEl = cdEl?.querySelector('.seconds');

  function nextOct17(){
    const now = new Date();
    const year = now.getMonth()>9 || (now.getMonth()===9 && now.getDate()>17) ? now.getFullYear()+1 : now.getFullYear();
    // Months are 0-indexed; 9 => October
    return new Date(year, 9, 17, 0, 0, 0);
  }

  const target = nextOct17();
  function tick(){
    const now = new Date();
    let diff = target - now;
    if(diff <= 0){
      if(cdEl) cdEl.textContent = 'Launched!';
      return;
    }
    const d = Math.floor(diff/86400000);
    diff%=86400000;
    const h = Math.floor(diff/3600000);
    diff%=3600000;
    const m = Math.floor(diff/60000);
    diff%=60000;
    const s = Math.floor(diff/1000);
    if(dEl) dEl.textContent=String(d).padStart(2,'0');
    if(hEl) hEl.textContent=String(h).padStart(2,'0');
    if(mEl) mEl.textContent=String(m).padStart(2,'0');
    if(sEl) sEl.textContent=String(s).padStart(2,'0');
  }
  setInterval(tick,1000); tick();

  // GSAP scroll reveals
  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.tl-item').forEach((el,i)=>{
      gsap.to(el,{opacity:1,y:0,duration:.7,delay:i*0.05,scrollTrigger:{trigger:el,start:'top 85%'}});
    });
    gsap.utils.toArray('.card.pop').forEach((el)=>{
      gsap.from(el,{opacity:0,y:20,rotationX:10,duration:.6,scrollTrigger:{trigger:el,start:'top 90%'}});
    });
  }

  // Parallax on scroll using GSAP
  const layers = document.querySelectorAll('.layer');
  function parallax(){
    const sc = window.scrollY;
    layers.forEach(l=>{
      const depth = parseFloat(l.getAttribute('data-depth')||'0');
      l.style.transform = `translateY(${sc*depth*-0.15}px)`;
    });
  }
  window.addEventListener('scroll', parallax, {passive:true});
  parallax();

  // Cursor pixel trail
  const canvas = document.getElementById('cursor-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w=canvas.width=window.innerWidth, h=canvas.height=window.innerHeight;
    window.addEventListener('resize',()=>{w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;});
    const particles=[];
    const colors=['#00ffff','#ff00ff','#00ff99'];
    function addParticle(x,y){
      particles.push({x,y,dx:(Math.random()-0.5)*1.5,dy:(Math.random()-0.5)*1.5,life:1,size:3,color:colors[(Math.random()*colors.length)|0]});
    }
    window.addEventListener('pointermove',e=>{for(let i=0;i<2;i++) addParticle(e.clientX,e.clientY);});
    function step(){
      ctx.clearRect(0,0,w,h);
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i];
        p.x+=p.dx; p.y+=p.dy; p.life-=0.02;
        ctx.globalAlpha=Math.max(p.life,0);
        ctx.fillStyle=p.color;
        ctx.fillRect(p.x,p.y,p.size,p.size);
        if(p.life<=0) particles.splice(i,1);
      }
      requestAnimationFrame(step);
    }
    step();
  }

  // Pixel rain (occasional)
  function spawnPixelRain(){
    const drop=document.createElement('div');
    drop.className='pixel-drop';
    drop.style.left = Math.random()*100 + 'vw';
    drop.style.top = '-5vh';
    document.body.appendChild(drop);
    const endY = 105;
    const duration = 3000 + Math.random()*2000;
    const start = performance.now();
    function animate(ts){
      const t=(ts-start)/duration; if(t>=1){drop.remove();return;}
      drop.style.top = (-5 + t*(endY+5)) + 'vh';
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  setInterval(()=>{ if(Math.random()<0.35) spawnPixelRain(); }, 1400);

  // Easter egg: spacebar makes dino jump
  const heroDino = document.querySelector('.hero .dino');
  let jumping = false;
  function jump(el){
    if(!el || jumping) return; jumping=true;
    el.style.transition='transform .5s cubic-bezier(.2,.8,.2,1)';
    el.style.transform='translateY(-40px)';
    setTimeout(()=>{el.style.transform='translateY(0)'; setTimeout(()=>{jumping=false;}, 520);}, 300);
  }
  window.addEventListener('keydown', (e)=>{ if(e.code==='Space'){ e.preventDefault(); jump(heroDino); } });

  // Footer dino occasional hop
  const footDino = document.querySelector('.site-footer .dino');
  setInterval(()=>{ if(Math.random()<0.15) jump(footDino); }, 2500);

  // Animated stat counters
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Trigger counter animation on scroll
  if(window.gsap && statNumbers.length > 0) {
    statNumbers.forEach(stat => {
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        once: true,
        onEnter: () => animateCounter(stat)
      });
    });
  }
})();
