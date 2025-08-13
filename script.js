 // Page Navigation
 const navLinks = document.querySelectorAll('.nav-links a');
 const pages = document.querySelectorAll('.page');
 
 navLinks.forEach(link => {
     link.addEventListener('click', (e) => {
         e.preventDefault();
         
         const targetPage = link.dataset.page;
         
         // Update active nav link
         navLinks.forEach(nav => nav.classList.remove('active'));
         link.classList.add('active');
         
         // Handle page transitions
         pages.forEach(page => {
             page.classList.remove('active', 'prev');
             if (page.id === targetPage) {
                 page.classList.add('active');
             } else if (page.classList.contains('active')) {
                 page.classList.add('prev');
             }
         });
         
         // Set new active page
         document.getElementById(targetPage).classList.add('active');
     });
 });

 // Library Filtering
 const filterBtns = document.querySelectorAll('.filter-btn');
 const bookCards = document.querySelectorAll('.book-card');
 
 filterBtns.forEach(btn => {
     btn.addEventListener('click', () => {
         const filter = btn.dataset.filter;
         
         // Update active filter button
         filterBtns.forEach(b => b.classList.remove('active'));
         btn.classList.add('active');
         
         // Filter books with animation
         bookCards.forEach(card => {
             card.style.transform = 'scale(0.8)';
             card.style.opacity = '0';
             
             setTimeout(() => {
                 if (filter === 'all' || card.dataset.category.includes(filter)) {
                     card.style.display = 'block';
                     setTimeout(() => {
                         card.style.transform = 'scale(1)';
                         card.style.opacity = '1';
                     }, 50);
                 } else {
                     card.style.display = 'none';
                 }
             }, 200);
         });
     });
 });

 // Create additional floating particles
 function createParticles() {
     for (let i = 0; i < 10; i++) {
         const particle = document.createElement('div');
         particle.className = 'particle';
         particle.style.left = Math.random() * 100 + '%';
         particle.style.animationDelay = Math.random() * 15 + 's';
         particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
         document.body.appendChild(particle);
     }
 }

 // Initialize
 document.addEventListener('DOMContentLoaded', () => {
     createParticles();
     
     // Add smooth transitions to all cards
     const cards = document.querySelectorAll('.card, .book-card, .blog-card, .contact-card');
     cards.forEach(card => {
         card.style.transition = 'all 0.3s ease, transform 0.3s ease, opacity 0.3s ease';
     });
 });

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
     
     lastScrollTop = scrollTop;
 });