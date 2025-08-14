// DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const usernameField = document.getElementById('username-field');
    const passwordField = document.getElementById('password-field');
    const loginBtn = document.getElementById('login-btn');
    const loginForm = document.getElementById('login-form');
    const loginOverlay = document.getElementById('loginOverlay');
    const portfolioContent = document.getElementById('portfolioContent');

    // Force scroll to top on page load
    window.scrollTo(0, 0);
    
    // Prevent hash-based navigation on load
    if (window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
      window.scrollTo(0, 0);
    }

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
  
      // Ensure we start at home after login
      setTimeout(() => {
        window.scrollTo(0, 0);
        // Set home as active in navigation
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        navLinks.forEach(link => link.classList.remove('active'));
        const homeLink = document.querySelector('.nav-links a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
      }, 100);
      
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
      'life-post': {
        title: 'The Beauty of Starting Over',
        date: 'Aug 14, 2025',
        read: '10 min read',
        body: `
          <h2>Why Did I Quit Basketball?</h2>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;This question is one that I get often, and to be honest, I still battle with it deep down when the world is quiet and I'm not neck-deep in a project or coursework. I'm not a quitter by nature, and basketball has been one of the constants in my life no matter what was going on behind the scenes.</p>
          
          <p>&nbsp;&nbsp;&nbsp;&nbsp;When I was hit by a car on my bicycle my senior year, 3 months before my freshman semester in college, I was devastated. But had I not had to sit out, I don't know if I would have another perspective of Aspen to tell you about, apart from dribbling a ball and reading.</p>
          
          <div class="blog-image-container" style="margin: 20px 0; text-align: center;">
            <img src="images/gum-in-mouth.jpg" alt="Basketball memories" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
            <p style="font-style: italic; color: #ffffff; margin-top: 8px;">Stopped chewing gum during games, because it made me insanely out of breath</p>
          </div>
          
          <p>&nbsp;&nbsp;&nbsp;&nbsp;My choice to quit basketball was a manifestation of many things: falling out of love with the sport, imposter syndrome, and the <strong>insane</strong> desire to pursue something greater academically. I owe thanks to many people for supporting me throughout it all, and they know who they are—thank you for being there for me when I could not be there for myself.</p>

          <h2>The Interim</h2>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;Hopefully I don't get into trouble for what I am about to say, but yeah, losing a full scholarship is "tough" and "unimaginable." But imagine the constant dread of remaining in an environment, doing a thing that doesn't fulfill you, nor does it get you closer to your life's purpose?</p>
          
          <blockquote style="border-left: 4px solid #007acc; padding-left: 20px; margin: 20px 0; font-style: italic; color: #cccccc; background: rgba(0,122,204,0.1); padding: 15px; border-radius: 8px;">
            "I could've kept moving 2 steps forward, to go 5 steps backwards, or I could purchase an Uber and ride far far away and pivot in the next town."
          </blockquote>
          
          <p>&nbsp;&nbsp;&nbsp;&nbsp;This is exactly what I did. The coaching staff (shout out Coach B!) and I had a conversation and I settled on my decision, and they supported me. It's rare that you find people in life nowadays who care about you as a person more than the occupation or services you provide, so I'm thankful for the Mercer WBB office from top to bottom.</p>

          <h2>My Takeaways</h2> 
          <div style="background: rgba(0,122,204,0.15); padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #007acc;">
            <p style="margin: 0; color: #ffffff; font-weight: 500;">&nbsp;&nbsp;&nbsp;&nbsp;<strong>It is a chasing of heart, not a change of heart.</strong> Therefore, pursue that thing, business, person you want to pursue, as if you won't have the breath to do so tomorrow, because you may very well not.</p>
          </div>

          <h2>Closing Comments & The People Who Believed</h2>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;Don't wait for someone else to see the opportunity to make a change in the world. If you have the vision, make the glasses yourself. Below, I've included pictures of everyone who had the glasses to see me in a light that I refused to wear because I didn't think I had the "prerequisites"—thank you all!</p>
          
          <h3 style="margin-top: 30px; color: #007acc;">Family: My Foundation</h3>
          <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 20px 0;">
            <div class="photo-item" style="text-align: center;">
              <img src="images/jamali-and-i.png" alt="Aspen with her older sister Jamali" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">My older sister, Jamali</p>
            </div>
            <div class="photo-item" style="text-align: center;">
              <img src="images/smith-family.png" alt="The Smith family" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">Two ACLs later & they still tolerate me</p>
            </div>
            <div class="photo-item" style="text-align: center;">
              <img src="images/mom-sister.png" alt="Aspen with mom and sister" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">Motherhood is hard, but you made it look easy</p>
            </div>
            <div class="photo-item" style="text-align: center;">
              <img src="images/three-generations.png" alt="Three generations of family" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">Through family, I understand what unconditional love means</p>
            </div>
          </div>
          
          <h3 style="margin-top: 40px; color: #007acc;">Mentors & Lifelong Friends</h3>
          <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 20px 0;">
            <div class="photo-item" style="text-align: center;">
              <img src="images/maddie-and-I.png" alt="Aspen with Maddison Andrews" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">Maddison "Maddie" Andrews, enough said lol</p>
            </div>
            <div class="photo-item" style="text-align: center;">
              <img src="images/huddy.png" alt="Coach Hudson" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">My high school coach, Coach Hudson</p>
            </div>
            <div class="photo-item" style="text-align: center;">
              <img src="images/maria-ali.png" alt="Maria and Ali" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">Maria Bania and Ali Dali, te quiero mucho</p>
            </div>
          </div>

          <h3 style="margin-top: 40px; color: #007acc;">The College Journey</h3>
          <div class="photo-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 20px 0;">
            <div class="photo-item" style="text-align: center;">
              <img src="images/four-for-four-v2.png" alt="College friends group" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">I wouldn't have made it through freshman year without my girls + Maria</p>
            </div>
            <div class="photo-item" style="text-align: center;">
              <img src="images/freshys-and-I.png" alt="Junior year friends" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">Junior year was special because I had them! Love you, freshies</p>
            </div>
            <div class="photo-item" style="text-align: center;">
              <img src="images/the-squad.png" alt="The squad" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              <p style="margin-top: 12px; font-size: 14px; color: #ffffff; font-weight: 500;">The best of times was with these girls</p>
            </div>
          </div>
          
          <hr style="margin: 40px 0; border: none; height: 2px; background: linear-gradient(to right, transparent, #007acc, transparent);">
          
          <div style="text-align: center; background: rgba(0,122,204,0.1); padding: 25px; border-radius: 12px; margin: 20px 0;">
            <p style="font-style: italic; color: #ffffff; font-size: 18px; margin: 0; line-height: 1.6;">"The best time to plant a tree was 20 years ago. The second best time is now."</p>
            <p style="color: #cccccc; margin-top: 10px; font-size: 14px;">— Chinese Proverb</p>
          </div>
        `
      },

       /* 
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
        */
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