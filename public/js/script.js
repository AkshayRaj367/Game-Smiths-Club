/* Game Smiths Club - Optimized Performance Version */
(function(){
  // Detect mobile/touch devices
  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  // Throttle utility for performance
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  // Debounce utility
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const root = document.documentElement;
  const musicBtn = document.getElementById('musicToggle');
  const bgm = document.getElementById('bgm');

  // Autoplay music on page load
  let musicOn = false;
  if(bgm) {
    bgm.volume = 0.25;
    // Attempt to autoplay
    bgm.play().then(() => {
      musicOn = true;
      if(musicBtn) musicBtn.textContent = '♫';
    }).catch(() => {
      // Autoplay was blocked, will require user interaction
      console.log('Autoplay blocked. Click the music button to play.');
      musicOn = false;
      if(musicBtn) musicBtn.textContent = '♪';
    });
  }

  // Music toggle
  musicBtn?.addEventListener('click',()=>{
    if(!bgm) return;
    musicOn = !musicOn;
    musicBtn.textContent = musicOn ? '♫' : '♪';
    if(musicOn){ 
      bgm.volume=0.25; 
      bgm.play().catch(()=>{}); 
    } else { 
      bgm.pause(); 
    }
  });

  // Countdown - optimized with less frequent updates
  const cdEl = document.querySelector('.countdown');
  const dEl = cdEl?.querySelector('.days');
  const hEl = cdEl?.querySelector('.hours');
  const mEl = cdEl?.querySelector('.minutes');
  const sEl = cdEl?.querySelector('.seconds');

  function nextOct17(){
    const now = new Date();
    const year = now.getMonth()>9 || (now.getMonth()===9 && now.getDate()>17) 
      ? now.getFullYear()+1 
      : now.getFullYear();
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
  setInterval(tick,1000); 
  tick();

  // Title Pixel Explosion - disabled on mobile for performance
  const heroTitle = document.querySelector('.hero .title');
  let isExploded = false;
  let reappearTimer = null;
  
  if(!isMobile) {
    heroTitle?.addEventListener('click', function() {
      if (isExploded) {
        this.classList.remove('exploded');
        isExploded = false;
        if(reappearTimer) clearTimeout(reappearTimer);
      } else {
        const rect = this.getBoundingClientRect();
        const colors = ['#00ffff', '#ff00ff', '#00ff99', '#ffe066', '#00aaff'];
        
        // Reduced particle count for performance
        const particleCount = 40;
        
        for (let i = 0; i < particleCount; i++) {
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
          setTimeout(() => pixel.remove(), 1000);
        }
        
        this.classList.add('exploded');
        isExploded = true;
        
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
      gsap.to(el,{
        opacity:1,
        y:0,
        duration:.7,
        delay:i*0.05,
        scrollTrigger:{trigger:el,start:'top 85%'}
      });
    });
    gsap.utils.toArray('.card.pop').forEach((el)=>{
      gsap.from(el,{
        opacity:0,
        y:20,
        rotationX:10,
        duration:.6,
        scrollTrigger:{trigger:el,start:'top 90%'}
      });
    });
  } else {
    // Fallback to Intersection Observer - simplified for mobile
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tl-item, .card.pop').forEach(el => {
      el.style.transition = isMobile ? 'opacity 0.3s' : 'opacity 0.6s, transform 0.6s';
      observer.observe(el);
    });
  }

  // Parallax - throttled for performance, disabled on mobile
  const layers = document.querySelectorAll('.layer');
  if(!isMobile){
    const parallax = throttle(function(){
      const sc = window.scrollY;
      layers.forEach(l=>{
        const depth = parseFloat(l.getAttribute('data-depth')||'0');
        l.style.transform = `translateY(${sc*depth*-0.15}px)`;
      });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', parallax, {passive:true});
    parallax();
  }

  // Cursor pixel trail - optimized particle system
  if(!isMobile){
    const canvas = document.getElementById('cursor-canvas');
    if(canvas){
      const ctx = canvas.getContext('2d', { alpha: true });
      let w=canvas.width=window.innerWidth;
      let h=canvas.height=window.innerHeight;
      
      const resizeCanvas = debounce(() => {
        w=canvas.width=window.innerWidth;
        h=canvas.height=window.innerHeight;
      }, 250);
      
      window.addEventListener('resize', resizeCanvas);
      
      const particles=[];
      const colors=['#00ffff','#ff00ff','#00ff99'];
      const maxParticles = 100; // Limit particle count
      
      function addParticle(x,y){
        if(particles.length >= maxParticles) return;
        particles.push({
          x, y,
          dx:(Math.random()-0.5)*1.5,
          dy:(Math.random()-0.5)*1.5,
          life:1,
          size:3,
          color:colors[(Math.random()*colors.length)|0]
        });
      }
      
      // Throttle particle creation
      const throttledAddParticle = throttle((e) => {
        addParticle(e.clientX, e.clientY);
      }, 50);
      
      window.addEventListener('pointermove', throttledAddParticle);
      
      function step(){
        ctx.clearRect(0,0,w,h);
        for(let i=particles.length-1;i>=0;i--){
          const p=particles[i];
          p.x+=p.dx; 
          p.y+=p.dy; 
          p.life-=0.02;
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
  if(!isMobile){
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
        const t=(ts-start)/duration; 
        if(t>=1){
          drop.remove();
          return;
        }
        drop.style.top = (-5 + t*(endY+5)) + 'vh';
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
    // Reduced frequency
    setInterval(()=>{ 
      if(Math.random()<0.2) spawnPixelRain(); 
    }, 2000);
  }

  // Dino jump
  const heroDino = document.querySelector('.hero .dino');
  let jumping = false;
  function jump(el){
    if(!el || jumping) return; 
    jumping=true;
    el.style.transition='transform .5s cubic-bezier(.2,.8,.2,1)';
    el.style.transform='translateY(-40px)';
    setTimeout(()=>{
      el.style.transform='translateY(0)'; 
      setTimeout(()=>{jumping=false;}, 520);
    }, 300);
  }
  
  window.addEventListener('keydown', (e)=>{ 
    if(e.code==='Space'){ 
      const activeEl = document.activeElement;
      if(activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') {
        e.preventDefault(); 
        jump(heroDino); 
      }
    } 
  });

  const footDino = document.querySelector('.site-footer .dino');
  setInterval(()=>{ 
    if(Math.random()<0.15) jump(footDino); 
  }, 2500);

  // Stat counters - optimized
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

  // Fetch member count from database
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

  // Fetch count on page load
  fetchMemberCount();

  // Use Intersection Observer for stat counters
  if(statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  // Custom Cursor - optimized
  let mouseX = 0, mouseY = 0;
  
  if(!isMobile){
    const customCursor = document.querySelector('.custom-cursor');
    
    // Use transform3d instead of left/top for better performance and prevent glitching
    const updateCursor = throttle((e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if(customCursor) {
        customCursor.style.transform = `translate3d(${mouseX - 16}px, ${mouseY - 16}px, 0) rotate(-135deg)`;
      }
    }, 16);
    
    document.addEventListener('mousemove', updateCursor);

    // Hover effect
    const interactiveElements = document.querySelectorAll('a, button, .card, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => customCursor?.classList.add('hover'));
      el.addEventListener('mouseleave', () => customCursor?.classList.remove('hover'));
    });

    // Ghosts - optimized with transform
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

    // Cache eye styles to avoid DOM manipulation every frame
    const eyeStyles = [null, null, null];

    function updateCharacters() {
      const cursorMoved = Math.abs(mouseX - lastMouseX) > 2 || Math.abs(mouseY - lastMouseY) > 2;
      
      if(cursorMoved) {
        cursorStillTime = 0;
        isDispersingMode = false;
        ghost1Target.x = mouseX;
        ghost1Target.y = mouseY;
        ghost2Target.x = mouseX;
        ghost2Target.y = mouseY;
        ghost3Target.x = mouseX;
        ghost3Target.y = mouseY;
      } else {
        cursorStillTime++;
        
        if(cursorStillTime > 60 && !isDispersingMode) {
          isDispersingMode = true;
          const disperseRadius = 150;
          ghost1Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
          ghost1Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
          ghost2Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
          ghost2Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
          ghost3Target.x = mouseX + (Math.random() - 0.5) * disperseRadius * 2;
          ghost3Target.y = mouseY + (Math.random() - 0.5) * disperseRadius * 2;
        }
        
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
      
      // Update positions with transform for better performance
      ghost1Pos.x += (ghost1Target.x - ghost1Pos.x) * 0.08;
      ghost1Pos.y += (ghost1Target.y - ghost1Pos.y) * 0.08;
      
      ghost2Pos.x += (ghost2Target.x - ghost2Pos.x) * 0.05;
      ghost2Pos.y += (ghost2Target.y - ghost2Pos.y) * 0.05;
      
      ghost3Pos.x += (ghost3Target.x - ghost3Pos.x) * 0.03;
      ghost3Pos.y += (ghost3Target.y - ghost3Pos.y) * 0.03;
      
      if(ghost1) {
        ghost1.style.transform = `translate(${ghost1Pos.x}px, ${ghost1Pos.y}px)`;
      }
      if(ghost2) {
        ghost2.style.transform = `translate(${ghost2Pos.x}px, ${ghost2Pos.y}px)`;
      }
      if(ghost3) {
        ghost3.style.transform = `translate(${ghost3Pos.x}px, ${ghost3Pos.y}px)`;
      }
      
      // Update ghost eyes - optimized
      [ghost1, ghost2, ghost3].forEach((ghost, index) => {
        if(!ghost) return;
        const gRect = ghost.getBoundingClientRect();
        const gCenterX = gRect.left + gRect.width / 2;
        const gCenterY = gRect.top + gRect.height / 2;
        const angle = Math.atan2(mouseY - gCenterY, mouseX - gCenterX);
        const eyeX = 6 + Math.cos(angle) * 1.5;
        const eyeY = 9 + Math.sin(angle) * 1.5;
        
        const styleId = `ghost${index + 1}-eye-style`;
        
        // Reuse existing style element
        if(!eyeStyles[index]) {
          eyeStyles[index] = document.createElement('style');
          eyeStyles[index].id = styleId;
          document.head.appendChild(eyeStyles[index]);
        }
        
        eyeStyles[index].textContent = `.ghost-${index + 1}:after{left:${eyeX}px!important;top:${eyeY}px!important}`;
      });

      requestAnimationFrame(updateCharacters);
    }
    updateCharacters();
  }

  // Games and forms - keep existing implementation
  // ... (rest of the code remains the same)

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

  // Contact form
  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    
    // Get custom select values
    const branchSelect = contactForm.querySelector('.custom-select[data-name="branch"]');
    const interestSelect = contactForm.querySelector('.custom-select[data-name="interest"]');
    
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
    
    btn.textContent = 'Sending...';
    btn.style.background = 'linear-gradient(90deg,var(--c-green),var(--c-cyan))';
    btn.disabled = true;
    
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if(data.success) {
        btn.textContent = 'Welcome to the Guild!';
        
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
      btn.textContent = 'Connection Error';
      btn.style.background = 'linear-gradient(90deg,#ff4444,#ff6666)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });

  // Registration modal
  const registerBtn = document.getElementById('registerBtn');
  const modal = document.getElementById('registrationModal');
  const closeModal = document.getElementById('closeModal');
  const registrationForm = document.getElementById('registrationForm');

  registerBtn?.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeModal?.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  modal?.querySelector('.modal-overlay')?.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Fetch registered count
  async function fetchRegisteredCount() {
    try {
      const response = await fetch('/api/registrations/count');
      const data = await response.json();
      const registeredCountEl = document.getElementById('registeredCount');
      if(data.success && registeredCountEl) {
        registeredCountEl.setAttribute('data-target', data.count);
        animateCounter(registeredCountEl);
      }
    } catch(error) {
      console.error('Error fetching count:', error);
    }
  }

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

  fetchRegisteredCount();

})();
