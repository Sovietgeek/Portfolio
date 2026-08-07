// ============================================
// UTKARSH YADAV — MacBook Portfolio
// Main Logic: All Features
// ============================================

let windowZIndex = 100;
let activeWindow = null;
let openWindows = {};
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let dragWindow = null;
let currentWallpaper = 0;
const wallpaperClasses = ['', 'wallpaper-sonoma', 'wallpaper-ventura', 'wallpaper-sequoia', 'wallpaper-monterey'];
const wallpaperNames = ['Sonoma (Default)', 'Sonoma Dark', 'Ventura', 'Sequoia', 'Monterey'];

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  updateWidgetClock();
  setInterval(updateWidgetClock, 1000);
  setupDockMagnification();
  setupSpotlight();
  setupKeyboardShortcuts();
  setupContextMenu();
  setupNotificationCenter();
  setupControlCenter();
  setupLaunchpadSearch();
  initDesktopParticles();
  setupDraggableIcons();
  setupAIPanel();
  setupDraggableAI();
  setupDockRearrange();
});

// ══════════════════════════════════════════
// CLOCK
// ══════════════════════════════════════════
function updateClock() {
  const now = new Date();
  const options = { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true };
  document.getElementById('menu-clock').textContent = now.toLocaleString('en-US', options);
}

function updateWidgetClock() {
  const now = new Date();
  const timeEl = document.getElementById('widget-time');
  const dateEl = document.getElementById('widget-date');
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ══════════════════════════════════════════
// DESKTOP PARTICLES (Aurora / Floating)
// ══════════════════════════════════════════
function initDesktopParticles() {
  const canvas = document.getElementById('desktop-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const count = 50;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(90, 200, 250, ${p.alpha})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(90, 200, 250, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ══════════════════════════════════════════
// OPEN APP
// ══════════════════════════════════════════
function openApp(appId) {
  if (openWindows[appId]) {
    // If minimized, restore it
    const win = openWindows[appId];
    if (win.dataset.minimized === 'true') {
      win.style.display = 'flex';
      win.dataset.minimized = 'false';
      win.classList.remove('minimizing');
      win.classList.add('restoring');
      setTimeout(() => win.classList.remove('restoring'), 350);
    }
    focusWindow(appId);
    return;
  }

  const container = document.getElementById('windows-container');
  const windowEl = document.createElement('div');
  windowEl.className = 'window focused';
  windowEl.id = `window-${appId}`;
  windowEl.dataset.app = appId;

  const positions = {
    'about':      { top: 60,  left: 80,  width: 520, height: 400 },
    'projects':   { top: 50,  left: 160, width: 580, height: 480 },
    'skills':     { top: 70,  left: 120, width: 540, height: 420 },
    'experience': { top: 80,  left: 140, width: 540, height: 400 },
    'contact':    { top: 90,  left: 100, width: 480, height: 360 },
    'resume':     { top: 60,  left: 130, width: 500, height: 460 },
    'terminal':   { top: 70,  left: 110, width: 560, height: 380 },
    'ai-chat':    { top: 50,  left: 150, width: 420, height: 500 },
    'finder':     { top: 60,  left: 90,  width: 540, height: 400 },
  };

  const pos = positions[appId] || { top: 80, left: 150, width: 520, height: 400 };
  const offset = Object.keys(openWindows).length * 25;
  windowEl.style.top = `${pos.top + offset}px`;
  windowEl.style.left = `${pos.left + offset}px`;
  windowEl.style.width = `${pos.width}px`;
  windowEl.style.height = `${pos.height}px`;
  windowEl.style.zIndex = ++windowZIndex;

  const appConfig = getAppConfig(appId);

  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-buttons">
        <button class="window-btn close" onclick="closeWindow('${appId}')"></button>
        <button class="window-btn minimize" onclick="minimizeWindow('${appId}')"></button>
        <button class="window-btn maximize" onclick="maximizeWindow('${appId}')"></button>
      </div>
      <span class="window-title">${appConfig.title}</span>
    </div>
    <div class="window-body" id="window-body-${appId}">
      ${appConfig.content}
    </div>
  `;

  container.appendChild(windowEl);
  openWindows[appId] = windowEl;

  windowEl.addEventListener('mousedown', () => focusWindow(appId));

  const titlebar = windowEl.querySelector('.window-titlebar');
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('window-btn')) return;
    startDrag(e, windowEl);
  });

  // Dock bounce animation
  const dockItem = document.querySelector(`.dock-item[data-app="${appId}"]`);
  if (dockItem) {
    dockItem.classList.add('active');
    dockItem.classList.add('bouncing');
    setTimeout(() => dockItem.classList.remove('bouncing'), 600);
  }

  focusWindow(appId);
  document.getElementById('menu-app-name').textContent = appConfig.title;

  if (appId === 'terminal') initTerminal(windowEl);
  if (appId === 'ai-chat') initAIChat(windowEl);
}

// ══════════════════════════════════════════
// APP CONFIGURATIONS
// ══════════════════════════════════════════
function getAppConfig(appId) {
  const p = PROFILE;
  const configs = {
    'about': {
      title: 'About Me',
      content: `
        <div class="about-header">
          <div class="about-avatar">${p.personal.avatar}</div>
          <div>
            <div class="about-name">${p.personal.name}</div>
            <div class="about-role">${p.personal.role}</div>
            <div class="about-location">📍 ${p.personal.location}</div>
          </div>
        </div>
        <p class="about-bio">${p.personal.bio}</p>
        <div class="about-links">
          <a href="mailto:${p.personal.email}" class="about-link">📧 Email</a>
          <a href="${p.personal.linkedin}" target="_blank" class="about-link">💼 LinkedIn</a>
          <a href="${p.personal.github}" target="_blank" class="about-link">🐙 GitHub</a>
          <a href="tel:${p.personal.phone}" class="about-link">📱 Phone</a>
        </div>`
    },
    'projects': {
      title: 'Projects',
      content: p.projects.map(proj => `
        <div class="project-card">
          <div class="project-header">
            <span class="project-name">${proj.name}</span>
            <span class="project-type">${proj.type}</span>
          </div>
          <p class="project-desc">${proj.description}</p>
          <div class="project-tech">${proj.tech.map(t => `<span class="project-tech-tag">${t}</span>`).join('')}</div>
          <ul class="project-points">${proj.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
        </div>`).join('')
    },
    'skills': {
      title: 'Skills',
      content: `<div class="skills-grid">${Object.entries(p.skills).map(([category, skills]) => `
        <div class="skill-category"><h3>${category}</h3><div class="skill-tags">${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div></div>`).join('')}</div>`
    },
    'experience': {
      title: 'Experience',
      content: p.experience.map(exp => `
        <div class="exp-card">
          <div class="exp-header">
            <div class="exp-title">${exp.title}</div>
            <div class="exp-company">${exp.company}</div>
            <div class="exp-meta">📍 ${exp.location} &nbsp;|&nbsp; 📅 ${exp.duration}</div>
          </div>
          <ul class="exp-points">${exp.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
        </div>`).join('')
    },
    'contact': {
      title: 'Contact',
      content: `
        <div class="contact-grid">
          <a href="mailto:${p.personal.email}" class="contact-item"><div class="contact-icon email">📧</div><div><div class="contact-label">Email</div><div class="contact-value">${p.personal.email}</div></div></a>
          <a href="tel:${p.personal.phone}" class="contact-item"><div class="contact-icon phone">📱</div><div><div class="contact-label">Phone</div><div class="contact-value">${p.personal.phone}</div></div></a>
          <a href="${p.personal.linkedin}" target="_blank" class="contact-item"><div class="contact-icon linkedin">💼</div><div><div class="contact-label">LinkedIn</div><div class="contact-value">utkarshyadav</div></div></a>
          <a href="${p.personal.github}" target="_blank" class="contact-item"><div class="contact-icon github">🐙</div><div><div class="contact-label">GitHub</div><div class="contact-value">utkarshyadav</div></div></a>
          <div class="contact-item" style="grid-column:1/-1;"><div class="contact-icon location">📍</div><div><div class="contact-label">Location</div><div class="contact-value">${p.personal.location}</div></div></div>
        </div>`
    },
    'resume': {
      title: 'Resume',
      content: `
        <div class="resume-section"><h3>🎓 Education</h3>${p.education.map(edu => `
          <div class="resume-item"><div class="resume-item-title">${edu.institution}</div><div class="resume-item-sub">${edu.degree} | ${edu.location} | ${edu.duration}</div><div class="resume-item-score">${edu.score}</div></div>`).join('')}</div>
        <div class="resume-section"><h3>🏆 Certifications</h3>${p.certifications.map(cert => `
          <div class="resume-item"><div class="resume-item-title">${cert.title}</div><div class="resume-item-sub">Issued by ${cert.issuer}</div></div>`).join('')}</div>
        <div class="resume-section"><h3>💪 Achievements</h3>${p.achievements.map(ach => `
          <div class="resume-item"><div class="resume-item-title">${ach}</div></div>`).join('')}</div>`
    },
    'terminal': {
      title: 'Terminal',
      content: `<div class="terminal-container"><div class="terminal-output" id="terminal-output"></div><div class="terminal-prompt"><span class="terminal-prompt-symbol">utkarsh@portfolio ~ %</span><input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false" autofocus></div></div>`
    },
    'ai-chat': {
      title: 'AI Assistant — Mac',
      content: `<div class="chat-container"><div class="chat-messages" id="chat-messages"><div class="chat-bubble system">👋 Hey! I'm Mac, Utkarsh's portfolio AI assistant. Ask me anything about Utkarsh!</div></div><div class="chat-input-area"><input type="text" class="chat-input" id="chat-input" placeholder="Ask about Utkarsh..." autocomplete="off"><button class="chat-send" id="chat-send" onclick="sendChatMessage()">➤</button></div></div>`
    },
    'finder': {
      title: 'Finder',
      content: `
        <div class="about-header">
          <div class="about-avatar">💻</div>
          <div><div class="about-name">Utkarsh's MacBook</div><div class="about-role">${p.personal.role}</div><div class="about-location">Welcome to my portfolio! Explore using the dock or desktop icons.</div></div>
        </div>
        <div class="skills-grid" style="margin-top:16px;">
          <div class="skill-category"><h3>Quick Links</h3><div class="skill-tags">
            <span class="skill-tag" style="cursor:pointer" onclick="openApp('about')">👤 About Me</span>
            <span class="skill-tag" style="cursor:pointer" onclick="openApp('projects')">📁 Projects</span>
            <span class="skill-tag" style="cursor:pointer" onclick="openApp('skills')">⭐ Skills</span>
            <span class="skill-tag" style="cursor:pointer" onclick="openApp('experience')">💼 Experience</span>
            <span class="skill-tag" style="cursor:pointer" onclick="openApp('contact')">📧 Contact</span>
            <span class="skill-tag" style="cursor:pointer" onclick="openApp('terminal')">💻 Terminal</span>
            <span class="skill-tag" style="cursor:pointer" onclick="openApp('ai-chat')">🤖 AI Chat</span>
          </div></div>
          <div class="skill-category"><h3>Quick Stats</h3><div class="skill-tags">
            <span class="skill-tag">350+ DSA Problems</span>
            <span class="skill-tag">Oracle AI Certified</span>
            <span class="skill-tag">Infosys Intern</span>
            <span class="skill-tag">2 Projects</span>
          </div></div>
        </div>`
    }
  };
  return configs[appId] || { title: appId, content: '<p>Coming soon!</p>' };
}

// ══════════════════════════════════════════
// WINDOW MANAGEMENT
// ══════════════════════════════════════════
function focusWindow(appId) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  const win = openWindows[appId];
  if (win) {
    win.classList.add('focused');
    win.style.zIndex = ++windowZIndex;
    activeWindow = appId;
    document.getElementById('menu-app-name').textContent = getAppConfig(appId).title;
  }
}

function closeWindow(appId) {
  const win = openWindows[appId];
  if (!win) return;
  win.classList.add('closing');
  setTimeout(() => {
    win.remove();
    delete openWindows[appId];
    const dockItem = document.querySelector(`.dock-item[data-app="${appId}"]`);
    if (dockItem) dockItem.classList.remove('active');
    const remaining = Object.keys(openWindows);
    if (remaining.length > 0) focusWindow(remaining[remaining.length - 1]);
    else { document.getElementById('menu-app-name').textContent = 'Finder'; activeWindow = null; }
  }, 250);
}

function minimizeWindow(appId) {
  const win = openWindows[appId];
  if (!win) return;
  win.classList.add('minimizing');
  setTimeout(() => {
    win.style.display = 'none';
    win.classList.remove('minimizing');
    win.dataset.minimized = 'true';
    const remaining = Object.keys(openWindows).filter(id => openWindows[id].dataset.minimized !== 'true');
    if (remaining.length > 0) focusWindow(remaining[remaining.length - 1]);
    else document.getElementById('menu-app-name').textContent = 'Finder';
  }, 450);
}

function maximizeWindow(appId) {
  const win = openWindows[appId];
  if (!win) return;
  if (win.dataset.maximized === 'true') {
    win.style.top = win.dataset.prevTop;
    win.style.left = win.dataset.prevLeft;
    win.style.width = win.dataset.prevWidth;
    win.style.height = win.dataset.prevHeight;
    win.dataset.maximized = 'false';
  } else {
    win.dataset.prevTop = win.style.top;
    win.dataset.prevLeft = win.style.left;
    win.dataset.prevWidth = win.style.width;
    win.dataset.prevHeight = win.style.height;
    win.style.top = '28px'; win.style.left = '0';
    win.style.width = '100%';
    win.style.height = `calc(100% - 28px - 84px)`;
    win.dataset.maximized = 'true';
  }
  win.style.transition = 'all 0.3s cubic-bezier(0.16,1,0.3,1)';
  setTimeout(() => { win.style.transition = ''; }, 300);
}

// ══════════════════════════════════════════
// DRAGGING
// ══════════════════════════════════════════
function startDrag(e, win) {
  if (win.dataset.maximized === 'true') return;
  isDragging = true; dragWindow = win;
  dragOffset.x = e.clientX - win.offsetLeft;
  dragOffset.y = e.clientY - win.offsetTop;
  win.style.transition = 'none';
}
document.addEventListener('mousemove', (e) => {
  if (!isDragging || !dragWindow) return;
  e.preventDefault();
  dragWindow.style.left = `${e.clientX - dragOffset.x}px`;
  dragWindow.style.top = `${e.clientY - dragOffset.y}px`;
});
document.addEventListener('mouseup', () => { isDragging = false; dragWindow = null; });

// ══════════════════════════════════════════
// DOCK MAGNIFICATION
// ══════════════════════════════════════════
function setupDockMagnification() {
  const dock = document.getElementById('dock');
  const items = dock.querySelectorAll('.dock-item');
  dock.addEventListener('mousemove', (e) => {
    items.forEach(item => {
      const icon = item.querySelector('.dock-icon');
      const rect = item.getBoundingClientRect();
      const dist = Math.abs(e.clientX - (rect.left + rect.width / 2));
      const maxDist = 120;
      if (dist < maxDist) {
        const scale = 1 + (1 - dist / maxDist) * 0.5;
        const marginAdd = (scale - 1) * 10;
        icon.style.transform = `scale(${scale})`;
        icon.style.marginTop = `-${marginAdd}px`;
        icon.style.marginBottom = `${marginAdd}px`;
      } else { icon.style.transform = 'scale(1)'; icon.style.marginTop = '0'; icon.style.marginBottom = '0'; }
    });
  });
  dock.addEventListener('mouseleave', () => {
    items.forEach(item => {
      const icon = item.querySelector('.dock-icon');
      icon.style.transform = 'scale(1)'; icon.style.marginTop = '0'; icon.style.marginBottom = '0';
    });
  });
}

// ══════════════════════════════════════════
// SPOTLIGHT SEARCH
// ══════════════════════════════════════════
function setupSpotlight() {
  const overlay = document.getElementById('spotlight-overlay');
  const input = document.getElementById('spotlight-input');
  const results = document.getElementById('spotlight-results');
  document.getElementById('spotlight-btn').addEventListener('click', () => toggleSpotlight(true));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) toggleSpotlight(false); });
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    results.innerHTML = '';
    if (!query) return;
    const searchItems = [
      { id:'about', label:'About Me', icon:'👤' },{ id:'projects', label:'Projects', icon:'📁' },
      { id:'skills', label:'Skills', icon:'⭐' },{ id:'experience', label:'Experience', icon:'💼' },
      { id:'contact', label:'Contact', icon:'📧' },{ id:'resume', label:'Resume', icon:'📄' },
      { id:'terminal', label:'Terminal', icon:'💻' },{ id:'ai-chat', label:'AI Assistant — Mac', icon:'🤖' },
      { id:'finder', label:'Finder', icon:'🗂️' },
    ];
    searchItems.filter(i => i.label.toLowerCase().includes(query)).forEach(item => {
      const el = document.createElement('div'); el.className = 'spotlight-item';
      el.innerHTML = `<div class="spotlight-item-icon">${item.icon}</div><div class="spotlight-item-text">${item.label}</div>`;
      el.addEventListener('click', () => { openApp(item.id); toggleSpotlight(false); });
      results.appendChild(el);
    });
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSpotlight(false);
    if (e.key === 'Enter') { const first = results.querySelector('.spotlight-item'); if (first) first.click(); }
  });
}
function toggleSpotlight(show) {
  const overlay = document.getElementById('spotlight-overlay');
  const input = document.getElementById('spotlight-input');
  if (show) { overlay.classList.remove('hidden'); input.value = ''; document.getElementById('spotlight-results').innerHTML = ''; setTimeout(() => input.focus(), 50); }
  else overlay.classList.add('hidden');
}

// ══════════════════════════════════════════
// RIGHT-CLICK CONTEXT MENU
// ══════════════════════════════════════════
function setupContextMenu() {
  const menu = document.getElementById('context-menu');
  const desktop = document.getElementById('desktop');

  desktop.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // Only show on desktop itself, not on windows
    if (e.target.closest('.window') || e.target.closest('#dock') || e.target.closest('#menu-bar')) return;
    menu.classList.remove('hidden');
    const x = Math.min(e.offsetX, desktop.offsetWidth - 220);
    const y = Math.min(e.offsetY, desktop.offsetHeight - 280);
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#context-menu')) menu.classList.add('hidden');
  });
}

// ══════════════════════════════════════════
// NOTIFICATION CENTER
// ══════════════════════════════════════════
function setupNotificationCenter() {
  const btn = document.getElementById('notification-center-btn');
  const panel = document.getElementById('notification-center');
  btn.addEventListener('click', () => {
    if (panel.classList.contains('hidden')) {
      // Close others
      document.getElementById('control-center').classList.add('hidden');
      panel.classList.remove('hidden', 'hiding');
    } else {
      panel.classList.add('hiding');
      setTimeout(() => { panel.classList.add('hidden'); panel.classList.remove('hiding'); }, 250);
    }
  });
}
function clearNotifications() {
  document.querySelector('.notif-list').innerHTML = '<div style="text-align:center;padding:20px;color:var(--mac-text-secondary);font-size:13px;">No notifications</div>';
}

// ══════════════════════════════════════════
// CONTROL CENTER
// ══════════════════════════════════════════
function setupControlCenter() {
  const btn = document.getElementById('control-center-btn');
  const panel = document.getElementById('control-center');
  btn.addEventListener('click', () => {
    if (panel.classList.contains('hidden')) {
      document.getElementById('notification-center').classList.add('hidden');
      panel.classList.remove('hidden');
    } else panel.classList.add('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#control-center') && !e.target.closest('#control-center-btn'))
      panel.classList.add('hidden');
  });
}
function toggleCC(el) { el.classList.toggle('cc-active'); }

// ══════════════════════════════════════════
// WALLPAPER CHANGE
// ══════════════════════════════════════════
function changeWallpaper() {
  const desktop = document.getElementById('desktop');
  desktop.classList.remove(...wallpaperClasses);
  currentWallpaper = (currentWallpaper + 1) % wallpaperClasses.length;
  if (wallpaperClasses[currentWallpaper]) desktop.classList.add(wallpaperClasses[currentWallpaper]);
  document.getElementById('context-menu').classList.add('hidden');
  document.getElementById('control-center').classList.add('hidden');
}

// ══════════════════════════════════════════
// LAUNCHPAD
// ══════════════════════════════════════════
function openLaunchpad() {
  const lp = document.getElementById('launchpad');
  lp.classList.remove('hidden', 'hiding');
  document.getElementById('context-menu').classList.add('hidden');
  document.getElementById('control-center').classList.add('hidden');
}
function closeLaunchpad() {
  const lp = document.getElementById('launchpad');
  lp.classList.add('hiding');
  setTimeout(() => { lp.classList.add('hidden'); lp.classList.remove('hiding'); }, 250);
}
function setupLaunchpadSearch() {
  const input = document.getElementById('launchpad-search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll('.launchpad-item').forEach(item => {
      const name = item.querySelector('span').textContent.toLowerCase();
      item.style.display = name.includes(query) ? '' : 'none';
    });
  });
}
// Close launchpad on background click
document.addEventListener('click', (e) => {
  const lp = document.getElementById('launchpad');
  if (!lp.classList.contains('hidden') && e.target === lp) closeLaunchpad();
});

// ══════════════════════════════════════════
// APP SWITCHER (Alt+Tab)
// ══════════════════════════════════════════
let switcherVisible = false;
let switcherIndex = 0;

function showAppSwitcher() {
  const openApps = Object.keys(openWindows);
  if (openApps.length === 0) return;

  const switcher = document.getElementById('app-switcher');
  const row = document.getElementById('switcher-row');
  row.innerHTML = '';

  openApps.forEach(appId => {
    const config = getAppConfig(appId);
    const isMinimized = openWindows[appId].dataset.minimized === 'true';
    const item = document.createElement('div');
    item.className = `switcher-item${appId === activeWindow ? ' active' : ''}`;
    item.innerHTML = `<div class="switcher-icon">📄</div><span>${config.title}</span>`;
    item.addEventListener('click', () => {
      if (isMinimized) {
        openWindows[appId].style.display = 'flex';
        openWindows[appId].dataset.minimized = 'false';
        openWindows[appId].classList.add('restoring');
        setTimeout(() => openWindows[appId].classList.remove('restoring'), 350);
      }
      focusWindow(appId);
      hideAppSwitcher();
    });
    row.appendChild(item);
  });

  switcher.classList.remove('hidden');
  switcherVisible = true;
}

function hideAppSwitcher() {
  document.getElementById('app-switcher').classList.add('hidden');
  switcherVisible = false;
}

// ══════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════
function setupKeyboardShortcuts() {
  let tabPressed = false;
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K = Spotlight
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const overlay = document.getElementById('spotlight-overlay');
      toggleSpotlight(overlay.classList.contains('hidden'));
    }
    // Escape
    if (e.key === 'Escape') {
      const overlay = document.getElementById('spotlight-overlay');
      if (!overlay.classList.contains('hidden')) { toggleSpotlight(false); return; }
      const lp = document.getElementById('launchpad');
      if (!lp.classList.contains('hidden')) { closeLaunchpad(); return; }
      const cc = document.getElementById('control-center');
      if (!cc.classList.contains('hidden')) { cc.classList.add('hidden'); return; }
      const nc = document.getElementById('notification-center');
      if (!nc.classList.contains('hidden')) { nc.classList.add('hidden'); return; }
      if (activeWindow) closeWindow(activeWindow);
    }
    // Alt+Tab = App Switcher
    if (e.altKey && e.key === 'Tab') {
      e.preventDefault();
      showAppSwitcher();
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt' && switcherVisible) hideAppSwitcher();
  });
}

// ══════════════════════════════════════════
// CLICK DESKTOP TO DEFOCUS
// ══════════════════════════════════════════
document.addEventListener('click', (e) => {
  const desktop = document.getElementById('desktop');
  if (e.target === desktop || e.target === document.getElementById('desktop-particles') || e.target === document.getElementById('wallpaper-pattern')) {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
    document.getElementById('menu-app-name').textContent = 'Finder';
    activeWindow = null;
    document.getElementById('context-menu').classList.add('hidden');
  }
  // Close menu dropdowns when clicking elsewhere
  document.querySelectorAll('.menu-item.has-dropdown').forEach(m => m.classList.remove('open'));
});

// ══════════════════════════════════════════
// MENU BAR DROPDOWNS (click to toggle)
// ══════════════════════════════════════════
function setupMenuBarDropdowns() {
  document.querySelectorAll('.menu-item.has-dropdown').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = item.classList.contains('open');
      // Close all dropdowns first
      document.querySelectorAll('.menu-item.has-dropdown').forEach(m => m.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
    // Keep open on hover within
    item.addEventListener('mouseenter', () => {
      // If any dropdown is already open, switch to this one
      if (document.querySelector('.menu-item.has-dropdown.open')) {
        document.querySelectorAll('.menu-item.has-dropdown').forEach(m => m.classList.remove('open'));
        item.classList.add('open');
      }
    });
  });
}
// Call it
setTimeout(setupMenuBarDropdowns, 100);

// ══════════════════════════════════════════
// DRAGGABLE DESKTOP ICONS (with boundary)
// Only converts to absolute on ACTUAL drag, not click
// ══════════════════════════════════════════
function setupDraggableIcons() {
  const icons = document.querySelectorAll('.desktop-icon');
  const desktop = document.getElementById('desktop');

  icons.forEach(icon => {
    let isDraggingIcon = false;
    let dragStarted = false; // true only after mouse actually moves
    let iconOffsetX = 0, iconOffsetY = 0;
    let startX = 0, startY = 0;
    const DRAG_THRESHOLD = 5; // pixels before we consider it a drag

    icon.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDraggingIcon = true;
      dragStarted = false;
      startX = e.clientX;
      startY = e.clientY;

      // Capture offset for later if drag starts
      const iconRect = icon.getBoundingClientRect();
      iconOffsetX = e.clientX - iconRect.left;
      iconOffsetY = e.clientY - iconRect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDraggingIcon) return;

      // Check if we've moved enough to start a drag
      if (!dragStarted) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return; // Not a drag yet

        // NOW it's a real drag — reparent icon into #desktop directly
        // so that left/top are relative to desktop (not #desktop-icons)
        dragStarted = true;
        const iconRect = icon.getBoundingClientRect();
        const dRect = desktop.getBoundingClientRect();
        const currentLeft = iconRect.left - dRect.left;
        const currentTop = iconRect.top - dRect.top;

        iconOffsetX = e.clientX - iconRect.left;
        iconOffsetY = e.clientY - iconRect.top;

        // Move icon from #desktop-icons into #desktop
        desktop.appendChild(icon);

        icon.style.position = 'absolute';
        icon.style.left = currentLeft + 'px';
        icon.style.top = currentTop + 'px';
        icon.style.right = 'auto';
        icon.style.margin = '0';
        icon.classList.add('dragging');
      }

      // Move the icon
      const dRect = desktop.getBoundingClientRect();
      const newX = e.clientX - dRect.left - iconOffsetX;
      const newY = e.clientY - dRect.top - iconOffsetY;

      const maxX = dRect.width - 90;
      const maxY = dRect.height - 110;
      icon.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
      icon.style.top = `${Math.max(30, Math.min(newY, maxY))}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDraggingIcon) {
        isDraggingIcon = false;
        icon.classList.remove('dragging');
        // dragStarted stays as-is — if false, click happened (position unchanged)
      }
    });
  });
}

// ══════════════════════════════════════════
// DRAGGABLE AI SEARCH BAR + PANEL
// ══════════════════════════════════════════
let aiDragType = null; // 'searchbar' or 'panel'
let aiDragOffset = { x: 0, y: 0 };

function setupDraggableAI() {
  const searchBar = document.getElementById('ai-search-bar');
  const panel = document.getElementById('ai-panel');
  const desktop = document.getElementById('desktop');

  // Search bar drag
  const searchHandle = searchBar.querySelector('.ai-search-handle');
  searchHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    aiDragType = 'searchbar';
    const rect = searchBar.getBoundingClientRect();
    const dRect = desktop.getBoundingClientRect();
    aiDragOffset.x = e.clientX - rect.left + dRect.left - searchBar.offsetLeft;
    aiDragOffset.y = e.clientY - rect.top + dRect.top - searchBar.offsetTop;
    // Switch to absolute positioning for free drag
    searchBar.style.transform = 'none';
    searchBar.style.left = rect.left - dRect.left + 'px';
    searchBar.style.top = rect.top - dRect.top + 'px';
  });

  // Panel drag
  const panelHandle = panel.querySelector('.ai-panel-drag-handle');
  panelHandle.addEventListener('mousedown', (e) => {
    if (e.target.closest('.ai-panel-close')) return;
    e.preventDefault();
    aiDragType = 'panel';
    const rect = panel.getBoundingClientRect();
    const dRect = desktop.getBoundingClientRect();
    // Switch to absolute positioning
    panel.style.transform = 'none';
    panel.style.left = rect.left - dRect.left + 'px';
    panel.style.top = rect.top - dRect.top + 'px';
    aiDragOffset.x = e.clientX - rect.left;
    aiDragOffset.y = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!aiDragType) return;
    e.preventDefault();
    const dRect = desktop.getBoundingClientRect();
    const el = aiDragType === 'searchbar' ? searchBar : panel;
    const newX = e.clientX - dRect.left - aiDragOffset.x;
    const newY = e.clientY - dRect.top - aiDragOffset.y;
    // Boundary limits
    el.style.left = `${Math.max(0, Math.min(newX, dRect.width - el.offsetWidth))}px`;
    el.style.top = `${Math.max(28, Math.min(newY, dRect.height - el.offsetHeight))}px`;
  });

  document.addEventListener('mouseup', () => { aiDragType = null; });
}

// ══════════════════════════════════════════
// DOCK REARRANGE (drag items to reorder)
// ══════════════════════════════════════════
function setupDockRearrange() {
  const dock = document.getElementById('dock');
  let dragItem = null;
  let dragOverItem = null;

  dock.querySelectorAll('.dock-item').forEach(item => {
    item.setAttribute('draggable', 'true');

    item.addEventListener('dragstart', (e) => {
      dragItem = item;
      item.style.opacity = '0.5';
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.style.opacity = '1';
      dragItem = null;
      dock.querySelectorAll('.dock-item').forEach(i => i.style.transform = '');
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (item === dragItem) return;
      dragOverItem = item;
      const rect = item.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      if (e.clientX < midX) {
        dock.insertBefore(dragItem, item);
      } else {
        dock.insertBefore(dragItem, item.nextSibling);
      }
    });
  });
}

// ══════════════════════════════════════════
// FLOATING AI PANEL (updated)
// ══════════════════════════════════════════
let aiPanelOpen = false;
let aiPanelHistory = [];

function toggleAIPanel() {
  const panel = document.getElementById('ai-panel');
  if (aiPanelOpen) {
    panel.classList.add('hidden');
    aiPanelOpen = false;
  } else {
    panel.classList.remove('hidden');
    aiPanelOpen = true;
    const input = document.getElementById('ai-panel-input');
    if (input) setTimeout(() => input.focus(), 100);
  }
}

function setupAIPanel() {
  const input = document.getElementById('ai-panel-input');
  const sendBtn = document.getElementById('ai-panel-send');
  if (!input || !sendBtn) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAIPanelMessage();
    }
  });
}

async function sendAIPanelMessage() {
  const input = document.getElementById('ai-panel-input');
  const messages = document.getElementById('ai-panel-messages');
  if (!input || !messages) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = userMessage;
  messages.appendChild(userBubble);
  input.value = '';

  const typingEl = document.createElement('div');
  typingEl.className = 'chat-typing';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  messages.appendChild(typingEl);
  messages.scrollTop = messages.scrollHeight;

  try {
    let response;
    if (PROFILE.ai.geminiApiKey) {
      response = await getGeminiResponseForPanel(userMessage);
    }
    if (!response) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
      response = getKeywordResponse(userMessage);
    }
    typingEl.remove();
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    let html = response.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    aiBubble.innerHTML = html;
    messages.appendChild(aiBubble);
  } catch (err) {
    typingEl.remove();
    const fallback = getKeywordResponse(userMessage);
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    let html = fallback.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    aiBubble.innerHTML = html;
    messages.appendChild(aiBubble);
  }
  messages.scrollTop = messages.scrollHeight;
}

async function getGeminiResponseForPanel(userMessage) {
  const apiKey = PROFILE.ai.geminiApiKey;
  if (!apiKey) return null;

  aiPanelHistory.push({ role: 'user', parts: [{ text: userMessage }] });
  if (aiPanelHistory.length > 20) aiPanelHistory = aiPanelHistory.slice(-10);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${PROFILE.ai.geminiModel}:generateContent?key=${apiKey}`;
  const body = {
    system_instruction: { parts: [{ text: PROFILE.ai.systemPrompt }] },
    contents: aiPanelHistory,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024, topP: 0.8, topK: 40 }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  if (data.candidates?.[0]?.content) {
    const aiText = data.candidates[0].content.parts[0].text;
    aiPanelHistory.push({ role: 'model', parts: [{ text: aiText }] });
    return aiText;
  }
  return null;
}
