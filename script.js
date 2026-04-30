// ========================================
//  EcoPower - ODS 7 | JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    });

    // ===== PARTÍCULAS DE FONDO =====
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(252, 195, 11, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Líneas entre partículas cercanas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.strokeStyle = `rgba(252, 195, 11, ${0.05 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;

        // Navbar
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progress bar
        scrollProgress.style.width = scrollPercent + '%';

        // Back to top
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        updateActiveNav();
    });

    // ===== ACTIVE NAV LINK =====
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ===== NAV TOGGLE MOBILE =====
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== BACK TO TOP =====
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== CARRUSEL =====
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentSlide = 0;
    let autoSlideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            goToSlide(parseInt(indicator.dataset.slide));
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Swipe táctil para carrusel
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselEl = document.getElementById('carousel');

    carouselEl.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselEl.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoSlide();
        }
    });

    // ===== CONTADOR DE NÚMEROS =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .stat-big-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (counter.dataset.counted) return;
                    counter.dataset.counted = 'true';

                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };
                    updateCounter();
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
    animateCounters();

    // ===== BARRAS DE PROGRESO (METAS) =====
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.dataset.width;
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 300);
                }
            });
        }, { threshold: 0.3 });

        progressBars.forEach(bar => observer.observe(bar));
    }
    animateProgressBars();

    // ===== GOAL ITEMS (TIMELINE) =====
    function animateGoals() {
        const goalItems = document.querySelectorAll('.goal-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        goalItems.forEach(item => observer.observe(item));
    }
    animateGoals();

    // ===== REVEAL ON SCROLL =====
    function revealOnScroll() {
        const elements = document.querySelectorAll(
            '.team-card, .info-card, .importance-item, .stat-card, .renewable-card, .resource-card, .action-card'
        );

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index % 4 * 0.1}s`;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(el);
        });
    }
    revealOnScroll();

    // ===== TILT EFFECT EN TEAM CARDS =====
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            const inner = card.querySelector('.team-card-inner');
            inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.team-card-inner');
            inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== SMOOTH SCROLL PARA LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== KEYBOARD NAV PARA CARRUSEL =====
    document.addEventListener('keydown', (e) => {
        const carouselSection = document.getElementById('carrusel');
        const rect = carouselSection.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlide();
            }
        }
    });

    // ===== EFECTO PARALLAX EN HERO =====
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.scrollY;

        if (scrolled < window.innerHeight) {
            const floatingIcons = document.querySelectorAll('.floating-icon');
            floatingIcons.forEach((icon, index) => {
                const speed = (index + 1) * 0.05;
                icon.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });

    // ===== TYPING EFFECT EN HERO SUBTITLE =====
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        subtitle.style.borderRight = '2px solid var(--primary)';

        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                subtitle.textContent += originalText[i];
                i++;
                if (i >= originalText.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        subtitle.style.borderRight = 'none';
                    }, 1000);
                }
            }, 30);
        }, 2000);
    }

});