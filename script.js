/* =============================================
   PORTFOLIO SCRIPT — CLEAN LIGHT EDITION
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Navbar Scroll State ─────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ─── Mobile Hamburger ────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const lines = hamburger.querySelectorAll('span');
        hamburger.classList.toggle('active');
        if (hamburger.classList.contains('active')) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            lines[0].style.transform = '';
            lines[1].style.opacity = '';
            lines[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    mobileMenu?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('active');
            const lines = hamburger.querySelectorAll('span');
            lines[0].style.transform = '';
            lines[1].style.opacity = '';
            lines[2].style.transform = '';
        });
    });

    // ─── Scroll Reveal ───────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── Skill Bar Animations ────────────────────
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.sbar-fill').forEach(bar => {
                    const width = bar.getAttribute('data-w');
                    bar.style.width = width + '%';
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.bento-large').forEach(el => barObserver.observe(el));

    // ─── Active Nav Link on Scroll ───────────────
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => {
                    l.classList.toggle('active-nav', l.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    // ─── Smooth Anchor Scroll ────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = 72;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── Stagger reveal delay for cards ──
    document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });

    document.querySelectorAll('.bento-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.06}s`;
    });

    document.querySelectorAll('.timeline .tl-item').forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.1}s`;
    });

});