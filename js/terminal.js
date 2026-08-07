// ============================================
// UTKARSH YADAV — MacBook Portfolio
// Interactive Terminal
// ============================================

function initTerminal(windowEl) {
  const output = windowEl.querySelector('#terminal-output');
  const input = windowEl.querySelector('#terminal-input');

  if (!output || !input) return;

  // Welcome message
  appendToTerminal(output, `
╔═══════════════════════════════════════════╗
║                                           ║
║   Welcome to Utkarsh's Portfolio Terminal  ║
║   Type 'help' for available commands      ║
║                                           ║
╚═══════════════════════════════════════════╝
`, 'info');

  // Input handler
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        appendToTerminal(output, `utkarsh@portfolio ~ % ${cmd}`, 'command');
        processCommand(cmd, output);
        input.value = '';
      }
    }
  });

  // Focus input when clicking terminal body
  output.addEventListener('click', () => input.focus());
  input.focus();
}

function appendToTerminal(output, text, type = 'output') {
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function processCommand(cmd, output) {
  const p = PROFILE;
  const parts = cmd.toLowerCase().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      appendToTerminal(output, `
Available Commands:
  whoami        — About Utkarsh
  about         — Detailed bio
  skills        — List all skills
  projects      — View projects
  experience    — Work experience
  education     — Education details
  contact       — Contact information
  certifications — Certifications & achievements
  neofetch      — System info (portfolio style)
  ls            — List sections
  cat <section>— Read section content
  clear         — Clear terminal
  date          — Current date & time
  echo <text>   — Print text
  open <app>    — Open an app window
  pwd           — Print working directory
  uname         — System info
  exit          — Close terminal
`, 'info');
      break;

    case 'whoami':
      appendToTerminal(output, `${p.personal.name} — ${p.personal.role}`);
      break;

    case 'about':
      appendToTerminal(output, `
Name:     ${p.personal.name}
Role:     ${p.personal.role}
Location: ${p.personal.location}
Email:    ${p.personal.email}
Phone:    ${p.personal.phone}

${p.personal.bio}
`, 'output');
      break;

    case 'skills':
      Object.entries(p.skills).forEach(([category, skills]) => {
        appendToTerminal(output, `${category}:`, 'info');
        appendToTerminal(output, `  ${skills.join(', ')}`);
      });
      break;

    case 'projects':
      p.projects.forEach((proj, i) => {
        appendToTerminal(output, `\n[${i + 1}] ${proj.name} (${proj.type})`, 'info');
        appendToTerminal(output, `    ${proj.description}`);
        appendToTerminal(output, `    Tech: ${proj.tech.join(', ')}`);
      });
      break;

    case 'experience':
    case 'exp':
      p.experience.forEach(exp => {
        appendToTerminal(output, `\n${exp.title}`, 'info');
        appendToTerminal(output, `  ${exp.company} | ${exp.duration} | ${exp.location}`);
        exp.points.forEach(pt => {
          appendToTerminal(output, `  • ${pt}`);
        });
      });
      break;

    case 'education':
    case 'edu':
      p.education.forEach(edu => {
        appendToTerminal(output, `${edu.institution}`, 'info');
        appendToTerminal(output, `  ${edu.degree} | ${edu.duration} | ${edu.score}`);
      });
      break;

    case 'contact':
      appendToTerminal(output, `
📧 Email:    ${p.personal.email}
📱 Phone:    ${p.personal.phone}
💼 LinkedIn: ${p.personal.linkedin}
🐙 GitHub:   ${p.personal.github}
📍 Location: ${p.personal.location}
`, 'output');
      break;

    case 'certifications':
    case 'certs':
      p.certifications.forEach(cert => {
        appendToTerminal(output, `🏆 ${cert.title} — ${cert.issuer}`, 'info');
      });
      p.achievements.forEach(ach => {
        appendToTerminal(output, `💪 ${ach}`, 'info');
      });
      break;

    case 'neofetch':
      appendToTerminal(output, `
        .:'          utkarsh@portfolio
    _ :'_   _._     ─────────────────
 .'  \`  '  \`  '.   OS: Portfolio macOS 14.0
:          _.:'     Host: Utkarsh Yadav
:         _.-       Kernel: Java 17 + Spring Boot
 :      _.-'        Shell: Portfolio Terminal 1.0
  \`._.-'            Resolution: ${window.innerWidth}x${window.innerHeight}
                    UI: MacBook Pro Dark Mode
                    Skills: Java, Spring Boot, REST API, MySQL
                    Projects: 2
                    DSA: 350+ Problems
                    Certification: Oracle AI Professional
                    Uptime: ${Math.floor(performance.now()/1000)}s
`, 'output');
      break;

    case 'ls':
      appendToTerminal(output, 'about/   projects/   skills/   experience/   contact/   education/   certifications/   resume/', 'info');
      break;

    case 'cat':
      if (args.length === 0) {
        appendToTerminal(output, 'Usage: cat <section> (about, projects, skills, experience, contact, education, certifications)', 'error');
      } else {
        const section = args[0];
        if (section === 'about' || section === 'bio') {
          appendToTerminal(output, p.personal.bio);
        } else if (section === 'projects') {
          p.projects.forEach(proj => {
            appendToTerminal(output, `${proj.name}: ${proj.description}`);
          });
        } else if (section === 'skills') {
          Object.values(p.skills).flat().forEach(s => appendToTerminal(output, s));
        } else if (section === 'experience' || section === 'exp') {
          p.experience.forEach(exp => {
            appendToTerminal(output, `${exp.title} at ${exp.company} (${exp.duration})`);
          });
        } else if (section === 'contact') {
          appendToTerminal(output, `${p.personal.email} | ${p.personal.phone}`);
        } else if (section === 'education' || section === 'edu') {
          p.education.forEach(edu => {
            appendToTerminal(output, `${edu.institution} — ${edu.degree} (${edu.score})`);
          });
        } else if (section === 'certifications' || section === 'certs') {
          p.certifications.forEach(c => appendToTerminal(output, `${c.title} — ${c.issuer}`));
        } else {
          appendToTerminal(output, `cat: ${section}: No such section`, 'error');
        }
      }
      break;

    case 'clear':
      output.innerHTML = '';
      break;

    case 'date':
      appendToTerminal(output, new Date().toString());
      break;

    case 'echo':
      appendToTerminal(output, args.join(' '));
      break;

    case 'open':
      if (args.length === 0) {
        appendToTerminal(output, 'Usage: open <app> (about, projects, skills, experience, contact, terminal, ai-chat, finder, resume)', 'error');
      } else {
        const appId = args[0];
        const validApps = ['about', 'projects', 'skills', 'experience', 'contact', 'terminal', 'ai-chat', 'finder', 'resume'];
        if (validApps.includes(appId)) {
          openApp(appId);
          appendToTerminal(output, `Opening ${appId}...`, 'info');
        } else {
          appendToTerminal(output, `open: ${appId}: Application not found`, 'error');
        }
      }
      break;

    case 'pwd':
      appendToTerminal(output, '/Users/utkarsh/portfolio');
      break;

    case 'uname':
      appendToTerminal(output, 'PortfolioOS 14.0 (MacBook Pro) — Powered by Java & Spring Boot');
      break;

    case 'exit':
      closeWindow('terminal');
      break;

    case 'sudo':
      appendToTerminal(output, '🔒 Nice try! This portfolio is read-only. 😄', 'error');
      break;

    case 'rm':
      appendToTerminal(output, '🔒 Permission denied: This portfolio is protected! 😄', 'error');
      break;

    case 'hack':
    case 'hacker':
      appendToTerminal(output, `
  ███╗   ██╗███████╗███████╗██████╗  ██████╗ ██╗  ██╗
  ████╗  ██║██╔════╝██╔════╝██╔══██╗██╔═══██╗╚██╗██╔╝
  ██╔██╗ ██║█████╗  █████╗  ██║  ██║██║   ██║ ╚███╔╝
  ██║╚██╗██║██╔══╝  ██╔══╝  ██║  ██║██║   ██║ ██╔██╗
  ██║ ╚████║███████╗███████╗██████╔╝╚██████╔╝██╔╝ ██╗
  ╚═╝  ╚═══╝╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝

  Just kidding! 😄 Utkarsh is a backend developer, not a hacker!
  But he does know how to secure REST APIs with proper auth! 🔐
`, 'info');
      break;

    default:
      appendToTerminal(output, `command not found: ${command}. Type 'help' for available commands.`, 'error');
  }
}
