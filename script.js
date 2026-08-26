/**
 * Omkar Rajamane - Portfolio JavaScript Engine
 * Clean, lightweight, and modern interactive logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavbarScrollSpy();
  initMobileMenu();
  initClipboardActions();
  initContactForm();
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

  window.addEventListener('scroll', handleScroll);
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
   4. Copy to Clipboard Actions (Email, Phone, Code)
   -------------------------------------------------------------------------- */
function initClipboardActions() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const terminalCopyBtn = document.getElementById('terminal-copy-btn');
  const copyButtons = document.querySelectorAll('.copy-btn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email');
      copyToClipboard(email, 'Email copied to clipboard!');
    });
  }

  if (terminalCopyBtn) {
    terminalCopyBtn.addEventListener('click', () => {
      const codeSnippet = `const engineer = {
  name: "Omkar Rajamane",
  degree: "B.E. Computer Science (2026)",
  college: "Jain College of Engineering",
  cgpa: 8.22,
  location: "Belagavi, Karnataka",
  primaryStack: ["Python", "React", "Node.js", "MySQL", "Flask", "OpenCV"],
  availableForHire: true
};`;
      copyToClipboard(codeSnippet, 'Profile code copied to clipboard!');
    });
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      copyToClipboard(textToCopy, `Copied "${textToCopy}" to clipboard!`);
    });
  });
}

function copyToClipboard(text, message = 'Copied to clipboard!') {
  if (!navigator.clipboard) {
    // Fallback for older browsers
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
   5. Contact Form Handler (Opens Mail Client + Toast)
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
   6. Dynamic Copyright Year
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
