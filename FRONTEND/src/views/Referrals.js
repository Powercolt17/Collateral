/**
 * Referrals Page — Redesigned
 *
 * Premium institutional layout:
 *   Header → Stats Bar → Progress → Referral Link → Boost Tiers → How It Works → Footer
 */

export function renderReferrals() {
    return `
        <div id="referrals-page" style="max-width:720px;margin:0 auto;padding:48px 20px 80px;font-family:'Neue Haas Grotesk Display','Helvetica Neue',Arial,sans-serif;">
            <!-- Header -->
            <div style="text-align:center;margin-bottom:40px;">
                <div style="display:inline-flex;align-items:center;gap:7px;margin-bottom:10px;">
                    <span style="display:inline-block;width:8px;height:8px;background:#8B1A1A;border-radius:1px;"></span>
                    <span style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8B1A1A;font-family:'JetBrains Mono',monospace;">Referral Program</span>
                </div>
                <h1 style="font-size:28px;font-weight:800;color:#111;margin:0 0 8px;letter-spacing:-0.03em;">Boost Your Payouts</h1>
                <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.5;">Invite peers to the platform. Earn permanent profit boosts on every contract.</p>
            </div>

            <!-- Loading State -->
            <div id="referral-loading" style="text-align:center;padding:60px 0;">
                <div style="width:24px;height:24px;border:2px solid #e5e5e5;border-top:2px solid #8B1A1A;border-radius:50%;margin:0 auto 12px;animation:spin 0.8s linear infinite;"></div>
                <div style="font-size:12px;color:#9ca3af;font-family:'JetBrains Mono',monospace;">Loading referral data…</div>
            </div>
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>

            <!-- Content (hidden until loaded) -->
            <div id="referral-content" style="display:none;"></div>

            <!-- Error State -->
            <div id="referral-error" style="display:none;"></div>
        </div>
    `;
}

export function initReferrals() {
    if (!window.appState?.isLoggedIn) {
        const loadingEl = document.getElementById('referral-loading');
        const errorEl = document.getElementById('referral-error');
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = `
                <div style="text-align:center;padding:60px 0;">
                    <div style="font-size:32px;margin-bottom:12px;">🔒</div>
                    <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:6px;">Sign in to view your referrals</div>
                    <div style="font-size:13px;color:#6b7280;margin-bottom:20px;">Create an account or sign in to access your referral dashboard.</div>
                    <button onclick="window.app.openAccessModal()" style="padding:12px 28px;background:#111;color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Neue Haas Grotesk Display',sans-serif;transition:background 0.15s;">Sign In</button>
                </div>
            `;
        }
        return;
    }
    loadReferralData();
}

async function loadReferralData() {
    const loadingEl = document.getElementById('referral-loading');
    const contentEl = document.getElementById('referral-content');
    const errorEl = document.getElementById('referral-error');

    if (!loadingEl || !contentEl || !errorEl) return;

    try {
        const stats = await window.api.getReferralStats();

        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';

        const referralLink = stats.referralCode
            ? `https://collateral.market/r/${stats.referralCode}`
            : null;

        const nextBoost = stats.nextTier ? `+${stats.nextTier.boostPct}%` : `+${stats.boostPct}%`;
        const nextNeeded = stats.nextTier ? stats.nextTier.needed : stats.referralCount;
        const progressPct = stats.nextTier
            ? Math.min(100, Math.round((stats.referralCount / stats.nextTier.needed) * 100))
            : 100;
        const progressLabel = stats.nextTier
            ? `${stats.referralCount} / ${stats.nextTier.needed} referral${stats.nextTier.needed !== 1 ? 's' : ''}`
            : 'Maximum reached';
        const progressHint = stats.nextTier
            ? `${stats.nextTier.needed - stats.referralCount} more referral${(stats.nextTier.needed - stats.referralCount) !== 1 ? 's' : ''} to unlock <strong style="color:#8B1A1A;">+${stats.nextTier.boostPct}%</strong> boost`
            : '🏆 You\'ve reached the maximum boost tier';

        // First-contract bonus banner
        const firstBonusHtml = stats.firstBonusAvailable
            ? `<div style="margin-bottom:20px;padding:14px 18px;background:#fefce8;border:1px solid #fde68a;border-radius:6px;display:flex;align-items:center;gap:12px;">
                   <span style="font-size:20px;">🎁</span>
                   <div>
                       <div style="font-size:13px;font-weight:700;color:#92400e;">+${stats.firstBonusPct}% bonus on your first contract</div>
                       <div style="font-size:11px;color:#a16207;margin-top:2px;">Execute your first contract to claim this reward.</div>
                   </div>
               </div>`
            : '';

        // Tier rows
        const tierRows = stats.tiers.map(t => {
            const isUnlocked = stats.referralCount >= t.minReferrals;
            const isCurrent = stats.boostPct === t.boostPct && stats.referralCount >= t.minReferrals;
            const isNext = stats.nextTier && stats.nextTier.boostPct === t.boostPct;

            return `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f3f4f6;opacity:${isUnlocked ? '1' : '0.45'};${isCurrent ? 'background:#f9fafb;' : ''}">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="display:inline-block;width:7px;height:7px;background:${isUnlocked ? '#8B1A1A' : '#d1d5db'};border-radius:1px;"></span>
                        <span style="font-size:14px;font-weight:${isUnlocked ? '700' : '500'};color:${isUnlocked ? '#111' : '#6b7280'};">
                            ${t.minReferrals} referral${t.minReferrals !== 1 ? 's' : ''}
                        </span>
                        ${isNext ? '<span style="font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#8B1A1A;background:#fef2f2;padding:2px 7px;border-radius:3px;margin-left:4px;">NEXT</span>' : ''}
                        ${isCurrent ? '<span style="font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#166534;background:#f0fdf4;padding:2px 7px;border-radius:3px;margin-left:4px;">CURRENT</span>' : ''}
                    </div>
                    <span style="font-size:14px;font-weight:700;color:${isUnlocked ? '#111' : '#9ca3af'};font-family:'JetBrains Mono',monospace;">+${t.boostPct}%</span>
                </div>`;
        }).join('');

        // Referral history
        const historyHtml = stats.referrals.length > 0
            ? `<div style="margin-top:28px;">
                   <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-family:'JetBrains Mono',monospace;margin-bottom:10px;">Referral History</div>
                   <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                       ${stats.referrals.map(r => `
                           <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #f3f4f6;">
                               <span style="font-size:12px;font-family:'JetBrains Mono',monospace;color:#374151;">${new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                               <span style="font-size:10px;font-weight:700;letter-spacing:0.04em;padding:3px 10px;border-radius:10px;${r.status === 'ACTIVATED' ? 'background:#f0fdf4;color:#166534;' : 'background:#fef3c7;color:#92400e;'}">${r.status}</span>
                           </div>
                       `).join('')}
                   </div>
               </div>`
            : '';

        contentEl.innerHTML = `
            ${firstBonusHtml}

            <!-- Stats Bar -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:20px;">
                <div style="text-align:center;padding:24px 16px;border-right:1px solid #e5e7eb;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:8px;">
                        <span style="font-size:12px;">📈</span>
                        <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-family:'JetBrains Mono',monospace;">Your Boost</span>
                    </div>
                    <div style="font-size:32px;font-weight:800;color:#111;letter-spacing:-0.03em;">+${stats.boostPct}%</div>
                </div>
                <div style="text-align:center;padding:24px 16px;border-right:1px solid #e5e7eb;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:8px;">
                        <span style="font-size:12px;">👥</span>
                        <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-family:'JetBrains Mono',monospace;">Referrals</span>
                    </div>
                    <div style="font-size:32px;font-weight:800;color:#111;letter-spacing:-0.03em;">${stats.referralCount}</div>
                </div>
                <div style="text-align:center;padding:24px 16px;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:8px;">
                        <span style="font-size:12px;">🎁</span>
                        <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-family:'JetBrains Mono',monospace;">Next Reward</span>
                    </div>
                    <div style="font-size:32px;font-weight:800;color:#8B1A1A;letter-spacing:-0.03em;">${nextBoost}</div>
                </div>
            </div>

            <!-- Progress to Next Tier -->
            <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-family:'JetBrains Mono',monospace;">Progress to Next Tier</span>
                    <span style="font-size:12px;font-weight:700;color:#111;font-family:'JetBrains Mono',monospace;">${progressLabel}</span>
                </div>
                <div style="height:6px;background:#f3f4f6;border-radius:3px;overflow:hidden;margin-bottom:10px;">
                    <div style="height:100%;background:linear-gradient(90deg,#8B1A1A,#b91c1c);border-radius:3px;width:${progressPct}%;transition:width 0.5s ease;"></div>
                </div>
                <div style="font-size:12px;color:#6b7280;display:flex;align-items:center;gap:6px;">
                    <span style="color:#9ca3af;">›</span>
                    <span>${progressHint}</span>
                </div>
            </div>

            <!-- Referral Link -->
            ${referralLink ? `
            <div style="background:#111;border-radius:8px;padding:20px 24px;margin-bottom:20px;">
                <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:'JetBrains Mono',monospace;margin-bottom:10px;">Your Referral Link</div>
                <div style="display:flex;gap:8px;">
                    <input id="referral-link-input" type="text" readonly value="${referralLink}"
                        style="flex:1;padding:10px 14px;border:1px solid #333;border-radius:5px;font-size:13px;font-family:'JetBrains Mono',monospace;background:#1a1a1a;color:#e5e5e5;outline:none;">
                    <button id="referral-copy-btn" style="padding:10px 20px;background:#8B1A1A;color:#fff;border:none;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:'JetBrains Mono',monospace;letter-spacing:0.04em;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:background 0.15s;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                        COPY
                    </button>
                </div>
            </div>` : ''}

            <!-- Boost Tiers -->
            <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                <div style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-family:'JetBrains Mono',monospace;">Boost Tiers</span>
                </div>
                ${tierRows}
            </div>

            <!-- How It Works -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:32px;">
                <div style="padding:24px 18px;border:1px solid #f3f4f6;border-radius:8px;background:#fafafa;">
                    <div style="font-size:28px;font-weight:800;color:#e5e7eb;letter-spacing:-0.02em;margin-bottom:6px;">01</div>
                    <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:6px;">Share Link</div>
                    <div style="font-size:12px;color:#6b7280;line-height:1.5;">Send your unique referral link to peers and colleagues.</div>
                </div>
                <div style="padding:24px 18px;border:1px solid #f3f4f6;border-radius:8px;background:#fafafa;">
                    <div style="font-size:28px;font-weight:800;color:#e5e7eb;letter-spacing:-0.02em;margin-bottom:6px;">02</div>
                    <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:6px;">They Join</div>
                    <div style="font-size:12px;color:#6b7280;line-height:1.5;">When they sign up and activate, your referral counts.</div>
                </div>
                <div style="padding:24px 18px;border:1px solid #f3f4f6;border-radius:8px;background:#fafafa;">
                    <div style="font-size:28px;font-weight:800;color:#e5e7eb;letter-spacing:-0.02em;margin-bottom:6px;">03</div>
                    <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:6px;">You Earn</div>
                    <div style="font-size:12px;color:#6b7280;line-height:1.5;">Permanent profit boost applied to all your contracts.</div>
                </div>
            </div>

            ${historyHtml}

            <!-- Footer note -->
            <div style="text-align:center;padding-top:24px;border-top:1px solid #f3f4f6;">
                <span style="font-size:11px;color:#9ca3af;">Boosts are permanent and stack with platform rewards. Terms apply.</span>
            </div>
        `;

        // Wire copy button
        const copyBtn = document.getElementById('referral-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const input = document.getElementById('referral-link-input');
                input.select();
                navigator.clipboard.writeText(input.value).then(() => {
                    copyBtn.innerHTML = `
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        COPIED
                    `;
                    copyBtn.style.background = '#166534';
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                            COPY
                        `;
                        copyBtn.style.background = '#8B1A1A';
                    }, 2000);
                });
            });
        }

    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        const msg = err.message || '';
        if (err.status === 401 || msg.includes('Unauthorized') || msg.includes('401')) {
            errorEl.innerHTML = `
                <div style="text-align:center;padding:60px 0;">
                    <div style="font-size:32px;margin-bottom:12px;">🔒</div>
                    <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:6px;">Sign in to view your referrals</div>
                    <div style="font-size:13px;color:#6b7280;margin-bottom:20px;">Your session has expired. Please sign in again.</div>
                    <button onclick="window.app.openAccessModal()" style="padding:12px 28px;background:#111;color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Neue Haas Grotesk Display',sans-serif;">Sign In</button>
                </div>
            `;
        } else {
            errorEl.innerHTML = `
                <div style="text-align:center;padding:60px 0;">
                    <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
                    <div style="font-size:14px;font-weight:600;color:#752122;">${msg || 'Failed to load referral data'}</div>
                </div>
            `;
        }
    }
}
