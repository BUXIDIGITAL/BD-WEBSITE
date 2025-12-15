// ===================================
// Mobile Menu Toggle
// ===================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===================================
// Interactive Particle Background (Enhanced)
// ===================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isAnimating = true;
        
        // Mobile detection and performance optimization
        this.isMobile = window.innerWidth <= 768;
        this.particleCount = this.isMobile ? 30 : 80; // Reduce particles on mobile
        this.mouse = { x: null, y: null, radius: 150 };
        this.connectionDistance = this.isMobile ? 80 : 120;
        
        this.resizeCanvas();
        this.init();
        
        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Pause animation when tab is hidden to prevent crashes
        document.addEventListener('visibilitychange', () => {
            this.isAnimating = !document.hidden;
            if (this.isAnimating) {
                this.animate();
            }
        });
        
        // Start animation
        this.animate();
    }
    
    resizeCanvas() {
        // Use devicePixelRatio for proper rendering on high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        // Update canvas display size
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    connect() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        if (!this.isAnimating) return; // Stop animation if tab is hidden
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update(this.canvas.width, this.canvas.height, this.mouse);
            particle.draw(this.ctx);
        });
        
        this.connect();
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 0.5; // Varying sizes
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 10;
        this.vx = (Math.random() - 0.5) * (Math.random() * 2 + 0.2); // Varying speeds
        this.vy = (Math.random() - 0.5) * (Math.random() * 2 + 0.2);
        this.isShooting = Math.random() > 0.98; // Rare shooting stars
        this.shootingSpeed = Math.random() * 3 + 2;
        this.trail = [];
        this.maxTrailLength = 10;
    }
    
    draw(ctx) {
        const isMobile = window.innerWidth <= 768;
        
        // Draw trail for shooting stars (disabled on mobile for performance)
        if (!isMobile && this.isShooting && this.trail.length > 0) {
            for (let i = 0; i < this.trail.length; i++) {
                const alpha = (i / this.trail.length) * 0.5;
                ctx.fillStyle = `rgba(255, 184, 0, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Main particle with gradient colors
        const colors = this.isShooting 
            ? 'rgba(255, 184, 0, 0.8)' 
            : `rgba(0, 212, 255, ${0.4 + Math.random() * 0.3})`;
        ctx.fillStyle = colors;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Enhanced glow effect (disabled on mobile for performance)
        if (!isMobile) {
            const glowIntensity = this.isShooting ? 20 : 10;
            const glowColor = this.isShooting ? 'rgba(255, 184, 0, 0.6)' : 'rgba(0, 212, 255, 0.5)';
            ctx.shadowBlur = glowIntensity;
            ctx.shadowColor = glowColor;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    update(canvasWidth, canvasHeight, mouse) {
        // Shooting star behavior
        if (this.isShooting) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
            
            this.x += this.vx * this.shootingSpeed;
            this.y += this.vy * this.shootingSpeed;
            
            // Reset shooting star if out of bounds
            if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight) {
                this.isShooting = false;
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.trail = [];
            }
            return;
        }
        
        // Boundary check with bounce
        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
        
        // Mouse interaction - attract particles
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            
            if (distance < mouse.radius) {
                const directionX = forceDirectionX * force * this.density * 0.5;
                const directionY = forceDirectionY * force * this.density * 0.5;
                this.x -= directionX;
                this.y -= directionY;
            }
        } else {
            // Return to base position
            if (this.x !== this.baseX) {
                const dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                const dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }
        
        // Move particles
        this.x += this.vx;
        this.y += this.vy;
    }
}

// ===================================
// Smooth Scroll & Navigation
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system only on desktop and when motion is not reduced
    const canvas = document.getElementById('particle-canvas');
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (canvas && !isMobile && !prefersReducedMotion) {
        new ParticleSystem(canvas);
    } else if (canvas && isMobile) {
        // Initialize with reduced settings on mobile
        new ParticleSystem(canvas);
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // For service cards, add stagger effect
            if (entry.target.classList.contains('service-card')) {
                const cards = document.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .section-header, .cta-content');
    animatedElements.forEach(el => observer.observe(el));
});

// ===================================
// Service Card Hover Effects
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Add parallax effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});

// ===================================
// Gradient Orb Animation Enhancement
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    // Add mouse move parallax effect to orbs
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;

            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});

// ===================================
// Button Ripple Effect
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Stats Counter Animation
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        if (animated) return;

        stats.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const number = parseInt(text.replace(/\D/g, ''));
            const duration = 2000;
            const increment = number / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < number) {
                    stat.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = text;
                }
            };

            updateCounter();
        });

        animated = true;
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

// ===================================
// Scroll Progress Indicator
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #0066ff);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});

// ===================================
// Lazy Loading Images (if any added later)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// ===================================
// Performance Optimization
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
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

// Throttle function for mouse move events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Console Welcome Message
// ===================================

console.log(
    '%c🚀 BUXI DIGITAL',
    'font-size: 24px; font-weight: bold; color: #00d4ff; text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);'
);
console.log(
    '%cBuild, Automate, and Scale — All in One Digital Partner',
    'font-size: 14px; color: #8892b8;'
);
console.log(
    '%cInterested in working with us? Visit https://buxi.digital',
    'font-size: 12px; color: #b8c1ec;'
);

// ===================================
// Accessibility Enhancements
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                card.click();
            }
        });
    });

    // Announce page changes for screen readers
    const sections = document.querySelectorAll('section[id]');
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcer);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.getAttribute('id') || 'section';
                announcer.textContent = `Entered ${sectionName} section`;
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));
    
    // ===================================
    // Magnetic Buttons
    // ===================================
    
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Magnetic pull effect (limited to 15px)
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const pull = 1 - (distance / maxDistance);
                button.style.transform = `translate(${x * pull * 0.3}px, ${y * pull * 0.3}px)`;
            }
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
});

// ===================================
// Dark Mode Toggle (Optional Enhancement)
// ===================================

// Uncomment if you want to add a dark/light mode toggle
/*
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '🌙';
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        cursor: pointer;
        font-size: 1.5rem;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        toggleButton.innerHTML = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    });
    
    document.body.appendChild(toggleButton);
});
*/
// ===================================
// Contact Form Handling
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const messageTextarea = document.getElementById('message');
    const charCountSpan = document.getElementById('char-count');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');
    
    // Character counter for message textarea
    if (messageTextarea && charCountSpan) {
        messageTextarea.addEventListener('input', () => {
            const count = messageTextarea.value.length;
            charCountSpan.textContent = count;
            
            if (count > 1000) {
                charCountSpan.style.color = '#FF6B6B';
            } else {
                charCountSpan.style.color = '';
            }
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    successMessage.classList.add('show');
                    contactForm.reset();
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // Error
                    errorMessage.style.display = 'block';
                    errorMessage.classList.add('show');
                    
                    // Scroll to error message
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (error) {
                // Network error
                errorMessage.style.display = 'block';
                errorMessage.classList.add('show');
                
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});