document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    //  1. CUSTOM CURSOR BLOB
    // ============================================================
    const blob = document.getElementById('cursorBlob');
    const blobBlur = document.getElementById('cursorBlobBlur');
    let mouseX = 0, mouseY = 0;
    let blobX = 0, blobY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateBlob() {
        blobX += (mouseX - blobX) * 0.15;
        blobY += (mouseY - blobY) * 0.15;
        if (blob) {
            blob.style.left = blobX + 'px';
            blob.style.top = blobY + 'px';
        }
        if (blobBlur) {
            blobBlur.style.left = blobX + 'px';
            blobBlur.style.top = blobY + 'px';
        }
        requestAnimationFrame(animateBlob);
    }
    animateBlob();

    // Grow blob on interactive elements
    document.querySelectorAll('a, button, .btn, .btn-icon, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (blob) blob.classList.add('blob-grow');
        });
        el.addEventListener('mouseleave', () => {
            if (blob) blob.classList.remove('blob-grow');
        });
    });

    // ============================================================
    //  2. PARTICLE CANVAS BACKGROUND
    // ============================================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 60;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.15 + 0.05;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 0, 0, ${0.03 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ============================================================
    //  3. HAMBURGER MENU
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // ============================================================
    //  4. NAVBAR SCROLL & ACTIVE LINK
    // ============================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================================
    //  5. SCROLL REVEAL WITH INTERSECTION OBSERVER
    // ============================================================
    const scrollElements = document.querySelectorAll('[data-scroll]');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = delay + 'ms';
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    scrollElements.forEach(el => scrollObserver.observe(el));

    // ============================================================
    //  6. TYPEWRITER EFFECT
    // ============================================================
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = [
            'Software Development Engineer',
            'DevOps Enthusiast',
            'Backend Architect',
            'Open Source Contributor'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typewrite() {
            const current = phrases[phraseIndex];
            if (isDeleting) {
                typewriterEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typewriterEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === current.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(typewrite, typingSpeed);
        }
        setTimeout(typewrite, 1000);
    }

    // ============================================================
    //  7. COUNTER ANIMATION (Hero Stats)
    // ============================================================
    const counters = document.querySelectorAll('.stat-number');
    let countersDone = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersDone) {
                countersDone = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    function updateCount() {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            return;
                        }
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCount);
                    }
                    updateCount();
                });
            }
        });
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.hero-stats'));
    }

    // ============================================================
    //  8. 3D TILT EFFECT ON CARDS
    // ============================================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Move the card-glow to cursor position
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = x + 'px';
                glow.style.top = y + 'px';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // ============================================================
    //  9. MAGNETIC BUTTONS
    // ============================================================
    const magneticEls = document.querySelectorAll('.magnetic');

    magneticEls.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const strength = parseInt(el.dataset.strength) || 20;
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x / strength * 2}px, ${y / strength * 2}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ============================================================
    // 10. SMOOTH SCROLL FOR NAV LINKS
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
