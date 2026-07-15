// MyContracts.js — Personal Performance Hub
// Matches ActiveContracts.js institutional layout

export function renderMyContracts() {
    return `
        <style>
            .myc {
                background: #fbfbf9;
                min-height: calc(100vh - 72px);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: #1e1e1e;
            }

            /* ── Page Header ── */
            .myc-header {
                padding: 48px 32px 0;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            .myc-title-wrap {}
            .myc-page-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: -1.2px;
                color: #111;
                margin: 0;
            }
            .myc-page-sub {
                font-size: 13px;
                color: #8a8984;
                margin: 8px 0 0;
                line-height: 1.6;
                max-width: 600px;
            }

            .myc-header-actions {
                display: flex;
                gap: 12px;
            }
            .myc-btn-secondary {
                padding: 10px 18px;
                background: #fff;
                border: 1px solid rgba(0,0,0,0.08);
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .myc-btn-secondary:hover {
                border-color: rgba(92, 20, 20, 0.25);
                background: rgba(92, 20, 20, 0.02);
                color: #5C1414;
                transform: translateY(-1px);
            }
            .myc-btn-primary {
                padding: 10px 18px;
                background: #111111;
                color: #ffffff;
                border: none;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(92, 20, 20, 0.1);
            }
            .myc-btn-primary:hover {
                background: #5C1414;
                transform: translateY(-1px);
                box-shadow: 0 6px 18px rgba(92, 20, 20, 0.25);
            }
            .myc-btn-primary::before {
                content: '';
                position: absolute;
                top: 0;
                left: -150%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
                transform: skewX(-25deg);
                pointer-events: none;
                z-index: 5;
            }
            .myc-btn-primary:hover::before {
                left: 150%;
                transition: left 0.8s ease-in-out;
            }

            /* ── Metrics Strip ── */
            .myc-metrics {
                display: flex;
                align-items: stretch;
                padding: 32px;
                gap: 16px;
                border-bottom: none;
            }
            .myc-metric {
                flex: 1;
                padding: 20px 24px;
                background: #fff;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .myc-metric:hover {
                border-color: rgba(92, 20, 20, 0.15);
                box-shadow: 0 8px 24px rgba(92, 20, 20, 0.04);
                transform: translateY(-2px);
            }
            .myc-metric-value {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 28px;
                font-weight: 800;
                color: #111;
                letter-spacing: -1px;
                line-height: 1.2;
                margin-bottom: 6px;
            }
            .myc-metric-subtext {
                display: block;
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 500;
                color: #8a8984;
                margin-top: 4px;
                text-transform: none;
                letter-spacing: 0px;
                line-height: 1.4;
            }
            .myc-metric-label {
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8a8984;
            }

            .myc-feed { padding: 16px 32px 80px; }

            /* Loading */
            .myc-loading { display: flex; flex-direction: column; align-items: center; padding: 80px 0; gap: 16px; }
            @keyframes cl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cl-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }

            /* --- INJECTED CARD GRID CSS --- */
            
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
            }
            .eq-card {
                background: #fff;
                padding: 32px 28px;
                border-radius: 16px;
                border: 1px solid rgba(0,0,0,0.05);
                box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                cursor: pointer;
                transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
            }
            .eq-card:hover {
                background: #fff;
                transform: translateY(-4px);
                border-color: rgba(92, 20, 20, 0.15);
                box-shadow: 0 16px 48px -16px rgba(92, 20, 20, 0.08), 0 0 1px rgba(92, 20, 20, 0.12);
            }
            .eq-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #5C1414;
                transition: width 0.4s ease;
            }
            .eq-card:hover::before { width: 100%; }
            .eq-card-meta {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .eq-closing { color: #5C1414; font-weight: 700; }
            .eq-id { color: #ccc; }
            .eq-time { color: #ccc; display: flex; align-items: center; gap: 4px; }

            .eq-card-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 18px;
                font-weight: 800;
                color: #111;
                margin: 12px 0 8px;
                letter-spacing: -0.5px;
            }
            .eq-card-provider {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            .eq-provider-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                text-transform: uppercase;
                color: #888;
            }
            .eq-tier-badge {
                padding: 3px 8px;
                font-size: 9px;
                font-weight: 700;
                border-radius: 2px;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.5px;
            }
            .eq-tier-badge.controlled { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
            .eq-tier-badge.elevated { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }
            .eq-tier-badge.maximum { background: #fff1f2; color: #9f1239; border: 1px solid #ffe4e6; }

            .eq-card-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #10b981;
                text-transform: uppercase;
                margin-bottom: 16px;
            }
            .eq-card-status .dot { width: 4px; height: 4px; border-radius: 50%; background: currentcolor; }

            .eq-card-stake-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
            }
            .eq-stake-val {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -1px;
            }
            .eq-stake-separator { width: 16px; height: 1px; background: #eee; }
            .eq-stake-lbl {
                font-family: 'Inter', sans-serif;
                font-size: 9px;
                color: #8a8984;
                text-transform: uppercase;
                margin-top: 4px;
                font-weight: 600;
            }

            .eq-card-cta {
                background: #111111;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 16px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                width: 100%;
                cursor: pointer;
                margin-top: auto;
                position: relative;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .eq-card-cta:hover {
                background: #5C1414;
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(92,20,20,0.25);
            }
            .eq-card-cta::before {
                content: '';
                position: absolute;
                top: 0;
                left: -150%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transform: skewX(-25deg);
                pointer-events: none;
                z-index: 5;
            }
            .eq-card-cta:hover::before {
                left: 150%;
                transition: left 0.8s ease-in-out;
            }
            .eq-card-footer {
                font-size: 10px;
                color: #8a8984;
                text-align: center;
                margin-top: 12px;
                font-style: italic;
            }

            @media (max-width: 768px) {
                .myc-header { padding: 32px 16px 0; flex-direction: column; align-items: flex-start; gap: 16px; }
                .myc-metrics { padding: 24px 16px; flex-wrap: wrap; gap: 12px; }
                .myc-metric { min-width: calc(50% - 6px); }
                .myc-feed { padding: 24px 16px 60px; }
                .eq-grid { grid-template-columns: 1fr; gap: 16px; }
            }

            /* --- ONBOARDING STYLES --- */
            .myc-onboarding-wrapper {
                display: flex;
                flex-direction: column;
                gap: 40px;
                margin-top: 8px;
            }
            .myo-welcome-hero {
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
            }
            .myo-welcome-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 20px;
                font-weight: 800;
                color: #111;
                margin: 0 0 8px;
                letter-spacing: -0.5px;
            }
            .myo-welcome-desc {
                font-size: 13px;
                color: #666;
                line-height: 1.65;
                margin: 0;
                max-width: 680px;
            }
            
            .myo-grid-layout {
                display: grid;
                grid-template-columns: 1.6fr 1fr;
                gap: 32px;
                align-items: start;
            }
            
            .myo-column-main {
                display: flex;
                flex-direction: column;
                gap: 40px;
            }
            .myo-column-side {
                display: flex;
                flex-direction: column;
                gap: 32px;
            }
            
            .myo-section {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .myo-section-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #8a8984;
                margin: 0;
            }
            
            /* Checklist */
            .myo-checklist {
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
            }
            .myo-checklist-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px 24px;
                border-bottom: 1px solid rgba(0,0,0,0.03);
            }
            .myo-checklist-item:last-child {
                border-bottom: none;
            }
            .myo-check-box {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1.5px solid #DDD;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .myo-check-icon {
                width: 12px;
                height: 12px;
                color: #5C1414;
                display: none;
            }
            .myo-checklist-item.completed .myo-check-box {
                background: rgba(92, 20, 20, 0.08);
                border-color: #5C1414;
            }
            .myo-checklist-item.completed .myo-check-icon {
                display: block;
            }
            .myo-check-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .myo-check-title {
                font-size: 13px;
                font-weight: 700;
                color: #111;
            }
            .myo-check-sub {
                font-size: 11px;
                color: #888;
            }
            .myo-check-btn {
                background: #fff;
                border: 1px solid rgba(0,0,0,0.08);
                border-radius: 4px;
                padding: 6px 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s;
            }
            .myo-check-btn:hover {
                border-color: #5C1414;
                color: #5C1414;
            }
            .myo-checklist-item.completed .myo-check-btn {
                display: none;
            }
            
            /* Benefits */
            .myo-benefits-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }
            .myo-benefit-card {
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .myo-benefit-icon {
                color: #5C1414;
                display: flex;
                align-items: center;
                margin-bottom: 4px;
            }
            .myo-benefit-icon svg {
                width: 20px;
                height: 20px;
            }
            .myo-benefit-title {
                font-size: 13px;
                font-weight: 700;
                color: #111;
            }
            .myo-benefit-desc {
                font-size: 11px;
                color: #777;
                line-height: 1.5;
            }
            
            /* Templates */
            .myo-templates-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }
            .myo-temp-card {
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                gap: 12px;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
            }
            .myo-temp-card:hover {
                transform: translateY(-2px);
                border-color: rgba(92, 20, 20, 0.15);
                box-shadow: 0 8px 24px rgba(92, 20, 20, 0.04);
            }
            .myo-temp-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .myo-temp-platform {
                font-size: 12px;
                font-weight: 700;
                color: #111;
            }
            .myo-temp-category {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                color: #5C1414;
                background: rgba(92, 20, 20, 0.04);
                border: 1px solid rgba(92, 20, 20, 0.12);
                border-radius: 2px;
                padding: 1px 5px;
                text-transform: uppercase;
            }
            .myo-temp-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 14px;
                font-weight: 800;
                color: #111;
                line-height: 1.3;
            }
            .myo-temp-btn {
                align-self: start;
                background: none;
                border: none;
                padding: 0;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                color: #5C1414;
                text-transform: uppercase;
                cursor: pointer;
                letter-spacing: 0.5px;
            }
            .myo-temp-btn:hover {
                color: #7A1D1D;
            }
            
            /* Sidebar boxes */
            .myo-side-box {
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                padding: 28px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .myo-side-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #8a8984;
                margin: 0;
            }
            
            /* Identity Preview */
            .myo-identity-card {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .myo-identity-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .myo-identity-level {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 16px;
                font-weight: 800;
                color: #111;
            }
            .myo-identity-status {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                color: #d97706;
                background: #fffbeb;
                border: 1px solid #fef3c7;
                padding: 2px 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .myo-identity-metrics {
                display: flex;
                flex-direction: column;
                gap: 10px;
                border-top: 1px solid rgba(0,0,0,0.03);
                border-bottom: 1px solid rgba(0,0,0,0.03);
                padding: 12px 0;
            }
            .myo-id-metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .myo-id-val {
                font-size: 13px;
                font-weight: 700;
                color: #111;
            }
            .myo-id-lbl {
                font-size: 11px;
                color: #888;
            }
            .myo-identity-footer {
                font-size: 11px;
                color: #666;
            }
            
            /* Roadmap */
            .myo-roadmap {
                display: flex;
                flex-direction: column;
                gap: 16px;
                position: relative;
                padding-left: 18px;
            }
            .myo-roadmap::before {
                content: '';
                position: absolute;
                left: 4px;
                top: 8px;
                bottom: 8px;
                width: 1px;
                background: #E5E5E5;
            }
            .myo-roadmap-item {
                display: flex;
                gap: 12px;
                position: relative;
            }
            .myo-road-node {
                position: absolute;
                left: -18px;
                top: 4px;
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #FFFFFF;
                border: 1.5px solid #DDD;
                z-index: 5;
            }
            .myo-roadmap-item.active .myo-road-node {
                background: #5C1414;
                border-color: #5C1414;
                box-shadow: 0 0 0 3px rgba(92, 20, 20, 0.15);
            }
            .myo-road-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .myo-road-lbl {
                font-size: 11px;
                font-weight: 700;
                color: #666;
            }
            .myo-roadmap-item.active .myo-road-lbl {
                color: #111;
            }
            .myo-road-desc {
                font-size: 10px;
                color: #aaa;
            }
            
            /* Activity Feed */
            .myo-activity-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .myo-act-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            .myo-act-icon {
                margin-top: 2px;
                display: flex;
                align-items: center;
            }
            .myo-act-icon svg {
                width: 14px;
                height: 14px;
            }
            .myo-act-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 1px;
            }
            .myo-act-title {
                font-size: 11px;
                font-weight: 700;
                color: #111;
            }
            .myo-act-sub {
                font-size: 10px;
                color: #888;
            }
            .myo-act-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
            }
            
            /* Motivation Panel */
            .myo-motivation-panel {
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                padding: 40px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-shadow: 0 4px 16px rgba(0,0,0,0.01);
            }
            .myo-motivation-title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 16px;
                font-weight: 800;
                color: #111;
                margin: 0 0 8px 0;
            }
            .myo-motivation-sub {
                font-size: 12px;
                color: #666;
                margin: 0 0 24px 0;
            }
            .myo-motivation-ctas {
                display: flex;
                gap: 16px;
            }
            
            @media (max-width: 1024px) {
                .myo-grid-layout {
                    grid-template-columns: 1fr;
                    gap: 32px;
                }
            }
        </style>

        <div class="myc">
            <div class="myc-header" data-reveal>
                <div class="myc-title-wrap">
                    <h1 class="myc-page-title">Active <span style="color: #5C1414;">Commitments</span></h1>
                    <p class="myc-page-sub">Every completed commitment permanently strengthens your Execution Identity, increases trust capacity, and expands what you can accomplish on the network.</p>
                </div>
                <div class="myc-header-actions">
                    <button class="myc-btn-secondary" onclick="window.router.navigate('/profile')">View Identity</button>
                    <button class="myc-btn-primary" onclick="window.router.navigate('/market')">New Contract</button>
                </div>
            </div>

            <div class="myc-metrics" data-reveal>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-total-locked">—</div>
                    <div class="myc-metric-label">Total Locked</div>
                </div>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-active-count">—</div>
                    <div class="myc-metric-label">Active Contracts</div>
                </div>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-settle-rate">—</div>
                    <div class="myc-metric-label">Settlement Rate</div>
                </div>
                <div class="myc-metric">
                    <div class="myc-metric-value" id="myc-avg-risk">—</div>
                    <div class="myc-metric-label">Total Payout</div>
                </div>
            </div>

            <div class="myc-feed" data-reveal>
                <div id="myc-content">
                    <div class="myc-loading">
                        <div style="position:relative;width:48px;height:48px;">
                            <svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="15.5" stroke="#3B0001" stroke-width="2"/><line x1="32" y1="19.5" x2="32" y2="44.5" stroke="#3B0001" stroke-width="1.5" stroke-linecap="round" style="animation:cl-pulse 1.6s ease-in-out infinite"/></svg>
                            <svg style="position:absolute;top:0;left:0;width:100%;height:100%;animation:cl-spin 2.4s linear infinite;transform-origin:center center" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="26.5" ry="7.5" stroke="#3B0001" stroke-width="1.1" fill="none" transform="rotate(-27 32 32)"/></svg>
                        </div>
                        <p style="font-family:'JetBrains Mono', monospace; font-size:10px; color:#888; text-transform:uppercase;">Retrieving personal record...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initMyContracts() {
    const container = document.getElementById('myc-content');
    if (!container) return;

    try {
        const response = await window.api.getContracts();
        const contracts = response?.contracts || [];

        // Summary Calculations
        const totalLocked = contracts.reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);
        const activeCount = contracts.filter(c => !c.isTerminal).length;

        const terminal = contracts.filter(c => c.isTerminal);
        const wins = terminal.filter(c => ['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE'].includes(c.derivedState || c.state)).length;
        const rate = terminal.length > 0 ? (wins / terminal.length * 100).toFixed(1) + '%' : '100%';

        const totalPayout = contracts.reduce((sum, c) => sum + (c.payoutAmountUsdCents || 0), 0);

        if (contracts.length === 0) {
            document.getElementById('myc-total-locked').innerHTML = '—<span class="myc-metric-subtext">No Capital Locked</span>';
            document.getElementById('myc-active-count').innerHTML = '0<span class="myc-metric-subtext">No Active Commitments</span>';
            document.getElementById('myc-settle-rate').innerHTML = '—<span class="myc-metric-subtext">No Settlements Yet</span>';
            document.getElementById('myc-avg-risk').innerHTML = '—<span class="myc-metric-subtext">No Settlements Yet</span>';

            // Query dynamic checklist states
            let isSourceConnected = false;
            let isIdentityVerified = false;
            try {
                const xStatus = await window.api.getXStatus().catch(() => null);
                const stripeStatus = await window.api.getStripeStatus().catch(() => null);
                const shopifyStatus = await window.api.getShopifyStatus().catch(() => null);
                const youtubeStatus = await window.api.getYouTubeStatus().catch(() => null);
                if (xStatus?.connected || stripeStatus?.connected || shopifyStatus?.connected || youtubeStatus?.connected) {
                    isSourceConnected = true;
                }

                // If user has a wallet connected or loaded profile
                const profile = await window.api.getProfile().catch(() => null);
                if (profile || window.ethereum?.selectedAddress) {
                    isIdentityVerified = true;
                }
            } catch (e) {
                console.warn('[MyContracts] Status check error:', e);
            }

            container.innerHTML = `
                <div class="myc-onboarding-wrapper">
                    <!-- Section 1: Welcome Card -->
                    <div class="myo-welcome-hero" data-reveal>
                        <h2 class="myo-welcome-title">Welcome to Your Execution Dashboard</h2>
                        <p class="myo-welcome-desc">Your execution history begins with your first commitment. Every completed contract permanently improves your reputation, increases trust capacity, and unlocks more opportunities across the protocol.</p>
                        <div style="display:flex; gap:12px; margin-top:20px;">
                            <button class="myc-btn-primary" onclick="window.router.navigate('/market')">Create First Commitment</button>
                            <button class="myc-btn-secondary" onclick="document.getElementById('suggested-templates-lbl').scrollIntoView({ behavior: 'smooth' })">Browse Templates</button>
                        </div>
                    </div>

                    <div class="myo-grid-layout">
                        <div class="myo-column-main">
                            <!-- Section 2: Getting Started Checklist -->
                            <div class="myo-section" data-reveal>
                                <h3 class="myo-section-lbl">Getting Started</h3>
                                <div class="myo-checklist">
                                    <div class="myo-checklist-item ${isIdentityVerified ? 'completed' : ''}">
                                        <div class="myo-check-box"><i data-lucide="check" class="myo-check-icon" style="${isIdentityVerified ? 'display:block;' : ''}"></i></div>
                                        <div class="myo-check-info">
                                            <span class="myo-check-title">Verify Identity</span>
                                            <span class="myo-check-sub">Generate your cryptographic execution signature on-chain.</span>
                                        </div>
                                        <button class="myo-check-btn" onclick="window.router.navigate('/profile')">Verify</button>
                                    </div>
                                    <div class="myo-checklist-item ${isSourceConnected ? 'completed' : ''}">
                                        <div class="myo-check-box"><i data-lucide="check" class="myo-check-icon" style="${isSourceConnected ? 'display:block;' : ''}"></i></div>
                                        <div class="myo-check-info">
                                            <span class="myo-check-title">Connect Verified Source</span>
                                            <span class="myo-check-sub">Bind APIs like Stripe, YouTube, or Shopify to verify outcomes.</span>
                                        </div>
                                        <button class="myo-check-btn" onclick="window.router.navigate('/sources')">Go to Sources</button>
                                    </div>
                                    <div class="myo-checklist-item">
                                        <div class="myo-check-box"><i data-lucide="check" class="myo-check-icon"></i></div>
                                        <div class="myo-check-info">
                                            <span class="myo-check-title">Create First Commitment</span>
                                            <span class="myo-check-sub">Choose a performance goal and lock CLTR or collateral.</span>
                                        </div>
                                    </div>
                                    <div class="myo-checklist-item">
                                        <div class="myo-check-box"><i data-lucide="check" class="myo-check-icon"></i></div>
                                        <div class="myo-check-info">
                                            <span class="myo-check-title">Complete First Settlement</span>
                                            <span class="myo-check-sub">Fulfill your goal to release collateral and boost reputation.</span>
                                        </div>
                                    </div>
                                    <div class="myo-checklist-item">
                                        <div class="myo-check-box"><i data-lucide="check" class="myo-check-icon"></i></div>
                                        <div class="myo-check-info">
                                            <span class="myo-check-title">Reach Level II Reputation</span>
                                            <span class="myo-check-sub">Perform high-rate settlements to elevate reputation status.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 4: Suggested Commitment Templates -->
                            <div class="myo-section" data-reveal>
                                <h3 class="myo-section-lbl" id="suggested-templates-lbl">Suggested Commitment Templates</h3>
                                <div class="myo-templates-grid">
                                    <div class="myo-temp-card" onclick="window.router.navigate('/market')">
                                        <div class="myo-temp-header">
                                            <span class="myo-temp-platform">YouTube</span>
                                            <span class="myo-temp-category">Creators</span>
                                        </div>
                                        <span class="myo-temp-title">Reach 10,000 subscribers</span>
                                        <div style="font-size:11px; color:#888; display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                                            <span>Duration: <strong>90 days</strong></span>
                                            <span>Source: <strong>YouTube Data API</strong></span>
                                            <span>Collateral: <strong>1,000 CLTR</strong></span>
                                        </div>
                                        <button class="myo-temp-btn" style="margin-top:8px;">Create Commitment</button>
                                    </div>
                                    <div class="myo-temp-card" onclick="window.router.navigate('/market')">
                                        <div class="myo-temp-header">
                                            <span class="myo-temp-platform">Stripe</span>
                                            <span class="myo-temp-category">Finance</span>
                                        </div>
                                        <span class="myo-temp-title">Generate $25,000 monthly revenue</span>
                                        <div style="font-size:11px; color:#888; display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                                            <span>Duration: <strong>30 days</strong></span>
                                            <span>Source: <strong>Stripe Connect</strong></span>
                                            <span>Collateral: <strong>2,500 CLTR</strong></span>
                                        </div>
                                        <button class="myo-temp-btn" style="margin-top:8px;">Create Commitment</button>
                                    </div>
                                    <div class="myo-temp-card" onclick="window.router.navigate('/market')">
                                        <div class="myo-temp-header">
                                            <span class="myo-temp-platform">Shopify</span>
                                            <span class="myo-temp-category">Commerce</span>
                                        </div>
                                        <span class="myo-temp-title">Complete 500 orders</span>
                                        <div style="font-size:11px; color:#888; display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                                            <span>Duration: <strong>30 days</strong></span>
                                            <span>Source: <strong>Shopify API</strong></span>
                                            <span>Collateral: <strong>1,500 CLTR</strong></span>
                                        </div>
                                        <button class="myo-temp-btn" style="margin-top:8px;">Create Commitment</button>
                                    </div>
                                    <div class="myo-temp-card" onclick="window.router.navigate('/market')">
                                        <div class="myo-temp-header">
                                            <span class="myo-temp-platform">GitHub</span>
                                            <span class="myo-temp-category">Development</span>
                                        </div>
                                        <span class="myo-temp-title">Ship Version 2.0 release tag</span>
                                        <div style="font-size:11px; color:#888; display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                                            <span>Duration: <strong>60 days</strong></span>
                                            <span>Source: <strong>GitHub Webhooks</strong></span>
                                            <span>Collateral: <strong>1,200 CLTR</strong></span>
                                        </div>
                                        <button class="myo-temp-btn" style="margin-top:8px;">Create Commitment</button>
                                    </div>
                                    <div class="myo-temp-card" onclick="window.router.navigate('/market')">
                                        <div class="myo-temp-header">
                                            <span class="myo-temp-platform">X (Twitter)</span>
                                            <span class="myo-temp-category">Social</span>
                                        </div>
                                        <span class="myo-temp-title">Post every day for 30 days</span>
                                        <div style="font-size:11px; color:#888; display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                                            <span>Duration: <strong>30 days</strong></span>
                                            <span>Source: <strong>X API</strong></span>
                                            <span>Collateral: <strong>500 CLTR</strong></span>
                                        </div>
                                        <button class="myo-temp-btn" style="margin-top:8px;">Create Commitment</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 5: Why Commitments Matter -->
                            <div class="myo-section" data-reveal>
                                <h3 class="myo-section-lbl">Why Commitments Matter</h3>
                                <div class="myo-benefits-grid">
                                    <div class="myo-benefit-card">
                                        <div class="myo-benefit-icon"><i data-lucide="award"></i></div>
                                        <span class="myo-benefit-title">Permanent Reputation</span>
                                        <span class="myo-benefit-desc">Every successful commitment increases credibility and establishes trust footprint.</span>
                                    </div>
                                    <div class="myo-benefit-card">
                                        <div class="myo-benefit-icon"><i data-lucide="trending-up"></i></div>
                                        <span class="myo-benefit-title">Economic Accountability</span>
                                        <span class="myo-benefit-desc">Locked staking capital guarantees promises are programmatically verified and kept.</span>
                                    </div>
                                    <div class="myo-benefit-card">
                                        <div class="myo-benefit-icon"><i data-lucide="shield-check"></i></div>
                                        <span class="myo-benefit-title">Trust Capacity</span>
                                        <span class="myo-benefit-desc">Larger reputation history unlocks capacity for higher yield contracts.</span>
                                    </div>
                                    <div class="myo-benefit-card">
                                        <div class="myo-benefit-icon"><i data-lucide="code"></i></div>
                                        <span class="myo-benefit-title">Proof of Execution</span>
                                        <span class="myo-benefit-desc">Create absolute, cryptographically signed records of real-world performance.</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Section: Commitment Table Placeholder -->
                            <div class="myo-section" data-reveal>
                                <h3 class="myo-section-lbl">Active Commitments List</h3>
                                <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                                    <div style="font-family:'JetBrains Mono', monospace; font-size:10px; color:#aaa; text-transform:uppercase; margin-bottom:8px;">No commitments yet</div>
                                    <p style="font-size:12px; color:#666; margin:0; line-height:1.6; max-width:440px; margin: 0 auto;">Your completed commitments will appear here along with their execution history, settlements, and reputation impact.</p>
                                </div>
                            </div>
                        </div>

                        <div class="myo-column-side">
                            <!-- Section 3: Execution Identity Preview -->
                            <div class="myo-side-box" data-reveal>
                                <h3 class="myo-side-title">Execution Identity</h3>
                                <div class="myo-identity-card">
                                    <div class="myo-identity-header">
                                        <span class="myo-identity-level">Level I</span>
                                        <span class="myo-identity-status">Waiting for First Commitment</span>
                                    </div>
                                    <div class="myo-identity-metrics">
                                        <div class="myo-id-metric">
                                            <span class="myo-id-lbl">Reputation</span>
                                            <span class="myo-id-val">0</span>
                                        </div>
                                        <div class="myo-id-metric">
                                            <span class="myo-id-lbl">Trust Capacity</span>
                                            <span class="myo-id-val">$0</span>
                                        </div>
                                        <div class="myo-id-metric">
                                            <span class="myo-id-lbl">Conviction</span>
                                            <span class="myo-id-val">0 CLTR</span>
                                        </div>
                                    </div>
                                    <div class="myo-identity-footer" style="margin-bottom:8px;">
                                        <span>Next Milestone: <strong>Complete First Commitment</strong></span>
                                    </div>
                                    <button class="myc-btn-secondary" style="width:100%;" onclick="window.router.navigate('/profile')">View Full Identity</button>
                                </div>
                            </div>

                            <!-- Section 7: Roadmap Journey -->
                            <div class="myo-side-box" data-reveal>
                                <h3 class="myo-side-title">Roadmap Progression</h3>
                                <div class="myo-roadmap">
                                    <div class="myo-roadmap-item active">
                                        <div class="myo-road-node"></div>
                                        <div class="myo-road-info">
                                            <span class="myo-road-lbl">Create First Commitment</span>
                                            <span class="myo-road-desc">Establish your first performance escrow pool.</span>
                                        </div>
                                    </div>
                                    <div class="myo-roadmap-item">
                                        <div class="myo-road-node"></div>
                                        <div class="myo-road-info">
                                            <span class="myo-road-lbl">Complete First Settlement</span>
                                            <span class="myo-road-desc">Fulfill terms to secure signature confirmation.</span>
                                        </div>
                                    </div>
                                    <div class="myo-roadmap-item">
                                        <div class="myo-road-node"></div>
                                        <div class="myo-road-info">
                                            <span class="myo-road-lbl">Reach Reputation Level II</span>
                                            <span class="myo-road-desc">Ascend execution tier for higher yield ratios.</span>
                                        </div>
                                    </div>
                                    <div class="myo-roadmap-item">
                                        <div class="myo-road-node"></div>
                                        <div class="myo-road-info">
                                            <span class="myo-road-lbl">Unlock Larger Capacity</span>
                                            <span class="myo-road-desc">Authorize enterprise-tier contract vaults.</span>
                                        </div>
                                    </div>
                                    <div class="myo-roadmap-item">
                                        <div class="myo-road-node"></div>
                                        <div class="myo-road-info">
                                            <span class="myo-road-lbl">Become Trusted Custodian</span>
                                            <span class="myo-road-desc">Earn prestige validator and governance status.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 6: Network Activity Feed -->
                            <div class="myo-side-box" data-reveal>
                                <h3 class="myo-side-title">Network Activity</h3>
                                <div class="myo-activity-list">
                                    <div class="myo-act-item">
                                        <div class="myo-act-icon"><i data-lucide="check-circle" style="color: #16a34a; width: 14px; height: 14px;"></i></div>
                                        <div class="myo-act-info">
                                            <span class="myo-act-title">Execution Confirmed</span>
                                            <span class="myo-act-sub">YouTube · $500</span>
                                        </div>
                                        <span class="myo-act-time">2m ago</span>
                                    </div>
                                    <div class="myo-act-item">
                                        <div class="myo-act-icon"><i data-lucide="arrow-right-circle" style="color: #635bff; width: 14px; height: 14px;"></i></div>
                                        <div class="myo-act-info">
                                            <span class="myo-act-title">Settlement Released</span>
                                            <span class="myo-act-sub">Stripe · $2,300</span>
                                        </div>
                                        <span class="myo-act-time">6m ago</span>
                                    </div>
                                    <div class="myo-act-item">
                                        <div class="myo-act-icon"><i data-lucide="lock" style="color: #96bf48; width: 14px; height: 14px;"></i></div>
                                        <div class="myo-act-info">
                                            <span class="myo-act-title">Funds Locked</span>
                                            <span class="myo-act-sub">Shopify · $900</span>
                                        </div>
                                        <span class="myo-act-time">12m ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Motivational Call to Action Section at bottom -->
                    <div class="myo-motivation-panel" data-reveal>
                        <h3 class="myo-motivation-title">Build Your First Commitment</h3>
                        <p class="myo-motivation-sub">Every verified commitment permanently strengthens your Execution Identity and expands your trust capacity.</p>
                        <div class="myo-motivation-ctas">
                            <button class="myc-btn-primary" onclick="window.router.navigate('/market')">Create First Commitment</button>
                            <button class="myc-btn-secondary" onclick="window.router.navigate('/market')">Explore Templates</button>
                        </div>
                    </div>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        } else {
            document.getElementById('myc-total-locked').textContent = '$' + (totalLocked / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });
            document.getElementById('myc-active-count').textContent = activeCount.toString();
            document.getElementById('myc-settle-rate').textContent = rate;
            document.getElementById('myc-avg-risk').textContent = '$' + (totalPayout / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });
            renderContractList(container, contracts);
        }
    } catch (err) {
        console.error('[MyContracts] Error:', err);
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#752122; font-family:'JetBrains Mono', monospace; font-size:12px;">SYSTEM_RECORD_ERROR: ${err.message}</div>`;
    }
}

function renderContractList(container, contracts) {
    contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const listHtml = contracts.map(c => {
        const rawId = (c.id || '').toString();
        const shortId = rawId.split('-')[0] || rawId || '????';
        const min = c.lockAmountUsdCents ? c.lockAmountUsdCents / 100 : 0;
        const stakeDisplay = '$' + min.toLocaleString();

        const platform = (c.platform || 'X').toLowerCase();
        let dotClass = 'x';
        if (platform === 'stripe') dotClass = 'stripe';
        if (platform === 'shopify') dotClass = 'shopify';
        if (platform === 'amazon') dotClass = 'amazon';

        const state = c.derivedState || c.state;
        const isTerminal = ['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'FORFEITED', 'SETTLED_FAILURE'].includes(state);
        let timeLabel = isTerminal ? 'SETTLED' : 'ACTIVE';
        let closingAmtText = isTerminal ? 'COMPLETED' : 'LIVE RECORD';

        const tierUpper = c.riskTier?.toUpperCase() || 'CONTROLLED';
        const multiplier = tierUpper === 'MAXIMUM' ? 4.0 : tierUpper === 'ELEVATED' ? 2.5 : 1.7;
        const tierBadge = tierUpper === 'CONTROLLED' ? 'PLEDGE' : tierUpper === 'ELEVATED' ? 'STAKE' : 'ALL-IN';

        const metricLabels = {
            SUBSCRIBERS: 'subscribers', FOLLOWERS: 'followers', REVENUE: 'revenue',
            VIEWS: 'views', GROSS_SALES: 'sales', ORDER_COUNT: 'orders',
        };
        const goal = metricLabels[c.metricType] ? `Grow ${metricLabels[c.metricType]}` : 'Performance Goal';

        return `
            <div class="eq-card"
                 onclick="window.router.navigate('/contracts/${c.id}')"
                 style="cursor:pointer;"
                 data-id="${c.id}">
                <div class="eq-card-meta">
                    <span class="eq-closing">${closingAmtText}</span>
                    <span class="eq-id">CNTRCT-${shortId.slice(0, 5).toUpperCase()}</span>
                    <span class="eq-time">· ${timeLabel}</span>
                </div>
                <div class="eq-card-title">${goal}</div>
                <div class="eq-card-provider">
                    <span class="dot ${dotClass}" style="width: 6px; height: 6px; border-radius: 50%; background: ${dotClass === 'stripe' ? '#635bff' : dotClass === 'shopify' ? '#96bf48' : dotClass === 'amazon' ? '#ff9900' : '#111'}"></span>
                    <span class="eq-provider-name">${platform.toUpperCase()}</span>
                    <span class="eq-tier-badge ${tierUpper.toLowerCase()}">${tierBadge}</span>
                </div>
                <div class="eq-card-status"><span class="dot" style="width:4px; height:4px; border-radius:50%; background:${isTerminal ? '#555' : '#10b981'}; display:inline-block; margin-right:4px;"></span> ${isTerminal ? 'SETTLED' : 'TERMS VERIFIED'}</div>
                <div class="eq-card-stake-info">
                    <div>
                        <div class="eq-stake-val">${stakeDisplay}</div>
                        <div class="eq-stake-lbl">STAKE CAPACITY</div>
                    </div>
                    <div class="eq-stake-separator"></div>
                    <div>
                        <div class="eq-stake-val">${multiplier}x</div>
                        <div class="eq-stake-lbl">YIELD MULTIPLIER</div>
                    </div>
                </div>
                <button class="eq-card-cta ${isTerminal ? '' : 'primary'}" onclick="event.stopPropagation(); window.router.navigate('/contracts/${c.id}')">
                    ${isTerminal ? 'VIEW RECORD' : 'VIEW DETAILS'}
                </button>
                <div class="eq-card-footer">Capital is ${isTerminal ? 'released' : 'locked until settlement'}.</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="eq-grid">${listHtml}</div>`;
}
