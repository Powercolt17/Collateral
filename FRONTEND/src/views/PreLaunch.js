// Pre-Launch Landing Page - Stunning Fintech Signup
// Matches Collateral color scheme: neutral grays, black text, red accents

export function renderPreLaunch() {
    return `
        <div id="prelaunch-page" class="prelaunch-container">
            <!-- Animated Background Grid -->
            <div class="prelaunch-grid"></div>
            
            <!-- Floating Particles -->
            <div class="particles" id="particles"></div>
            
            <!-- Main Content -->
            <div class="prelaunch-content">
                <!-- Header -->
                <header class="prelaunch-header">
                    <div class="prelaunch-logo">
                        <span class="logo-text">Collateral</span><span class="logo-accent">.market</span>
                    </div>
                    <div class="prelaunch-badge">
                        <span class="badge-dot"></span>
                        Pre-Launch Access
                    </div>
                </header>

                <!-- Hero Section -->
                <main class="prelaunch-hero">
                    <h1 class="prelaunch-title">
                        <span class="title-line">Where outcomes</span>
                        <span class="title-line title-emphasis">decide who gets paid.</span>
                    </h1>
                    
                    <p class="prelaunch-subtitle">
                        Lock capital against measurable outcomes.<br/>
                        Verify performance. Settle results.
                    </p>

                    <!-- Stats Row -->
                    <div class="prelaunch-stats">
                        <div class="stat-item">
                            <div class="stat-value" id="waitlist-count">—</div>
                            <div class="stat-label">On Waitlist</div>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <div class="stat-value">$0</div>
                            <div class="stat-label">Platform Fee</div>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <div class="stat-value">100%</div>
                            <div class="stat-label">Outcome-Based</div>
                        </div>
                    </div>
                </main>

                <!-- Signup Section -->
                <section class="prelaunch-signup">
                    <div class="signup-card">
                        <div class="signup-header">
                            <h2 class="signup-title">Request Early Access</h2>
                            <p class="signup-desc">Early users define the first performance contracts, risk tiers, and verification standards.</p>
                        </div>

                        <form id="waitlist-form" class="signup-form">
                            <div class="form-group">
                                <label class="form-label">EMAIL</label>
                                <input 
                                    type="email" 
                                    id="waitlist-email" 
                                    class="form-input" 
                                    placeholder="you@company.com"
                                    required
                                    autocomplete="email"
                                />
                            </div>

                            <div class="form-group">
                                <label class="form-label">INTENDED USE <span class="label-optional">(OPTIONAL)</span></label>
                                <input 
                                    type="text" 
                                    id="waitlist-use" 
                                    class="form-input" 
                                    placeholder="What capital will you lock?"
                                />
                            </div>

                            <button type="submit" id="waitlist-submit" class="submit-btn">
                                <span class="btn-text">Request Access</span>
                                <span class="btn-arrow">→</span>
                            </button>

                            <p class="form-disclaimer">
                                NO SPAM. ACCESS IS REVIEWED.
                            </p>
                        </form>

                        <!-- Success State -->
                        <div id="signup-success" class="signup-success hidden">
                            <div class="success-icon">✓</div>
                            <h3 class="success-title">You're on the list.</h3>
                            <p class="success-desc">We'll reach out when it's your turn to build.</p>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="prelaunch-footer">
                    <div class="footer-links">
                        <a href="https://twitter.com/collaboralmarket" target="_blank" class="footer-link">Twitter</a>
                        <span class="footer-divider">•</span>
                        <a href="mailto:hello@collateral.market" class="footer-link">Contact</a>
                    </div>
                    <div class="footer-copy">© 2026 Collateral Market. All rights reserved.</div>
                </footer>
            </div>
        </div>
    `;
}

export async function initPreLaunch() {
    console.log('[PreLaunch] Initializing...');

    // Fetch waitlist count
    fetchWaitlistCount();

    // Create particles
    createParticles();

    // Form submission
    const form = document.getElementById('waitlist-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Add animation classes after load
    setTimeout(() => {
        document.querySelector('.prelaunch-title')?.classList.add('animate-in');
        document.querySelector('.prelaunch-subtitle')?.classList.add('animate-in');
        document.querySelector('.prelaunch-stats')?.classList.add('animate-in');
    }, 100);
}

async function fetchWaitlistCount() {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://collateral-production.up.railway.app';
        const response = await fetch(`${API_URL}/v1/waitlist/count`);
        const data = await response.json();

        const countEl = document.getElementById('waitlist-count');
        if (countEl && data.count !== undefined) {
            // Animate count up
            animateCount(countEl, data.count);
        }
    } catch (err) {
        console.log('[PreLaunch] Could not fetch waitlist count');
    }
}

function animateCount(element, target) {
    const duration = 1500;
    const start = 0;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // Ease out quart
        const current = Math.floor(start + (target - start) * eased);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    if (target > 0) {
        update();
    } else {
        element.textContent = '0';
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const emailInput = document.getElementById('waitlist-email');
    const useInput = document.getElementById('waitlist-use');
    const submitBtn = document.getElementById('waitlist-submit');
    const form = document.getElementById('waitlist-form');
    const successDiv = document.getElementById('signup-success');

    if (!emailInput || !submitBtn) return;

    const email = emailInput.value.trim();
    const intendedUse = useInput?.value.trim() || '';

    if (!email) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="btn-spinner"></span>';

    try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://collateral-production.up.railway.app';
        const response = await fetch(`${API_URL}/v1/waitlist/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, intendedUse }),
        });

        const data = await response.json();

        if (data.success) {
            // Show success state
            form?.classList.add('hidden');
            successDiv?.classList.remove('hidden');
            successDiv?.classList.add('animate-in');

            // Update count
            const countEl = document.getElementById('waitlist-count');
            if (countEl) {
                const current = parseInt(countEl.textContent.replace(/,/g, '')) || 0;
                animateCount(countEl, current + 1);
            }
        } else {
            throw new Error(data.error || 'Failed to join');
        }

    } catch (err) {
        // Error state
        submitBtn.classList.add('error');
        submitBtn.innerHTML = '<span class="btn-text">Try Again</span><span class="btn-arrow">→</span>';

        setTimeout(() => {
            submitBtn.classList.remove('error', 'loading');
            submitBtn.disabled = false;
        }, 2000);
    }
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}
