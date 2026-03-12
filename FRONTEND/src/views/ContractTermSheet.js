// ContractTermSheet.js — Institutional Contract Term Sheet
// Mechanical specification page. Not marketing.

import { getMarketListings, hasAuthToken, getReferralStats } from '../api.js';
import { openExecutionModal } from './ExecutionModal.js';

export function renderContractTermSheet(params) {
    return `
        <style>
            .cts { max-width: 1120px; margin: 0 auto; padding: 32px 24px 80px; font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; }

            /* Breadcrumb */
            .cts-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 28px; }
            .cts-breadcrumb a, .cts-breadcrumb span {
                font-size: 10px; font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af;
                text-decoration: none; transition: color 150ms;
            }
            .cts-breadcrumb a:hover { color: #111; }
            .cts-breadcrumb .cts-bc-sep { font-size: 9px; color: #d4d4d4; }
            .cts-breadcrumb .cts-bc-current { color: #374151; font-weight: 600; }

            /* Two-Column Layout */
            .cts-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }
            @media (max-width: 860px) { .cts-layout { grid-template-columns: 1fr; } }

            /* Left Column */
            .cts-main { min-width: 0; }

            /* Header */
            .cts-hdr { margin-bottom: 24px; }
            .cts-hdr-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 8px; }
            .cts-title { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: #0a0a0a; line-height: 1.2; }
            .cts-id { font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #9ca3af; letter-spacing: 0.06em; padding: 4px 8px; border: 1px solid #e5e5e5; background: #fafafa; flex-shrink: 0; }
            .cts-meta-row { display: flex; align-items: center; gap: 16px; }
            .cts-provider { font-size: 12px; font-weight: 600; color: #374151; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.04em; }
            .cts-status { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #166534; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 2px 8px; }
            .cts-objective { font-size: 14px; color: #6b7280; line-height: 1.5; margin-top: 10px; }

            /* Divider */
            .cts-div { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }

            /* Section Header */
            .cts-sh { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; font-family: 'JetBrains Mono', monospace; margin-bottom: 16px; }

            /* Summary Terms Grid */
            .cts-terms-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid #d4d4d4; overflow: hidden; margin-bottom: 24px; }
            .cts-term-cell { padding: 16px 14px; border-right: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; background: #fafafa; }
            .cts-term-cell:nth-child(4n) { border-right: none; }
            .cts-term-cell:nth-last-child(-n+4) { border-bottom: none; }
            .cts-term-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; font-family: 'JetBrains Mono', monospace; font-weight: 600; margin-bottom: 6px; }
            .cts-term-val { font-size: 15px; font-weight: 600; color: #111; letter-spacing: -0.01em; }

            /* Subsection Blocks */
            .cts-block { margin-bottom: 20px; }
            .cts-block-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #374151; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
            .cts-block-text { font-size: 13px; color: #6b7280; line-height: 1.6; }

            /* Right Panel (Sticky) */
            .cts-panel { position: sticky; top: 24px; background: #fff; border: 1px solid #d4d4d4; border-top: 2px solid #752122; overflow: hidden; }
            .cts-panel-hdr { padding: 16px 20px; background: #fafafa; border-bottom: 1px solid #e5e5e5; }
            .cts-panel-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #374151; font-family: 'JetBrains Mono', monospace; }
            .cts-panel-body { padding: 20px; }
            .cts-panel-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
            .cts-panel-row:last-of-type { border-bottom: none; }
            .cts-panel-lbl { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'JetBrains Mono', monospace; font-weight: 500; }
            .cts-panel-val { font-size: 14px; font-weight: 600; color: #111; }
            .cts-panel-val.capital { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: #0a0a0a; }
            .cts-panel-val.success { color: #166534; }
            .cts-panel-val.failure { color: #752122; opacity: 0.85; }

            .cts-panel-div { border: none; border-top: 1px solid #e5e5e5; margin: 12px 0; }

            .cts-panel-escrow { font-size: 10px; color: #9ca3af; text-align: center; font-family: 'JetBrains Mono', monospace; margin: 12px 0 16px; }

            .cts-lock-btn {
                width: 100%; height: 48px; border: none;
                background: #752122; color: #fff;
                font-size: 12px; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.06em;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                cursor: pointer;
                transition: background 180ms ease, transform 100ms ease, box-shadow 180ms ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            }
            .cts-lock-btn:hover {
                background: #5a191a;
                box-shadow: 0 4px 12px rgba(117,33,34,0.2);
            }
            .cts-lock-btn:active { transform: translateY(1px); }

            /* Tier selector */
            .cts-tier-group { display: flex; gap: 6px; margin-bottom: 16px; }
            .cts-tier-opt {
                flex: 1; padding: 10px 6px; text-align: center;
                border: 1px solid #e5e5e5; background: #fafafa;
                font-size: 12px; font-weight: 600; color: #374151;
                font-family: 'JetBrains Mono', monospace;
                cursor: pointer; transition: all 150ms;
            }
            .cts-tier-opt:hover { border-color: #d4d4d4; background: #f5f5f5; }
            .cts-tier-opt.active { border-color: #374151; background: #fff; color: #0a0a0a; box-shadow: 0 0 0 1px #374151; }

            /* Loading */
            .cts-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
            .cts-spinner { width: 20px; height: 20px; border: 2px solid #e5e5e5; border-top-color: #374151; border-radius: 50%; animation: cts-spin 0.7s linear infinite; }
            @keyframes cts-spin { to { transform: rotate(360deg); } }

            .cts-error { text-align: center; padding: 60px 20px; color: #6b7280; font-size: 14px; }
            .cts-error-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #374151; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px; }

            /* Two-col subsection grid */
            .cts-subsections { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 32px; }
            @media (max-width: 640px) { .cts-subsections { grid-template-columns: 1fr; } }
        </style>

        <div class="cts">
            <div class="cts-breadcrumb">
                <a href="#/overview">Market</a>
                <span class="cts-bc-sep">›</span>
                <span class="cts-bc-current">Term Sheet</span>
            </div>

            <div id="cts-loading" class="cts-loading">
                <div class="cts-spinner"></div>
            </div>

            <div id="cts-error" class="cts-error" style="display:none;">
                <div class="cts-error-title">Contract Not Found</div>
                <p>This contract does not exist or has expired.</p>
            </div>

            <div id="cts-content" style="display:none;">
                <div class="cts-layout">
                    <!-- Left: Term Sheet -->
                    <div class="cts-main" id="cts-main"></div>

                    <!-- Right: Sticky Execution Panel -->
                    <div id="cts-panel"></div>
                </div>
            </div>
        </div>
    `;
}

export async function initContractTermSheet(params) {
    const contractId = params?.id;
    if (!contractId) {
        showError();
        return;
    }

    try {
        const data = await getMarketListings();
        const listings = data?.listings || data?.items || data?.contracts || [];
        const contract = listings.find(c => c.id === contractId);

        if (!contract) {
            showError();
            return;
        }

        showContent(contract);

    } catch (err) {
        console.error('[TermSheet] Failed to load:', err);
        showError();
    }
}

function showError() {
    const loading = document.getElementById('cts-loading');
    const error = document.getElementById('cts-error');
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'block';
}

function showContent(c) {
    const loading = document.getElementById('cts-loading');
    const content = document.getElementById('cts-content');
    const main = document.getElementById('cts-main');
    const panel = document.getElementById('cts-panel');

    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';

    // Data extraction
    const id = c.id || '';
    const shortId = id.split('-')[0].slice(0, 4).toUpperCase();
    const title = c.title || 'Performance Contract';
    const provider = (c.provider || c.platform || c.source || 'stripe').toString().toLowerCase();
    const providerLabelMap = {
        'youtube': 'YouTube', 'x': 'X (Twitter)', 'twitter': 'X (Twitter)',
        'stripe': 'Stripe', 'shopify': 'Shopify', 'github': 'GitHub', 'amazon': 'Amazon',
    };
    const displayProvider = providerLabelMap[provider] || provider.charAt(0).toUpperCase() + provider.slice(1);
    const tier = (c.tier || 'controlled').toLowerCase();
    const tierUpper = tier.toUpperCase();
    const minStake = c.min_stake || 100;
    const maxStake = c.max_stake || 1500;
    const feeBps = c.fee_bps || 250;
    const feePercent = (feeBps / 100).toFixed(1);
    const windowDays = 30;
    const multiplier = tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.5;
    const winRate = tierUpper === 'CONTROLLED' ? '~30%' : tierUpper === 'ELEVATED' ? '~20%' : '~10%';
    const targetHint = c.target_hint || c.display_target_hint || '+15%';
    const stakeRange = (minStake === maxStake) ? `$${minStake.toLocaleString()}` : `$${minStake.toLocaleString()} – $${maxStake.toLocaleString()}`;
    const domain = (c.domain || 'commerce').charAt(0).toUpperCase() + (c.domain || 'commerce').slice(1);

    // === LEFT COLUMN ===
    main.innerHTML = `
        <!-- Header -->
        <div class="cts-hdr">
            <div class="cts-hdr-top">
                <div class="cts-title">${title}</div>
                <div class="cts-id">RCP-${shortId}</div>
            </div>
            <div class="cts-meta-row">
                <span class="cts-provider">${displayProvider}</span>
                <span class="cts-status">Active</span>
            </div>
            <div class="cts-objective">
                Performance contract targeting ${targetHint} ${domain.toLowerCase()} growth within a ${windowDays}-day measurement window.
            </div>
        </div>

        <hr class="cts-div">

        <!-- Section: Summary Terms -->
        <div class="cts-sh">Summary Terms</div>
        <div class="cts-terms-grid">
            <div class="cts-term-cell">
                <div class="cts-term-lbl">Duration</div>
                <div class="cts-term-val">${windowDays} Days</div>
            </div>
            <div class="cts-term-cell">
                <div class="cts-term-lbl">Target Requirement</div>
                <div class="cts-term-val">${targetHint}</div>
            </div>
            <div class="cts-term-cell">
                <div class="cts-term-lbl">Stake Range</div>
                <div class="cts-term-val">${stakeRange}</div>
            </div>
            <div class="cts-term-cell">
                <div class="cts-term-lbl">Settlement</div>
                <div class="cts-term-val">Binary</div>
            </div>
        </div>

        <hr class="cts-div">

        <!-- Section: Verification & Settlement -->
        <div class="cts-sh">Verification & Settlement</div>
        <div class="cts-subsections">
            <div class="cts-block">
                <div class="cts-block-title">Source of Truth</div>
                <div class="cts-block-text">Data retrieved directly from connected ${displayProvider} account.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Baseline Snapshot</div>
                <div class="cts-block-text">Baseline captured at execution timestamp.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Measurement Window</div>
                <div class="cts-block-text">Begins immediately upon execution confirmation.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Settlement Logic</div>
                <div class="cts-block-text">Automatic settlement at window close.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Fail-Closed Policy</div>
                <div class="cts-block-text">If provider API cannot verify, contract fails.</div>
            </div>
        </div>

        <hr class="cts-div">

        <!-- Section: Economic Structure -->
        <div class="cts-sh">Economic Structure</div>
        <div class="cts-subsections">
            <div class="cts-block">
                <div class="cts-block-title">Platform Fee</div>
                <div class="cts-block-text">${feePercent}% of payout.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Payout Structure</div>
                <div class="cts-block-text">Fixed ${multiplier}× multiplier on locked capital.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Implied Win Rate</div>
                <div class="cts-block-text">${winRate} — tier dependent.</div>
            </div>
        </div>

        <hr class="cts-div">

        <!-- Section: Risk & Edge Cases -->
        <div class="cts-sh">Risk & Edge Cases</div>
        <div class="cts-subsections">
            <div class="cts-block">
                <div class="cts-block-title">Refund Handling</div>
                <div class="cts-block-text">Refunded transactions excluded from metric calculation.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Anti-Gaming Controls</div>
                <div class="cts-block-text">Minimum baseline floor. Objective provider filters. No manual overrides.</div>
            </div>
            <div class="cts-block">
                <div class="cts-block-title">Dispute Policy</div>
                <div class="cts-block-text">Deterministic provider data only. No appeals.</div>
            </div>
        </div>
    `;

    // === RIGHT COLUMN — Sticky Execution Panel ===
    let currentStake = minStake;
    let currentPayout = Math.round(currentStake * multiplier);

    // Build tier options from stake range
    const tierSteps = buildTierSteps(minStake, maxStake);

    panel.innerHTML = `
        <div class="cts-panel">
            <div class="cts-panel-hdr">
                <div class="cts-panel-title">Execute Contract</div>
            </div>
            <div class="cts-panel-body">
                <div class="cts-panel-row">
                    <span class="cts-panel-lbl">Selected Tier</span>
                    <span class="cts-panel-val" id="cts-tier-label">${tierUpper}</span>
                </div>

                <div class="cts-tier-group" id="cts-tier-group">
                    ${tierSteps.map((s, i) => `<div class="cts-tier-opt${i === 0 ? ' active' : ''}" data-stake="${s}">$${s.toLocaleString()}</div>`).join('')}
                </div>

                <div class="cts-panel-row">
                    <span class="cts-panel-lbl">Capital Locked</span>
                    <span class="cts-panel-val capital" id="cts-stake-val">$${currentStake.toLocaleString()}</span>
                </div>
                <div class="cts-panel-row">
                    <span class="cts-panel-lbl">If Successful</span>
                    <span class="cts-panel-val success" id="cts-payout-val">+$${currentPayout.toLocaleString()}</span>
                </div>
                <div id="cts-bonus-row" style="display:none;"></div>
                <div class="cts-panel-row">
                    <span class="cts-panel-lbl">If Failed</span>
                    <span class="cts-panel-val failure" id="cts-loss-val">-$${currentStake.toLocaleString()}</span>
                </div>

                <hr class="cts-panel-div">

                <div class="cts-panel-escrow">Capital is held in escrow until settlement.</div>

                <button class="cts-lock-btn" id="cts-lock-btn">LOCK $${currentStake.toLocaleString()} CAPITAL →</button>
            </div>
        </div>
    `;

    // Wire tier selectors
    const tierGroup = document.getElementById('cts-tier-group');
    const stakeVal = document.getElementById('cts-stake-val');
    const payoutVal = document.getElementById('cts-payout-val');
    const lossVal = document.getElementById('cts-loss-val');
    const lockBtn = document.getElementById('cts-lock-btn');
    const bonusRow = document.getElementById('cts-bonus-row');
    let referralBonusPct = 0;

    if (tierGroup) {
        tierGroup.addEventListener('click', (e) => {
            const opt = e.target.closest('.cts-tier-opt');
            if (!opt) return;

            tierGroup.querySelectorAll('.cts-tier-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            currentStake = parseInt(opt.dataset.stake);
            const basePayout = Math.round(currentStake * multiplier);
            const bonusAmt = referralBonusPct > 0 ? Math.round(basePayout * referralBonusPct / 100) : 0;
            currentPayout = basePayout + bonusAmt;

            stakeVal.textContent = `$${currentStake.toLocaleString()}`;
            payoutVal.textContent = `+$${currentPayout.toLocaleString()}`;
            lossVal.textContent = `-$${currentStake.toLocaleString()}`;
            lockBtn.textContent = `LOCK $${currentStake.toLocaleString()} CAPITAL →`;
            if (bonusRow && referralBonusPct > 0) {
                bonusRow.innerHTML = `<div class="cts-panel-row" style="background:#f0fdf4;border:1px solid #bbf7d0;padding:4px 12px;margin:2px 0;"><span class="cts-panel-lbl" style="color:#15803d;font-weight:600;font-size:9px;">🎁 Referral Bonus (+${referralBonusPct}%)</span><span class="cts-panel-val success" style="font-size:12px;">+$${bonusAmt.toLocaleString()}</span></div>`;
            }
        });
    }

    // Wire LOCK button → execution modal
    if (lockBtn) {
        lockBtn.addEventListener('click', () => {
            const params = new URLSearchParams({
                id,
                tier,
                source: provider,
                capital: currentStake
            });
            window.router.navigate('/contracts/execute?' + params.toString());
        });
    }

    // Fetch referral bonus asynchronously
    if (hasAuthToken()) {
        console.log('[TermSheet] Fetching referral stats...');
        getReferralStats().then(stats => {
            console.log('[TermSheet] Referral stats:', stats);
            if (stats && stats.firstBonusAvailable && stats.firstBonusPct > 0) {
                referralBonusPct = stats.firstBonusPct;
                const basePayout = Math.round(currentStake * multiplier);
                const bonusAmt = Math.round(basePayout * referralBonusPct / 100);
                currentPayout = basePayout + bonusAmt;
                if (payoutVal) payoutVal.textContent = `+$${currentPayout.toLocaleString()}`;
                if (bonusRow) {
                    bonusRow.style.display = 'block';
                    bonusRow.innerHTML = `<div class="cts-panel-row" style="background:#f0fdf4;border:1px solid #bbf7d0;padding:4px 12px;margin:2px 0;"><span class="cts-panel-lbl" style="color:#15803d;font-weight:600;font-size:9px;">🎁 Referral Bonus (+${referralBonusPct}%)</span><span class="cts-panel-val success" style="font-size:12px;">+$${bonusAmt.toLocaleString()}</span></div>`;
                }
            } else {
                console.log('[TermSheet] No referral bonus available:', { firstBonusAvailable: stats?.firstBonusAvailable, wasReferred: stats?.wasReferred });
            }
        }).catch(err => { console.error('[TermSheet] Referral stats fetch failed:', err); });
    } else {
        console.log('[TermSheet] No auth token, skipping referral bonus check');
    }
}

function buildTierSteps(min, max) {
    if (min === max || max <= 0) return [min || 25];
    const steps = [min];
    const candidates = [100, 250, 500, 1000, 1500, 2000, 3000, 5000, 10000];
    for (const v of candidates) {
        if (v > min && v <= max && steps.length < 4) steps.push(v);
    }
    if (!steps.includes(max) && steps.length < 5) steps.push(max);
    return steps;
}
