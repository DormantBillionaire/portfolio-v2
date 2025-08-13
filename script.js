// Page Navigation with scroll reset
const navLinks = document.querySelectorAll('.nav-links a[data-page]');
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
                setTimeout(() => {
                    page.classList.add('active');
                    // Reset scroll position to top when switching pages
                    page.scrollTop = 0;
                }, 50);
            } else if (page.classList.contains('active')) {
                page.classList.add('prev');
            }
        });
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

// Project Toggle Functionality
function toggleProject(projectId) {
    const preview = document.getElementById(projectId + '-preview');
    const full = document.getElementById(projectId + '-full');
    const button = event.target;
    
    if (preview.style.display === 'none') {
        preview.style.display = 'block';
        full.style.display = 'none';
        button.textContent = 'Read More';
    } else {
        preview.style.display = 'none';
        full.style.display = 'block';
        button.textContent = 'Show Less';
    }
}

// Create additional floating particles dynamically
function createParticles() {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        document.body.appendChild(particle);
    }
}

// Header scroll effect - modified for page-specific scrolling
let lastScrollTop = 0;
const header = document.querySelector('.header');

// Add scroll listener to each page individually
pages.forEach(page => {
    page.addEventListener('scroll', () => {
        const scrollTop = page.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});

// Also keep window scroll for fallback
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Smooth scroll behavior for any internal links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add intersection observer for animations
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create floating particles
    createParticles();
    
    // Add smooth transitions to cards
    const cards = document.querySelectorAll('.experience-card, .skill-category, .book-card, .blog-card, .contact-link');
    cards.forEach(card => {
        card.style.transition = 'all 0.3s ease, transform 0.3s ease, opacity 0.3s ease';
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        // Observe for intersection
        observer.observe(card);
    });
    
    // Add staggered animation delay to cards in grids
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
    
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Trigger initial animation for visible elements
    setTimeout(() => {
        const visibleCards = document.querySelectorAll('#home .welcome-content');
        visibleCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 300);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any expanded projects
        const expandedPreviews = document.querySelectorAll('.project-preview[style*="display: none"]');
        expandedPreviews.forEach(preview => {
            const projectId = preview.id.replace('-preview', '');
            toggleProject(projectId);
        });
    }
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
});

function handleGesture() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped up - could trigger next section
            console.log('Swiped up');
        } else {
            // Swiped down - could trigger previous section
            console.log('Swiped down');
        }
    }
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll event
const throttledScrollHandler = throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, 100);

window.addEventListener('scroll', throttledScrollHandler);

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Start particle animations after load
    setTimeout(() => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.opacity = '0.6';
        });
    }, 500);
});

// Add focus management for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});

// Add error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

function safeQuerySelectorAll(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        console.warn(`No elements found: ${selector}`);
    }
    return elements;
}