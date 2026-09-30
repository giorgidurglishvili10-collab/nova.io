/**
 * Nova Landing Page - Interactive JavaScript
 * Experienced Developer Architecture: Strict mode, Modular, Accessible, Robust Form Validation
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all application modules
  ThemeManager.init();
  NavigationManager.init();
  ScrollSpy.init();
  FormValidator.init();
});

/* ==========================================================================
   1. Theme Manager (Dark / Light Mode with LocalStorage & OS Sync)
   ========================================================================== */
const ThemeManager = {
  storageKey: 'nova-theme-preference',
  html: document.documentElement,
  toggleBtn: document.getElementById('themeToggle'),

  init() {
    if (!this.toggleBtn) return;

    // Detect saved preference or fall back to system preference
    const savedTheme = localStorage.getItem(this.storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    this.applyTheme(initialTheme);

    // Event listener for toggle button
    this.toggleBtn.addEventListener('click', () => {
      const currentTheme = this.html.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
      Toast.show(
        newTheme === 'dark' ? 'ჩაირთო მუქი თემა 🌙' : 'ჩაირთო ღია თემა ☀️',
        'info',
        2500
      );
    });

    // Listen to OS system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  applyTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
    const isDark = theme === 'dark';
    this.toggleBtn.setAttribute(
      'aria-label',
      isDark ? 'ღია თემაზე გადართვა' : 'მუქ თემაზე გადართვა'
    );
  }
};

/* ==========================================================================
   2. Navigation Manager (Mobile Drawer, Smooth Scroll, Keyboard Access)
   ========================================================================== */
const NavigationManager = {
  header: document.getElementById('siteHeader'),
  navMenu: document.getElementById('navMenu'),
  toggleBtn: document.getElementById('mobileToggle'),
  navLinks: document.querySelectorAll('.nav-link'),

  init() {
    if (!this.toggleBtn || !this.navMenu) return;

    // Mobile Hamburger Toggle
    this.toggleBtn.addEventListener('click', () => this.toggleNav());

    // Close menu when clicking any nav link
    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (this.isOpen()) {
          this.closeNav();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        this.isOpen() &&
        !this.navMenu.contains(event.target) &&
        !this.toggleBtn.contains(event.target)
      ) {
        this.closeNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen()) {
        this.closeNav();
        this.toggleBtn.focus();
      }
    });

    // Sticky Header elevation on scroll
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  },

  isOpen() {
    return this.navMenu.classList.contains('open');
  },

  toggleNav() {
    const isExpanded = this.toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      this.closeNav();
    } else {
      this.openNav();
    }
  },

  openNav() {
    this.navMenu.classList.add('open');
    this.toggleBtn.classList.add('open');
    this.toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  },

  closeNav() {
    this.navMenu.classList.remove('open');
    this.toggleBtn.classList.remove('open');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  handleScroll() {
    if (window.scrollY > 30) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
};

/* ==========================================================================
   3. ScrollSpy (Active Section Highlight via IntersectionObserver)
   ========================================================================== */
const ScrollSpy = {
  sections: document.querySelectorAll('section[id]'),
  navLinks: document.querySelectorAll('.nav-list .nav-link'),

  init() {
    if (!('IntersectionObserver' in window) || !this.sections.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          this.setActiveLink(currentId);
        }
      });
    }, observerOptions);

    this.sections.forEach((section) => observer.observe(section));
  },

  setActiveLink(id) {
    this.navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

/* ==========================================================================
   4. Form Validation & Submission Handler
   ========================================================================== */
const FormValidator = {
  form: document.getElementById('contactForm'),
  submitBtn: document.getElementById('submitBtn'),
  formAlert: document.getElementById('formAlert'),
  charCounter: document.getElementById('charCounter'),

  fields: {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate(val) {
        if (!val.trim()) return 'გთხოვთ, მიუთითოთ სახელი და გვარი.';
        if (val.trim().length < 2) return 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან.';
        return '';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate(val) {
        if (!val.trim()) return 'გთხოვთ, მიუთითოთ ელ-ფოსტის მისამართი.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(val.trim())) return 'გთხოვთ, შეიყვანოთ სწორი ელ-ფოსტის ფორმატი (მაგ: user@example.com).';
        return '';
      }
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
      validate(val) {
        if (!val) return 'გთხოვთ, აირჩიოთ სასურველი თემა.';
        return '';
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate(val) {
        if (!val.trim()) return 'გთხოვთ, ჩაწეროთ შეტყობინების ტექსტი.';
        if (val.trim().length < 10) return 'შეტყობინება უნდა შედგებოდეს მინიმუმ 10 სიმბოლოსგან.';
        return '';
      }
    },
    terms: {
      input: document.getElementById('terms'),
      error: document.getElementById('termsError'),
      validate(val, isChecked) {
        if (!isChecked) return 'გთხოვთ, დაეთანხმოთ კონფიდენციალურობის პირობებს.';
        return '';
      }
    }
  },

  init() {
    if (!this.form) return;

    // Real-time Input Listeners
    Object.keys(this.fields).forEach((key) => {
      const field = this.fields[key];
      if (!field.input) return;

      const eventType = field.input.type === 'checkbox' || field.input.tagName === 'SELECT' ? 'change' : 'input';

      // Validation on input/change
      field.input.addEventListener(eventType, () => {
        this.validateField(field);
      });

      // Validation on blur
      field.input.addEventListener('blur', () => {
        this.validateField(field);
      });
    });

    // Message Character Counter
    const messageInput = this.fields.message.input;
    if (messageInput && this.charCounter) {
      messageInput.addEventListener('input', () => {
        const count = messageInput.value.length;
        this.charCounter.textContent = `${count} / 500`;
        if (count > 500) {
          this.charCounter.style.color = 'var(--status-error)';
        } else {
          this.charCounter.style.color = 'var(--text-muted)';
        }
      });
    }

    // Submit Listener
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  validateField(field) {
    const isCheckbox = field.input.type === 'checkbox';
    const value = field.input.value;
    const isChecked = field.input.checked;
    const errorMsg = field.validate(value, isChecked);

    if (errorMsg) {
      this.showFieldError(field, errorMsg);
      return false;
    } else {
      this.clearFieldError(field);
      return true;
    }
  },

  showFieldError(field, message) {
    field.input.classList.add('is-invalid');
    field.input.classList.remove('is-valid');
    field.input.setAttribute('aria-invalid', 'true');
    if (field.error) {
      field.error.textContent = message;
    }
  },

  clearFieldError(field) {
    field.input.classList.remove('is-invalid');
    field.input.classList.add('is-valid');
    field.input.removeAttribute('aria-invalid');
    if (field.error) {
      field.error.textContent = '';
    }
  },

  resetValidationState() {
    Object.keys(this.fields).forEach((key) => {
      const field = this.fields[key];
      if (field.input) {
        field.input.classList.remove('is-valid', 'is-invalid');
        field.input.removeAttribute('aria-invalid');
      }
      if (field.error) {
        field.error.textContent = '';
      }
    });
    if (this.charCounter) {
      this.charCounter.textContent = '0 / 500';
    }
  },

  showAlert(message, type = 'success') {
    if (!this.formAlert) return;
    this.formAlert.className = `form-alert ${type}`;
    this.formAlert.textContent = message;
    this.formAlert.hidden = false;
  },

  hideAlert() {
    if (!this.formAlert) return;
    this.formAlert.hidden = true;
    this.formAlert.textContent = '';
  },

  async handleSubmit(e) {
    e.preventDefault();
    this.hideAlert();

    // Validate all fields
    let isFormValid = true;
    let firstInvalidField = null;

    Object.keys(this.fields).forEach((key) => {
      const field = this.fields[key];
      const valid = this.validateField(field);
      if (!valid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field.input;
        }
      }
    });

    if (!isFormValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      this.showAlert('გთხოვთ შეასწოროთ ფორმაში მონიშნული შეცდომები.', 'error');
      Toast.show('ფორმა შეიცავს არასწორ მონაცემებს.', 'error');
      return;
    }

    // Set UI to loading state
    this.setLoading(true);

    try {
      // Simulate real API network request
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Success
      this.form.reset();
      this.resetValidationState();
      const successMessage = 'მადლობა! თქვენი შეტყობინება წარმატებით გაიგზავნა. ჩვენი გუნდი მალე დაგიკავშირდებათ.';
      this.showAlert(successMessage, 'success');
      Toast.show('შეტყობინება წარმატებით გაიგზავნა! 🚀', 'success');

    } catch (error) {
      this.showAlert('დაფიქსირდა შეცდომა შეტყობინების გაგზავნისას. გთხოვთ სცადოთ მოგვიანებით.', 'error');
      Toast.show('გაგზავნა ვერ მოხერხდა.', 'error');
    } finally {
      this.setLoading(false);
    }
  },

  setLoading(isLoading) {
    if (!this.submitBtn) return;
    if (isLoading) {
      this.submitBtn.classList.add('loading');
      this.submitBtn.disabled = true;
      this.submitBtn.querySelector('.btn-text').textContent = 'იგზავნება...';
    } else {
      this.submitBtn.classList.remove('loading');
      this.submitBtn.disabled = false;
      this.submitBtn.querySelector('.btn-text').textContent = 'შეტყობინების გაგზავნა';
    }
  }
};

/* ==========================================================================
   5. Toast Notification System
   ========================================================================== */
const Toast = {
  container: document.getElementById('toastContainer'),

  show(message, type = 'success', duration = 3500) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    // Icon based on type
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span><strong>${icon}</strong></span> <span>${message}</span>`;

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, duration);
  }
};
