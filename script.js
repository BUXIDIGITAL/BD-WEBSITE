// ===================================
// Mobile Menu Toggle
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileMenuToggle || !navLinks) return;

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
});

// ===================================
// Interactive Particle Background (Enhanced)
// ===================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isAnimating = true;
        this.width = 0;
        this.height = 0;
        
        // Mobile detection and performance optimization
        this.isMobile = window.innerWidth <= 768;
        this.particleCount = this.isMobile ? 30 : 80; // Reduce particles on mobile
        this.mouse = { x: null, y: null, radius: 150 };
        this.connectionDistance = this.isMobile ? 80 : 120;
        
        this.resizeCanvas();
        this.init();
        
        // Event listeners
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.init();
        });
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
        // Use devicePixelRatio for crisp rendering, but keep drawing coordinates in CSS pixels
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.width = Math.max(1, rect.width);
        this.height = Math.max(1, rect.height);

        this.canvas.width = Math.max(1, Math.floor(this.width * dpr));
        this.canvas.height = Math.max(1, Math.floor(this.height * dpr));

        // Reset any prior transforms to avoid cumulative scaling
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.width, this.height));
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
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(particle => {
            particle.update(this.width, this.height, this.mouse);
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
    
    if (canvas && !isMobile && !prefersReducedMotion) new ParticleSystem(canvas);
    
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
document.addEventListener('DOMContentLoaded', () => {
    const messageTextarea = document.getElementById('message');
    const charCountSpan = document.getElementById('char-count');
    
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
});