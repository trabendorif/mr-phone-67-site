// ============================================================
// MR PHONE 67 — Enhanced Interactive JavaScript
// ============================================================

// === PARTICLE BACKGROUND ===
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  // Style the canvas
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.6;';

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 195 : (Math.random() > 0.5 ? 265 : 80);
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(195, 80%, 60%, ${0.08 * (1 - distance / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// === HEADER SCROLL EFFECT ===
const header = document.getElementById('header');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > 50);
  lastScrollY = scrollY;
});

// === MOBILE MENU ===
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  mobileToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    mobileToggle.textContent = '☰';
  });
});

// === SCROLL REVEAL WITH STAGGER ===
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// === ACTIVE NAV LINK ===
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// === HIGHLIGHT TODAY IN HOURS ===
const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const today = days[new Date().getDay()];
document.querySelectorAll('.hour-row').forEach(row => {
  const daySpan = row.querySelector('.hour-day');
  if (daySpan && daySpan.textContent.trim() === today) {
    row.classList.add('today');
  }
});

// === RDV FORM — SENDS TO EMAIL VIA MAILTO ===
const rdvForm = document.getElementById('rdvForm');
rdvForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = rdvForm.querySelectorAll('input, select, textarea');
  
  const nom = inputs[0].value || 'Non renseigné';
  const tel = inputs[1].value || 'Non renseigné';
  const appareil = inputs[2].value || 'Non renseigné';
  const modele = inputs[3].value || 'Non renseigné';
  const probleme = inputs[4].value || 'Non renseigné';

  // Build email body
  const subject = encodeURIComponent(`Demande de RDV — ${nom} — ${appareil}`);
  const body = encodeURIComponent(
    `Nouvelle demande de rendez-vous MR PHONE 67\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `👤 Nom : ${nom}\n` +
    `📞 Téléphone : ${tel}\n` +
    `📱 Appareil : ${appareil}\n` +
    `📋 Modèle : ${modele}\n` +
    `🔧 Problème : ${probleme}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Envoyé depuis le site reparationsmartphone.net`
  );

  // Open mailto
  window.location.href = `mailto:mediamonger67200@gmail.com?subject=${subject}&body=${body}`;

  // Show confirmation with animation
  const btn = rdvForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '✅ Demande envoyée !';
  btn.style.background = 'linear-gradient(135deg, #84cc16, #65a30d)';
  btn.style.transform = 'scale(1.02)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.style.transform = '';
    rdvForm.reset();
  }, 3000);
});

// === COUNTER ANIMATION (Improved) ===
const counters = document.querySelectorAll('.hero-stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const match = text.match(/(\d+)/);
      if (match) {
        const target = parseInt(match[1]);
        const suffix = text.replace(match[1], '').trim();
        const prefix = text.indexOf(match[1]) > 0 ? text.substring(0, text.indexOf(match[1])) : '';
        let current = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          current = Math.round(easeOutExpo(progress) * target);
          
          // Format with + suffix for large numbers
          let displayValue = current;
          if (target >= 1000) {
            displayValue = current.toLocaleString('fr-FR');
          }
          
          el.textContent = prefix + displayValue + (suffix ? (suffix.startsWith('+') ? '' : ' ') + suffix : '');
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        
        requestAnimationFrame(updateCounter);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// === SMOOTH SCROLL FOR ALL ANCHORS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === MAGNETIC HOVER EFFECT ON CARDS ===
document.querySelectorAll('.service-card, .brand-card, .trust-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    
    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-percentY * 3}deg) rotateY(${percentX * 3}deg)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// === PARALLAX ON SCROLL ===
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
}

// === TYPED EFFECT ON HERO (subtle) ===
const heroP = document.querySelector('.hero p');
if (heroP) {
  heroP.style.opacity = '0';
  setTimeout(() => {
    heroP.style.opacity = '';
  }, 400);
}

console.log('🚀 MR PHONE 67 — Site chargé avec succès');
