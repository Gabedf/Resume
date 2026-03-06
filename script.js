/* ============================================================
   script.js — Interactivity for Gabe Fonseca Portfolio
   Features:
   - Canvas particle system (star field)
   - Sticky navbar with scroll detection
   - Mobile menu toggle
   - Typing / typewriter effect in hero
   - Scroll-reveal animations (Intersection Observer)
   - Active nav link tracking
   - Contact form UX (client-side only)
   ============================================================ */

/* ─── 1. PARTICLE CANVAS BACKGROUND ──────────────────────── */
(function initParticles() {
  const canvas  = document.getElementById('particles-canvas');
  const ctx     = canvas.getContext('2d');
  let width, height, particles = [];

  const CONFIG = {
    count:       80,
    maxRadius:   1.4,
    minRadius:   0.3,
    speed:       0.22,
    lineDistance: 110,
    primaryColor:   [226, 232, 240],   // silver-white
    secondaryColor: [103, 232, 249],   // ice cyan
    accentColor:    [148, 163, 184],   // slate
  };

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function randomColor() {
    const colors = [CONFIG.primaryColor, CONFIG.secondaryColor, CONFIG.accentColor];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createParticle() {
    const color = randomColor();
    return {
      x:     Math.random() * width,
      y:     Math.random() * height,
      vx:    (Math.random() - 0.5) * CONFIG.speed,
      vy:    (Math.random() - 0.5) * CONFIG.speed,
      r:     Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius,
      color,
      alpha: Math.random() * 0.35 + 0.12,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color.join(',')},${p.alpha})`;
    ctx.fill();
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < CONFIG.lineDistance) {
          const opacity = (1 - dist / CONFIG.lineDistance) * 0.10;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.primaryColor.join(',')},${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width)  p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      drawParticle(p);
    }
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    // redistribute particles on resize
    particles.forEach(p => {
      if (p.x > width)  p.x = Math.random() * width;
      if (p.y > height) p.y = Math.random() * height;
    });
  });

  init();
  animate();
})();


/* ─── 2. STICKY NAVBAR ────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ─── 3. MOBILE MENU TOGGLE ───────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('menu-icon');

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
  });

  // Close menu on nav link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      icon.className = 'fas fa-bars';
    });
  });
})();


/* ─── 4. TYPEWRITER EFFECT (HERO SUBTITLE) ───────────────── */
(function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Software Engineer',
    'Backend Developer',
    'Problem Solver',
    'Data Engineer',
    'System Builder',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let delay       = 120;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        delay = 1800; // pause at end
      } else {
        delay = 100 + Math.random() * 40;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      } else {
        delay = 55;
      }
    }
    setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();


/* ─── 5. SCROLL-REVEAL (Intersection Observer) ────────────── */
(function initScrollReveal() {
  const selectors = '.reveal, .reveal-left, .reveal-right';
  const elements  = document.querySelectorAll(selectors);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ─── 6. ACTIVE NAV LINK TRACKING ────────────────────────── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(sec => observer.observe(sec));
})();


/* ─── 7. CONTACT FORM (Formspree) ─────────────────────────── */
(function initContactForm() {
  // Sign up at https://formspree.io, create a form, and paste your
  // endpoint here. Format: 'https://formspree.io/f/YOUR_FORM_ID'
  const FORMSPREE_URL = 'https://formspree.io/f/mlgpryvo';

  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i><span>Sending…</span>';

    fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          showStatus("Message sent! I'll get back to you soon.", 'success');
          form.reset();
        } else {
          const errMsg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
          showStatus(errMsg, 'error');
        }
      })
      .catch(() => {
        showStatus('Network error. Please try emailing me directly at gabdwork@gmail.com', 'error');
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane text-xs"></i>';
      });
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = type === 'success'
      ? 'mt-3 text-sm text-emerald-400'
      : 'mt-3 text-sm text-red-400';
    status.style.display = 'block';
    if (type !== 'success') {
      setTimeout(() => { status.style.display = 'none'; }, 6000);
    }
  }
})();


/* ─── 8. SMOOTH SCROLL for anchor links ──────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar').offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});