// ============================================
// UTKARSH YADAV — MacBook Portfolio
// AI Chatbot — Gemini API + Keyword Fallback
// ============================================

let chatHistory = [];
let isChatLoading = false;

function initAIChat(windowEl) {
  const input = windowEl.querySelector('#chat-input');
  const sendBtn = windowEl.querySelector('#chat-send');

  if (!input || !sendBtn) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });

  input.focus();
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  if (!input || !messages || isChatLoading) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user bubble
  addChatBubble(messages, userMessage, 'user');
  input.value = '';

  // Show typing indicator
  const typingEl = addTypingIndicator(messages);
  isChatLoading = true;

  try {
    let response;

    // Try Gemini API first
    if (PROFILE.ai.geminiApiKey) {
      response = await getGeminiResponse(userMessage);
    }

    // Fallback to keyword matching
    if (!response) {
      // Simulate delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
      response = getKeywordResponse(userMessage);
    }

    // Remove typing indicator
    typingEl.remove();

    // Add AI response
    addChatBubble(messages, response, 'ai');

  } catch (error) {
    console.error('Chat error:', error);
    typingEl.remove();

    // Fallback to keyword response
    const fallbackResponse = getKeywordResponse(userMessage);
    addChatBubble(messages, fallbackResponse, 'ai');
  }

  isChatLoading = false;
}

// ══════════════════════════════════════════
// GEMINI API
// ══════════════════════════════════════════
async function getGeminiResponse(userMessage) {
  const apiKey = PROFILE.ai.geminiApiKey;
  if (!apiKey) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${PROFILE.ai.geminiModel}:generateContent?key=${apiKey}`;

  // Build conversation history
  chatHistory.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  // Keep history manageable (last 20 messages)
  if (chatHistory.length > 20) {
    chatHistory = chatHistory.slice(-10);
  }

  const body = {
    system_instruction: {
      parts: [{ text: PROFILE.ai.systemPrompt }]
    },
    contents: chatHistory,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.8,
      topK: 40
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();

  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    const aiText = data.candidates[0].content.parts[0].text;

    // Add to history
    chatHistory.push({
      role: 'model',
      parts: [{ text: aiText }]
    });

    return aiText;
  }

  return null;
}

// ══════════════════════════════════════════
// KEYWORD FALLBACK RESPONSE
// ══════════════════════════════════════════
function getKeywordResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  // Check each Q&A entry with weighted scoring
  let bestMatch = null;
  let bestScore = 0;

  for (const qa of AI_FALLBACK_QA) {
    let score = 0;
    for (const keyword of qa.keywords) {
      if (msg.includes(keyword)) {
        // Longer keyword matches get higher score (more specific = better)
        score += keyword.length * 2;
        // Exact word match bonus
        if (msg.split(/\s+/).includes(keyword)) {
          score += keyword.length;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = qa;
    }
  }

  // If we have a good match
  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }

  // ══════════════════════════════════════
  // PATTERN-BASED RESPONSES
  // ══════════════════════════════════════

  // Greetings
  if (/^(hi|hello|hey|sup|yo|namaste|hola)/.test(msg)) {
    return "Hey there! 👋 I'm Mac, Utkarsh's portfolio AI assistant. I can tell you all about Utkarsh — his skills, projects, experience, interview answers, DSA journey, and much more! What would you like to know?";
  }

  // Thank you
  if (/^(thanks|thank you|thx|ty)/.test(msg)) {
    return "You're welcome! 😊 Feel free to ask anything else about Utkarsh!";
  }

  // Goodbye
  if (/^(bye|goodbye|see ya|later)/.test(msg)) {
    return "Goodbye! 👋 Thanks for checking out Utkarsh's portfolio. Come back anytime!";
  }

  // How are you
  if (/how are you|how('s| is) it going|what('s| is) up/.test(msg)) {
    return "I'm running great, thanks for asking! 😄 I'm here to help you learn about Utkarsh. What would you like to know?";
  }

  // What can you do
  if (/what can you|what do you|help me|capabilities/.test(msg)) {
    return "I can tell you about Utkarsh's:\n• 🎓 Education & background\n• 💼 Work experience & internship details\n• 🛠️ Skills & technologies (deep-dive available)\n• 📁 Projects (detailed architecture & design)\n• 💡 Interview-style answers about Utkarsh\n• 🧠 DSA proficiency & problem-solving\n• 💻 Coding & tech stack details\n• 📧 Contact info\n• 🏆 Certifications & achievements\n• 🖥️ This portfolio website itself\n\nJust ask anything about Utkarsh!";
  }

  // Name related
  if (/your name|who are you|what are you/.test(msg)) {
    return "I'm Mac — Utkarsh's portfolio AI assistant! 🤖 Named after the Mac you're viewing this on. I know everything about Utkarsh — from his coding skills to his project architecture. Ask me anything!";
  }

  // ══════════════════════════════════════
  // INTERVIEW-STYLE PATTERNS
  // ══════════════════════════════════════

  // Why should we hire / interview questions
  if (/why (should|would) (we|you|anyone) (hire|recruit|employ)/.test(msg) || /why utkarsh/.test(msg)) {
    return "Here's why Utkarsh stands out as a hire:\n\n🔥 **Strong Backend Foundation** — Real project experience with Java + Spring Boot, not just academic knowledge. Built production-style REST APIs with proper MVC architecture.\n\n💼 **Professional Experience** — Infosys internship taught him Agile, Git workflows, SDLC, API testing, and team collaboration.\n\n🧠 **350+ DSA Problems Solved** — Solid algorithmic thinking and efficient code design.\n\n🏆 **Oracle Certified (Gen AI)** — Stays updated with cutting-edge technology.\n\n🏗️ **Clean Architecture** — Every project follows proper OOPs design and separation of concerns.\n\n🔒 **Solo Project Capability** — Built the Offline UPI Payment Gateway independently with hybrid encryption, P2P architecture, and optimistic locking.\n\n🎯 **Available & Growing** — Currently in 3rd year, hungry to learn, ready to contribute from day one.";
  }

  // Strengths
  if (/strength|good at|best quality|what is (he|utkarsh) (good|great|best) at/.test(msg)) {
    return "Utkarsh's biggest strength is building scalable backend systems with clean architecture:\n\n• **Spring Boot MVC Pattern** — Proper separation: Controller → Service → Repository layers\n• **Efficient Algorithm Design** — 350+ DSA problems means he naturally considers time/space complexity\n• **Database Design** — Normalized schemas, optimized queries, proper indexing\n• **Security-First Thinking** — Hybrid encryption in his UPI project\n• **Testing Discipline** — JUnit + Postman means reliable, bug-free code\n\nHe writes code that's not just functional — it's scalable, secure, and maintainable.";
  }

  // Weakness / improvement
  if (/weakness|area of? improvement|what (does|is) (he|utkarsh) lack|improve/.test(msg)) {
    return "Utkarsh is honest about growth areas:\n\n• **Frontend Depth** — His core strength is backend. He can build functional frontends but his passion lies in server-side architecture.\n• **System Design at Scale** — He understands the concepts but is actively building production-scale experience.\n• **Cloud Deployment** — Has Oracle Cloud certification but expanding hands-on AWS/GCP experience.\n\nThe key point: every weakness is something he's actively working on. That growth mindset matters most! 💪";
  }

  // Challenging project
  if (/challeng|difficult|tough|hardest|complex/.test(msg) && /project|work|thing|task/.test(msg)) {
    return "Utkarsh's most challenging project is the **Offline UPI Payment Gateway** — built entirely solo!\n\n🔐 **Hybrid Encryption** — Combined AES + RSA. Preventing data leaks across intermediate bridge nodes was complex.\n\n🔗 **P2P Device Hop Algorithm** — Modified BFS to find shortest path between devices. Each device is a node in a dynamic graph.\n\n⚖️ **Concurrency Bug** — Found a race condition: transactions getting duplicated. Fixed with **optimistic locking** (@Version in Spring Data JPA).\n\n🏗️ **ACID Compliance** — Financial data demands strict consistency across multiple device hops.\n\nThis demonstrates systems thinking, security awareness, and independent debugging!";
  }

  // ══════════════════════════════════════
  // TECH-RELATED PATTERNS (about Utkarsh's stack)
  // ══════════════════════════════════════

  // Questions about how/what Utkarsh uses
  if (/what (does|do) utkarsh (use|know|work with)|utkarsh.*tech|utkarsh.*stack|what.*utkarsh.*skill/.test(msg)) {
    return "Utkarsh's complete tech stack:\n\n☕ **Core Language:** Java — Core Java, OOPs, Collections, Exception Handling, Multithreading, Generics, Lambda Expressions\n\n🔧 **Backend:** Spring Boot, Spring MVC, Spring Data JPA, REST API, Microservices\n\n🗄️ **Database:** MySQL — Schema design, Normalization, Query Optimization, Indexing\n\n🌐 **Web:** JavaScript, HTML5, CSS3\n\n🧠 **CS Fundamentals:** OOP, OS, DBMS, Computer Networks\n\n🛠️ **Tools:** Git, GitHub, IntelliJ IDEA, VS Code, Postman\n\n🧪 **Testing:** JUnit, Manual Testing, API Testing (Postman), SDLC & STLC\n\n📊 **DSA:** 350+ problems — Arrays, Strings, Linked Lists, Trees, Binary Search, DP, Graphs, and more!";
  }

  // What did Utkarsh learn at internship
  if (/what.*(learn|gain|takeaway).*infosys|infosys.*(learn|gain|experience)/.test(msg)) {
    return "Utkarsh's Infosys internship learnings:\n\n📋 **Agile Methodology** — Sprint planning, daily standups, retrospectives\n🔀 **Git Workflows** — Branching, PRs, code reviews, merge conflict resolution\n🧪 **API Testing** — Manually tested all REST endpoints with Postman\n🏗️ **SDLC in Practice** — Full lifecycle: Requirements → Design → Code → Test → Deploy\n🤝 **Team Collaboration** — Sprint syncs, code reviews, troubleshooting together\n✅ **Quality Standards** — Code isn't done until tested, reviewed, and documented";
  }

  // ══════════════════════════════════════
  // OFF-TOPIC DETECTION (smart — allows Utkarsh-related tech questions)
  // ══════════════════════════════════════

  // Portfolio-related keywords — if present, it's on-topic
  const portfolioKeywords = [
    'utkarsh', 'yadav', 'skill', 'project', 'experience', 'java',
    'spring', 'boot', 'intern', 'infosys', 'education', 'college',
    'galgotias', 'contact', 'email', 'phone', 'resume', 'hire',
    'certif', 'oracle', 'dsa', 'leetcode', 'codechef', 'geeksforgeeks',
    'mysql', 'backend', 'developer', 'portfolio', 'work', 'about',
    'carbon', 'footprint', 'upi', 'payment', 'api', 'rest',
    'oop', 'oops', 'algorithm', 'data structure', 'coding', 'problem',
    'git', 'github', 'junit', 'postman', 'testing', 'database',
    'microservice', 'endpoint', 'encryption', 'locking', 'concurrency',
    'architecture', 'design pattern', 'mvc', 'jpa', 'hibernate',
    'interview', 'hire', 'recruit', 'strength', 'weakness',
    'macbook', 'mac', 'terminal', 'dock', 'website', 'this portfolio',
    'sdlc', 'stlc', 'quality', 'agile', 'scrum', 'sprint',
    'cgpa', 'gpa', 'marks', 'grade', 'varanasi', 'noida',
    'competitive', 'contest', 'problem solving', 'solved',
    'computer network', 'dbms', 'operating system', 'os',
    'security', 'secure', 'decentralized', 'peer'
  ];

  const hasPortfolioKeyword = portfolioKeywords.some(kw => msg.includes(kw));

  if (hasPortfolioKeyword) {
    return "I can help with that! Could you be more specific? You can ask about Utkarsh's:\n• 🛠️ Skills & technologies\n• 📁 Projects (with architecture details)\n• 💼 Experience & internship\n• 💡 Interview-style answers\n• 🧠 DSA & coding proficiency\n• 📧 Contact information\n\nJust ask!";
  }

  // Pure off-topic — refuse politely
  const offTopicPatterns = [
    /weather/i, /recipe/i, /movie/i, /song/i, /music/i,
    /game/i, /play/i, /joke/i, /funny/i, /laugh/i,
    /politic/i, /news/i, /sport/i, /cricket/i, /football/i,
    /crypto/i, /bitcoin/i, /stock/i, /invest/i,
    /code (for|me|this)/i, /write (a |me )?(program|function|code|script)/i,
    /homework/i, /assignment/i, /essay/i,
    /another (person|people|developer|company)/i,
    /general knowledge/i, /quiz/i, /trivia/i,
    /tell me a story/i, /poem/i, /sing/i,
    /hack/i, /crack/i, /cheat/i, /pirate/i,
    /buy/i, /sell/i, /shop/i, /order/i,
    /translate/i, /meaning of/i, /definition/i,
    /math/i, /calculate/i, /what is \d/i,
    /date me/i, /girlfriend/i, /boyfriend/i,
    /opinion/i, /recommend (a|some)/i
  ];

  for (const pattern of offTopicPatterns) {
    if (pattern.test(msg)) {
      return AI_REFUSAL_RESPONSE;
    }
  }

  // If nothing matched and it's a decent-length message
  if (msg.length > 5) {
    return AI_REFUSAL_RESPONSE;
  }

  // Very short message
  return "Hmm, I didn't quite get that. 🤔 Try asking something about Utkarsh — like his skills, projects, DSA journey, or interview strengths!";
}

// ══════════════════════════════════════════
// CHAT UI HELPERS
// ══════════════════════════════════════════
function addChatBubble(messagesEl, text, type) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  if (type === 'ai') {
    // Parse markdown-like formatting for AI responses
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/• /g, '• ');
    bubble.innerHTML = html;
  } else {
    bubble.textContent = text;
  }
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addTypingIndicator(messagesEl) {
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return typing;
}
