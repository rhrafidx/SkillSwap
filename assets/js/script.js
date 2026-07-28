/* =========================================================
   SkillSwap — script.js
   Vanilla JS only. No frameworks, no dependencies.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 300);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => preloader && preloader.classList.add('is-hidden'), 1800);

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('skillswap-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    root.setAttribute('data-theme', 'dark');
  }

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('skillswap-theme', next);
  });

  /* ---------- Sticky navbar shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    navbar?.classList.toggle('is-scrolled', scrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav drawer ---------- */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');

  const closeDrawer = () => {
    hamburger?.classList.remove('is-open');
    drawer?.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
  };
  const toggleDrawer = () => {
    const isOpen = drawer?.classList.toggle('is-open');
    hamburger?.classList.toggle('is-open', isOpen);
    overlay?.classList.toggle('is-open', isOpen);
    hamburger?.setAttribute('aria-expanded', String(!!isOpen));
  };

  hamburger?.addEventListener('click', toggleDrawer);
  overlay?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDrawer));

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - (window.innerWidth > 860 ? 70 : 12);
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), (idx % 6) * 70);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Hero search (dummy, front-end only) ---------- */
  const searchForm = document.getElementById('searchForm');
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput')?.value.trim();
    const category = document.getElementById('searchCategory')?.value;
    // Front-end only demo: in production this would call a backend search API.
    console.log('Search requested:', { query, category });
    window.location.href = 'marketplace.html' +
      (query ? `?q=${encodeURIComponent(query)}` : '') +
      (category ? `${query ? '&' : '?'}category=${encodeURIComponent(category)}` : '');
  });

  /* ---------- Popular skills horizontal scroll controls ---------- */
  const chipRow = document.getElementById('popularSkills');
  document.getElementById('popPrev')?.addEventListener('click', () => {
    chipRow?.scrollBy({ left: -260, behavior: 'smooth' });
  });
  document.getElementById('popNext')?.addEventListener('click', () => {
    chipRow?.scrollBy({ left: 260, behavior: 'smooth' });
  });

  /* ---------- Hero orbit parallax on mouse move (desktop) ---------- */
  const heroVisual = document.getElementById('heroVisual');
  const orbit = document.getElementById('orbit');
  if (heroVisual && orbit && window.matchMedia('(pointer:fine)').matches) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      orbit.style.transform = `rotate(${relX * 6}deg) translate(${relX * 10}px, ${relY * 10}px)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      orbit.style.transform = '';
    });
  }

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (track && dotsWrap) {
    const slides = Array.from(track.children);
    let current = 0;
    let autoplayId;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
    }

    track.parentElement.addEventListener('mouseenter', stopAutoplay);
    track.parentElement.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  /* ---------- Password visibility toggle (Login / Register) ---------- */
  document.querySelectorAll('.input-wrap__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.classList.toggle('is-active', show);
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  /* ---------- Login form: front-end validation + simulated request ---------- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const submitBtn = document.getElementById('loginSubmit');
    const note = document.getElementById('formNote');

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const setFieldError = (field, hasError) => {
      field.closest('.form-field')?.classList.toggle('has-error', hasError);
    };

    [emailField, passwordField].forEach(field => {
      field?.addEventListener('input', () => setFieldError(field, false));
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = '';
      note.className = 'form-note';

      const emailValid = isValidEmail(emailField.value.trim());
      const passwordValid = passwordField.value.length >= 6;

      setFieldError(emailField, !emailValid);
      setFieldError(passwordField, !passwordValid);

      if (!emailValid || !passwordValid) return;

      // Front-end only: simulate an API call. Replace with a real fetch() to your backend, e.g.:
      // const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'},
      //   body: JSON.stringify({ email: emailField.value, password: passwordField.value }) });
      submitBtn.classList.add('is-loading');
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        note.textContent = 'Logged in successfully — redirecting to your dashboard…';
        note.classList.add('is-success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
      }, 1200);
    });
  }

  /* ---------- Register form ---------- */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    const nameField = document.getElementById('fullName');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmField = document.getElementById('confirmPassword');
    const termsField = document.getElementById('terms');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthLabel = document.getElementById('strengthLabel');
    const submitBtn = document.getElementById('registerSubmit');
    const note = document.getElementById('formNote');

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const setFieldError = (field, hasError) => field.closest('.form-field')?.classList.toggle('has-error', hasError);

    const scorePassword = (value) => {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return score;
    };
    const strengthText = ['Too short', 'Weak — add a number', 'Okay — add a symbol', 'Good', 'Strong password'];

    passwordField?.addEventListener('input', () => {
      setFieldError(passwordField, false);
      const score = scorePassword(passwordField.value);
      strengthMeter.className = 'strength-meter' + (score > 0 ? ` level-${score}` : '');
      strengthLabel.textContent = passwordField.value.length === 0
        ? 'Use 8+ characters, with a number and a symbol.'
        : strengthText[score];
    });

    [nameField, emailField, confirmField].forEach(field => {
      field?.addEventListener('input', () => setFieldError(field, false));
    });
    termsField?.addEventListener('change', () => setFieldError(termsField, false));

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = '';
      note.className = 'form-note';

      const nameValid = nameField.value.trim().length >= 2;
      const emailValid = isValidEmail(emailField.value.trim());
      const passwordValid = passwordField.value.length >= 8;
      const confirmValid = confirmField.value.length > 0 && confirmField.value === passwordField.value;
      const termsValid = termsField.checked;

      setFieldError(nameField, !nameValid);
      setFieldError(emailField, !emailValid);
      setFieldError(passwordField, !passwordValid);
      setFieldError(confirmField, !confirmValid);
      setFieldError(termsField, !termsValid);

      if (!nameValid || !emailValid || !passwordValid || !confirmValid || !termsValid) {
        note.textContent = 'Please fix the highlighted fields above.';
        note.classList.add('is-error');
        return;
      }

      // Front-end only: simulate an API call. Replace with a real fetch() to your backend, e.g.:
      // const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'},
      //   body: JSON.stringify({ name: nameField.value, email: emailField.value, password: passwordField.value }) });
      submitBtn.classList.add('is-loading');
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        note.textContent = 'Account created — welcome to SkillSwap! Redirecting…';
        note.classList.add('is-success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
      }, 1200);
    });
  }

  /* ---------- Dashboard: sidebar toggle (mobile) ---------- */
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  const closeSidebar = () => {
    sidebar?.classList.remove('is-open');
    sidebarOverlay?.classList.remove('is-open');
  };
  sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.add('is-open');
    sidebarOverlay?.classList.add('is-open');
  });
  sidebarOverlay?.addEventListener('click', closeSidebar);

  /* ---------- Dashboard: notification & user dropdowns ---------- */
  const setupDropdown = (btnId, panelId) => {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  };
  setupDropdown('notifBtn', 'notifPanel');
  setupDropdown('userMenuBtn', 'userMenuPanel');

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.notif-panel.is-open, .user-menu__panel.is-open').forEach(panel => {
      if (!panel.parentElement.contains(e.target)) panel.classList.remove('is-open');
    });
  });

  /* ---------- Dashboard: animated stat counters ---------- */
  const statValues = document.querySelectorAll('.stat-card__value[data-count]');
  if (statValues.length && 'IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimal || '0', 10);
        const duration = 1000;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(decimals);
        };
        requestAnimationFrame(tick);
        statIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    statValues.forEach(el => statIo.observe(el));
  }

  /* ---------- Profile: contact button ---------- */
  document.getElementById('contactBtn')?.addEventListener('click', () => {
    window.location.href = 'chat.html';
  });

  /* ---------- Marketplace: filter / search / sort ---------- */
  const skillGrid = document.getElementById('skillGrid');
  if (skillGrid) {
    const cards = Array.from(skillGrid.querySelectorAll('.skill-card'));
    const filterRow = document.getElementById('filterRow');
    const searchInput = document.getElementById('marketSearch');
    const sortSelect = document.getElementById('sortSelect');
    const marketCount = document.getElementById('marketCount');
    const marketEmpty = document.getElementById('marketEmpty');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    let activeFilter = 'all';
    let visibleCount = 9;

    function applyFilters() {
      const query = (searchInput?.value || '').trim().toLowerCase();

      let visible = 0;
      cards.forEach(card => {
        const category = card.dataset.category;
        const text = card.textContent.toLowerCase();
        const matchesFilter = activeFilter === 'all' || category === activeFilter;
        const matchesSearch = !query || text.includes(query);
        const shouldShow = matchesFilter && matchesSearch;
        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visible++;
      });

      // Re-apply the "load more" cap on top of whatever matched
      let shown = 0;
      cards.forEach(card => {
        if (card.style.display === 'none') return;
        shown++;
        card.style.display = shown <= visibleCount ? '' : 'none';
      });

      marketCount.textContent = visible === 0
        ? 'No matching skills'
        : `Showing ${Math.min(visible, visibleCount)} of ${visible} skills`;
      marketEmpty.hidden = visible !== 0;
      loadMoreBtn.style.display = visible > visibleCount ? '' : 'none';
    }

    function applySort() {
      const sortBy = sortSelect.value;
      const sorted = [...cards].sort((a, b) => {
        if (sortBy === 'rating') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (sortBy === 'newest') return parseInt(b.dataset.order) - parseInt(a.dataset.order);
        return parseInt(a.dataset.order) - parseInt(b.dataset.order); // popular = original order
      });
      sorted.forEach(card => skillGrid.appendChild(card));
    }

    filterRow?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      filterRow.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      visibleCount = 9;
      applyFilters();
    });

    let searchTimer;
    searchInput?.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { visibleCount = 9; applyFilters(); }, 200);
    });

    sortSelect?.addEventListener('change', () => { applySort(); applyFilters(); });

    loadMoreBtn?.addEventListener('click', () => {
      visibleCount += 9;
      applyFilters();
    });

    applyFilters();
  }

  /* ---------- Skill Details: Request Exchange modal ---------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const openModalBtn = document.getElementById('openExchangeModal');
  const closeModalBtn = document.getElementById('modalClose');
  const exchangeForm = document.getElementById('exchangeForm');

  const openModal = () => {
    modalOverlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modalOverlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openModalBtn?.addEventListener('click', openModal);
  closeModalBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('is-open')) closeModal();
  });

  exchangeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('exchangeSubmit');
    const note = document.getElementById('exchangeNote');

    // Front-end only: simulate an API call. Replace with a real fetch() to your backend, e.g.:
    // await fetch('/api/exchanges', { method:'POST', headers:{'Content-Type':'application/json'},
    //   body: JSON.stringify({ skillId, offerSkill: offerSkill.value, message: exchangeMessage.value }) });
    submitBtn.classList.add('is-loading');
    note.textContent = '';
    note.className = 'form-note';
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      note.textContent = 'Request sent! Marco usually replies within a few hours.';
      note.classList.add('is-success');
      setTimeout(closeModal, 1400);
    }, 1200);
  });

  /* ---------- Chat UI ---------- */
  const chatShell = document.getElementById('chatShell');
  if (chatShell) {
    const chatItems = document.getElementById('chatItems');
    const chatMessages = document.getElementById('chatMessages');
    const chatHeadName = document.getElementById('chatHeadName');
    const chatHeadAvatar = document.getElementById('chatHeadAvatar');
    const typingIndicator = document.getElementById('typingIndicator');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatBack = document.getElementById('chatBack');
    const chatSearch = document.getElementById('chatSearch');

    // Dummy per-conversation data. Replace with real messages fetched from your backend/WebSocket.
    const conversations = {
      aisha: {
        name: 'Aisha K.', avatar: 'https://i.pravatar.cc/60?img=47', online: true,
        messages: [
          { from: 'them', text: "Hey! I saw you're offering React lessons — I'd love to trade for some UI design feedback.", time: '10:02 AM' },
          { from: 'me', text: "That sounds perfect, I've been wanting to improve my design eye anyway.", time: '10:05 AM' },
          { from: 'them', text: 'Great — are you free sometime this week for a first session?', time: '10:06 AM' },
          { from: 'them', text: 'Sounds great — how about Thursday at 6pm?', time: '10:07 AM' },
        ]
      },
      marco: {
        name: 'Marco T.', avatar: 'https://i.pravatar.cc/60?img=12', online: true,
        messages: [
          { from: 'them', text: 'Thanks again for the Excel session, really useful stuff.', time: 'Yesterday' },
          { from: 'me', text: "Glad it helped! Whenever you're ready for round 2 on Italian, let me know.", time: 'Yesterday' },
          { from: 'them', text: "Thanks for the review! Let's set up session 2 🎉", time: '1h ago' },
        ]
      },
      priya: {
        name: 'Priya S.', avatar: 'https://i.pravatar.cc/60?img=5', online: false,
        messages: [
          { from: 'them', text: 'Morning! Still good for the yoga session tomorrow?', time: 'Mon, 8:10 AM' },
          { from: 'me', text: 'Yes, looking forward to it!', time: 'Mon, 8:14 AM' },
          { from: 'me', text: 'Perfect, see you at 9am for the yoga session', time: 'Mon, 8:15 AM' },
        ]
      },
      grace: {
        name: 'Grace M.', avatar: 'https://i.pravatar.cc/60?img=25', online: false,
        messages: [
          { from: 'them', text: "Here are a few photo edits from our last session — let me know what you think!", time: 'Yesterday' },
        ]
      },
      omar: {
        name: 'Omar Haddad', avatar: 'https://i.pravatar.cc/60?img=8', online: true,
        messages: [
          { from: 'them', text: 'Obrigado! That really helped with pronunciation', time: '2 days ago' },
        ]
      }
    };

    function renderMessages(convId) {
      const convo = conversations[convId];
      if (!convo) return;
      chatHeadName.textContent = convo.name;
      chatHeadAvatar.src = convo.avatar;
      chatHeadAvatar.alt = convo.name;
      document.querySelector('.chat-window__status').innerHTML =
        `<span class="status-dot" style="background:${convo.online ? 'var(--success)' : 'var(--text-muted)'}"></span> ${convo.online ? 'Online' : 'Offline'}`;

      chatMessages.innerHTML = '';
      convo.messages.forEach(msg => appendMessage(msg, convo.avatar, false));
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendMessage(msg, avatar, scroll = true) {
      const wrap = document.createElement('div');
      wrap.className = 'msg' + (msg.from === 'me' ? ' msg--me' : '');
      wrap.innerHTML = msg.from === 'me'
        ? `<div class="msg__bubble">${escapeHtml(msg.text)}<span class="msg__time">${msg.time}</span></div>`
        : `<img src="${avatar}" alt=""><div class="msg__bubble">${escapeHtml(msg.text)}<span class="msg__time">${msg.time}</span></div>`;
      chatMessages.appendChild(wrap);
      if (scroll) chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    let activeConv = 'aisha';

    chatItems.addEventListener('click', (e) => {
      const item = e.target.closest('.chat-item');
      if (!item) return;
      chatItems.querySelectorAll('.chat-item').forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      item.querySelector('.chat-item__unread')?.remove();
      activeConv = item.dataset.conv;
      renderMessages(activeConv);

      // Mobile: switch from list view to chat view
      if (window.innerWidth <= 759) {
        chatShell.classList.remove('show-list');
        chatShell.classList.add('show-chat');
      }
    });

    chatBack?.addEventListener('click', () => {
      chatShell.classList.remove('show-chat');
      chatShell.classList.add('show-list');
    });

    chatForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

      appendMessage({ from: 'me', text, time });
      conversations[activeConv].messages.push({ from: 'me', text, time });
      chatInput.value = '';

      // Simulated reply — replace with real-time messages via WebSocket/Socket.io in production.
      typingIndicator.hidden = false;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(() => {
        typingIndicator.hidden = true;
        const replyText = "Thanks for the message! I'll get back to you shortly.";
        const replyTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        appendMessage({ from: 'them', text: replyText, time: replyTime }, conversations[activeConv].avatar);
        conversations[activeConv].messages.push({ from: 'them', text: replyText, time: replyTime });
      }, 1800);
    });

    chatSearch?.addEventListener('input', () => {
      const query = chatSearch.value.trim().toLowerCase();
      chatItems.querySelectorAll('.chat-item').forEach(item => {
        const name = item.querySelector('strong').textContent.toLowerCase();
        item.style.display = name.includes(query) ? '' : 'none';
      });
    });

    // Initial mobile state: show list first
    if (window.innerWidth <= 759) chatShell.classList.add('show-list');
    renderMessages(activeConv);
  }

  /* ---------- Notifications page ---------- */
  const notifTabs = document.getElementById('notifTabs');
  if (notifTabs) {
    const groups = [
      document.getElementById('notifListToday'),
      document.getElementById('notifListYesterday'),
      document.getElementById('notifListEarlier')
    ].filter(Boolean);
    const groupLabels = document.querySelectorAll('.notif-group-label');
    const notifEmpty = document.getElementById('notifEmpty');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const sidebarBadge = document.getElementById('sidebarNotifBadge');

    let activeTab = 'all';

    function updateUnreadBadge() {
      const unreadCount = document.querySelectorAll('.notif-row.is-unread').length;
      if (sidebarBadge) {
        sidebarBadge.textContent = unreadCount;
        sidebarBadge.style.display = unreadCount > 0 ? '' : 'none';
      }
    }

    function applyNotifFilter() {
      let totalVisible = 0;
      groups.forEach((group, i) => {
        let visibleInGroup = 0;
        group.querySelectorAll('.notif-row').forEach(row => {
          const matchesTab = activeTab === 'all'
            || (activeTab === 'unread' && row.classList.contains('is-unread'))
            || row.dataset.type === activeTab;
          row.style.display = matchesTab ? '' : 'none';
          if (matchesTab) visibleInGroup++;
        });
        totalVisible += visibleInGroup;
        if (groupLabels[i]) groupLabels[i].style.display = visibleInGroup > 0 ? '' : 'none';
        group.style.display = visibleInGroup > 0 ? '' : 'none';
      });
      notifEmpty.hidden = totalVisible !== 0;
    }

    notifTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-pill');
      if (!btn) return;
      notifTabs.querySelectorAll('.tab-pill').forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeTab = btn.dataset.tab;
      applyNotifFilter();
    });

    groups.forEach(group => {
      group.addEventListener('click', (e) => {
        const dismissBtn = e.target.closest('.notif-row__dismiss');
        const row = e.target.closest('.notif-row');
        if (!row) return;

        if (dismissBtn) {
          row.classList.add('is-removing');
          setTimeout(() => { row.remove(); updateUnreadBadge(); applyNotifFilter(); }, 300);
        } else {
          row.classList.remove('is-unread');
          updateUnreadBadge();
        }
      });
    });

    markAllReadBtn?.addEventListener('click', () => {
      document.querySelectorAll('.notif-row.is-unread').forEach(row => row.classList.remove('is-unread'));
      updateUnreadBadge();
    });

    applyNotifFilter();
    updateUnreadBadge();
  }

  /* ---------- Settings: tab switching ---------- */
  const settingsNav = document.getElementById('settingsNav');
  if (settingsNav) {
    settingsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.settings-nav__item');
      if (!btn) return;
      settingsNav.querySelectorAll('.settings-nav__item').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.querySelectorAll('.settings-section').forEach(sec => sec.classList.remove('is-active'));
      document.getElementById(`section-${btn.dataset.target}`)?.classList.add('is-active');
    });

    // Settings forms: simulate save with a success note (front-end only — replace with real API calls)
    document.querySelectorAll('.settings-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const note = form.querySelector('.form-note');
        const btn = form.querySelector('.settings-save');
        if (!note) return;
        btn?.classList.add('is-loading');
        note.textContent = '';
        note.className = 'form-note';
        setTimeout(() => {
          btn?.classList.remove('is-loading');
          note.textContent = 'Saved successfully.';
          note.classList.add('is-success');
        }, 800);
      });
    });

    // Theme cards: sync with the global dark/light toggle
    const themeCards = document.querySelectorAll('input[name="themeChoice"]');
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const storedPref = localStorage.getItem('skillswap-theme') ? currentTheme : 'system';
    themeCards.forEach(input => { if (input.value === storedPref) input.checked = true; });

    themeCards.forEach(input => {
      input.addEventListener('change', () => {
        if (input.value === 'system') {
          localStorage.removeItem('skillswap-theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
          document.documentElement.setAttribute('data-theme', input.value);
          localStorage.setItem('skillswap-theme', input.value);
        }
      });
    });
  }

  /* ---------- Settings: delete account modal ---------- */
  const deleteModalOverlay = document.getElementById('deleteModalOverlay');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  const deleteModalClose = document.getElementById('deleteModalClose');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteConfirmInput = document.getElementById('deleteConfirmInput');
  const deleteNote = document.getElementById('deleteNote');

  if (deleteModalOverlay) {
    const openDeleteModal = () => { deleteModalOverlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const closeDeleteModal = () => {
      deleteModalOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      deleteConfirmInput.value = '';
      confirmDeleteBtn.disabled = true;
      deleteNote.textContent = '';
      deleteNote.className = 'form-note';
    };

    deleteAccountBtn?.addEventListener('click', openDeleteModal);
    deleteModalClose?.addEventListener('click', closeDeleteModal);
    cancelDeleteBtn?.addEventListener('click', closeDeleteModal);
    deleteModalOverlay.addEventListener('click', (e) => { if (e.target === deleteModalOverlay) closeDeleteModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && deleteModalOverlay.classList.contains('is-open')) closeDeleteModal();
    });

    deleteConfirmInput?.addEventListener('input', () => {
      confirmDeleteBtn.disabled = deleteConfirmInput.value.trim().toUpperCase() !== 'DELETE';
    });

    confirmDeleteBtn?.addEventListener('click', () => {
      // Front-end only: simulate an API call. Replace with a real fetch() to your backend, e.g.:
      // await fetch('/api/account', { method:'DELETE' });
      confirmDeleteBtn.classList.add('is-loading');
      setTimeout(() => {
        confirmDeleteBtn.classList.remove('is-loading');
        deleteNote.textContent = 'Account deleted. Redirecting…';
        deleteNote.classList.add('is-success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
      }, 1000);
    });
  }

  /* ---------- About page: animated stats band counters ---------- */
  const aboutStats = document.querySelectorAll('.stat-count[data-count]');
  if (aboutStats.length && 'IntersectionObserver' in window) {
    const aboutIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const isYear = target > 1900 && target < 2100 && el.dataset.count.length === 4;
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = isYear ? value.toString() : value.toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = isYear ? target.toString() : target.toLocaleString() + '+';
        };
        requestAnimationFrame(tick);
        aboutIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    aboutStats.forEach(el => aboutIo.observe(el));
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameField = document.getElementById('contactName');
    const emailField = document.getElementById('contactEmail');
    const subjectField = document.getElementById('contactSubject');
    const messageField = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('contactSubmit');
    const note = document.getElementById('contactNote');

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const setFieldError = (field, hasError) => field.closest('.form-field')?.classList.toggle('has-error', hasError);

    [nameField, emailField, subjectField, messageField].forEach(field => {
      field?.addEventListener('input', () => setFieldError(field, false));
      field?.addEventListener('change', () => setFieldError(field, false));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = '';
      note.className = 'form-note';

      const nameValid = nameField.value.trim().length >= 2;
      const emailValid = isValidEmail(emailField.value.trim());
      const subjectValid = subjectField.value.trim().length > 0;
      const messageValid = messageField.value.trim().length >= 10;

      setFieldError(nameField, !nameValid);
      setFieldError(emailField, !emailValid);
      setFieldError(subjectField, !subjectValid);
      setFieldError(messageField, !messageValid);

      if (!nameValid || !emailValid || !subjectValid || !messageValid) {
        note.textContent = 'Please fill in all fields correctly before sending.';
        note.classList.add('is-error');
        return;
      }

      // Front-end only: simulate an API call. Replace with a real fetch() to your backend, e.g.:
      // await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'},
      //   body: JSON.stringify({ name: nameField.value, email: emailField.value, subject: subjectField.value, message: messageField.value }) });
      submitBtn.classList.add('is-loading');
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        note.textContent = "Message sent! We'll get back to you within one business day.";
        note.classList.add('is-success');
        contactForm.reset();
      }, 1200);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other panels (accordion behavior)
      document.querySelectorAll('.accordion__trigger').forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
    });
  });

});
