// ============================================
// UTKARSH YADAV — MacBook Portfolio
// Boot + Welcome Screen with Particles
// ============================================

(function() {
  const bootScreen = document.getElementById('boot-screen');
  const welcomeScreen = document.getElementById('welcome-screen');
  const macbook = document.getElementById('macbook');

  // ── Boot Phase ──
  const bootDuration = 3000;

  setTimeout(() => {
    bootScreen.classList.add('fade-out');
    setTimeout(() => {
      bootScreen.style.display = 'none';
      // Show welcome screen
      welcomeScreen.classList.remove('hidden');
      initWelcomeParticles();
      startWelcomeAnimation();
    }, 800);
  }, bootDuration);

  // Skip boot on click/key
  function skipBoot() {
    if (bootScreen.style.display === 'none') return;
    bootScreen.classList.add('fade-out');
    setTimeout(() => {
      bootScreen.style.display = 'none';
      welcomeScreen.classList.remove('hidden');
      initWelcomeParticles();
      startWelcomeAnimation();
    }, 400);
    document.removeEventListener('click', skipBoot);
    document.removeEventListener('keydown', skipBoot);
  }
  setTimeout(() => {
    document.addEventListener('click', skipBoot);
    document.addEventListener('keydown', skipBoot);
  }, 1000);

  // ── Welcome Particles ──
  function initWelcomeParticles() {
    const canvas = document.getElementById('welcome-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = 80;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '90, 200, 250' : '138, 92, 246',
      });
    }

    function animate() {
      if (welcomeScreen.classList.contains('hidden')) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }
      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(90, 200, 250, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ── Welcome Typewriter Animation ──
  function startWelcomeAnimation() {
    const nameEl = document.getElementById('welcome-name');
    const roleEl = document.getElementById('welcome-role');
    const taglineEl = document.getElementById('welcome-tagline');
    const ctaEl = document.querySelector('.welcome-cta');
    const btn = document.getElementById('welcome-enter-btn');

    const name = "Hi, I'm Utkarsh 👋";
    const role = "Software & Backend Developer";
    const tagline = "Building scalable systems with Java & Spring Boot";

    let i = 0;

    // Typewriter for name
    function typeName() {
      if (i < name.length) {
        nameEl.textContent += name[i];
        i++;
        setTimeout(typeName, 60 + Math.random() * 40);
      } else {
        // Show role
        setTimeout(() => {
          roleEl.textContent = role;
          roleEl.classList.add('visible');
          // Show tagline
          setTimeout(() => {
            taglineEl.textContent = tagline;
            taglineEl.classList.add('visible');
            // Show CTA
            setTimeout(() => {
              ctaEl.classList.add('visible');
            }, 400);
          }, 500);
        }, 400);
      }
    }
    typeName();

    // Enter portfolio
    function enterPortfolio() {
      welcomeScreen.style.transition = 'opacity 0.8s ease';
      welcomeScreen.style.opacity = '0';
      setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        welcomeScreen.style.opacity = '1';
        macbook.classList.remove('hidden');
      }, 800);
    }

    btn.addEventListener('click', enterPortfolio);
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Enter' && !welcomeScreen.classList.contains('hidden')) {
        enterPortfolio();
        document.removeEventListener('keydown', handler);
      }
    });
  }
})();
