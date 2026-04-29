/**
 * Creators Page — collateral.market/creators
 * Creator partnership program landing page.
 */

export function renderCreators() {
    return `
    <div class="creators-page">
        <!-- HERO -->
        <section class="creators-hero">
            <h1>Get Paid to Introduce Serious People to Serious Accountability.</h1>
            <p class="creators-hero-sub">
                Collateral partners with creators who have audiences that care about measurable outcomes.
                You post. They sign up. They fund a contract. You get paid.
            </p>
            <button class="creators-cta-btn" onclick="window.open('https://x.com/collateralmarket', '_blank')">
                Apply to Partner →
            </button>
        </section>

        <!-- WHAT IS COLLATERAL -->
        <section class="creators-section">
            <h2>The Platform</h2>
            <p>
                Collateral is an accountability platform where people lock money behind measurable goals.
            </p>
            <p>
                Users pick a target — revenue, follower growth, sales, subscribers — fund the contract with real capital,
                and Collateral verifies the outcome automatically through connected sources like Stripe, Shopify, X, Amazon, and YouTube.
            </p>
            <p class="creators-highlight">
                Hit the target → get paid.<br>
                Miss → lose the contract.<br><br>
                No opinions. No judges. Just the number.
            </p>
        </section>

        <!-- WHO USES IT -->
        <section class="creators-section">
            <h2>Who Uses Collateral</h2>
            <ul class="creators-list">
                <li>Founders tracking MRR and revenue milestones</li>
                <li>E-commerce operators with Shopify sales targets</li>
                <li>Creators growing their X, YouTube, or Instagram audience</li>
                <li>Salespeople committing to pipeline and close numbers</li>
                <li>Anyone who wants consequences behind their goals</li>
            </ul>
            <blockquote class="creators-quote">
                If your audience talks about hitting numbers, growing revenue, or building something real — they're already thinking like Collateral users.
            </blockquote>
        </section>

        <!-- HOW YOU GET PAID -->
        <section class="creators-section">
            <h2>How You Get Paid</h2>

            <h3>1. Post Fee (Upfront)</h3>
            <p>We pay a flat fee per sponsored post. Amount depends on your audience size and engagement quality.</p>

            <div class="creators-table-wrap">
                <table class="creators-table">
                    <thead><tr><th>Your Audience</th><th>Post Fee</th></tr></thead>
                    <tbody>
                        <tr><td>1k–5k followers</td><td>$0–$25 or bonus-only</td></tr>
                        <tr><td>5k–25k followers</td><td>$20–$75</td></tr>
                        <tr><td>25k–75k followers</td><td>$75–$250</td></tr>
                    </tbody>
                </table>
            </div>

            <h3>2. Funded-Contract Bonus (Performance)</h3>
            <p>
                You earn a bonus every time someone from your audience creates a funded contract through your referral link.
            </p>
            <ul class="creators-list">
                <li><strong>$10–$25 per qualified funded contract</strong></li>
                <li>A "qualified funded contract" means the user signed up through your link, created a contract, and locked at least $25</li>
                <li>Bonus is paid after the contract is confirmed and passes review</li>
            </ul>

            <h3>3. No Cap</h3>
            <p>There is no limit on funded-contract bonuses. The more serious users you refer, the more you earn.</p>
        </section>

        <!-- EXAMPLE POST ANGLES -->
        <section class="creators-section">
            <h2>What to Post</h2>
            <p>We don't script your content. But here are angles that work:</p>

            <div class="creators-angles">
                <div class="creators-angle">
                    <span class="creators-angle-label">THE CHALLENGE</span>
                    <p>"Would you put $100 behind the number you keep saying you'll hit?"</p>
                </div>
                <div class="creators-angle">
                    <span class="creators-angle-label">THE CONTRAST</span>
                    <p>"Everyone says they're going to grow. Very few will put money behind it."</p>
                </div>
                <div class="creators-angle">
                    <span class="creators-angle-label">THE SYSTEM</span>
                    <p>"Pick a target. Lock capital. Prove the outcome. That's @collateralmarket."</p>
                </div>
                <div class="creators-angle">
                    <span class="creators-angle-label">THE PERSONAL</span>
                    <p>"I just locked $500 behind hitting [X goal] in 30 days. If I miss — I lose it."</p>
                </div>
                <div class="creators-angle">
                    <span class="creators-angle-label">THE PHILOSOPHY</span>
                    <p>"Willpower is free. Consequences are expensive."</p>
                </div>
            </div>
            <p class="creators-small">Post in your own voice. The only requirement is accuracy.</p>
        </section>

        <!-- RULES -->
        <section class="creators-section">
            <h2>Rules of the Program</h2>
            <ol class="creators-rules">
                <li><strong>Be accurate.</strong> Collateral is an accountability platform. Do not describe it as betting, gambling, investing, or a get-rich-quick scheme.</li>
                <li><strong>No fake claims.</strong> Do not promise guaranteed returns, passive income, or "free money."</li>
                <li><strong>Disclose the partnership.</strong> Mark sponsored posts per platform guidelines.</li>
                <li><strong>Quality over quantity.</strong> One serious user is worth more than 1,000 curious visitors.</li>
                <li><strong>No spam.</strong> Don't mass-DM followers or buy fake engagement.</li>
                <li><strong>Bonus rules are strict.</strong> Bonuses are only paid for real, funded, non-refunded contracts from unique users. Self-referrals and fraud result in removal.</li>
            </ol>
        </section>

        <!-- HOW TRACKING WORKS -->
        <section class="creators-section">
            <h2>Your Referral Link</h2>
            <p>When you're accepted, you get a unique referral link:</p>
            <code class="creators-code">collateral.market/r/yourname</code>
            <ul class="creators-list">
                <li>When someone clicks your link, your referral is stored for 30 days</li>
                <li>If they sign up and fund a contract → you earn the bonus</li>
                <li>You can track clicks, signups, and funded contracts</li>
            </ul>
            <p class="creators-small">Payouts are processed after manual review during beta.</p>
        </section>

        <!-- CTA -->
        <section class="creators-cta-section">
            <h2>Ready?</h2>
            <p>If your audience cares about real outcomes, measurable goals, and putting skin in the game — we want to work with you.</p>
            <button class="creators-cta-btn" onclick="window.open('https://x.com/collateralmarket', '_blank')">
                Apply to Partner →
            </button>
            <p class="creators-small" style="margin-top: 16px;">
                Or DM us on X: <a href="https://x.com/collateralmarket" target="_blank" rel="noopener">@collateralmarket</a>
            </p>
        </section>
    </div>
    `;
}

export function initCreators() {
    // Static page — no initialization needed
    document.title = 'Creator Partnerships — Collateral.market';

    // Update meta description
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
        meta.setAttribute('content', 'Get paid to introduce serious people to serious accountability. Partner with Collateral and earn for every funded performance contract.');
    }
}
