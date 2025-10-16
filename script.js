/**
 * Game Smiths Club - Main JavaScript
 * 
 * Handles all client-side interactivity including:
 * - Mobile/desktop detection and optimization
 * - Custom cursor and ghost followers
 * - Music toggle and autoplay
 * - Countdown timer
 * - Parallax scrolling
 * - Mini games (Snake, Pong)
 * - Form validation and submission
 * - Member count fetching
 * - Touch controls for mobile games
 * 
 * @author Game Smiths Club Team
 * @version 2.0.0
 */
(function(){
  /**
   * Detects if the current device is mobile or touch-enabled
   * Checks multiple conditions for comprehensive mobile detection
   * @constant {boolean}
   */
  const isMobile = (window.innerWidth <= 768) || // Screen width check first
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // If mobile, enable default cursor immediately and hide custom cursor
  if(isMobile) {
    document.documentElement.style.cursor = 'auto';
    document.body.style.cursor = 'auto';
    const customCursor = document.querySelector('.custom-cursor');
    if(customCursor) customCursor.style.display = 'none';
  }
  
  // DOM element references
  const root = document.documentElement;
  const musicBtn = document.getElementById('musicToggle');
  const bgm = document.getElementById('bgm');

  /**
   * Initializes and handles background music autoplay
   * Attempts to autoplay on page load, falls back to manual play if blocked
   * @type {boolean} musicOn - Current music playback state
   */
  let musicOn = false;
  if(bgm) {
    bgm.volume = 0.25;
    // Attempt to autoplay music on page load
    bgm.play().then(() => {
      musicOn = true;
      if(musicBtn) musicBtn.textContent = '♫';
    }).catch(() => {
      // Autoplay was blocked by browser policy, requires user interaction
      console.log('Autoplay blocked. Click the music button to play.');
      musicOn = false;
      if(musicBtn) musicBtn.textContent = '♪';
    });
  }

  /**
   * Music toggle button event handler
   * Toggles between play and pause states
   */
  musicBtn?.addEventListener('click',()=>{
    if(!bgm) return;
    musicOn = !musicOn;
    musicBtn.textContent = musicOn ? '♫' : '♪';
    if(musicOn){ bgm.volume=0.25; bgm.play().catch(()=>{}); } else { bgm.pause(); }
  });

  /**
   * Countdown Timer to October 17
   * Displays days, hours, minutes, and seconds remaining
   */
  const cdEl = document.querySelector('.countdown');
  const dEl = cdEl?.querySelector('.days');
  const hEl = cdEl?.querySelector('.hours');
  const mEl = cdEl?.querySelector('.minutes');
  const sEl = cdEl?.querySelector('.seconds');

  /**
   * Calculates the next October 17 date
   * @returns {Date} Next occurrence of October 17
   */
  function nextOct17(){
    const now = new Date();
    const year = now.getMonth()>9 || (now.getMonth()===9 && now.getDate()>17) ? now.getFullYear()+1 : now.getFullYear();
    // Months are 0-indexed; 9 => October
    return new Date(year, 9, 17, 0, 0, 0);
  }

  const target = nextOct17();
  
  /**
   * Updates countdown display every second
   * Shows "The Club is Live" message when countdown reaches zero
   */
  function tick(){
    const now = new Date();
    let diff = target - now;
    if(diff <= 0){
      if(cdEl) {
        cdEl.innerHTML = '<div style="font-size: 32px; font-weight: bold; color: var(--c-cyan); text-shadow: 0 0 20px var(--c-cyan), 0 0 40px var(--c-mag); animation: pulse 1.5s ease-in-out infinite;"> The Club is Live 🤩!!!! </div>';
      }
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

  /**
   * Title Pixel Explosion Effect
   * Creates animated pixel particles when title is clicked
   * Disabled on mobile for performance
   */
  const heroTitle = document.querySelector('.hero .title');
  let isExploded = false;
  let reappearTimer = null;
  
  if(!isMobile) {
    heroTitle?.addEventListener('click', function() {
      if (isExploded) {
        // Reappear animation
        this.classList.remove('exploded');
        isExploded = false;
        if(reappearTimer) clearTimeout(reappearTimer);
      } else {
        // Explode animation: create 50 colored pixels
        const rect = this.getBoundingClientRect();
        const colors = ['#00ffff', '#ff00ff', '#00ff99', '#ffe066', '#00aaff'];
        
        for (let i = 0; i < 50; i++) {
          const pixel = document.createElement('div');
          pixel.className = 'explosion-pixel';
          pixel.style.left = rect.left + rect.width / 2 + 'px';
          pixel.style.top = rect.top + rect.height / 2 + 'px';
          pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          
          // Calculate random explosion vector
          const angle = Math.random() * Math.PI * 2;
          const velocity = 100 + Math.random() * 200;
          const vx = Math.cos(angle) * velocity;
          const vy = Math.sin(angle) * velocity;
          
          pixel.style.setProperty('--vx', vx + 'px');
          pixel.style.setProperty('--vy', vy + 'px');
          
          document.body.appendChild(pixel);
          
          // Remove pixel after animation completes
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

  /**
   * Fetches the current member count from the MongoDB database
   * Updates the member count stat card with real-time data
   * @async
   * @param {boolean} animate - Whether to animate the counter (default: false)
   * @returns {Promise<void>}
   */
  async function fetchMemberCount(animate = false) {
    try {
      const response = await fetch('/api/members/count');
      const data = await response.json();
      if(data.success) {
        const memberStatCard = document.getElementById('memberCount');
        if(memberStatCard) {
          memberStatCard.setAttribute('data-target', data.count);
          memberStatCard.textContent = '0';
          
          // Animate counter if requested
          if(animate) {
            animateCounter(memberStatCard);
          }
        }
      }
    } catch(error) {
      console.error('Error fetching member count:', error);
    }
  }

  // Fetch member count on page load, then animate
  fetchMemberCount().then(() => {
    // Trigger counter animation on scroll (desktop) or immediately (mobile)
    if(window.gsap && statNumbers.length > 0) {
      if(isMobile) {
        // On mobile, animate immediately without waiting for scroll
        statNumbers.forEach(stat => {
          animateCounter(stat);
        });
      } else {
        // On desktop, use scroll trigger
        statNumbers.forEach(stat => {
          ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            once: true,
            onEnter: () => animateCounter(stat)
          });
        });
      }
    }
  });

  // Custom Cursor (disabled on mobile)
  let mouseX = -1000, mouseY = -1000; // Start off-screen
  let customCursorInitialized = false;
  
  if(!isMobile){
  const customCursor = document.querySelector('.custom-cursor');
  
  // Initialize cursor position and ensure it's always on top
  if(customCursor) {
    // Create a dedicated overlay container for the cursor
    let cursorOverlay = document.getElementById('cursor-overlay');
    if(!cursorOverlay) {
      cursorOverlay = document.createElement('div');
      cursorOverlay.id = 'cursor-overlay';
      cursorOverlay.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;pointer-events:none!important;z-index:2147483646!important;overflow:visible!important;isolation:isolate!important;';
      document.body.appendChild(cursorOverlay);
    }
    
    // Move cursor into the overlay
    cursorOverlay.appendChild(customCursor);
    
    // Initialize cursor off-screen
    customCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(-135deg)`;
    customCursorInitialized = true;
    
    // Continuously ensure cursor overlay stays on top but below max z-index
    setInterval(() => {
      if(cursorOverlay) {
        cursorOverlay.style.zIndex = '2147483646';
        cursorOverlay.style.pointerEvents = 'none';
        if(cursorOverlay.parentElement !== document.body) {
          document.body.appendChild(cursorOverlay);
        }
      }
      if(customCursor) {
        customCursor.style.display = 'block';
      }
    }, 100);
  }
  
  // Update cursor position on mouse move
  const updateCursorPosition = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if(customCursor) {
      // Use transform for better performance and prevent glitching
      customCursor.style.transform = `translate3d(${mouseX - 16}px, ${mouseY - 16}px, 0) rotate(-135deg)`;
    }
  };
  
  // Use multiple event listeners for better browser compatibility
  document.addEventListener('mousemove', updateCursorPosition);
  document.addEventListener('mouseenter', updateCursorPosition);
  
  // Also track on window for better coverage
  window.addEventListener('mousemove', updateCursorPosition);
  
  // Fallback: Show default cursor if custom cursor fails to initialize or move
  let cursorMoveDetected = false;
  const cursorFailsafeCheck = setTimeout(() => {
    if(!cursorMoveDetected && customCursor) {
      // If no mouse movement detected after 3 seconds, show default cursor as fallback
      console.warn('Custom cursor may not be working properly, enabling fallback');
      document.documentElement.style.setProperty('cursor', 'auto', 'important');
      document.body.style.setProperty('cursor', 'auto', 'important');
    }
  }, 3000);
  
  // Detect any cursor movement
  const detectCursorMovement = () => {
    cursorMoveDetected = true;
    clearTimeout(cursorFailsafeCheck);
    document.removeEventListener('mousemove', detectCursorMovement);
  };
  document.addEventListener('mousemove', detectCursorMovement);

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

  /**
   * Snake Game Implementation
   * Classic snake game with keyboard and mobile controls
   * @namespace SnakeGame
   */
  const snakeCanvas = document.getElementById('snakeGame');
  const snakeCtx = snakeCanvas?.getContext('2d');
  const snakeStartBtn = document.getElementById('snakeStart');
  const snakeScoreEl = document.getElementById('snakeScore');
  
  let snakeGame = null;
  let snakeRunning = false;

  /**
   * Initializes the Snake game
   * Sets up game grid, snake, food, and event listeners
   * @function initSnake
   * @returns {Function} Cleanup function to remove event listeners
   */
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

  /**
   * Pong Game Implementation
   * Classic pong game with keyboard controls (desktop) and touch controls (mobile)
   * @namespace PongGame
   */
  const pongCanvas = document.getElementById('pongGame');
  const pongCtx = pongCanvas?.getContext('2d');
  const pongStartBtn = document.getElementById('pongStart');
  const pongScoreEl = document.getElementById('pongScore');
  
  let pongRunning = false;

  /**
   * Initializes the Pong game
   * Sets up paddle, ball, physics, and controls
   * Includes touch controls for mobile devices
   * @function initPong
   */
  function initPong() {
    if(!pongCanvas || !pongCtx) return;
    
    let paddleY = pongCanvas.height / 2 - 40;
    let ballX = pongCanvas.width / 2;
    let ballY = pongCanvas.height / 2;
    let ballDX = 2.5;
    let ballDY = 2.5;
    let score = 0;
    
    // Keyboard controls
    const keys = {};
    const paddleSpeed = 4;
    
    // Touch/Scroll controls for mobile
    let touchStartY = 0;
    let lastTouchY = 0;
    
    function handleTouchStart(e) {
      if(!isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      const rect = pongCanvas.getBoundingClientRect();
      touchStartY = touch.clientY - rect.top;
      lastTouchY = touch.clientY;
      
      // Directly set paddle position based on touch
      paddleY = touchStartY - 40; // Center paddle on touch (80/2 = 40)
      paddleY = Math.max(0, Math.min(paddleY, pongCanvas.height - 80));
    }
    
    function handleTouchMove(e) {
      if(!isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      const rect = pongCanvas.getBoundingClientRect();
      const touchY = touch.clientY - rect.top;
      
      // Move paddle to follow touch position directly
      paddleY = touchY - 40; // Center paddle on touch (80/2 = 40)
      paddleY = Math.max(0, Math.min(paddleY, pongCanvas.height - 80));
      
      lastTouchY = touch.clientY;
    }
    
    function handleTouchEnd(e) {
      if(!isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      touchStartY = 0;
      lastTouchY = 0;
    }
    
    function handleKeyDown(e) {
      if(['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        keys[e.key.toLowerCase()] = true;
      }
    }
    
    function handleKeyUp(e) {
      keys[e.key.toLowerCase()] = false;
    }
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    if(isMobile && pongCanvas) {
      // Use { passive: false } to allow preventDefault()
      pongCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      pongCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      pongCanvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Also prevent default on the canvas itself
      pongCanvas.style.touchAction = 'none';
    }

    function gameLoop() {
      if(!pongRunning) {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        if(isMobile && pongCanvas) {
          pongCanvas.removeEventListener('touchstart', handleTouchStart);
          pongCanvas.removeEventListener('touchmove', handleTouchMove);
          pongCanvas.removeEventListener('touchend', handleTouchEnd);
        }
        return;
      }

      pongCtx.fillStyle = '#000';
      pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);
      
      // Move paddle with keyboard (desktop only)
      if(!isMobile) {
        if(keys['arrowup'] || keys['w']) {
          paddleY -= paddleSpeed;
        }
        if(keys['arrowdown'] || keys['s']) {
          paddleY += paddleSpeed;
        }
        
        // Keep paddle within bounds
        paddleY = Math.max(0, Math.min(paddleY, pongCanvas.height - 80));
      }

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
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
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

  // Custom Select Dropdown Functionality for Contact Form
  const contactCustomSelects = document.querySelectorAll('.contact-form .custom-select');
  contactCustomSelects.forEach(select => {
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');
    const options = items.querySelectorAll('div');
    
    // Toggle dropdown
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllContactSelect(select);
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
  function closeAllContactSelect(except) {
    contactCustomSelects.forEach(select => {
      if(select !== except) {
        select.classList.remove('select-arrow-active');
        const items = select.querySelector('.select-items');
        if(items) items.classList.add('select-hide');
      }
    });
  }
  
  document.addEventListener('click', () => closeAllContactSelect());

  // Form submission with MongoDB
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    
    // Get custom select values
    const branchSelect = contactForm.querySelector('.custom-select[data-name="branch"]');
    const interestSelect = contactForm.querySelector('.custom-select[data-name="interest"]');
    
    // Get form data
    const formData = {
      name: contactForm.querySelector('input[name="name"]').value,
      email: contactForm.querySelector('input[name="email"]').value,
      phone: contactForm.querySelector('input[name="phone"]').value,
      branch: branchSelect?.dataset.value || '',
      section: contactForm.querySelector('input[name="section"]').value,
      interest: interestSelect?.dataset.value || '',
      message: contactForm.querySelector('textarea[name="message"]').value
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.branch || !formData.section || !formData.interest) {
      btn.textContent = 'Please fill all required fields';
      btn.style.background = 'linear-gradient(90deg,#ff4444,#ff6666)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
      return;
    }
    
    // Update button state
    btn.textContent = 'Sending...';
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
        btn.textContent = 'Welcome to the Guild!';
        btn.style.background = 'linear-gradient(90deg,var(--c-green),var(--c-cyan))';
        
        // Update member count with animation
        await fetchMemberCount(true);
        
        // Scroll to stats section smoothly
        setTimeout(() => {
          const statsSection = document.querySelector('.stats-section');
          if(statsSection) {
            statsSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 500);
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      } else {
        btn.textContent = data.message;
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

})();
