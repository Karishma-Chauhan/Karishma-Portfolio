// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0;
let isScrolling = false;
let lastScrollTop = 0;

// Typing animation texts for hero section
const typingTexts = [
    'Full Stack Developer',
    'Social Media Manager',
    'Digital Strategist',
    'Web Developer',
    'Content Creator',
    'UI/UX Designer'
];

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== MAIN INITIALIZATION =====
function initializeApp() {
    initializeLoadingScreen();
    initializeNavigation();
    initializeTypingAnimation();
    initializeScrollAnimations();
    initializeCounterAnimations();
    initializeSkillBars();
    initializeNewSkillsAnimations(); // New skills animations
    initializeRadarChart(); // New radar chart
    initializePortfolioFilter();
    initializeTestimonialSlider();
    initializeContactForm();
    initializeThemeToggle();
    initializeBackToTop();
    initializeSmoothScrolling();
    initializeIntersectionObserver();
    initializeParallaxEffects();
    initializePreloader();

    setTimeout(() => {
        initializeAOS();
        hideLoadingScreen();
    }, 1000);
}

// ===== LOADING SCREEN =====
function initializeLoadingScreen() {
    const loadingScreen = $('#loading-screen');
    if (!loadingScreen) return;

    const letters = $$('.letter');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.1}s`;
    });
}

function hideLoadingScreen() {
    const loadingScreen = $('#loading-screen');
    if (!loadingScreen) return;

    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger');
    const navMenu = $('#nav-menu');
    const navLinks = $$('.nav-link');

    if (!navbar || !hamburger || !navMenu) return;

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Navbar scroll behavior
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
        updateActiveNavLink();
    }, 100));
}

// Active navigation link update
function updateActiveNavLink() {
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 200;
    const navLinks = $$('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = $(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// ===== TYPING ANIMATION =====
function initializeTypingAnimation() {
    const typingElement = $('#typing-text');
    if (!typingElement) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
        const currentText = typingTexts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typingSpeed = 500;
        }

        setTimeout(typeWriter, typingSpeed);
    }

    setTimeout(typeWriter, 1000);
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const animatedElements = $$('[data-aos]');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== COUNTER ANIMATIONS =====
function initializeCounterAnimations() {
    const counters = $$('[data-count]');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = (target >= 100 ? Math.floor(current) + '+' : Math.floor(current));
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });

        hasAnimated = true;
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.hero-stats'));
    }
}

// ===== SKILL BARS ANIMATION =====
function initializeSkillBars() {
    const skillBars = $$('.skill-progress');
    let hasAnimated = false;

    const animateSkillBars = () => {
        if (hasAnimated) return;

        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, Math.random() * 1000);
        });

        hasAnimated = true;
    };

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    });

    const skillsSection = $('#skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// ===== NEW SKILLS ANIMATIONS =====
function initializeNewSkillsAnimations() {
    const modernSkillBars = $$('.skill-progress-modern-fill');
    let skillsAnimated = false;

    const animateModernSkillBars = () => {
        if (skillsAnimated) return;

        modernSkillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 200);
        });

        skillsAnimated = true;
    };

    // Hexagon hover effects
    const hexagons = $$('.skill-hexagon');
    hexagons.forEach(hexagon => {
        hexagon.addEventListener('mouseenter', () => {
            hexagon.style.transform = 'scale(1.1) rotate(5deg)';
        });

        hexagon.addEventListener('mouseleave', () => {
            hexagon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Tool cards hover effects
    const toolCards = $$('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateY(-4px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateY(0)';
        });
    });

    // Observe skills section for animations
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateModernSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    });

    const skillsSection = $('#skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// ===== RADAR CHART ANIMATION =====
function initializeRadarChart() {
    const radarPoints = $$('.radar-point');
    const radarArea = $('#radar-area');

    if (!radarPoints.length || !radarArea) return;

    // Animate radar points on scroll
    const radarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate points appearing
                radarPoints.forEach((point, index) => {
                    setTimeout(() => {
                        point.style.opacity = '1';
                        point.style.transform = `translate(-50%, -50%) rotate(${point.style.getPropertyValue('--angle')}) scale(1)`;
                    }, index * 200);
                });

                // Animate radar area
                setTimeout(() => {
                    radarArea.style.opacity = '0.3';
                }, 800);

                radarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const radarChart = $('#radar-chart');
    if (radarChart) {
        // Initially hide points
        radarPoints.forEach(point => {
            point.style.opacity = '0';
            point.style.transform = `translate(-50%, -50%) rotate(${point.style.getPropertyValue('--angle')}) scale(0)`;
        });

        radarArea.style.opacity = '0';
        radarObserver.observe(radarChart);
    }

    // Interactive radar points
    radarPoints.forEach(point => {
        const marker = point.querySelector('.point-marker');
        const label = point.querySelector('.point-label');

        if (marker && label) {
            point.addEventListener('mouseenter', () => {
                marker.style.transform = 'translateY(-180px) scale(1.5)';
                label.style.transform = 'translateX(-50%) rotate(calc(-1 * var(--angle))) scale(1.1)';
            });

            point.addEventListener('mouseleave', () => {
                marker.style.transform = 'translateY(-180px) scale(1)';
                label.style.transform = 'translateX(-50%) rotate(calc(-1 * var(--angle))) scale(1)';
            });
        }
    });
}

// ===== PORTFOLIO FILTER =====
function initializePortfolioFilter() {
    const filterBtns = $$('.filter-btn');
    const portfolioItems = $$('.portfolio-item');

    if (!filterBtns.length || !portfolioItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hide');
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.classList.add('hide');
                }
            });

            // Cleanup animation after play
            setTimeout(() => {
                portfolioItems.forEach(item => {
                    item.style.animation = '';
                });
            }, 600);
        });
    });
}

// ===== TESTIMONIAL SLIDER =====
function initializeTestimonialSlider() {
    const track = $('#testimonial-track');
    const slides = $$('.testimonial-slide');
    const prevBtn = $('#prev-testimonial');
    const nextBtn = $('#next-testimonial');
    const dots = $$('.dot');

    if (!track || slides.length === 0) return;

    const totalSlides = slides.length;

    function updateSlider() {
        const translateX = -currentTestimonial * 100;
        track.style.transform = `translateX(${translateX}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
    }

    function nextSlide() {
        currentTestimonial = (currentTestimonial + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentTestimonial = (currentTestimonial - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            updateSlider();
        });
    });

    // Auto-play testimonials every 5 seconds
    setInterval(nextSlide, 5000);

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }

        isDragging = false;
    });

    updateSlider();
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const nameInput = $('#name');
    const emailInput = $('#email');
    const serviceSelect = $('#service');
    const messageTextarea = $('#message');
    const submitBtn = form.querySelector('.btn');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.form-error');
        if (existingError) existingError.remove();

        const error = document.createElement('div');
        error.className = 'form-error';
        error.style.color = 'var(--danger-color)';
        error.style.fontSize = 'var(--text-sm)';
        error.style.marginTop = 'var(--space-2)';
        error.textContent = message;
        formGroup.appendChild(error);
    }

    function clearErrors() {
        $$('.form-error').forEach(error => error.remove());
    }

    function validateForm() {
        clearErrors();
        let isValid = true;

        if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters long');
            isValid = false;
        }

        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        if (!serviceSelect.value) {
            showError(serviceSelect, 'Please select a service');
            isValid = false;
        }

        if (messageTextarea.value.trim().length < 10) {
            showError(messageTextarea, 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    function showSuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.style.background = 'var(--accent-color)';
        successMsg.style.color = 'white';
        successMsg.style.padding = 'var(--space-4)';
        successMsg.style.borderRadius = 'var(--radius-md)';
        successMsg.style.marginTop = 'var(--space-4)';
        successMsg.textContent = 'Thank you! Your message has been sent successfully.';
        form.appendChild(successMsg);

        setTimeout(() => { successMsg.remove(); }, 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate API call - replace with actual submission logic
            await new Promise(resolve => setTimeout(resolve, 2000));
            showSuccess();
            form.reset();
        } catch {
            showError(form, 'Something went wrong. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Real-time validation on blur
    [nameInput, emailInput, messageTextarea, serviceSelect].forEach(input => {
        if (input) {
            input.addEventListener('blur', validateForm);
        }
    });
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    const themeToggle = $('#theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = (theme === 'dark') ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ===== BACK TO TOP =====
function initializeBackToTop() {
    const backToTopBtn = $('#back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, 100));

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = $$('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = $(`#${targetId}`);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Adjust for fixed navbar height
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// ===== INTERSECTION OBSERVER for animations =====
function initializeIntersectionObserver() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }

                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animation target elements
    $$('section, .fade-in, .slide-in-left, .slide-in-right, .zoom-in, .rotate-in, .skill-item, .stat').forEach(el => {
        observer.observe(el);
    });
}

// Animate individual skill bar (used by IntersectionObserver)
function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    if (progressBar && !progressBar.classList.contains('animated')) {
        const width = progressBar.getAttribute('data-width');
        setTimeout(() => {
            progressBar.style.width = width + '%';
            progressBar.classList.add('animated');
        }, Math.random() * 500);
    }
}

// Animate individual counter (used by IntersectionObserver)
function animateCounter(statElement) {
    const counter = statElement.querySelector('[data-count]');
    if (counter && !counter.classList.contains('animated')) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = (target >= 100 ? Math.floor(current) + '+' : Math.floor(current));
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
                counter.classList.add('animated');
            }
        };

        updateCounter();
    }
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    const parallaxElements = $$('.hero-bg-elements .floating-shape');

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach((el, index) => {
            const speed = (index + 1) * 0.2;
            el.style.transform = `translateY(${rate * speed}px)`;
        });
    }, 16));
}

// ===== PRELOADER =====
function initializePreloader() {
    window.addEventListener('load', () => {
        setTimeout(hideLoadingScreen, 500);
    });
}

// ===== AOS (Animate on Scroll) Initialization =====
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Lazy Loading Images
function initializeLazyLoading() {
    const images = $$('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Dynamic Year Update
function updateCopyrightYear() {
    const yearElements = $$('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Social Media Share Functions
function shareOnSocialMedia(platform, url = window.location.href, text = 'Check out this amazing portfolio!') {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Send analytics data if needed
        if (loadTime > 3000) {
            console.warn('Page load time is slow. Consider optimizing.');
        }
    });
    
    // Monitor scroll performance
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            // Scroll ended
        }, 150);
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You can send error reports to your analytics service here
});

// Keyboard Navigation Support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes modals/menus
        if (e.key === 'Escape') {
            const hamburger = $('#hamburger');
            const navMenu = $('#nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Arrow keys for testimonial navigation
        if (e.key === 'ArrowLeft') {
            const prevBtn = $('#prev-testimonial');
            if (prevBtn) prevBtn.click();
        }
        
        if (e.key === 'ArrowRight') {
            const nextBtn = $('#next-testimonial');
            if (nextBtn) nextBtn.click();
        }
    });
}

// Initialize additional features on load
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    updateCopyrightYear();
    initializePerformanceMonitoring();
    initializeKeyboardNavigation();
});

// Console welcome message
console.log('%c🚀 Welcome to My Portfolio!', 'color: #2563eb; font-size: 24px; font-weight: bold;');
console.log('%cFull Stack Developer & Social Media Manager', 'color: #f59e0b; font-size: 16px;');
console.log('%cInterested in working together? Contact me!', 'color: #10b981; font-size: 14px;');

// Export functions for global access if needed
window.portfolioJS = {
    shareOnSocialMedia,
    updateActiveNavLink,
    initializeAOS
};


const form = document.getElementById('contact-form');
const statusText = document.getElementById('form-status');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Show loading spinner
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline-block';

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    // Hide spinner
    btnText.style.display = 'inline-block';
    btnLoading.style.display = 'none';

    if (response.ok) {
      statusText.textContent = "Thanks for contacting me! I’ll review your message and respond shortly.";
      statusText.className = "form-status success";
      form.reset();
    } else {
      statusText.textContent = "Oops! Something went wrong. Please try again.";
      statusText.className = "form-status error";
    }
  } catch (error) {
    statusText.textContent = "Network error. Please check your connection.";
    statusText.className = "form-status error";
  }
});

document.querySelectorAll('.getintouch').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('contact-form').scrollIntoView({
            behavior: 'smooth'
        });
    });
});