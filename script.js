// DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const usernameField = document.getElementById('username-field');
    const passwordField = document.getElementById('password-field');
    const loginBtn = document.getElementById('login-btn');
    const loginForm = document.getElementById('login-form');
    const loginOverlay = document.getElementById('loginOverlay');
    const portfolioContent = document.getElementById('portfolioContent');
  
    // ---- Typewriter for login ----
    const usernames = ['aspen.fl on Instagram', 'aspenjjohnson on LinkedIn', 'AP4PresHQ'];
    let currentUsernameIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
  
    function typeUsername() {
      const currentUsername = usernames[currentUsernameIndex];
  
      if (!isDeleting) {
        usernameField.value = currentUsername.substring(0, currentCharIndex);
        currentCharIndex++;
        if (currentCharIndex > currentUsername.length) {
          if (currentUsernameIndex === usernames.length - 1) {
            setTimeout(typePassword, 500);
            return;
          }
          isDeleting = true;
          setTimeout(typeUsername, 1500);
          return;
        }
      } else {
        usernameField.value = currentUsername.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        if (currentCharIndex === 0) {
          isDeleting = false;
          currentUsernameIndex++;
          typingSpeed = 100;
        }
      }
      setTimeout(typeUsername, isDeleting ? 50 : typingSpeed);
    }
  
    function typePassword() {
      let dots = '';
      let dotCount = 0;
      const maxDots = 11;
      const passwordInterval = setInterval(() => {
        if (dotCount < maxDots) {
          dots += '•';
          passwordField.value = dots;
          dotCount++;
        } else {
          clearInterval(passwordInterval);
          setTimeout(() => {
            loginBtn.classList.add('show');
            setTimeout(() => {
              loginBtn.classList.add('active');
              loginBtn.setAttribute('aria-disabled', 'false');
            }, 300);
          }, 200);
        }
      }, 150);
    }
  
    setTimeout(typeUsername, 1000);
  
    // ---- Handle fake login ----
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!loginBtn.classList.contains('active')) return;
  
      loginOverlay.classList.add('hidden');
      portfolioContent.classList.add('active');
      portfolioContent.setAttribute('aria-hidden', 'false');
  
      initializePortfolio();
    });
  
    // ---- Portfolio initialization ----
    function initializePortfolio() {
      // Smooth nav + active state
      const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          if (!targetSection) return;
  
          navLinks.forEach(n => n.classList.remove('active'));
          link.classList.add('active');
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
  
      // Update active link on scroll
      window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(a => {
              a.classList.toggle('active', a.getAttribute('href') === `#${sectionId}`);
            });
          }
        });
      });
  
      // Add extra particles into the portfolio container
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        portfolioContent.appendChild(particle);
      }
  
      // Hide header on scroll down
      let lastScrollTop = 0;
      const header = document.querySelector('.header');
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        lastScrollTop = Math.max(scrollTop, 0);
      });
  
      // Fade-in cards on view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
      document.querySelectorAll('.glass-card').forEach((card, idx) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${idx * 0.06}s`;
        observer.observe(card);
      });
  
      // Library filter buttons
      const filterBtns = document.querySelectorAll('.filter-btn');
      const books = document.querySelectorAll('.book-card');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.filter;
          books.forEach(card => {
            const show = (cat === 'all') || (card.dataset.category === cat);
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }
  
    // ---- Global helpers for inline HTML handlers ----
    window.toggleProject = function(idPrefix) {
      const preview = document.getElementById(`${idPrefix}-preview`);
      const full = document.getElementById(`${idPrefix}-full`);
      const btn = document.querySelector(`button[onclick="toggleProject('${idPrefix}')"]`);
      if (!preview || !full || !btn) return;
  
      const isOpen = full.style.display !== 'none';
      full.style.display = isOpen ? 'none' : 'block';
      preview.style.display = isOpen ? 'block' : 'none';
      btn.textContent = isOpen ? 'Read More' : 'Show Less';
    };
  
    const blogPosts = {
      'physics-post': {
        title: 'The Beauty of Mathematical Physics',
        date: 'Aug 10, 2025',
        read: '6 min read',
        body: `
          <p>Hamiltonian mechanics reframes dynamics in terms of energy and symplectic geometry.
          This perspective turns complicated differential equations into elegant flows on phase space.</p>
          <p>In practice, canonical transformations preserve structure and make previously intractable systems tractable.</p>
        `
      },
      'basketball-post': {
        title: 'From Basketball Court to Trading Floor',
        date: 'Aug 5, 2025',
        read: '4 min read',
        body: `
          <p>Shot selection ↔ risk management. Tempo control ↔ volatility regimes. Film study ↔ post-trade reviews.
          Lessons from the court map surprisingly well onto markets.</p>
        `
      },
      'quantum-post': {
        title: 'My First Steps into Quantum Computing',
        date: 'Jul 28, 2025',
        read: '5 min read',
        body: `
          <p>Using AWS Braket to explore basic circuits and visualize Bloch sphere intuition for single-qubit rotations.</p>
        `
      },
      'ml-post': {
        title: 'Building My First ML Model',
        date: 'Jul 20, 2025',
        read: '5 min read',
        body: `
          <p>Data cleaning, feature engineering, and cross-validation formed the backbone of my first regression workflow.</p>
        `
      }
    };
  
    const sidePanel = document.getElementById('blogSidePanel');
    const sideBackdrop = document.getElementById('blogSidePanelBackdrop');
    const panelTitle = document.getElementById('blogPanelTitle');
    const panelDate = document.getElementById('blogPanelDate');
    const panelRead = document.getElementById('blogPanelReadTime');
    const panelBody = document.getElementById('blogPanelBody');
  
    window.openBlogPanel = function(key) {
      const post = blogPosts[key];
      if (!post) return;
      panelTitle.textContent = post.title;
      panelDate.textContent = post.date;
      panelRead.textContent = post.read;
      panelBody.innerHTML = post.body;
  
      sidePanel.classList.add('open');
      sideBackdrop.classList.add('open');
      sidePanel.setAttribute('aria-hidden', 'false');
      sideBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
  
    window.closeBlogPanel = function() {
      sidePanel.classList.remove('open');
      sideBackdrop.classList.remove('open');
      sidePanel.setAttribute('aria-hidden', 'true');
      sideBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
  
    // Prevent manual typing during animation demo
    usernameField.addEventListener('keydown', (e) => e.preventDefault());
    passwordField.addEventListener('keydown', (e) => e.preventDefault());
  });
  