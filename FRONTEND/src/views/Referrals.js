/**
 * Referrals Page
 * 
 * Dashboard showing referral stats, boost tier, and shareable link.
 */

export function renderReferrals() {
    return `
        <div id="referrals-page" style="max-width:600px;margin:40px auto;padding:0 20px;font-family:'Neue Haas Grotesk Display','Helvetica Neue',sans-serif;">
            <div style="text-align:center;margin-bottom:32px;">
                <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 6px;letter-spacing:-0.02em;">Referral Program</h1>
                <p style="font-size:13px;color:#6b7280;margin:0;font-family:'JetBrains Mono',monospace;">Invite friends. Boost your contract payouts.</p>
            </div>

            <div id="referral-loading" style="text-align:center;padding:40px 0;">
                <div style="font-size:13px;color:#6b7280;">Loading referral data…</div>
            </div>

            <div id="referral-content" style="display:none;"></div>
            <div id="referral-error" style="display:none;text-align:center;padding:40px 0;color:#752122;font-size:13px;"></div>
        </div>
    `;
}

export function initReferrals() {
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

        const nextTierHtml = stats.nextTier
            ? `<div style="margin-top:14px;padding:10px;background:#fafafa;border:1px solid #e5e5e5;border-radius:4px;">
                   <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;font-family:'JetBrains Mono',monospace;margin-bottom:4px;">Next Level</div>
                   <div style="font-size:12px;color:#374151;">${stats.nextTier.needed} referrals → <strong>+${stats.nextTier.boostPct}%</strong></div>
                   <div style="margin-top:6px;height:4px;background:#e5e5e5;border-radius:2px;overflow:hidden;">
                       <div style="height:100%;background:#166534;border-radius:2px;width:${Math.min(100, (stats.referralCount / stats.nextTier.needed) * 100)}%;transition:width 300ms;"></div>
                   </div>
               </div>`
            : `<div style="margin-top:14px;padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;text-align:center;">
                   <div style="font-size:11px;color:#166534;font-weight:600;">🏆 Maximum boost reached</div>
               </div>`;

        // Build tier table
        const tierRows = stats.tiers.map(t => {
            const isUnlocked = stats.referralCount >= t.minReferrals;
            return `<tr style="opacity:${isUnlocked ? '1' : '0.5'};">
                <td style="padding:6px 10px;font-size:11px;font-family:'JetBrains Mono',monospace;border-bottom:1px solid #f3f4f6;">${t.minReferrals}${t.minReferrals === 1 ? ' referral' : ' referrals'}</td>
                <td style="padding:6px 10px;font-size:11px;font-weight:600;color:${isUnlocked ? '#166534' : '#6b7280'};border-bottom:1px solid #f3f4f6;">+${t.boostPct}%${stats.boostPct === t.boostPct ? ' ← you' : ''}</td>
            </tr>`;
        }).join('');

        // First-contract bonus callout
        const firstBonusHtml = stats.firstBonusAvailable
            ? `<div style="margin-bottom:16px;padding:12px;background:#fefce8;border:1px solid #fde68a;border-radius:6px;text-align:center;">
                   <div style="font-size:11px;font-weight:600;color:#92400e;">🎁 You have a +${stats.firstBonusPct}% bonus on your first contract!</div>
                   <div style="font-size:10px;color:#a16207;margin-top:2px;">Execute your first contract to claim it.</div>
               </div>`
            : '';

        contentEl.innerHTML = `
            ${firstBonusHtml}

            <!-- Boost Card -->
            <div style="background:#111;color:#fff;border-radius:8px;padding:24px;text-align:center;margin-bottom:16px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;font-family:'JetBrains Mono',monospace;margin-bottom:8px;">Your Profit Boost</div>
                <div style="font-size:36px;font-weight:800;letter-spacing:-0.02em;">+${stats.boostPct}%</div>
                <div style="font-size:11px;color:#9ca3af;margin-top:4px;font-family:'JetBrains Mono',monospace;">${stats.referralCount} referral${stats.referralCount !== 1 ? 's' : ''}</div>
            </div>

            ${nextTierHtml}

            <!-- Referral Link -->
            ${referralLink ? `
            <div style="margin-top:20px;padding:16px;border:1px solid #e5e5e5;border-radius:6px;background:#fafafa;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;font-family:'JetBrains Mono',monospace;margin-bottom:8px;">Your Referral Link</div>
                <div style="display:flex;gap:6px;">
                    <input id="referral-link-input" type="text" readonly value="${referralLink}" 
                        style="flex:1;padding:8px 10px;border:1px solid #d4d4d4;border-radius:4px;font-size:11px;font-family:'JetBrains Mono',monospace;background:#fff;color:#111;">
                    <button id="referral-copy-btn" style="padding:8px 14px;background:#111;color:#fff;border:none;border-radius:4px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:'Neue Haas Grotesk Display',sans-serif;">Copy</button>
                </div>
            </div>` : ''}

            <!-- Tier Table -->
            <div style="margin-top:20px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;font-family:'JetBrains Mono',monospace;margin-bottom:8px;">Boost Tiers</div>
                <table style="width:100%;border-collapse:collapse;">
                    ${tierRows}
                </table>
            </div>

            <!-- Referral History -->
            ${stats.referrals.length > 0 ? `
            <div style="margin-top:24px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;font-family:'JetBrains Mono',monospace;margin-bottom:8px;">Referral History</div>
                <div style="border:1px solid #e5e5e5;border-radius:6px;overflow:hidden;">
                    ${stats.referrals.map(r => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #f3f4f6;">
                            <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:#374151;">
                                ${new Date(r.createdAt).toLocaleDateString()}
                            </div>
                            <div style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:10px;
                                ${r.status === 'ACTIVATED'
                ? 'background:#f0fdf4;color:#166534;'
                : 'background:#fef3c7;color:#92400e;'}">
                                ${r.status}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
        `;

        // Wire copy button
        const copyBtn = document.getElementById('referral-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const input = document.getElementById('referral-link-input');
                input.select();
                navigator.clipboard.writeText(input.value).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                });
            });
        }

    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = err.message || 'Failed to load referral data';
    }
}
