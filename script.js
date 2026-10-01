/**
 * Jayasurya B - Portfolio Interactive Scripts
 * Features: Dark/Light Mode, Project Filters, Copy-to-Clipboard,
 * Active Nav Spy, Contact Form Validation, Resume Modal, Toast System
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Toast Notification System
  // =========================================================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    const iconSvg = type === 'success'
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#06b6d4" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // =========================================================================
  // 2. Theme Switcher (Dark / Light Mode)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('jb_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('jb_theme', newTheme);
      showToast(`Switched to ${newTheme} theme`, 'info', 2000);
    });
  }

  // =========================================================================
  // 3. Navbar Sticky Effect & Active Link Scroll Spy
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');

  // Sticky Navbar class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy for Nav links
    let currentSection = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 4. Project Filter Buttons
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. Copy to Clipboard Utility
  // =========================================================================
  const copyTriggers = document.querySelectorAll('.copy-trigger');

  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = trigger.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`, 'success');
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied to clipboard: ${text}`, 'success');
    } catch (err) {
      showToast('Could not copy automatically', 'info');
    }
    document.body.removeChild(textArea);
  }

  // =========================================================================
  // 6. Resume Modal Functionality
  // =========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const viewResumeNavBtn = document.getElementById('view-resume-nav-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const closeResumeModalBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (viewResumeNavBtn) viewResumeNavBtn.addEventListener('click', openResumeModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResumeModal);
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);

  // Close when clicking modal backdrop
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
      closeResumeModal();
    }
  });

  // Print Resume action
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // =========================================================================
  // 7. Interactive Contact Form Validation & Submission
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (messageError) messageError.textContent = '';

      // Validate Name
      if (!nameInput.value.trim()) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        if (emailError) emailError.textContent = 'Please provide an email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        if (messageError) messageError.textContent = 'Please enter a message with at least 10 characters.';
        isValid = false;
      }

      if (!isValid) return;

      // Animate Loading State
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const userSubject = subjectInput && subjectInput.value.trim()
        ? subjectInput.value.trim()
        : `New Portfolio Message from ${nameInput.value.trim()}`;

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: userSubject,
        message: messageInput.value.trim(),
        _subject: `[Portfolio] ${userSubject}`,
        _template: 'table',
        _captcha: 'false'
      };

      // Check if browsing via local file:// protocol
      // FormSubmit requires an HTTP/HTTPS web server; on file:// we directly open Gmail compose
      if (window.location.protocol === 'file:') {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();

        const encodedSubject = encodeURIComponent(userSubject);
        const encodedBody = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=jayasuryabhr@gmail.com&su=${encodedSubject}&body=${encodedBody}`;

        showToast('Opening Gmail with your message ready to send...', 'info', 5000);
        window.open(gmailUrl, '_blank');
        return;
      }

      // Send to FormSubmit AJAX endpoint for delivery to jayasuryabhr@gmail.com
      fetch('https://formsubmit.co/ajax/jayasuryabhr@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        if (data.success === 'true' || data.success === true) {
          contactForm.reset();
          showToast('Message sent successfully! Check your email inbox.', 'success', 5000);
        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          showToast('Form activation required: Check jayasuryabhr@gmail.com for the activation email!', 'info', 7000);
        } else {
          showToast(data.message || 'Message processed.', 'info', 5000);
        }
      })
      .catch(error => {
        console.error('Submission error:', error);
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Fallback: Open Gmail compose
        const encodedSubject = encodeURIComponent(userSubject);
        const encodedBody = encodeURIComponent(`From: ${payload.name} (${payload.email})\n\nMessage:\n${payload.message}`);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=jayasuryabhr@gmail.com&su=${encodedSubject}&body=${encodedBody}`;

        showToast('Connecting via Gmail...', 'info', 4000);
        window.open(gmailUrl, '_blank');
      });
    });
  }

  // =========================================================================
  // 8. Back to Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 9. Subtle Scroll Reveal Animations
  // =========================================================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.glass-card, .timeline-item, .project-card, .metric-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // Add the CSS class logic for reveal
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(styleSheet);

});
