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

  // Title Pixel Explosion Effect
  const heroTitle = document.querySelector('.hero .title');
  let isExploded = false;
  let reappearTimer = null;
  
  heroTitle?.addEventListener('click', function() {
    if (isExploded) {
      // Reappear
      this.classList.remove('exploded');
      isExploded = false;
      if(reappearTimer) clearTimeout(reappearTimer);
    } else {
      // Explode
      const rect = this.getBoundingClientRect();
      const colors = ['#00ffff', '#ff00ff', '#00ff99', '#ffe066', '#00aaff'];
      
      // Create pixels
      for (let i = 0; i < 50; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'explosion-pixel';
        pixel.style.left = rect.left + rect.width / 2 + 'px';
        pixel.style.top = rect.top + rect.height / 2 + 'px';
        pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 200;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        pixel.style.setProperty('--vx', vx + 'px');
        pixel.style.setProperty('--vy', vy + 'px');
        
        document.body.appendChild(pixel);
        
        // Remove pixel after animation
        setTimeout(() => pixel.remove(), 1000);
      }
      
      this.classList.add('exploded');
      isExploded = true;
      
      // Auto-reappear after 3 seconds
      reappearTimer = setTimeout(() => {
        this.classList.remove('exploded');
        isExploded = false;
      }, 3000);
    }
  });

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
  window.addEventListener('keydown', (e)=>{ 
    if(e.code==='Space'){ 
      // Only prevent default if not typing in input/textarea
      const activeEl = document.activeElement;
      if(activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') {
        e.preventDefault(); 
        jump(heroDino); 
      }
    } 
  });

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

  // Custom Cursor with glitch trails
  const customCursor = document.querySelector('.custom-cursor');
  const trail1 = document.getElementById('trail1');
  const trail2 = document.getElementById('trail2');
  const trail3 = document.getElementById('trail3');
  
  let mouseX = 0, mouseY = 0;
  let trail1Pos = {x: 0, y: 0};
  let trail2Pos = {x: 0, y: 0};
  let trail3Pos = {x: 0, y: 0};
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(customCursor) {
      customCursor.style.left = mouseX + 'px';
      customCursor.style.top = mouseY + 'px';
    }
  });
  
  // Animate cursor trails with glitch effect
  function updateCursorTrails() {
    // Trail 1 - closest, magenta
    trail1Pos.x += (mouseX - trail1Pos.x) * 0.15;
    trail1Pos.y += (mouseY - trail1Pos.y) * 0.15;
    if(trail1) {
      trail1.style.left = trail1Pos.x + 'px';
      trail1.style.top = trail1Pos.y + 'px';
      trail1.style.opacity = '0.5';
    }
    
    // Trail 2 - medium distance, green
    trail2Pos.x += (mouseX - trail2Pos.x) * 0.1;
    trail2Pos.y += (mouseY - trail2Pos.y) * 0.1;
    if(trail2) {
      trail2.style.left = trail2Pos.x + 'px';
      trail2.style.top = trail2Pos.y + 'px';
      trail2.style.opacity = '0.35';
    }
    
    // Trail 3 - farthest, yellow
    trail3Pos.x += (mouseX - trail3Pos.x) * 0.06;
    trail3Pos.y += (mouseY - trail3Pos.y) * 0.06;
    if(trail3) {
      trail3.style.left = trail3Pos.x + 'px';
      trail3.style.top = trail3Pos.y + 'px';
      trail3.style.opacity = '0.25';
    }
    
    requestAnimationFrame(updateCursorTrails);
  }
  updateCursorTrails();

  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .card, input, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => customCursor?.classList.add('hover'));
    el.addEventListener('mouseleave', () => customCursor?.classList.remove('hover'));
  });

  // Ghosts follow cursor with delay
  const ghost1 = document.querySelector('.ghost-1');
  const ghost2 = document.querySelector('.ghost-2');
  const ghost3 = document.querySelector('.ghost-3');
  
  let ghost1Pos = {x: 100, y: 100};
  let ghost2Pos = {x: 150, y: 150};
  let ghost3Pos = {x: 200, y: 200};
  
  let ghost1Target = {x: 100, y: 100};
  let ghost2Target = {x: 150, y: 150};
  let ghost3Target = {x: 200, y: 200};
  
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  let cursorStillTime = 0;
  let isDispersingMode = false;

  function updateCharacters() {
    // Check if cursor is still
    const cursorMoved = Math.abs(mouseX - lastMouseX) > 2 || Math.abs(mouseY - lastMouseY) > 2;
    
    if(cursorMoved) {
      cursorStillTime = 0;
      isDispersingMode = false;
      // Update targets to cursor position
      ghost1Target.x = mouseX;
      ghost1Target.y = mouseY;
      ghost2Target.x = mouseX;
      ghost2Target.y = mouseY;
      ghost3Target.x = mouseX;
      ghost3Target.y = mouseY;
    } else {
      cursorStillTime++;
      
      // After 60 frames (~1 second) of stillness, start dispersing
      if(cursorStillTime > 60 && !isDispersingMode) {
        isDispersingMode = true;
        // Set random disperse targets
        const disperseRadius = 150;
        ghost1Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
        ghost1Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
        ghost2Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
        ghost2Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
        ghost3Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
        ghost3Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
      }
      
      // Keep updating random targets while dispersing
      if(isDispersingMode && cursorStillTime % 120 === 0) {
        const disperseRadius = 200;
        ghost1Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
        ghost1Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
        ghost2Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
        ghost2Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
        ghost3Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
        ghost3Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
      }
    }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    // Ghosts follow their targets with different speeds (creating delay effect)
    ghost1Pos.x += (ghost1Target.x - ghost1Pos.x) * 0.08; // Fastest
    ghost1Pos.y += (ghost1Target.y - ghost1Pos.y) * 0.08;
    
    ghost2Pos.x += (ghost2Target.x - ghost2Pos.x) * 0.05; // Medium
    ghost2Pos.y += (ghost2Target.y - ghost2Pos.y) * 0.05;
    
    ghost3Pos.x += (ghost3Target.x - ghost3Pos.x) * 0.03; // Slowest
    ghost3Pos.y += (ghost3Target.y - ghost3Pos.y) * 0.03;
    
    // Update ghost positions
    if(ghost1) {
      ghost1.style.left = ghost1Pos.x + 'px';
      ghost1.style.top = ghost1Pos.y + 'px';
    }
    if(ghost2) {
      ghost2.style.left = ghost2Pos.x + 'px';
      ghost2.style.top = ghost2Pos.y + 'px';
    }
    if(ghost3) {
      ghost3.style.left = ghost3Pos.x + 'px';
      ghost3.style.top = ghost3Pos.y + 'px';
    }
    
    // Ghost eyes follow cursor
    [ghost1, ghost2, ghost3].forEach((ghost, index) => {
      if(!ghost) return;
      const gRect = ghost.getBoundingClientRect();
      const gCenterX = gRect.left + gRect.width / 2;
      const gCenterY = gRect.top + gRect.height / 2;
      const angle = Math.atan2(mouseY - gCenterY, mouseX - gCenterX);
      const eyeX = 10 + Math.cos(angle) * 3;
      const eyeY = 14 + Math.sin(angle) * 3;
      
      const styleId = `ghost${index + 1}-eye-style`;
      const existingStyle = document.getElementById(styleId);
      if(existingStyle) existingStyle.remove();
      
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `.ghost-${index + 1}:after{left:${eyeX}px!important;top:${eyeY}px!important}`;
      document.head.appendChild(style);
    });

    requestAnimationFrame(updateCharacters);
  }
  updateCharacters();

  // Snake Game
  const snakeCanvas = document.getElementById('snakeGame');
  const snakeCtx = snakeCanvas?.getContext('2d');
  const snakeStartBtn = document.getElementById('snakeStart');
  const snakeScoreEl = document.getElementById('snakeScore');
  
  let snakeGame = null;
  let snakeRunning = false;

  function initSnake() {
    if(!snakeCanvas || !snakeCtx) return;
    
    snakeRunning = false;
    
    const gridSize = 20;
    const tileCount = snakeCanvas.width / gridSize;
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0, dy = 0;
    let score = 0;
    let started = false;

    function drawSnake() {
      snakeCtx.fillStyle = '#00ff99';
      snake.forEach((segment, i) => {
        snakeCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        if(i === 0) {
          snakeCtx.fillStyle = '#00ffff';
          snakeCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
          snakeCtx.fillStyle = '#00ff99';
        }
      });
    }

    function drawFood() {
      snakeCtx.fillStyle = '#ff00ff';
      snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
      if(dx === 0 && dy === 0) return;
      
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      
      // Wall collision
      if(head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
      }
      
      // Self collision
      if(snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      // Check food
      if(head.x === food.x && head.y === food.y) {
        score += 10;
        if(snakeScoreEl) snakeScoreEl.textContent = score;
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }
    }

    function gameLoop() {
      if(!snakeRunning) return;
      
      snakeCtx.fillStyle = '#000';
      snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
      
      moveSnake();
      drawFood();
      drawSnake();
      
      setTimeout(() => requestAnimationFrame(gameLoop), 100);
    }

    function gameOver() {
      snakeRunning = false;
      snakeCtx.fillStyle = '#ff00ff';
      snakeCtx.font = '24px "Press Start 2P"';
      snakeCtx.textAlign = 'center';
      snakeCtx.fillText('GAME OVER', snakeCanvas.width/2, snakeCanvas.height/2);
      if(snakeStartBtn) snakeStartBtn.textContent = 'Restart';
    }

    function handleKey(e) {
      if(!snakeRunning) return;
      const key = e.key.toLowerCase();
      if((key === 'arrowup' || key === 'w') && dy === 0) { dx = 0; dy = -1; started = true; }
      if((key === 'arrowdown' || key === 's') && dy === 0) { dx = 0; dy = 1; started = true; }
      if((key === 'arrowleft' || key === 'a') && dx === 0) { dx = -1; dy = 0; started = true; }
      if((key === 'arrowright' || key === 'd') && dx === 0) { dx = 1; dy = 0; started = true; }
    }

    const keyHandler = (e) => handleKey(e);
    document.addEventListener('keydown', keyHandler);
    snakeRunning = true;
    gameLoop();
    
    return () => document.removeEventListener('keydown', keyHandler);
  }

  snakeStartBtn?.addEventListener('click', () => {
    if(snakeScoreEl) snakeScoreEl.textContent = '0';
    if(snakeStartBtn) snakeStartBtn.textContent = 'Playing...';
    initSnake();
  });

  // Pong Game
  const pongCanvas = document.getElementById('pongGame');
  const pongCtx = pongCanvas?.getContext('2d');
  const pongStartBtn = document.getElementById('pongStart');
  const pongScoreEl = document.getElementById('pongScore');
  
  let pongRunning = false;

  function initPong() {
    if(!pongCanvas || !pongCtx) return;
    
    let paddleY = pongCanvas.height / 2 - 40;
    let ballX = pongCanvas.width / 2;
    let ballY = pongCanvas.height / 2;
    let ballDX = 4;
    let ballDY = 4;
    let score = 0;

    pongCanvas.addEventListener('mousemove', (e) => {
      const rect = pongCanvas.getBoundingClientRect();
      paddleY = e.clientY - rect.top - 40;
    });

    function gameLoop() {
      if(!pongRunning) return;

      pongCtx.fillStyle = '#000';
      pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

      // Draw paddle
      pongCtx.fillStyle = '#00ffff';
      pongCtx.fillRect(10, paddleY, 10, 80);

      // Draw ball
      pongCtx.fillStyle = '#ff00ff';
      pongCtx.fillRect(ballX - 8, ballY - 8, 16, 16);

      // Move ball
      ballX += ballDX;
      ballY += ballDY;

      // Ball collision with walls
      if(ballY <= 0 || ballY >= pongCanvas.height) ballDY *= -1;
      if(ballX >= pongCanvas.width) ballDX *= -1;

      // Ball collision with paddle
      if(ballX <= 20 && ballY >= paddleY && ballY <= paddleY + 80) {
        ballDX *= -1;
        score += 10;
        if(pongScoreEl) pongScoreEl.textContent = score;
      }

      // Game over
      if(ballX <= 0) {
        pongRunning = false;
        pongCtx.fillStyle = '#ff00ff';
        pongCtx.font = '24px "Press Start 2P"';
        pongCtx.textAlign = 'center';
        pongCtx.fillText('GAME OVER', pongCanvas.width/2, pongCanvas.height/2);
        if(pongStartBtn) pongStartBtn.textContent = 'Restart';
        return;
      }

      requestAnimationFrame(gameLoop);
    }

    pongRunning = true;
    gameLoop();
  }

  pongStartBtn?.addEventListener('click', () => {
    if(pongScoreEl) pongScoreEl.textContent = '0';
    if(pongStartBtn) pongStartBtn.textContent = 'Playing...';
    initPong();
  });

  // Contact form animations
  const contactForm = document.querySelector('.contact-form');
  const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateX(5px)';
      this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateX(0)';
    });
  });

  // Form submission with MongoDB
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    
    // Get form data
    const formData = {
      name: contactForm.querySelector('input[type="text"]').value,
      email: contactForm.querySelector('input[type="email"]').value,
      interest: contactForm.querySelector('select').value,
      message: contactForm.querySelector('textarea').value
    };
    
    // Update button state
    btn.textContent = '✨ Sending...';
    btn.style.background = 'linear-gradient(90deg,var(--c-green),var(--c-cyan))';
    btn.disabled = true;
    
    try {
      // Send to backend
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if(data.success) {
        btn.textContent = '✅ Welcome to the Guild!';
        btn.style.background = 'linear-gradient(90deg,var(--c-green),var(--c-cyan))';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      } else {
        btn.textContent = '❌ ' + data.message;
        btn.style.background = 'linear-gradient(90deg,#ff4444,#ff6666)';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      btn.textContent = '❌ Connection Error';
      btn.style.background = 'linear-gradient(90deg,#ff4444,#ff6666)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });

  // Animate social links on scroll
  const socialLinks = document.querySelectorAll('.icon-link');
  if(window.gsap && socialLinks.length > 0) {
    socialLinks.forEach((link, i) => {
      gsap.from(link, {
        opacity: 0,
        x: 50,
        duration: 0.6,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: link,
          start: 'top 90%'
        }
      });
    });
  }

  // Registration Modal
  const registerBtn = document.getElementById('registerBtn');
  const modal = document.getElementById('registrationModal');
  const closeModal = document.getElementById('closeModal');
  const registrationForm = document.getElementById('registrationForm');
  const registeredCountEl = document.getElementById('registeredCount');

  // Open modal
  registerBtn?.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  closeModal?.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close on overlay click
  modal?.querySelector('.modal-overlay')?.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Fetch registered count
  async function fetchRegisteredCount() {
    try {
      const response = await fetch('/api/registrations/count');
      const data = await response.json();
      if(data.success && registeredCountEl) {
        registeredCountEl.setAttribute('data-target', data.count);
        animateCounter(registeredCountEl);
      }
    } catch(error) {
      console.error('Error fetching count:', error);
    }
  }

  // Registration form submission
  registrationForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = registrationForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    
    const formData = {
      name: registrationForm.name.value,
      email: registrationForm.email.value,
      phone: registrationForm.phone.value,
      rollNumber: registrationForm.rollNumber.value,
      branch: registrationForm.branch.value,
      year: registrationForm.year.value,
      section: registrationForm.section.value.toUpperCase(),
      interest: registrationForm.interest.value
    };
    
    btn.innerHTML = '<span>⏳ Registering...</span>';
    btn.disabled = true;
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if(data.success) {
        btn.innerHTML = '<span>✅ Registration Successful!</span>';
        btn.style.background = 'linear-gradient(90deg,var(--c-green),var(--c-cyan))';
        
        setTimeout(() => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
          registrationForm.reset();
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          fetchRegisteredCount();
        }, 2000);
      } else {
        btn.innerHTML = '<span>❌ ' + data.message + '</span>';
        btn.style.background = 'linear-gradient(90deg,#ff4444,#ff6666)';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    } catch(error) {
      console.error('Error:', error);
      btn.innerHTML = '<span>❌ Connection Error</span>';
      btn.style.background = 'linear-gradient(90deg,#ff4444,#ff6666)';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });

  // Fetch count on page load
  fetchRegisteredCount();

})();
