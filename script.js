 // Login Animation Script
 const usernameField = document.getElementById('username-field');
 const passwordField = document.getElementById('password-field');
 const loginBtn = document.getElementById('login-btn');
 const loginForm = document.getElementById('login-form');
 const loginOverlay = document.getElementById('loginOverlay');
 const portfolioContent = document.getElementById('portfolioContent');

 const usernames = [
     'aspen.fl on Instagram',
     'aspenjjohnson on LinkedIn',
     'AP4PresHQ'
 ];

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
                 setTimeout(() => typePassword(), 500);
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
                 }, 300);
             }, 200);
         }
     }, 150);
 }

 // Start the animation after a short delay
 setTimeout(() => {
     typeUsername();
 }, 1000);

 // Handle form submission
 loginForm.addEventListener('submit', (e) => {
     e.preventDefault();
     if (loginBtn.classList.contains('active')) {
         // Fade out login overlay
         loginOverlay.classList.add('hidden');
         
         // Show portfolio content
         setTimeout(() => {
             portfolioContent.classList.add('active');
             initializePortfolio();
         }, 500);
     }
 });

 // Portfolio initialization function
 function initializePortfolio() {
     // Smooth scrolling navigation
     const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

     navLinks.forEach(link => {
         link.addEventListener('click', (e) => {
             e.preventDefault();
             
             const targetId = link.getAttribute('href');
             const targetSection = document.querySelector(targetId);
             
             if (targetSection) {
                 navLinks.forEach(nav => nav.classList.remove('active'));
                 link.classList.add('active');
                 
                 targetSection.scrollIntoView({
                     behavior: 'smooth',
                     block: 'start'
                 });
             }
         });
     });

     // Update active nav link on scroll
     window.addEventListener('scroll', () => {
         const sections = document.querySelectorAll('.section');
         const scrollPosition = window.scrollY + 100;
         
         sections.forEach(section => {
             const sectionTop = section.offsetTop;
             const sectionHeight = section.offsetHeight;
             const sectionId = section.getAttribute('id');
             
             if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                 navLinks.forEach(link => {
                     link.classList.remove('active');
                     if (link.getAttribute('href') === `#${sectionId}`) {
                         link.classList.add('active');
                     }
                 });
             }
         });
     });

     // Create additional particles
     for (let i = 0; i < 12; i++) {
         const particle = document.createElement('div');
         particle.className = 'particle';
         particle.style.left = Math.random() * 100 + '%';
         particle.style.animationDelay = Math.random() * 20 + 's';
         particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
         portfolioContent.appendChild(particle);
     }

     // Header scroll effect
     let lastScrollTop = 0;
     const header = document.querySelector('.header');

     window.addEventListener('scroll', () => {
         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
         
         if (scrollTop > lastScrollTop && scrollTop > 100) {
             header.style.transform = 'translateY(-100%)';
         } else {
             header.style.transform = 'translateY(0)';
         }
         
         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
     });

     // Intersection Observer for animations
     const observerOptions = {
         threshold: 0.1,
         rootMargin: '0px 0px -50px 0px'
     };

     const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
             if (entry.isIntersecting) {
                 entry.target.style.opacity = '1';
                 entry.target.style.transform = 'translateY(0)';
             }
         });
     }, observerOptions);

     // Add smooth transitions to cards
     const cards = document.querySelectorAll('.glass-card');
     cards.forEach((card, index) => {
         card.style.opacity = '0';
         card.style.transform = 'translateY(20px)';
         card.style.transition = 'all 0.6s ease';
         card.style.transitionDelay = `${index * 0.1}s`;
         observer.observe(card);
     });
 }

 // Prevent input while animation is running
 usernameField.addEventListener('keydown', (e) => e.preventDefault());
 passwordField.addEventListener('keydown', (e) => e.preventDefault());