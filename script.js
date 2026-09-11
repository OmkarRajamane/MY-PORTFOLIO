/**
 * Omkar Rajamane - Portfolio JavaScript Engine
 * Clean, lightweight, and modern interactive logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavbarScrollSpy();
  initMobileMenu();
  initProjectFilters();
  initClipboardActions();
  initContactForm();
  initScrollReveal();
  initBackToTop();
  initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Dynamic Typewriter Effect in Hero Section
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const roles = [
    'Python & AI Developer',
    'Full-Stack Web Developer',
    'Database & Problem Solver',
    'Computer Science Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause after typing
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 350; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   2. Sticky Navbar & Active Section ScrollSpy
   -------------------------------------------------------------------------- */
function initNavbarScrollSpy() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Sticky navbar shadow
    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

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

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('open')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Project Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Copy to Clipboard Actions & Resume CTA Handler
   -------------------------------------------------------------------------- */
function initClipboardActions() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const resumeButtons = [document.getElementById('nav-resume-btn'), document.getElementById('hero-resume-btn')];

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email');
      copyToClipboard(email, 'Email copied to clipboard!');
    });
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      copyToClipboard(textToCopy, `Copied "${textToCopy}" to clipboard!`);
    });
  });

  resumeButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (href === '#contact') {
          showToast('Feel free to request the complete CV via the contact section!');
        }
      });
    }
  });
}

function copyToClipboard(text, message = 'Copied to clipboard!') {
  if (!navigator.clipboard) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(message);
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      showToast(message);
    })
    .catch(() => {
      showToast('Failed to copy. Please copy manually.');
    });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* --------------------------------------------------------------------------
   6. Contact Form Handler (Opens Mail Client + Toast)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const mailtoUrl = `mailto:omkarrajamane593@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Omkar,\n\n${message}\n\nFrom: ${name} (${email})`)}`;

    window.location.href = mailtoUrl;
    showToast('Opening your email client...');
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   7. Smooth Scroll Reveal (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll(
    '.about-card, .stat-box, .skill-group, .project-card, .timeline-item, .edu-card, .cert-card, .contact-card, .contact-form-column'
  );

  elementsToReveal.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elementsToReveal.forEach(el => revealObserver.observe(el));
  } else {
    elementsToReveal.forEach(el => el.classList.add('active'));
  }
}

/* --------------------------------------------------------------------------
   8. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   9. Dynamic Copyright Year
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
