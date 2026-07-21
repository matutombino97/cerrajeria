/* ═══════════════════════════════════════════════════════════════
   EN TODAS PUERTAS — Premium Interactive Script v2.0
   ═══════════════════════════════════════════════════════════════ */

const SITE_CONFIG = {
    phone: '542614000000',
};

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('is-loading');
    initHeader();
    initMobileMenu();
    initMagneticGlow();
    initCounterAnimations();
    initSmoothScrollLinks();
    initBentoTabs();
    initProtectedEmails();
    initParallaxHero();
});

/* ═══ Header scroll behavior ═══ */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    let ticking = false;

    function onScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
}

/* ═══ Mobile menu toggle ═══ */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    if (!toggle || !menu) return;

    const links = menu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    links.forEach(link => link.addEventListener('click', closeMenu));

    function openMenu() {
        menu.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        menu.inert = false;
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.inert = true;
        document.body.style.overflow = '';
    }
}

/* ═══ Magnetic Glow Effect ═══ */
function initMagneticGlow() {
    // Select cards or buttons that should have the magnetic glow effect
    const magneticElements = document.querySelectorAll('.caso-card, .cta-button, .glow-card');
    
    if (!magneticElements.length) return;

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate mouse position relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS variables for the background gradient position
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        });
        
        // Reset when mouse leaves (optional, but good for some effects)
        el.addEventListener('mouseleave', () => {
            el.style.setProperty('--mouse-x', `50%`);
            el.style.setProperty('--mouse-y', `50%`);
        });
    });
}



/* ═══ Animated counters ═══ */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 1800;
    const startTime = performance.now();

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(easedProgress * target);

        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';

        element.textContent = prefix + currentValue.toLocaleString('es-AR') + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + target.toLocaleString('es-AR') + suffix;
        }
    }

    requestAnimationFrame(update);
}

/* ═══ Bento Tabs Logic ═══ */
function initBentoTabs() {
    const tabs = document.querySelectorAll('.bento-tab');
    const panes = document.querySelectorAll('.bento-pane');
    
    if (!tabs.length || !panes.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('is-active'));
            panes.forEach(p => p.classList.remove('is-active'));

            // Add active class to clicked tab
            tab.classList.add('is-active');

            // Show corresponding pane
            const targetId = tab.getAttribute('data-target');
            const targetPane = document.getElementById(`pane-${targetId}`);
            if (targetPane) {
                targetPane.classList.add('is-active');
            }
        });
    });
}

/* ═══ Smooth scroll for anchor links ═══ */
function initSmoothScrollLinks() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ═══ Protected email (anti-spam) ═══ */
function initProtectedEmails() {
    const protectedEmails = document.querySelectorAll('.protected-email');
    protectedEmails.forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const user = this.getAttribute('data-user');
            const domain = this.getAttribute('data-domain');
            window.location.href = "mailto:" + user + "@" + domain;
        });
    });
}

/* ═══ Parallax on Hero background ═══ */
function initParallaxHero() {
    const heroBg = document.querySelector('.hero-premium__bg');
    if (!heroBg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
