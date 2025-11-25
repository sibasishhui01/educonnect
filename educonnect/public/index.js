// index.js — hero parallax + animated counters + mobile menu
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const hero = document.getElementById('hero');
const heroParallax = document.getElementById('heroParallax');

/* Mobile menu toggle */
mobileBtn?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = mobileBtn.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

/* Small parallax movement on mouse move for desktop */
if (heroParallax) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // subtle transform
    heroParallax.style.transform = `translate(${x * 12}px, ${y * 8}px) scale(1.01)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroParallax.style.transform = '';
  });
}

/* Animated counters */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-value');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target || '0', 10);
    let current = 0;
    const duration = 1400;
    const stepTime = Math.max(12, Math.floor(duration / (target || 1)));
    const inc = Math.max(1, Math.floor(target / (duration / stepTime)));
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = current.toLocaleString();
      }
    }, stepTime);
  });
}

/* Trigger counters when hero visible using IntersectionObserver */
const heroInner = document.querySelector('.hero-inner');
if ('IntersectionObserver' in window && heroInner) {
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        o.disconnect();
      }
    });
  }, { threshold: 0.5 });
  obs.observe(heroInner);
} else {
  // fallback
  window.addEventListener('load', animateCounters);
}

/* small accessibility: close mobile menu if clicking outside */
document.addEventListener('click', (e) => {
  if (!navLinks || !mobileBtn) return;
  if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target) && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    const icon = mobileBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});
