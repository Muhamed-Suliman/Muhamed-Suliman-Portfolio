/**
 * ==============================================================================
 * MUHAMED SULIMAN PORTFOLIO - MAIN ARCHITECTURE SCRIPT (script.js)
 * High-Performance, Vanilla ES6+ Front-End Script
 * 
 * Includes: Theme Management, Typing Animation, Intersection Observer Reveal,
 * Active Nav Sync, Smooth Scroll, Back-To-Top, Progress Bar, Form Validation,
 * Lazy Loading, and Accessibility Hooks.
 * ==============================================================================
 */

'use strict';

(() => {
  /* ==========================================================================
     1. UTILITIES & HELPER FUNCTIONS
     ========================================================================== */

  /**
   * Safe DOM Selector query wrapper to prevent runtime errors on missing nodes.
   * @param {string} selector 
   * @param {Element|Document} [context=document]
   * @returns {Element|null}
   */
  const $ = (selector, context = document) => context.querySelector(selector);

  /**
   * Safe DOM QuerySelectorAll wrapper returning a true Array.
   * @param {string} selector 
   * @param {Element|Document} [context=document]
   * @returns {Array<Element>}
   */
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /**
   * Debounce function execution for expensive resize/scroll events.
   * @param {Function} fn 
   * @param {number} delay 
   * @returns {Function}
   */
  const debounce = (fn, delay = 100) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  /**
   * Throttle function execution using requestAnimationFrame.
   * @param {Function} fn 
   * @returns {Function}
   */
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

  /**
   * Checks if user prefers reduced motion for accessibility compliance.
   * @returns {boolean}
   */
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };


  /* ==========================================================================
     2. THEME MANAGEMENT (DARK / LIGHT MODE)
     ========================================================================== */
  const ThemeManager = {
    STORAGE_KEY: 'portfolio_theme',
    btn: null,

    init() {
      this.btn = $('.theme-toggle-btn');
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

      // Apply saved or system theme
      if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        this.setTheme('light');
      } else {
        this.setTheme('dark');
      }

      if (this.btn) {
        this.btn.addEventListener('click', () => this.toggle());
      }

      // Listen to OS theme updates dynamically
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'light' : 'dark');
        }
      });
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
      'Informatica Specialist',
      'Data Warehouse Engineer',
      'Apache Spark Developer'
    ],
    targetEl: null,
    roleIdx: 0,
    charIdx: 0,
    isDeleting: false,
    typingSpeed: 100,
    deleteSpeed: 50,
    pauseDuration: 1800,

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

      let delta = this.isDeleting ? this.deleteSpeed : this.typingSpeed;

      if (!this.isDeleting && this.charIdx === currentRole.length) {
        delta = this.pauseDuration;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIdx === 0) {
        this.isDeleting = false;
        this.roleIdx = (this.roleIdx + 1) % this.roles.length;
        delta = 400; // Delay before typing next word
      }

      setTimeout(() => this.tick(), delta);
    }
  };


  /* ==========================================================================
     4. NAVIGATION & HEADER CONTROLLER
     ========================================================================== */
  const NavigationController = {
    header: null,
    mobileToggle: null,
    navMenu: null,
    navLinks: [],
    sections: [],
    progressBar: null,

    init() {
      this.header = $('.header');
      this.mobileToggle = $('.mobile-toggle-btn');
      this.navMenu = $('.nav-menu');
      this.navLinks = $$('.nav-link');
      this.sections = $$('section[id], header[id]');
      this.progressBar = $('#scroll-progress');

      this.bindEvents();
    },

    bindEvents() {
      // Mobile Hamburger Toggle
      if (this.mobileToggle && this.navMenu) {
        this.mobileToggle.addEventListener('click', () => {
          const isOpen = this.navMenu.classList.toggle('active');
          this.mobileToggle.classList.toggle('active');
          this.mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu on link click
        this.navLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.navMenu.classList.remove('active');
            this.mobileToggle.classList.remove('active');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
          });
        });

        // Close menu on ESC key press
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
            this.navMenu.classList.remove('active');
            this.mobileToggle.classList.remove('active');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Smooth scrolling for anchor links
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;

          const targetSection = $(targetId);
          if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({
              behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            });
          }
        });
      });

      // Passive scroll listener for performance
      window.addEventListener('scroll', throttle(() => this.handleScroll()), { passive: true });
    },

    handleScroll() {
      const scrollY = window.scrollY;

      // Sticky Header state
      if (this.header) {
        if (scrollY > 50) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }

      // Top Progress Bar
      if (this.progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }

      // Active Navigation Link Highlighting
      if (this.sections.length > 0 && this.navLinks.length > 0) {
        let currentSectionId = '';
        const scrollPosition = scrollY + 150; // Offset for header trigger

        this.sections.forEach(section => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSectionId = section.getAttribute('id');
          }
        });

        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
    }
  };


  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const RevealObserver = {
    init() {
      const targets = $$('.reveal-item, .glass-card, .timeline-item, .project-card, .skill-category-card, .cert-card');
      if (targets.length === 0) return;

      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('revealed'));
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target); // Animate once
          }
        });
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      targets.forEach(target => {
        target.classList.add('reveal-item');
        observer.observe(target);
      });
    }
  };


  /* ==========================================================================
     6. ANIMATED NUMERIC COUNTERS
     ========================================================================== */
  const CounterAnimation = {
    init() {
      const counterElements = $$('.stat-number');
      if (counterElements.length === 0) return;

      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        counterElements.forEach(el => {
          const targetNum = el.getAttribute('data-target') || el.textContent;
          el.textContent = targetNum;
        });
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counterElements.forEach(el => observer.observe(el));
    },

    animate(counterEl) {
      const rawTarget = counterEl.getAttribute('data-target') || counterEl.textContent.replace(/[^0-9]/g, '');
      const target = parseInt(rawTarget, 10);
      if (isNaN(target)) return;

      const duration = 2000; // 2 seconds
      const frameRate = 60;
      const totalFrames = Math.round((duration / 1000) * frameRate);
      let frame = 0;

      const counterInterval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3))); // Ease Out Cubic

        counterEl.textContent = currentCount;

        if (frame >= totalFrames) {
          counterEl.textContent = target;
          clearInterval(counterInterval);
        }
      }, 1000 / frameRate);
    }
  };


  /* ==========================================================================
     7. BACK TO TOP BUTTON
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

      this.btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
      });
    }
  };


  /* ==========================================================================
     8. PROJECT CARDS HOVER EFFECT (GPU ACCELERATED TILT)
     ========================================================================== */
  const CardHoverEffects = {
    init() {
      if (prefersReducedMotion() || ('ontouchstart' in window)) return;

      const cards = $$('.project-card, .skill-category-card');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => this.handleMove(e, card));
        card.addEventListener('mouseleave', () => this.handleReset(card));
      });
    },

    handleMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg rotation
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(5px)`;
    },

    handleReset(card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  };


  /* ==========================================================================
     9. CONTACT FORM VALIDATION & HANDLING
     ========================================================================== */
  const ContactForm = {
    form: null,
    statusMessage: null,

    init() {
      this.form = $('.contact-form');
      if (!this.form) return;

      this.statusMessage = $('.form-status-message');
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Clear field errors on input
      $$('.form-input, .form-textarea', this.form).forEach(input => {
        input.addEventListener('input', () => {
          const parent = input.closest('.form-group');
          if (parent) parent.classList.remove('error');
        });
      });
    },

    handleSubmit(e) {
      e.preventDefault();
      let isValid = true;

      const nameInput = $('#name', this.form);
      const emailInput = $('#email', this.form);
      const messageInput = $('#message', this.form);

      // Validate Name
      if (nameInput && nameInput.value.trim() === '') {
        this.setError(nameInput);
        isValid = false;
      }

      // Validate Email
      if (emailInput && (!emailInput.value.trim() || !this.isValidEmail(emailInput.value.trim()))) {
        this.setError(emailInput);
        isValid = false;
      }

      // Validate Message
      if (messageInput && messageInput.value.trim() === '') {
        this.setError(messageInput);
        isValid = false;
      }

      if (isValid) {
        const submitBtn = $('button[type="submit"]', this.form);
        const originalText = submitBtn ? submitBtn.textContent : 'Send';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        // Simulate Form Submission (2s delay)
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
          this.form.reset();
          this.showStatus('Message sent successfully! I will get back to you shortly.', 'success');
        }, 1500);
      } else {
        this.showStatus('Please fill in all required fields with valid details.', 'error');
      }
    },

    setError(element) {
      const parent = element.closest('.form-group');
      if (parent) parent.classList.add('error');
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showStatus(msg, type) {
      if (!this.statusMessage) return;
      this.statusMessage.textContent = msg;
      this.statusMessage.className = `form-status-message ${type}`;

      setTimeout(() => {
        this.statusMessage.className = 'form-status-message';
        this.statusMessage.textContent = '';
      }, 5000);
    }
  };


  /* ==========================================================================
     10. IMAGE LAZY LOADING ENHANCEMENT
     ========================================================================== */
  const LazyImageLoader = {
    init() {
      const images = $$('img[data-src]');
      if (images.length === 0) return;

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.getAttribute('data-src');
              img.removeAttribute('data-src');
              obs.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback for older browsers
        images.forEach(img => {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
        });
      }
    }
  };


  /* ==========================================================================
     11. INITIALIZATION CONTROLLER
     ========================================================================== */
  const initialize = () => {
    ThemeManager.init();
    TypingEngine.init();
    NavigationController.init();
    RevealObserver.init();
    CounterAnimation.init();
    BackToTop.init();
    CardHoverEffects.init();
    ContactForm.init();
    LazyImageLoader.init();
  };

  // Run initializations after DOM is safe
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
