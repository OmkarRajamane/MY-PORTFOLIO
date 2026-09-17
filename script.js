/**
 * Omkar Rajamane - Portfolio JavaScript
 * Handles Theme Toggling, Mobile Menu, Active ScrollSpy, Form Validation & Submission, Copy-to-Clipboard
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initScrollSpy();
  initCopyToClipboard();
  initContactForm();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to sleek dark

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }
}

/* ==========================================================================
   2. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking on any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  function openMenu() {
    navMenu.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }
}

/* ==========================================================================
   3. Active Section ScrollSpy
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    const navHeight = 90;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - navHeight;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================================
   4. Copy to Clipboard
   ========================================================================== */
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }
    });
  });
}

/* ==========================================================================
   5. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  // Real-time input cleaning
  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const errEl = document.getElementById(`${input.id.replace('contact-', '')}-error`);
      if (errEl) errEl.textContent = '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    formStatus.style.display = 'none';
    formStatus.className = 'form-status-alert';
    formStatus.textContent = '';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
    const message = messageInput.value.trim();

    let isValid = true;

    // Validate Name
    if (!name) {
      nameError.textContent = 'Please enter your name.';
      nameInput.classList.add('is-invalid');
      isValid = false;
    } else if (name.length < 2) {
      nameError.textContent = 'Name must be at least 2 characters.';
      nameInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailError.textContent = 'Please enter your email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Message
    if (!message) {
      messageError.textContent = 'Please enter your message.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    } else if (message.length < 10) {
      messageError.textContent = 'Message should be at least 10 characters.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Enter Loading State
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    try {
      // Endpoint using Formspree configured to recipient omkarrajamane593@gmail.com
      const endpoint = 'https://formspree.io/f/omkarrajamane593@gmail.com';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: subject || `Portfolio Contact from ${name}`,
          message: message
        })
      });

      if (response.ok) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
        formStatus.classList.add('success');
        formStatus.style.display = 'block';
        form.reset();
        showToast('Message sent successfully!');
      } else {
        // If Formspree requires activation or returns error, provide direct mailto fallback
        const mailtoUrl = `mailto:omkarrajamane593@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Message from ' + name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        
        formStatus.innerHTML = `Unable to submit automatically. Please <a href="${mailtoUrl}" style="text-decoration:underline;font-weight:bold;color:inherit;">click here to send directly via your email client</a>.`;
        formStatus.classList.add('error');
        formStatus.style.display = 'block';
      }
    } catch (err) {
      // Network/CORS fallback
      const mailtoUrl = `mailto:omkarrajamane593@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Message from ' + name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      
      formStatus.innerHTML = `Network issue. Please <a href="${mailtoUrl}" style="text-decoration:underline;font-weight:bold;color:inherit;">click here to send via your email client</a>.`;
      formStatus.classList.add('error');
      formStatus.style.display = 'block';
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-primary);"><path d="M20 6 9 17l-5-5"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3500);
}
