/* =============================================
   PORTFOLIO SCRIPT — CLEAN LIGHT EDITION
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    const html = document.documentElement;
    const navbar = document.getElementById('navbar');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    // ─── Developer Mode Particles ────────────────
    let startParticles = () => { };
    let stopParticles = () => { };

    function initParticles() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let canvas = document.getElementById('dev-particles');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'dev-particles';
            canvas.style.cssText = `
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none;
                z-index: 0;
                opacity: 0.4;
                display: none;
            `;
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;
        let animId = null;
        let isAnimating = false;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize, { passive: true });
        resize();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * (canvas.width || window.innerWidth);
                this.y = Math.random() * (canvas.height || window.innerHeight);
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            if (html.getAttribute('data-theme') !== 'developer') {
                isAnimating = false;
                animId = null;
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw particle connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(37, 99, 235, ${0.05 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(animate);
        }

        startParticles = function () {
            if (!isAnimating) {
                isAnimating = true;
                animId = requestAnimationFrame(animate);
            }
        };

        stopParticles = function () {
            isAnimating = false;
            if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }

    initParticles();

    // ─── Theme System ────────────────────────────
    function getSavedTheme() {
        return localStorage.getItem('portfolio-theme') || 'light';
    }

    function updateParticles(theme) {
        const canvas = document.getElementById('dev-particles');
        if (canvas) {
            if (theme === 'developer') {
                canvas.style.display = 'block';
                startParticles();
            } else {
                canvas.style.display = 'none';
                stopParticles();
            }
        }
    }

    function setTheme(theme) {
        const currentY = window.scrollY;
        html.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        updateParticles(theme);
        window.scrollTo({ top: currentY, behavior: 'instant' });
    }

    function initTheme() {
        const saved = getSavedTheme();
        setTheme(saved);
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme(btn.dataset.theme);
        });
    });

    initTheme();

    // ─── Navbar Scroll State ─────────────────────
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }
    }, { passive: true });

    // ─── Mobile Hamburger ────────────────────────
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            const lines = hamburger.querySelectorAll('span');
            if (isOpen) {
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
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                const lines = hamburger.querySelectorAll('span');
                lines[0].style.transform = '';
                lines[1].style.opacity = '';
                lines[2].style.transform = '';
            });
        });

        // Close mobile menu on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                const lines = hamburger.querySelectorAll('span');
                lines[0].style.transform = '';
                lines[1].style.opacity = '';
                lines[2].style.transform = '';
            }
        });
    }

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
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));

    // ─── Smooth Anchor Scroll ────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 72;
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

    // ─── Developer Mode Terminal ───────────────
    const terminalInput = document.getElementById('dev-terminal-input');
    const terminalOutput = document.getElementById('dev-terminal-output');
    const terminalCursor = document.getElementById('terminal-cursor');

    // Only initialize terminal if elements exist (Developer Mode)
    if (terminalInput && terminalOutput && terminalCursor) {
        // Terminal state
        const commandHistory = [];
        let historyIndex = -1;
        let isProcessing = false;

        function addOutput(text, className = 'output', isHTML = false) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            if (className && typeof className === 'string') {
                className.trim().split(/\s+/).forEach(cls => line.classList.add(cls));
            }
            if (isHTML || (typeof text === 'string' && /<[a-z][\s\S]*>/i.test(text))) {
                line.innerHTML = text;
            } else {
                line.textContent = text;
            }
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        function addCommandLine(command) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = '<span class="prompt">&gt;&gt;&gt;</span> <span class="command user-input">' + escapeHtml(command) + '</span>';
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Command definitions
        const commands = {
            help: {
                description: 'Show available commands',
                execute: () => {
                    addOutput('', '');
                    addOutput('Available commands:', 'output info');
                    addOutput('', '');
                    addOutput('email      → Contact me by email', 'output');
                    addOutput('github     → Open my GitHub', 'output');
                    addOutput('linkedin   → Open my LinkedIn', 'output');
                    addOutput('resume     → View my resume', 'output');
                    addOutput('visit      → Open my portfolio', 'output');
                    addOutput('contact    → Show contact information', 'output');
                    addOutput('clear      → Clear terminal', 'output');
                    addOutput('help       → Show available commands', 'output');
                }
            },
            email: {
                description: 'Send me an email',
                execute: () => {
                    addOutput('Opening email client...', 'output info');
                    setTimeout(() => {
                        addOutput('✓ Connection initialized.', 'output success');
                        window.open('mailto:iamrameshrathod01@gmail.com', '_blank');
                    }, 400);
                }
            },
            github: {
                description: 'Open my GitHub',
                execute: () => {
                    addOutput('Connecting to GitHub...', 'output info');
                    setTimeout(() => {
                        addOutput('✓ Repository access granted.', 'output success');
                        window.open('https://github.com/darknightspi', '_blank', 'noopener,noreferrer');
                    }, 400);
                }
            },
            linkedin: {
                description: 'Open my LinkedIn',
                execute: () => {
                    addOutput('Connecting to LinkedIn...', 'output info');
                    setTimeout(() => {
                        addOutput('✓ Profile found.', 'output success');
                        window.open('https://www.linkedin.com/in/rameshrathod01/', '_blank', 'noopener,noreferrer');
                    }, 400);
                }
            },
            resume: {
                description: 'View my resume',
                execute: () => {
                    addOutput('Loading resume...', 'output info');
                    setTimeout(() => {
                        addOutput('✓ Resume ready.', 'output success');
                        window.open('assets/Ramesh_Rathod.pdf', '_blank');
                    }, 400);
                }
            },
            visit: {
                description: 'Visit portfolio',
                execute: () => {
                    addOutput('Opening portfolio...', 'output info');
                    setTimeout(() => {
                        addOutput('✓ Welcome.', 'output success');
                        window.location.href = '#hero';
                    }, 400);
                }
            },
            contact: {
                description: 'Show contact information',
                execute: () => {
                    addOutput('', '');
                    addOutput('Name     : Ramesh Rathod', 'contact-info');
                    addOutput('Focus    : ML / Data Science / AI', 'contact-info');
                    addOutput('Status   : Looking for Opportunities', 'contact-info');
                    addOutput('Location : India', 'contact-info');
                    addOutput('', '');
                    addOutput('Available channels:', 'contact-info');
                    addOutput('', '');
                    addOutput('<span class="channel" onclick="window.open(\'mailto:iamrameshrathod01@gmail.com\', \'_blank\')">[email] iamrameshrathod01@gmail.com</span>', 'contact-info', true);
                    addOutput('<span class="channel" onclick="window.open(\'https://github.com/darknightspi\', \'_blank\', \'noopener,noreferrer\')">[github] @darknightspi</span>', 'contact-info', true);
                    addOutput('<span class="channel" onclick="window.open(\'https://www.linkedin.com/in/rameshrathod01/\', \'_blank\', \'noopener,noreferrer\')">[linkedin] /in/rameshrathod01</span>', 'contact-info', true);
                }
            },
            clear: {
                description: 'Clear terminal',
                execute: () => {
                    terminalOutput.innerHTML = '';
                    // Re-add welcome message
                    addOutput('<span class="text-muted">Python 3.x - Ramesh Contact Interface</span>', 'welcome', true);
                    addOutput('<span class="text-muted">Type \'help\' to see available commands.</span>', 'welcome', true);
                }
            }
        };

        async function executeCommand(command) {
            if (isProcessing) return;

            const cmd = command.trim().toLowerCase();
            if (!cmd) return;

            addCommandLine(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;

            const cmdObj = commands[cmd];
            if (cmdObj) {
                isProcessing = true;
                await cmdObj.execute();
                isProcessing = false;
            } else {
                addOutput('Command not found: ' + escapeHtml(command), 'output error');
                addOutput("Type 'help' to see available commands.", 'output info');
            }
        }

        function updateInputWidth() {
            terminalInput.style.width = terminalInput.value.length + 'ch';
        }

        terminalInput.addEventListener('input', updateInputWidth);

        // Terminal input handling
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const command = terminalInput.value;
                terminalInput.value = '';
                updateInputWidth();
                executeCommand(command);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (commandHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                    updateInputWidth();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex] || '';
                    updateInputWidth();
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                    updateInputWidth();
                }
            } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                terminalInput.value = '';
                updateInputWidth();
                executeCommand('clear');
            }
        });

        updateInputWidth();

        // Focus input on click
        terminalInput.addEventListener('click', (e) => {
            e.stopPropagation();
            terminalInput.focus({ preventScroll: true });
        });

        // Focus input when clicking anywhere in terminal
        const terminalBody = document.getElementById('dev-terminal-body');
        if (terminalBody) {
            terminalBody.addEventListener('click', (e) => {
                if (e.target === terminalBody || e.target.closest('.dev-terminal-output') || e.target.closest('.input-wrap') || e.target.closest('.input-line')) {
                    terminalInput.focus({ preventScroll: true });
                }
            });
        }
    }

    // ─── Terminal Cursor Animation (Hero) ───────────────
    const heroCursor = document.querySelector('.terminal-prompt');
    if (heroCursor && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(() => {
            heroCursor.style.opacity = heroCursor.style.opacity === '0' ? '1' : '0';
        }, 530);
    }

    // ─── Developer Mode Contact Terminal Cursor ───────────────
    const devCursor = document.getElementById('terminal-cursor');
    if (devCursor && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(() => {
            devCursor.style.opacity = devCursor.style.opacity === '0' ? '1' : '0';
        }, 530);
    }

});