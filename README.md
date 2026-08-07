# 🖥️ Utkarsh Yadav — MacBook Portfolio

A fully interactive **macOS desktop simulation** portfolio website. When you open a MacBook, that's exactly what this looks like — complete with boot animation, draggable windows, dock bar, terminal, AI chatbot, and more.

> **Live Demo:** [Sovietgeek/Portfolio](https://github.com/Sovietgeek/Portfolio) *(Enable GitHub Pages to go live!)*

---

## ✨ Features

### 🖥️ macOS Experience
- **Boot Animation** — Realistic macOS boot sequence
- **Welcome Screen** — Typewriter effect with particle animation
- **Desktop** — Full macOS desktop with SVG wallpaper patterns & canvas particles
- **Menu Bar** — Working dropdowns (File, Edit, View, Go, Window, Help)
- **Dock** — Magnification effect on hover, app indicators, draggable items
- **Window Management** — Open, close, minimize (genie effect), maximize, drag, focus/z-index
- **Desktop Icons** — Draggable anywhere on the desktop

### 🤖 AI Assistant — "Mac"
- Answers **everything about Utkarsh** — skills, projects, experience, DSA, interview questions
- **Interview-ready answers** — "Why hire Utkarsh?", strengths, weaknesses, career goals
- **Project deep-dives** — Architecture, database design, API endpoints, OOPs principles
- **Tech stack details** — Java, Spring Boot, MySQL, REST API, Microservices, Git, Testing
- **DSA & CS Fundamentals** — 350+ problems, data structures, algorithms, OS, DBMS, Networks
- **Refuses off-topic questions** — Only answers about Utkarsh, nothing else
- **Gemini API + Keyword Fallback** — Works with or without API key

### 💻 Interactive Terminal
- `whoami`, `about`, `skills`, `projects`, `experience`, `education`, `contact`
- `neofetch` — System-style profile display
- `ls`, `cat`, `pwd`, `uname`, `date`, `echo`
- `clear`, `open`, `exit`
- Easter eggs: `sudo`, `rm`, `hack` 😄

### 🎛️ System Features
- **Notification Center** — Slide-in panel with notifications
- **Control Center** — WiFi, Bluetooth, AirDrop, Display toggles
- **Launchpad** — App grid with search
- **Spotlight Search** — `Ctrl+K` to search apps
- **Context Menu** — Right-click desktop for options
- **Wallpaper Changer** — 5 macOS-style wallpapers
- **App Switcher** — `Alt+Tab` between open windows

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |
| **Effects** | Canvas API (particles), CSS backdrop-filter (blur/glass) |
| **Animations** | CSS keyframes, cubic-bezier transitions |
| **AI** | Google Gemini API + Keyword-based fallback |
| **Design** | SVG wallpaper patterns, macOS-accurate UI |

> Zero dependencies. No React, no frameworks, no build tools — pure vanilla web tech.

---

## 👤 About Utkarsh

| | Detail |
|---|--------|
| **Name** | Utkarsh Yadav |
| **Role** | Software & Backend Developer |
| **College** | Galgotias University, B.Tech CSE (2023-2027) |
| **Internship** | Java Full Stack Developer — Infosys Springboard |
| **Certification** | Oracle Cloud Infrastructure 2025 Certified Generative AI Professional |
| **DSA** | 350+ problems on LeetCode, CodeChef, GeeksforGeeks |
| **Core Stack** | Java, Spring Boot, MySQL, REST API, Git |

---

## 📂 Project Structure

```
Portfolio/
├── index.html          # Main HTML — all screens & components
├── css/
│   └── style.css       # Complete macOS dark theme CSS
├── js/
│   ├── boot.js         # Boot animation + welcome screen
│   ├── main.js         # Core logic — windows, dock, menus, drag, AI panel
│   ├── terminal.js     # Interactive terminal commands
│   └── ai-chat.js      # AI chatbot — Gemini API + keyword fallback
├── data/
│   └── profile.js      # All profile data + AI config + fallback Q&A
└── README.md
```

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/Sovietgeek/Portfolio.git
   cd Portfolio
   ```

2. **Open in browser**
   - Just open `index.html` in any modern browser
   - Or use a local server:
     ```bash
     python -m http.server 8080
     # Open http://localhost:8080
     ```

3. **Enable Gemini AI (optional)**
   - Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Paste it in `data/profile.js` → `PROFILE.ai.geminiApiKey`
   - Without the key, the AI uses keyword-based fallback (still works great!)

4. **Deploy to GitHub Pages**
   - Go to repo **Settings → Pages → Source: main branch**
   - Your portfolio will be live at `https://sovietgeek.github.io/Portfolio/`

---

## 🎯 Key Projects Showcased

### 1. Carbon Footprint Monitoring Web App
**Tech:** Java, Spring Boot, REST API, MySQL, Spring Data JPA, JS, HTML, CSS

Full-stack app tracking carbon emissions with MVC architecture, OOPs design principles, and manual API testing.

### 2. Offline UPI Payment Gateway *(Solo Project)*
**Tech:** Java JDK 17, Spring Boot, Spring Data JPA, MySQL, DSA

Decentralized payment gateway enabling offline P2P transactions through device hops — with hybrid encryption (AES + RSA), optimistic locking (@Version), and BFS-based device-hop algorithm.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built with ❤️ by <a href="https://github.com/Sovietgeek">Utkarsh Yadav</a></b><br>
  <sub>If you liked this portfolio, give it a ⭐!</sub>
</p>
