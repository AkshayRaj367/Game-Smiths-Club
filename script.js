/* Game Smiths Club - Interactivity & Animations */
(function(){
  // Detect mobile/touch devices
  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
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

  // Title Pixel Explosion Effect - disabled on mobile for performance
  const heroTitle = document.querySelector('.hero .title');
  let isExploded = false;
  let reappearTimer = null;
  
  if(!isMobile) {
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
  }

  // GSAP scroll reveals - simplified on mobile
  if(window.gsap && !isMobile){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.tl-item').forEach((el,i)=>{
      gsap.to(el,{opacity:1,y:0,duration:.7,delay:i*0.05,scrollTrigger:{trigger:el,start:'top 85%'}});
    });
    gsap.utils.toArray('.card.pop').forEach((el)=>{
      gsap.from(el,{opacity:0,y:20,rotationX:10,duration:.6,scrollTrigger:{trigger:el,start:'top 90%'}});
    });
  }

  // Parallax on scroll - disabled on mobile for performance
  if(!isMobile) {
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
  }

  // Cursor pixel trail (disabled on mobile)
  if(!isMobile){
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
  }

  // Pixel rain - disabled on mobile for performance
  if(!isMobile) {
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
  }

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

  // Custom Cursor (disabled on mobile)
  let mouseX = 0, mouseY = 0;
  
  if(!isMobile){
  const customCursor = document.querySelector('.custom-cursor');
  
  // Initialize cursor position and ensure it's always on top
  if(customCursor) {
    // Create a dedicated overlay container for the cursor
    let cursorOverlay = document.getElementById('cursor-overlay');
    if(!cursorOverlay) {
      cursorOverlay = document.createElement('div');
      cursorOverlay.id = 'cursor-overlay';
      cursorOverlay.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;pointer-events:none!important;z-index:2147483647!important;overflow:visible!important;isolation:isolate!important;';
      document.body.appendChild(cursorOverlay);
    }
    
    // Move cursor into the overlay
    cursorOverlay.appendChild(customCursor);
    
    // Set cursor styles
    customCursor.style.cssText = 'position:fixed!important;width:32px!important;height:32px!important;pointer-events:none!important;z-index:2147483647!important;transform:rotate(-135deg)!important;opacity:1!important;visibility:visible!important;display:block!important;';
    
    // Continuously ensure cursor and overlay stay on top
    setInterval(() => {
      if(cursorOverlay) {
        cursorOverlay.style.zIndex = '2147483647';
        cursorOverlay.style.pointerEvents = 'none';
        if(cursorOverlay.parentElement !== document.body) {
          document.body.appendChild(cursorOverlay);
        }
      }
      if(customCursor) {
        customCursor.style.zIndex = '2147483647';
        customCursor.style.opacity = '1';
        customCursor.style.visibility = 'visible';
        customCursor.style.display = 'block';
      }
    }, 50);
  }
  
  // Update cursor position on mouse move
  const updateCursorPosition = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(customCursor) {
      // Center the cursor on mouse position (32px / 2 = 16px offset)
      customCursor.style.left = (mouseX - 16) + 'px';
      customCursor.style.top = (mouseY - 16) + 'px';
    }
  };
  
  document.addEventListener('mousemove', updateCursorPosition);
  
  // Initialize cursor at center of screen on load
  window.addEventListener('load', () => {
    if(customCursor) {
      customCursor.style.left = (window.innerWidth / 2 - 16) + 'px';
      customCursor.style.top = (window.innerHeight / 2 - 16) + 'px';
    }
  });

  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .card, input, textarea, select');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => customCursor?.classList.add('hover'));
    el.addEventListener('mouseleave', () => customCursor?.classList.remove('hover'));
    // Force hide default cursor
    el.style.cursor = 'none';
  });
  
  // Force hide cursor on all select dropdowns and their options
  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(select => {
    select.style.cursor = 'none';
    select.addEventListener('mousedown', () => {
      // Hide cursor when dropdown opens
      document.body.style.cursor = 'none';
    });
    select.addEventListener('change', () => {
      // Keep cursor hidden after selection
      document.body.style.cursor = 'none';
      select.style.cursor = 'none';
    });
  });
  
  // Observe for dynamically added elements
  const observer = new MutationObserver(() => {
    document.querySelectorAll('select, option').forEach(el => {
      el.style.cursor = 'none';
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

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
      const eyeX = 6 + Math.cos(angle) * 1.5;
      const eyeY = 9 + Math.sin(angle) * 1.5;
      
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
  }

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
    let dx = 0, dy = 0;
    let score = 0;
    let started = false;
    
    function generateFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
      return newFood;
    }
    
    let food = generateFood();

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
        food = generateFood();
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

  // Mobile controls for snake game
  if(isMobile) {
    const mobileControls = document.querySelector('.mobile-controls');
    if(mobileControls) mobileControls.style.display = 'flex';
    
    const mobileBtns = document.querySelectorAll('.mobile-btn');
    mobileBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.getAttribute('data-direction');
        const event = new KeyboardEvent('keydown', {
          key: direction === 'up' ? 'ArrowUp' : 
               direction === 'down' ? 'ArrowDown' :
               direction === 'left' ? 'ArrowLeft' : 'ArrowRight'
        });
        document.dispatchEvent(event);
      });
    });
  }

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

  // Animate social links on scroll (both desktop and mobile)
  const socialLinks = document.querySelectorAll('.icon-link');
  if(window.gsap && window.ScrollTrigger && socialLinks.length > 0 && !isMobile) {
    // Only animate on desktop, keep visible on mobile
    socialLinks.forEach((link, i) => {
      // Set initial state for animation
      gsap.set(link, {opacity: 0, x: 50});
      
      gsap.to(link, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: link.closest('.social-container') || link,
          start: 'top 85%',
          once: true
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

  // Custom Select Dropdown Functionality
  const customSelects = document.querySelectorAll('.custom-select');
  customSelects.forEach(select => {
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');
    const options = items.querySelectorAll('div');
    
    // Toggle dropdown
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllSelect(select);
      select.classList.toggle('select-arrow-active');
      items.classList.toggle('select-hide');
    });
    
    // Select option
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        selected.textContent = option.textContent;
        select.dataset.value = option.dataset.value;
        
        // Remove previous selection
        options.forEach(opt => opt.classList.remove('same-as-selected'));
        option.classList.add('same-as-selected');
        
        // Close dropdown
        select.classList.remove('select-arrow-active');
        items.classList.add('select-hide');
      });
    });
  });
  
  // Close all dropdowns when clicking outside
  function closeAllSelect(except) {
    customSelects.forEach(select => {
      if(select !== except) {
        select.classList.remove('select-arrow-active');
        select.querySelector('.select-items').classList.add('select-hide');
      }
    });
  }
  
  document.addEventListener('click', () => closeAllSelect());

  // Registration form submission
  registrationForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = registrationForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    
    // Get custom select values
    const branchSelect = registrationForm.querySelector('.custom-select[data-name="branch"]');
    const yearSelect = registrationForm.querySelector('.custom-select[data-name="year"]');
    const interestSelect = registrationForm.querySelector('.custom-select[data-name="interest"]');
    
    const formData = {
      name: registrationForm.querySelector('input[name="name"]').value,
      email: registrationForm.querySelector('input[name="email"]').value,
      phone: registrationForm.querySelector('input[name="phone"]').value,
      rollNumber: registrationForm.querySelector('input[name="rollNumber"]').value,
      branch: branchSelect?.dataset.value || '',
      year: yearSelect?.dataset.value || '',
      section: registrationForm.querySelector('input[name="section"]').value.toUpperCase(),
      interest: interestSelect?.dataset.value || ''
    };
    
    // Validation
    if(!formData.branch || !formData.year || !formData.interest) {
      btn.innerHTML = '<span>❌ Please fill all fields</span>';
      btn.style.background = 'linear-gradient(90deg,#ff4444,#ff6666)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 2000);
      return;
    }
    
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
