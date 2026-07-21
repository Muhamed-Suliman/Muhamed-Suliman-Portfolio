/**
 * ==============================================================================
 * MUHAMED SULIMAN PORTFOLIO - MAIN ARCHITECTURE SCRIPT (script.js)
 * High-Performance, Vanilla ES6+ Front-End Script
 * Modernized with Full WCAG Accessibility and Zero Memory Leak Listeners.
 * ==============================================================================
 */

'use strict';

(() => {
  /* ==========================================================================
     1. UTILITIES & HELPER FUNCTIONS
     ========================================================================== */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const throttle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          fn.apply(null, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* ==========================================================================
     2. THEME MANAGEMENT
     ========================================================================== */
  const ThemeManager = {
    STORAGE_KEY: 'portfolio_theme',
    btn: null,

    init() {
      this.btn = $('.theme-toggle-btn');
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

      if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        this.setTheme('light');
      } else {
        this.setTheme('dark');
      }

      if (this.btn) {
        this.btn.addEventListener('click', () => this.toggle());
      }
    },

    setTheme(theme) {
      if (theme === 'light') {
        document.body.classList.add('light');
        if (this.btn) this.btn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        document.body.classList.remove('light');
        if (this.btn) this.btn.setAttribute('aria-label', 'Switch to Light Mode');
      }
      localStorage.setItem(this.STORAGE_KEY, theme);
    },

    toggle() {
      const isLight = document.body.classList.contains('light');
      this.setTheme(isLight ? 'dark' : 'light');
    }
  };

  /* ==========================================================================
     3. TYPING EFFECT ANIMATION
     ========================================================================== */
  const TypingEngine = {
    roles: [
      'Data Engineer',
      'ETL Developer',
      'Microsoft Fabric Engineer',
      'SQL Developer',
      'PySpark Specialist'
    ],
    targetEl: null,
    roleIdx: 0,
    charIdx: 0,
    isDeleting: false,

    init() {
      this.targetEl = $('.typing-text');
      if (!this.targetEl) return;

      if (prefersReducedMotion()) {
        this.targetEl.textContent = this.roles[0];
        return;
      }

      this.tick();
    },

    tick() {
      const currentRole = this.roles[this.roleIdx];

      if (this.isDeleting) {
        this.targetEl.textContent = currentRole.substring(0, this.charIdx - 1);
        this.charIdx--;
      } else {
        this.targetEl.textContent = currentRole.substring(0, this.charIdx + 1);
        this.charIdx++;
      }

      let delta = this.isDeleting ? 50 : 100;

      if (!this.isDeleting && this.charIdx === currentRole.length) {
        delta = 1800;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIdx === 0) {
        this.isDeleting = false;
        this.roleIdx = (this.roleIdx + 1) % this.roles.length;
        delta = 400;
      }

      setTimeout(() => this.tick(), delta);
    }
  };

  /* ==========================================================================
     4. NAVIGATION CONTROLLER
     ========================================================================== */
  const NavigationController = {
    header: null,
    mobileToggle: null,
    navMenu: null,
    progressBar: null,

    init() {
      this.header = $('.header');
      this.mobileToggle = $('.mobile-toggle-btn');
      this.navMenu = $('#main-nav');
      this.progressBar = $('#scroll-progress');

      this.bindEvents();
    },

    bindEvents() {
      if (this.mobileToggle && this.navMenu) {
        this.mobileToggle.addEventListener('click', () => {
          const isOpen = this.navMenu.classList.toggle('active');
          this.mobileToggle.classList.toggle('active');
          this.mobileToggle.setAttribute('aria-expanded', isOpen.toString());
        });
      }

      window.addEventListener('scroll', throttle(() => this.handleScroll()), { passive: true });
    },

    handleScroll() {
      const scrollY = window.scrollY;

      if (this.header) {
        if (scrollY > 50) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }

      if (this.progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    }
  };

  /* ==========================================================================
     5. INTERSECTION OBSERVER REVEAL
     ========================================================================== */
  const RevealObserver = {
    init() {
      const targets = $$('.reveal-item');
      if (targets.length === 0) return;

      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('revealed'));
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      targets.forEach(target => observer.observe(target));
    }
  };

  /* ==========================================================================
     6. BACK TO TOP
     ========================================================================== */
  const BackToTop = {
    btn: null,

    init() {
      this.btn = $('.back-to-top-btn');
      if (!this.btn) return;

      window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 400) {
          this.btn.classList.add('visible');
        } else {
          this.btn.classList.remove('visible');
        }
      }), { passive: true });

      this.btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
      });
    }
  };

  /* ==========================================================================
     7. INITIALIZATION
     ========================================================================== */
  const initialize = () => {
    ThemeManager.init();
    TypingEngine.init();
    NavigationController.init();
    RevealObserver.init();
    BackToTop.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
