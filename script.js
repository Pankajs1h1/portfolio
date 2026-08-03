/* ==========================================================================
   Pankaj Saha Academic Portfolio - Interactive Logic Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize KaTeX Math Formula Auto-Render
    initKaTeX();

    // 2. Initialize Dark/Light Theme Switcher
    initThemeToggle();

    // 3. Initialize Interactive Canvas (Stochastic Motion Simulation)
    initStochasticCanvas();

    // 4. Initialize Mobile Menu Navigation Toggle
    initMobileNav();

    // 5. Initialize Scroll Animations & Counters
    initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. KaTeX Math Equation Renderer
   -------------------------------------------------------------------------- */
function initKaTeX() {
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false},
                {left: "\\[", right: "\\]", display: true}
            ],
            throwOnError: false
        });
    }
}

/* --------------------------------------------------------------------------
   2. Theme Toggle (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // Check localStorage preference or system preference
    const savedTheme = localStorage.getItem('pankaj_theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('pankaj_theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (!icon) return;
    if (theme === 'light') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

/* --------------------------------------------------------------------------
   3. Stochastic Motion / Brownian Particle Background Simulation
   -------------------------------------------------------------------------- */
function initStochasticCanvas() {
    const canvas = document.getElementById('stochasticCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particle class representing Wiener processes / Stochastic trajectories
    const numParticles = 45;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1,
            history: []
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const strokeColor = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)';
        const particleColor = isDark ? 'rgba(6, 182, 212, 0.6)' : 'rgba(99, 102, 241, 0.6)';

        // Update and draw particles with random Brownian noise step (dW_t)
        particles.forEach((p, idx) => {
            // Add stochastic noise step (Brownian motion)
            const dWx = (Math.random() - 0.5) * 0.4;
            const dWy = (Math.random() - 0.5) * 0.4;

            p.vx += dWx;
            p.vy += dWy;

            // Apply slight drift damping
            p.vx *= 0.98;
            p.vy *= 0.98;

            p.x += p.vx;
            p.y += p.vy;

            // Boundary wrapping
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();

            // Connect nearby particles to form stochastic network lattice
            for (let j = idx + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 1 - dist / 140;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   4. Mobile Menu Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        const icon = toggle.querySelector('i');
        if (menu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });
}

/* --------------------------------------------------------------------------
   5. Skill & Coursework Category Filters
   -------------------------------------------------------------------------- */
function filterCategory(cat, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.course-category-card');
    cards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/* --------------------------------------------------------------------------
   6. Project Modals & Detailed Thesis View
   -------------------------------------------------------------------------- */
const projectData = {
    1: {
        title: "Large Deviation for Stochastic Three Species Predator-Prey Model with Anti-Predator Response",
        period: "Aug 2024 – July 2025",
        supervisor: "Dr. Debopriya Mukherjee (Assistant Professor, IIT Indore)",
        abstract: `The primary objective of this project is to establish the Large Deviation Principle (LDP) for a stochastic three-species predator-prey system with anti-predator response dynamics. We study the asymptotics of small noise perturbations using the weak convergence approach introduced by Budhiraja and Dupuis.`,
        keyPoints: [
            "Formulated the stochastic differential equation governing three interacting species (Prey, Intermediate Predator, Top Predator) under environmental noise perturbations.",
            "Established existence and uniqueness of strong solutions in a Polish space setting.",
            "Applied the variational representation formula for positive functionals of Brownian motion.",
            "Verified the Laplace Principle for the family of solutions, which is equivalent to LDP for Polish space valued random variables."
        ],
        equations: [
            "$$\\mathrm{d}X_i(t) = f_i(X(t))\\mathrm{d}t + \\sqrt{\\epsilon} \\sigma_i(X(t))\\mathrm{d}W_i(t), \\quad i=1,2,3$$",
            "$$I(g) = \\inf_{v \\in \\mathcal{A}} \\left\\{ \\frac{1}{2} \\int_0^T |v(t)|^2 \\mathrm{d}t \\,:\\, g = \\mathcal{G}^0\\left( \\int_0^\\cdot v(s)\\mathrm{d}s \\right) \\right\\}$$"
        ]
    },
    2: {
        title: "Large Deviation for Stochastic Reaction-Diffusion Equation",
        period: "Aug 2024 – July 2025",
        supervisor: "Dr. Debopriya Mukherjee (Assistant Professor, IIT Indore)",
        abstract: `In this project, we demonstrate the Large Deviation Principle for a stochastic reaction-diffusion predator-prey system featuring anti-predation behavior and fear effects. The spatial diffusion process is perturbed by multiplicative Gaussian noise.`,
        keyPoints: [
            "Proved the existence of a unique strong solution for the stochastic reaction-diffusion system with non-linear reaction terms.",
            "Incorporated fear effects into the prey growth function and anti-predator defensive mechanisms.",
            "Derived tightness properties for the family of stochastic controls using compact embeddings in Sobolev-Hilbert spaces.",
            "Established the LDP rate function $I(\\cdot)$ via the weak convergence approach of Budhiraja and Dupuis."
        ],
        equations: [
            "$$\\frac{\\partial u}{\\partial t} = d_1 \\Delta u + \\frac{r u}{1 + k v} - a u^2 - \\frac{b u v}{1 + w u} + \\sqrt{\\epsilon} \\sigma_1(u) \\dot{W}_1(t,x)$$",
            "$$\\lim_{\\epsilon \\to 0} \\epsilon \\log \\mathbb{P}(U^\\epsilon \\in A) = -\\inf_{u \\in A} I(u)$$"
        ]
    }
};

function openProjectModal(id) {
    const data = projectData[id];
    if (!data) return;

    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');

    const keyPointsHTML = data.keyPoints.map(pt => `<li><i class="fa-solid fa-angle-right" style="color: var(--accent-primary);"></i> ${pt}</li>`).join('');
    const eqHTML = data.equations.map(eq => `<div class="katex-box" style="margin-bottom: 0.8rem;">${eq}</div>`).join('');

    modalContent.innerHTML = `
        <div class="project-header" style="margin-bottom: 1rem;">
            <span class="project-tag">Master's Thesis Project ${id}</span>
            <span class="project-date"><i class="fa-regular fa-calendar"></i> ${data.period}</span>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem; line-height: 1.3;">${data.title}</h2>
        <div style="color: var(--accent-cyan); font-weight: 500; font-size: 0.9rem; margin-bottom: 1.2rem;">
            <i class="fa-solid fa-user-tie"></i> ${data.supervisor}
        </div>
        
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem;">Abstract</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.2rem;">${data.abstract}</p>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem;">Key Theoretical Findings</h4>
        <ul style="list-style: none; padding: 0; margin-bottom: 1.2rem; font-size: 0.9rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem;">
            ${keyPointsHTML}
        </ul>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Mathematical Formulation</h4>
        ${eqHTML}
    `;

    modal.classList.add('active');

    // Re-render KaTeX inside modal
    if (window.renderMathInElement) {
        renderMathInElement(modalContent, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ]
        });
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
}

// Close modal on background overlay click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

/* --------------------------------------------------------------------------
   7. Copy to Clipboard Utility
   -------------------------------------------------------------------------- */
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = origText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/* --------------------------------------------------------------------------
   8. Form Submission Simulation
   -------------------------------------------------------------------------- */
function handleFormSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('formSuccessAlert');
    if (alertBox) {
        alertBox.classList.remove('hidden');
        document.getElementById('contactForm').reset();
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 5000);
    }
}

/* --------------------------------------------------------------------------
   9. Stat Counters Animation
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const statNums = document.querySelectorAll('.stat-num');
    let animated = false;

    window.addEventListener('scroll', () => {
        if (animated) return;
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            animated = true;
            statNums.forEach(el => {
                const target = parseFloat(el.getAttribute('data-count'));
                if (!target) return;
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target % 1 === 0 ? target : target.toFixed(2);
                        clearInterval(timer);
                    } else {
                        el.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(2);
                    }
                }, 30);
            });
        }
    });
}
