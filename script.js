

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio chargé avec succès!');
    
    initCurseur();
    initTypingEffect();
    initNavigation();
    initAOS();
    initCanvas3D();
    initParticles();
    initSmoothScroll();
    initScrollAnimations();
    initContactButtons();
});

// ========== CURSEUR PERSONNALISÉ ==========
function initCurseur() {
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    if (!cursor || !cursorDot) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        cursor.style.left = x - 15 + 'px';
        cursor.style.top = y - 15 + 'px';
        cursorDot.style.left = x - 4 + 'px';
        cursorDot.style.top = y - 4 + 'px';
    });

    // Hover sur les boutons et liens
    document.querySelectorAll('.btn, a, button, .contact-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorDot.style.transform = 'scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorDot.style.transform = 'scale(1)';
        });
    });

    // Cacher le curseur au départ
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.7';
        cursorDot.style.opacity = '1';
    });
}

// ========== TYPING EFFECT ==========
function initTypingEffect() {
    const textElement = document.querySelector('.typing-effect');
    if (!textElement) return;

    const texts = [
        'Étudiant en ingénierie robotique cobotique',
        'Passionné par la programmation embarquée',
        'Initiation au systèmes autonomes',
        'Créateur de solutions innovantes'
    ];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function type() {
        const fullText = texts[currentTextIndex];

        if (isDeleting) {
            currentCharIndex--;
        } else {
            currentCharIndex++;
        }

        textElement.textContent = fullText.substring(0, currentCharIndex);

        let speed = 50;

        if (isDeleting) speed = 30;

        if (currentCharIndex === fullText.length) {
            isDeleting = true;
            speed = 1500;
        } else if (currentCharIndex === 0 && isDeleting) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

// ========== NAVIGATION ACTIVE ==========
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Navigation smooth
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').slice(1);
            const section = document.getElementById(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.style.display = 'none';
            });
        });
    }
}

// ========== AOS (ANIMATE ON SCROLL) ==========
function initAOS() {
    if (window.AOS) {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out-quart'
        });
    }
}

// ========== CANVAS 3D - SPHÈRE PRINCIPALE ==========
function initCanvas3D() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas || !window.THREE) return;

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);

        camera.position.z = 2.5;

        // Géométrie
        const geometry = new THREE.IcosahedronGeometry(1, 4);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00d9ff,
            emissive: 0x00d9ff,
            wireframe: true,
            wireframeLinewidth: 2
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Lumières
        const light = new THREE.PointLight(0x00d9ff, 2, 100);
        light.position.set(5, 5, 7);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Animation
        function animate() {
            requestAnimationFrame(animate);

            mesh.rotation.x += 0.001;
            mesh.rotation.y += 0.002;

            const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
            mesh.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        }

        animate();

        // Redimensionnement
        window.addEventListener('resize', () => {
            if (canvas.clientWidth > 0) {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            }
        });
    } catch (error) {
        console.log('Three.js non disponible ou erreur:', error);
    }
}

// ========== PARTICULES ANIMÉES ==========
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: #00d9ff;
            border-radius: 50%;
            opacity: ${Math.random() * 0.7 + 0.2};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 20 + 10}s infinite linear;
            box-shadow: 0 0 ${Math.random() * 10 + 5}px #00d9ff;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }
}

// ========== SCROLL SMOOTH ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== ANIMATIONS AU SCROLL ==========
function initScrollAnimations() {
    if (!window.gsap) return;

    gsap.registerPlugin(ScrollTrigger);

    // Parallax hero
    gsap.to('.hero-container', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
        },
        y: 100,
        opacity: 0.7
    });

    // Cartes projets
    gsap.utils.toArray('.project-card').forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6
        });
    });

    // Badges
    gsap.utils.toArray('.badge-item').forEach((badge, index) => {
        gsap.from(badge, {
            scrollTrigger: {
                trigger: badge,
                start: 'top 90%'
            },
            opacity: 0,
            x: -20,
            duration: 0.5,
            delay: index * 0.1
        });
    });
}

// ========== FLIP CARDS 3D ==========
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (window.gsap) {
            gsap.to(this.querySelector('.card-inner'), {
                rotationY: 180,
                duration: 0.6,
                ease: 'power2.inOut'
            });
        }
    });

    card.addEventListener('mouseleave', function() {
        if (window.gsap) {
            gsap.to(this.querySelector('.card-inner'), {
                rotationY: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            });
        }
    });
});

// ========== TILT 3D PROJECTS ==========
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ========== COMPTEURS ANIMÉS ==========
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateValue(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));

function animateValue(element) {
    const match = element.textContent.match(/\d+/);
    if (!match) return;
    
    const value = parseInt(match[0]);
    const duration = 2;
    let start = 0;

    const timer = setInterval(() => {
        start += value / (duration * 60);
        if (start >= value) {
            element.textContent = value;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 1000 / 60);
}

// ========== UPDATE NAVBAR ON SCROLL ==========
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 8, 18, 0.95)';
    } else {
        navbar.style.background = 'rgba(5, 8, 18, 0.8)';
    }
});

// ========== CONTACT BUTTONS ==========
function initContactButtons() {
    const contactButtons = document.querySelectorAll('.contact-btn');
    
    contactButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('btn-email')) {
                const email = 'glennsilvere.ivombo@eidia.euromed.org';
                window.location.href = `mailto:${email}`;
            } else if (btn.classList.contains('btn-whatsapp')) {
                const phone ='212778336608';
                window.open(`https://wa.me/${phone}`, '_blank');
            } else if (btn.classList.contains('btn-linkedin')) {
                window.open('https://www.linkedin.com/in/glenn-ivombo', '_blank');
            }
        });

        // Ajouter animation au hover
        btn.addEventListener('mouseenter', () => {
            if (window.gsap) {
                gsap.to(btn, {
                    y: -3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (window.gsap) {
                gsap.to(btn, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// ========== LAZY LOADING ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ========== MESSAGE CONSOLE ==========
console.log('%c🤖 OLIVIER - PORTFOLIO ROBOTIQUE', 'color: #00d9ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00d9ff;');
console.log('%cBienvenue sur le portfolio futuriste! 🚀', 'color: #7c3aed; font-size: 14px;');
console.log('%cDesign moderne & animations fluides', 'color: #ec4899;');
