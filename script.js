/**
 * Portfolio Interactive Scripts
 * Handles:
 * 1. Night Mode / Dark Mode Theme Toggle with CSS Media Query Detection & LocalStorage
 * 2. Synchronized Sidebar, Mobile Bar, and Hero Theme Switchers
 * 3. Left Vertical Sidebar Mobile Drawer Toggle & Keyboard Accessibility
 * 4. Active Navigation Link Highlighting (8 Sections) via IntersectionObserver
 * 5. Interactive Retro Chat Terminal & Prompt Chips
 * 6. Dynamic Year in Footer & Contact Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. NIGHT MODE THEME ENGINE & CSS MEDIA QUERY DETECTION
  // ========================================================
  const headerThemeBtn = document.getElementById('theme-toggle');
  const heroThemeBtn = document.getElementById('hero-theme-toggle');
  const sidebarThemeBtn = document.getElementById('sidebar-theme-toggle');
  const themeDetectedLabel = document.getElementById('theme-detected-label');
  const rootElement = document.documentElement;
  const STORAGE_KEY = 'kavana-portfolio-theme';

  // CSS Media Query to detect user's default browser theme
  const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

  /**
   * Determine the effective theme
   * Returns { theme: 'dark'|'light', isManual: boolean }
   */
  const resolveCurrentTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return { theme: saved, isManual: true };
    }
    // Default to the browser's CSS media query detection
    return { 
      theme: mediaQueryDark.matches ? 'dark' : 'light', 
      isManual: false 
    };
  };

  /**
   * Apply theme and update button states, ARIA labels, and HUD badge
   */
  const applyTheme = (theme, isManual) => {
    rootElement.setAttribute('data-theme', theme);

    if (isManual) {
      localStorage.setItem(STORAGE_KEY, theme);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    const isDark = theme === 'dark';
    const toggleLabel = isDark ? 'Switch to Light Mode' : 'Switch to Night Mode';

    // Update Mobile Bar Theme Button
    if (headerThemeBtn) {
      headerThemeBtn.setAttribute('aria-label', toggleLabel);
      headerThemeBtn.setAttribute('title', toggleLabel);
    }

    // Update Hero Creative Tech Theme Switcher
    if (heroThemeBtn) {
      heroThemeBtn.setAttribute('aria-label', toggleLabel);
      heroThemeBtn.setAttribute('title', toggleLabel);
    }

    // Update Vertical Sidebar Theme Button
    if (sidebarThemeBtn) {
      sidebarThemeBtn.setAttribute('aria-label', toggleLabel);
      sidebarThemeBtn.setAttribute('title', toggleLabel);
    }

    // Update Theme Dock Indicator Label
    if (themeDetectedLabel) {
      if (isManual) {
        themeDetectedLabel.textContent = `Manual (${isDark ? 'Dark' : 'Light'})`;
      } else {
        themeDetectedLabel.textContent = `Auto (${isDark ? 'Dark' : 'Light'} Default)`;
      }
    }
  };

  // Toggle Handler
  const toggleTheme = () => {
    const current = rootElement.getAttribute('data-theme') || (mediaQueryDark.matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  };

  // Initialize on load
  const initial = resolveCurrentTheme();
  applyTheme(initial.theme, initial.isManual);

  // Attach event listeners to all theme buttons
  if (headerThemeBtn) {
    headerThemeBtn.addEventListener('click', toggleTheme);
  }
  if (heroThemeBtn) {
    heroThemeBtn.addEventListener('click', toggleTheme);
  }
  if (sidebarThemeBtn) {
    sidebarThemeBtn.addEventListener('click', toggleTheme);
  }

  // React to live changes in system browser theme when in auto-detected mode
  mediaQueryDark.addEventListener('change', (e) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // ========================================================
  // 2. VERTICAL SIDEBAR DRAWER TOGGLE & ACCESSIBILITY
  // ========================================================
  const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const verticalSidebar = document.getElementById('vertical-sidebar');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  const openSidebar = () => {
    if (verticalSidebar) verticalSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
    if (mobileSidebarToggle) mobileSidebarToggle.setAttribute('aria-expanded', 'true');
    if (window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeSidebar = () => {
    if (verticalSidebar) verticalSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
    if (mobileSidebarToggle) mobileSidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', () => {
      const isOpen = verticalSidebar && verticalSidebar.classList.contains('open');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && verticalSidebar && verticalSidebar.classList.contains('open')) {
      closeSidebar();
      if (mobileSidebarToggle) mobileSidebarToggle.focus();
    }
  });

  // Close drawer when clicking any sidebar link on mobile/tablet
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });

  // ========================================================
  // 3. ACTIVE NAVIGATION LINK HIGHLIGHTING (8 SECTIONS)
  // ========================================================
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0 && sidebarLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          sidebarLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ========================================================
  // ========================================================
  // 4. INTERACTIVE SKILLS MATRIX: CATEGORY FILTER & XP BARS
  // ========================================================
  const filterBtns = document.querySelectorAll('.pixel-filter-btn');
  const skillCards = document.querySelectorAll('.pixel-skill-card');
  const skillsSection = document.getElementById('skills');
  const gaugeFills = document.querySelectorAll('.pixel-gauge-fill');
  const gaugePercents = document.querySelectorAll('.xp-meta-percent');

  /**
   * Optional subtle retro 8-bit blip sound synthesized via Web Audio API
   * Runs client-side without external media assets
   */
  const playRetroClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (err) {
      // Audio context blocked or unsupported; silent fallback
    }
  };

  // Filter Tab Interactions
  if (filterBtns.length > 0 && skillCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        playRetroClickSound();

        // Update active tab states
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterVal = btn.getAttribute('data-filter');

        // Filter cards smoothly
        skillCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (filterVal === 'all' || cardCat === filterVal) {
            card.classList.remove('is-hidden');
            // Trigger quick retro step pop
            card.style.animation = 'none';
            card.offsetHeight; // force reflow
            card.style.animation = 'pixel-card-pop 0.25s steps(2)';
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // Animate XP Gauge Progress Bars & Counter Numbers when Skills section scrolls into view
  if (skillsSection && gaugeFills.length > 0) {
    let hasAnimated = false;

    const animateSkillGauges = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      // Animate progress bar widths
      gaugeFills.forEach((fill) => {
        fill.classList.add('is-animated');
      });

      // Animate numeric percentages from 0 to target
      gaugePercents.forEach((numSpan) => {
        const target = parseInt(numSpan.getAttribute('data-target'), 10) || 90;
        let current = 0;
        const duration = 1200;
        const stepTime = Math.max(15, Math.floor(duration / target));

        const counterTimer = setInterval(() => {
          current += 2;
          if (current >= target) {
            current = target;
            clearInterval(counterTimer);
          }
          numSpan.textContent = `${current}%`;
        }, stepTime);
      });
    };

    if ('IntersectionObserver' in window) {
      const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillGauges();
            skillsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      skillsObserver.observe(skillsSection);
    } else {
      // Fallback for older browsers
      animateSkillGauges();
    }
  }

  // ========================================================
  // ========================================================
  // 5. INTERACTIVE AI CHAT SECTION (PORTFOLIO TWIN EMULATOR)
  // Simulates real-time messaging with AI Kavana persona,
  // featuring typing indicator, timestamps, autoscroll,
  // sound feedback, and complete OpenAI API integration blueprint.
  // ========================================================
  const chatInputForm = document.getElementById('chat-input-form');
  const chatUserInput = document.getElementById('chat-user-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatResetBtn = document.getElementById('chat-reset-btn');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const typingIndicator = document.getElementById('chat-typing-indicator');

  // Format current time into human-friendly 12-hour format (e.g., 3:45 PM)
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Set initial timestamp on the welcome message
  const initialTimestampSpan = document.querySelector('[data-initial-time="true"]');
  if (initialTimestampSpan) {
    initialTimestampSpan.textContent = getFormattedTime();
  }

  /*
   * =========================================================================================
   * 🤖 API INTEGRATION BLUEPRINT: OPENAI / LLM BACKEND HOOK
   * =========================================================================================
   * To connect this chat interface to a live LLM API (such as OpenAI GPT-4o, Google Gemini, or Claude):
   *
   * [1] PRODUCTION BEST PRACTICE (RECOMMENDED):
   *     Do NOT expose your secret API keys (e.g., `sk-...`) in client-side front-end code.
   *     Instead, set up a serverless function or backend proxy route:
   *     e.g., POST /api/chat -> reads process.env.OPENAI_API_KEY -> calls OpenAI API -> returns answer.
   *
   * [2] SAMPLE OPENAI DIRECT/PROXY FETCH FUNCTION:
   *
   * async function callOpenAIChatAPI(userMessage, conversationHistory) {
   *   // Point to your secure proxy or direct OpenAI endpoint:
   *   const ENDPOINT = '/api/chat'; // Or 'https://api.openai.com/v1/chat/completions'
   *
   *   const systemPersona = `You are AI Kavana, a smart, welcoming virtual digital twin
   *   of Kavana, a software engineer.
   *   Key background:
   *   - Currently studying Bachelor of Engineering (B.E.) at AIT Chikkamagaluru (graduating 2029).
   *   - Completed 12th (PUC) at SRS PU College Chitradurga (2025).
   *   - Completed 10th (SSLC) at SDRHS Guddadaneralakere (2023).
   *   - Core Skills: Python (96%), Java (90%), Machine Learning (88%), AI (89%),
   *     Data Structures (95%), SQL (92%), HTML & CSS (97%), Git & GitHub (94%).
   *   - Tone: Friendly, articulate, technical, and concise.`;
   *
   *   try {
   *     const response = await fetch(ENDPOINT, {
   *       method: 'POST',
   *       headers: {
   *         'Content-Type': 'application/json',
   *         // 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // (Keep on server side)
   *       },
   *       body: JSON.stringify({
   *         model: 'gpt-4o-mini',
   *         messages: [
   *           { role: 'system', content: systemPersona },
   *           ...conversationHistory,
   *           { role: 'user', content: userMessage }
   *         ],
   *         temperature: 0.7,
   *         max_tokens: 280
   *       })
   *     });
   *
   *     if (!response.ok) throw new Error(`HTTP error ${response.status}`);
   *     const data = await response.json();
   *     return data.choices[0].message.content;
   *   } catch (error) {
   *     console.error('OpenAI API Error:', error);
   *     return "I'm having a momentary hiccup reaching my cloud brain. Let me revert to local emulation!";
   *   }
   * }
   * =========================================================================================
   */

  // Feature Flag: Toggle to true when ready to connect to a live backend endpoint
  const USE_LIVE_AI_API = false;

  // Track conversation history in standard OpenAI message format [{role: 'user'|'assistant', content: string}]
  const conversationHistory = [];

  // Simulated Knowledge Base representing Kavana's AI digital twin
  const botResponses = {
    skills: "My 8 core software engineering competencies are:\n• Python (96%): Asynchronous services, APIs (FastAPI), numerical scripting.\n• Java (90%): Enterprise systems, multithreading, JVM tuning, Spring Boot.\n• Machine Learning (88%): Scikit-learn, predictive regression, model tuning.\n• Artificial Intelligence (89%): Transformers, LLMs, neural networks, RAG.\n• Data Structures (95%): Big-O optimization, binary search trees, graph theory.\n• SQL (92%): PostgreSQL, indexing, complex recursive CTEs, ACID transactions.\n• HTML & CSS (97%): Semantic HTML5, accessible modern CSS, pixel art aesthetics.\n• Git & GitHub (94%): CI/CD actions, interactive rebasing, trunk delivery.",
    education: "Here is my academic journey:\n🎓 Current: Bachelor of Engineering (B.E.) at Adichunchanagiri Institute of Technology (AIT), Chikkamagaluru (graduating 2029)!\n🏫 2023 - 2025: 12th Standard / Pre-University (PUC) at SRS PU College, Chitradurga.\n📚 2023: 10th Standard (SSLC) at SDRHS, Guddadaneralakere.",
    python: "Python (LVL 96) is my primary tool for building concurrent asynchronous APIs with FastAPI, data science pipelines with NumPy/Pandas, and machine learning orchestration with PyTorch.",
    java: "Java (LVL 90) powers my enterprise systems engineering experience, with a focus on Spring Boot microservices, high-throughput multithreading, and low-latency JVM garbage collection tuning.",
    ml: "In Machine Learning (LVL 88), I work with supervised and unsupervised algorithms, Scikit-Learn, XGBoost, feature pipelines, and model evaluation metrics for predictive intelligence.",
    ai: "In Artificial Intelligence (LVL 89), I architect deep neural networks, LLM agent workflows, transformer models, vector retrieval (RAG), and deterministic prompt engineering.",
    dsa: "Data Structures & Algorithms (LVL 95) is my core engineering foundation—covering binary search trees, graph traversals (BFS/DFS), dynamic programming, and strict Big-O computational efficiency.",
    sql: "In SQL (LVL 92), I specialize in relational schema design, PostgreSQL optimization, B-Tree index tuning, complex recursive queries, and strict ACID transaction safety.",
    web: "For HTML & CSS (LVL 97), I craft accessible (WCAG 2.1 AA) semantic markup, responsive Grid and Flexbox layouts, modular custom properties, and precision pixel art interfaces.",
    git: "With Git & GitHub (LVL 94), I maintain clean commit trees, trunk-based delivery, interactive rebasing, pull request review hygiene, and automated GitHub Actions CI/CD pipelines.",
    projects: "Some of my featured projects include:\n🚀 StreamWeaver: High-throughput log aggregator handling 250k+ events/sec with Go & Kafka.\n☸️ KubePulse CLI: Rust-based terminal health monitor for Kubernetes.\n🔄 SchemaSync: Database drift detector & CI/CD migration validator.",
    hire: "Yes! I am actively open to discussing high-impact software engineering roles, internships, and AI/ML collaborations. You can reach out directly via the Contact section below, email kavanaaiml2@gmail.com, or call +91 9731749122!",
    contact: "You can reach Kavana directly through:\n📧 Email: kavanaaiml2@gmail.com\n📞 Phone & WhatsApp: +91 9731749122\n📍 Location: AIT Chikkamagaluru, Karnataka, India\nOr send a transmission directly using the Contact form in the section below!",
    about: "I'm Kavana, a creative technologist and software engineer studying at AIT Chikkamagaluru (class of 2029). I build scalable backend architectures, intelligent AI pipelines, and boundary-pushing interactive experiences.",
    greeting: "Hello! Great to meet you. How can I help you today? Feel free to ask about my core technical skills, education at AIT Chikkamagaluru, projects, or how to contact me!",
    default: "Thanks for asking! As an AI digital twin of Kavana, I specialize in distributed backends, AI/ML, algorithms, and creative computation. Check out my Skills matrix or drop a note via the Contact section below!"
  };

  /**
   * Append a chat bubble to the display area
   */
  const appendChatMessage = (sender, text, isUser = false) => {
    if (!chatMessages) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;

    // Meta header with sender and timestamp
    const headerMeta = document.createElement('div');
    headerMeta.className = 'bubble-header-meta';

    const senderSpan = document.createElement('span');
    senderSpan.className = 'bubble-sender';
    senderSpan.textContent = sender;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'bubble-timestamp';
    timeSpan.textContent = getFormattedTime();

    headerMeta.appendChild(senderSpan);
    headerMeta.appendChild(timeSpan);
    bubble.appendChild(headerMeta);

    // Message body (split lines by paragraph if multiline)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'bubble-content-text';

    const paragraphs = text.split('\n');
    paragraphs.forEach((pText) => {
      if (pText.trim()) {
        const p = document.createElement('p');
        p.textContent = pText;
        contentDiv.appendChild(p);
      }
    });

    bubble.appendChild(contentDiv);

    // Insert before the typing indicator if indicator exists, otherwise append
    if (typingIndicator && typingIndicator.parentNode === chatMessages) {
      chatMessages.insertBefore(bubble, typingIndicator);
    } else {
      chatMessages.appendChild(bubble);
    }

    // Smooth autoscroll down to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Track in conversation history
    conversationHistory.push({
      role: isUser ? 'user' : 'assistant',
      content: text
    });
  };

  /**
   * Show simulated typing indicator
   */
  const showTypingIndicator = () => {
    if (typingIndicator) {
      typingIndicator.style.display = 'block';
      chatMessages.appendChild(typingIndicator); // Ensure it's at the bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  };

  /**
   * Hide typing indicator
   */
  const hideTypingIndicator = () => {
    if (typingIndicator) {
      typingIndicator.style.display = 'none';
    }
  };

  /**
   * Determine simulated bot response
   */
  const resolveBotAnswer = (query) => {
    const q = query.toLowerCase();

    if (q.includes('skill') || q.includes('competenc') || q.includes('stack') || q.includes('technolog') || q.includes('abilit')) {
      return botResponses.skills;
    } else if (q.includes('education') || q.includes('college') || q.includes('school') || q.includes('ait') || q.includes('study') || q.includes('timeline') || q.includes('graduat') || q.includes('puc') || q.includes('10th') || q.includes('12th')) {
      return botResponses.education;
    } else if (q.includes('python')) {
      return botResponses.python;
    } else if (q.includes('java') && !q.includes('script')) {
      return botResponses.java;
    } else if (q.includes('machine learning') || q.includes('ml')) {
      return botResponses.ml;
    } else if (q.includes('artificial intelligence') || q.includes('ai') || q.includes('neural') || q.includes('llm') || q.includes('gpt')) {
      return botResponses.ai;
    } else if (q.includes('data structure') || q.includes('algorithm') || q.includes('dsa') || q.includes('big-o')) {
      return botResponses.dsa;
    } else if (q.includes('sql') || q.includes('database') || q.includes('postgres')) {
      return botResponses.sql;
    } else if (q.includes('html') || q.includes('css') || q.includes('frontend') || q.includes('ui')) {
      return botResponses.web;
    } else if (q.includes('git') || q.includes('github') || q.includes('ci/cd')) {
      return botResponses.git;
    } else if (q.includes('project') || q.includes('streamweaver') || q.includes('kubepulse') || q.includes('portfolio')) {
      return botResponses.projects;
    } else if (q.includes('hire') || q.includes('available') || q.includes('contract') || q.includes('job') || q.includes('role')) {
      return botResponses.hire;
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings')) {
      return botResponses.greeting;
    } else if (q.includes('who are you') || q.includes('about') || q.includes('kavana')) {
      return botResponses.about;
    }

    return botResponses.default;
  };

  /**
   * Process message sending & receiving
   */
  const processUserMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // 1. Play user message sound & append user bubble
    playRetroClickSound();
    appendChatMessage('[VISITOR]', trimmed, true);

    // 2. Display typing indicator while AI Kavana "formulates" a reply
    showTypingIndicator();

    // 3. Simulate realistic AI thinking delay (600ms - 900ms)
    const simulatedDelay = Math.floor(Math.random() * 300) + 600;

    setTimeout(async () => {
      let replyText = '';

      if (USE_LIVE_AI_API) {
        // [WHERE OPENAI API HOOK CALL HAPPENS]
        // replyText = await callOpenAIChatAPI(trimmed, conversationHistory);
        replyText = resolveBotAnswer(trimmed);
      } else {
        replyText = resolveBotAnswer(trimmed);
      }

      hideTypingIndicator();
      appendChatMessage('[AI_KAVANA]', replyText, false);
      playRetroClickSound();
    }, simulatedDelay);
  };

  // Form submission handler
  if (chatInputForm && chatUserInput) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatUserInput.value;
      chatUserInput.value = '';
      processUserMessage(val);
      chatUserInput.focus();
    });
  }

  // Icebreaker prompt chips
  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent.replace('✦', '').trim();
      processUserMessage(prompt);
    });
  });

  // Reset conversation button handler
  if (chatResetBtn && chatMessages) {
    chatResetBtn.addEventListener('click', () => {
      playRetroClickSound();

      // Reset messages to initial welcome state
      chatMessages.innerHTML = `
        <div class="chat-bubble bot-bubble">
          <div class="bubble-header-meta">
            <span class="bubble-sender">[AI_KAVANA]</span>
            <span class="bubble-timestamp">${getFormattedTime()}</span>
          </div>
          <div class="bubble-content-text">
            <p>
              🔄 Conversation reset. I'm <strong>AI Kavana</strong>, your interactive portfolio assistant.
            </p>
            <p>
              Ask me anything about Kavana's <strong>8 technical skills</strong>, ongoing engineering degree at <strong>AIT Chikkamagaluru</strong>, or past projects!
            </p>
          </div>
        </div>
        <div class="chat-quick-prompts" id="chat-quick-prompts" aria-label="Quick suggested questions">
          <span class="prompts-heading" aria-hidden="true">TRY ASKING:</span>
          <button class="prompt-chip" type="button" data-prompt="What are your core technical skills?">✦ Core Skills &amp; Languages</button>
          <button class="prompt-chip" type="button" data-prompt="Tell me about your education at AIT and PUC">✦ Education &amp; AIT Timeline</button>
          <button class="prompt-chip" type="button" data-prompt="What projects have you built?">✦ Featured Projects</button>
          <button class="prompt-chip" type="button" data-prompt="Are you available for engineering roles?">✦ Availability &amp; Hire</button>
        </div>
        <div id="chat-typing-indicator" class="chat-bubble bot-bubble chat-typing-bubble" style="display: none;" aria-hidden="true">
          <span class="bubble-sender">[AI_KAVANA]</span>
          <div class="typing-indicator-row">
            <div class="typing-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span class="typing-label">AI Kavana is thinking...</span>
          </div>
        </div>
      `;

      // Re-attach quick prompt listeners
      const newPromptChips = chatMessages.querySelectorAll('.prompt-chip');
      newPromptChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt') || chip.textContent.replace('✦', '').trim();
          processUserMessage(prompt);
        });
      });

      conversationHistory.length = 0;
      if (chatUserInput) chatUserInput.focus();
    });
  }

  // ========================================================
  // 6. DYNAMIC YEAR IN FOOTER
  // ========================================================
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ========================================================
  // 7. CONTACT FORM SUBMISSION & RESEND EMAIL API INTEGRATION
  // ========================================================
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const contactConfirmation = document.getElementById('contact-confirmation');
  const contactResetBtn = document.getElementById('contact-reset-btn');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const confirmedSenderName = document.getElementById('confirmed-sender-name');
  const confirmedSenderEmail = document.getElementById('confirmed-sender-email');
  const confirmedTimestamp = document.getElementById('confirmed-timestamp');

  // Input sanitization / validation helper
  const clearErrors = () => {
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) input.classList.remove('is-invalid');
    });
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
  };

  // Real-time error clearance on typing
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        const errSpan = document.getElementById(`${input.name}-error`);
        if (errSpan) errSpan.textContent = '';
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      let hasError = false;

      // Validate Name (Required field)
      if (!nameVal || nameVal.length < 2) {
        if (nameInput) nameInput.classList.add('is-invalid');
        if (nameError) nameError.textContent = 'Please enter your name (min 2 characters).';
        hasError = true;
      }

      // Validate Email (Required field with standard regex)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailPattern.test(emailVal)) {
        if (emailInput) emailInput.classList.add('is-invalid');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
      }

      // Validate Message (Required field)
      if (!messageVal || messageVal.length < 6) {
        if (messageInput) messageInput.classList.add('is-invalid');
        if (messageError) messageError.textContent = 'Please enter a message (min 6 characters).';
        hasError = true;
      }

      if (hasError) {
        // Focus first invalid input for accessibility
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Set Submitting Loading State on High-Contrast Button
      if (contactSubmitBtn) {
        contactSubmitBtn.classList.add('is-submitting');
        contactSubmitBtn.disabled = true;
      }

      // =========================================================================
      // EMAIL-SENDING SERVICE INTEGRATION (e.g. RESEND API)
      // =========================================================================
      // Direct Recipient: kavanaaiml2@gmail.com
      // Contact Phone: +91 9731749122
      //
      // To integrate Resend API (https://resend.com), follow one of the architectures:
      //
      // -------------------------------------------------------------------------
      // PATTERN A: Backend Route / Serverless Handler (Vercel / Cloudflare / Node)
      // Best Practice: Keeps your RESEND_API_KEY secure in server environment variables.
      //
      // In your server/serverless endpoint (e.g. /api/send-email):
      // ```javascript
      // import { Resend } from 'resend';
      // const resend = new Resend(process.env.RESEND_API_KEY);
      //
      // export async function POST(request) {
      //   const { name, email, message } = await request.json();
      //   const { data, error } = await resend.emails.send({
      //     from: 'Portfolio Transmission <onboarding@resend.dev>',
      //     to: ['kavanaaiml2@gmail.com'],
      //     reply_to: email,
      //     subject: `New Transmission from ${name} via Portfolio`,
      //     html: `
      //       <div style="font-family: sans-serif; line-height: 1.6; color: #1e1b4b; max-width: 600px; margin: 0 auto; border: 2px solid #6366f1; border-radius: 12px; padding: 24px; background: #ffffff;">
      //         <h2 style="color: #4338ca; border-bottom: 2px solid #eeebf4; padding-bottom: 12px; margin-top: 0;">New Transmission Received</h2>
      //         <p><strong>Sender Name:</strong> ${name}</p>
      //         <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
      //         <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 14px; margin: 16px 0; border-radius: 4px;">
      //           <p style="margin: 0; white-space: pre-wrap;"><strong>Message:</strong><br>${message}</p>
      //         </div>
      //         <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      //         <p style="font-size: 12px; color: #64748b;">Direct transmission to kavanaaiml2@gmail.com | Portfolio Telemetry Console</p>
      //       </div>
      //     `
      //   });
      //   if (error) return Response.json({ error }, { status: 400 });
      //   return Response.json({ success: true, data });
      // }
      // ```
      //
      // -------------------------------------------------------------------------
      // PATTERN B: Client-side fetch call (via secure backend proxy / webhook):
      // ```javascript
      // try {
      //   const response = await fetch('/api/send-email', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       name: nameVal,
      //       email: emailVal,
      //       message: messageVal,
      //       recipient: 'kavanaaiml2@gmail.com'
      //     })
      //   });
      //   const result = await response.json();
      //   if (!response.ok) throw new Error(result.error || 'Failed to dispatch email');
      // } catch (err) {
      //   console.error('Email transmission failed:', err);
      //   // Handle error notification
      // }
      // =========================================================================

      // Simulate network round-trip delay for smooth feedback experience
      await new Promise((resolve) => setTimeout(resolve, 650));

      // Populate confirmation card telemetry
      if (confirmedSenderName) confirmedSenderName.textContent = nameVal;
      if (confirmedSenderEmail) confirmedSenderEmail.textContent = emailVal;
      if (confirmedTimestamp) {
        const now = new Date();
        confirmedTimestamp.textContent = `${now.toLocaleDateString()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }

      // Smoothly hide form and display confirmation message
      contactForm.style.display = 'none';
      if (contactConfirmation) {
        contactConfirmation.removeAttribute('hidden');
        contactConfirmation.style.display = 'block';
        contactConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset submitting status on the button
      if (contactSubmitBtn) {
        contactSubmitBtn.classList.remove('is-submitting');
        contactSubmitBtn.disabled = false;
      }
    });
  }

  // Handle "Send Another Message" reset button
  if (contactResetBtn) {
    contactResetBtn.addEventListener('click', () => {
      // Reset form fields
      if (contactForm) {
        contactForm.reset();
        clearErrors();
        contactForm.style.display = 'block';
      }
      if (contactConfirmation) {
        contactConfirmation.setAttribute('hidden', '');
        contactConfirmation.style.display = 'none';
      }
      if (nameInput) nameInput.focus();
    });
  }

  // ========================================================
  // 8. TACTILE COPY-TO-CLIPBOARD FOR PHONE & EMAIL
  // ========================================================
  const copyButtons = document.querySelectorAll('.contact-copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const label = btn.querySelector('.copy-label');
        const origText = label ? label.textContent : 'Copy';

        btn.classList.add('is-copied');
        if (label) label.textContent = 'Copied! ✓';

        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (label) label.textContent = origText;
        }, 2000);
      } catch (err) {
        console.warn('Clipboard write fallback:', err);
      }
    });
  });
});
