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
                .myo-checklist { flex-direction: column !important; }
                .myo-checklist-item { border-right: none !important; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .myo-checklist-item:last-child { border-bottom: none !important; }
            }

            /* --- ONBOARDING STYLES --- */
            .myc-onboarding-wrapper {
                display: flex;
                flex-direction: column;
                gap: 24px;
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
                flex-direction: row;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
            }
            .myo-checklist-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px 24px;
                flex: 1;
                border-right: 1px solid rgba(0,0,0,0.05);
            }
            .myo-checklist-item:last-child {
                border-right: none;
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
            .myo-templates-grid-3 {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            @media (max-width: 1024px) {
                .myo-templates-grid-3 {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            @media (max-width: 768px) {
                .myo-templates-grid-3 {
                    grid-template-columns: 1fr;
                }
            }
            .myo-temp-card {
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.05);
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                display: flex;
                flex-direction: column;
                gap: 8px;
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
                    <div class="myc-metric-label">Active Commitments</div>
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
            document.getElementById('myc-total-locked').innerHTML = '—<span class="myc-metric-subtext">No capital currently committed</span>';
            document.getElementById('myc-active-count').innerHTML = '0<span class="myc-metric-subtext">Ready to create your first</span>';
            document.getElementById('myc-settle-rate').innerHTML = '—<span class="myc-metric-subtext">No settlements yet</span>';
            document.getElementById('myc-avg-risk').innerHTML = '—<span class="myc-metric-subtext">No payouts yet</span>';

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
                <div class="myc-onboarding-wrapper" style="display: flex; flex-direction: column; gap: 32px;">
                    
                    <!-- Section: Getting Started Checklist -->
                    <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.01);">
                        <h3 class="myo-section-lbl" style="margin-bottom: 12px;">Getting Started</h3>
                        <div class="myo-checklist">
                            <div class="myo-checklist-item ${isIdentityVerified ? 'completed' : ''}">
                                <div class="myo-check-box" style="font-weight: 700; color: ${isIdentityVerified ? '#5C1414' : '#ccc'};">${isIdentityVerified ? '✓' : '○'}</div>
                                <div class="myo-check-info">
                                    <span class="myo-check-title">Identity Verified</span>
                                    ${!isIdentityVerified ? '<a href="#" onclick="event.preventDefault(); window.router.navigate(\'/profile\')" style="font-size:10px; color:#5C1414; text-decoration:none; font-weight:600; margin-top:2px;">Verify Identity →</a>' : ''}
                                </div>
                            </div>
                            <div class="myo-checklist-item ${isSourceConnected ? 'completed' : ''}">
                                <div class="myo-check-box" style="font-weight: 700; color: ${isSourceConnected ? '#5C1414' : '#ccc'};">${isSourceConnected ? '✓' : '○'}</div>
                                <div class="myo-check-info">
                                    <span class="myo-check-title">Source Connected</span>
                                    ${!isSourceConnected ? '<a href="#" onclick="event.preventDefault(); window.router.navigate(\'/sources\')" style="font-size:10px; color:#5C1414; text-decoration:none; font-weight:600; margin-top:2px;">Connect Source →</a>' : ''}
                                </div>
                            </div>
                            <div class="myo-checklist-item">
                                <div class="myo-check-box" style="color: #ccc;">○</div>
                                <div class="myo-check-info">
                                    <span class="myo-check-title">Create Commitment</span>
                                </div>
                            </div>
                            <div class="myo-checklist-item">
                                <div class="myo-check-box" style="color: #ccc;">○</div>
                                <div class="myo-check-info">
                                    <span class="myo-check-title">Complete First Settlement</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section: Centered Empty-State Onboarding Section -->
                    <div class="myo-welcome-hero" style="border: 1px solid rgba(0,0,0,0.06); padding: 24px 32px; background: #fff; text-align: center; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
                        <h2 class="myo-welcome-title" style="font-size: 20px; margin-bottom: 8px; font-weight: 800; letter-spacing: -0.6px; color: #111;">No Active Commitments Yet</h2>
                        <p class="myo-welcome-desc" style="max-width: 600px; margin: 0 auto 20px; line-height: 1.6; color: #555; font-size: 13px;">
                            Your Execution Identity begins with your first commitment. Successfully completing commitments permanently builds your reputation, expands your trust capacity, and unlocks larger opportunities.
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button class="myc-btn-primary" onclick="window.router.navigate('/market')" style="padding: 8px 16px;">Create Your First Commitment</button>
                            <button class="myc-btn-secondary" onclick="document.getElementById('suggested-commitments-lbl').scrollIntoView({ behavior: 'smooth' })" style="padding: 8px 16px;">Browse Templates</button>
                        </div>
                    </div>

                    <div style="border-bottom: 1px solid rgba(0,0,0,0.05); margin: 8px 0;"></div>

                    <!-- Section: Suggested Commitments -->
                    <div class="myo-section" style="margin-bottom: 12px;">
                        <h3 class="myo-section-lbl" id="suggested-commitments-lbl" style="margin-bottom: 12px;">Suggested Commitments</h3>
                        <div class="myo-templates-grid-3">
                            <div class="myo-temp-card" onclick="window.router.navigate('/market')" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 170px;">
                                <div>
                                    <div class="myo-temp-header" style="margin-bottom: 8px;">
                                        <span class="myo-temp-platform" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
                                            <img src="https://cdn.simpleicons.org/youtube/FF0000" alt="YouTube" width="14" height="14" style="display:block; flex-shrink:0;" /> YouTube
                                        </span>
                                        <span class="myo-temp-category">Creators</span>
                                    </div>
                                    <span class="myo-temp-title" style="display: block; margin-bottom: 4px; font-size: 13px;">Reach 10,000 YouTube Subscribers</span>
                                    <p style="font-size: 11px; color: #666; margin: 0 0 8px 0; line-height: 1.4;">Establish verification of creator channel subscriber milestones.</p>
                                    <div style="font-size: 10px; color: #888; display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;">
                                        <span>Estimated Verification Source: <strong>YouTube API</strong></span>
                                    </div>
                                </div>
                                <button class="myo-temp-btn">Create Commitment</button>
                            </div>

                            <div class="myo-temp-card" onclick="window.router.navigate('/market')" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 170px;">
                                <div>
                                    <div class="myo-temp-header" style="margin-bottom: 8px;">
                                        <span class="myo-temp-platform" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
                                            <img src="https://cdn.simpleicons.org/stripe/635BFF" alt="Stripe" width="14" height="14" style="display:block; flex-shrink:0;" /> Stripe
                                        </span>
                                        <span class="myo-temp-category">Finance</span>
                                    </div>
                                    <span class="myo-temp-title" style="display: block; margin-bottom: 4px; font-size: 13px;">Generate $10,000 Monthly Revenue</span>
                                    <p style="font-size: 11px; color: #666; margin: 0 0 8px 0; line-height: 1.4;">Verify monthly stripe revenue metric triggers.</p>
                                    <div style="font-size: 10px; color: #888; display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;">
                                        <span>Estimated Verification Source: <strong>Stripe API</strong></span>
                                    </div>
                                </div>
                                <button class="myo-temp-btn">Create Commitment</button>
                            </div>

                            <div class="myo-temp-card" onclick="window.router.navigate('/market')" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 170px;">
                                <div>
                                    <div class="myo-temp-header" style="margin-bottom: 8px;">
                                        <span class="myo-temp-platform" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
                                            <img src="https://cdn.simpleicons.org/youtube/FF0000" alt="YouTube" width="14" height="14" style="display:block; flex-shrink:0;" /> YouTube
                                        </span>
                                        <span class="myo-temp-category">Creators</span>
                                    </div>
                                    <span class="myo-temp-title" style="display: block; margin-bottom: 4px; font-size: 13px;">Achieve 50,000 YouTube Views</span>
                                    <p style="font-size: 11px; color: #666; margin: 0 0 8px 0; line-height: 1.4;">Track and verify video view count milestones.</p>
                                    <div style="font-size: 10px; color: #888; display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;">
                                        <span>Estimated Verification Source: <strong>YouTube API</strong></span>
                                    </div>
                                </div>
                                <button class="myo-temp-btn">Create Commitment</button>
                            </div>

                            <div class="myo-temp-card" onclick="window.router.navigate('/market')" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 170px;">
                                <div>
                                    <div class="myo-temp-header" style="margin-bottom: 8px;">
                                        <span class="myo-temp-platform" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
                                            <img src="https://cdn.simpleicons.org/shopify/95BF47" alt="Shopify" width="14" height="14" style="display:block; flex-shrink:0;" /> Shopify
                                        </span>
                                        <span class="myo-temp-category">Commerce</span>
                                    </div>
                                    <span class="myo-temp-title" style="display: block; margin-bottom: 4px; font-size: 13px;">Complete 100 Shopify Orders</span>
                                    <p style="font-size: 11px; color: #666; margin: 0 0 8px 0; line-height: 1.4;">Fulfill orders threshold verification.</p>
                                    <div style="font-size: 10px; color: #888; display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;">
                                        <span>Estimated Verification Source: <strong>Shopify API</strong></span>
                                    </div>
                                </div>
                                <button class="myo-temp-btn">Create Commitment</button>
                            </div>

                            <div class="myo-temp-card" onclick="window.router.navigate('/market')" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 170px;">
                                <div>
                                    <div class="myo-temp-header" style="margin-bottom: 8px;">
                                        <span class="myo-temp-platform" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
                                            <img src="https://cdn.simpleicons.org/x/000000" alt="X" width="12" height="12" style="display:block; flex-shrink:0;" /> X (Twitter)
                                        </span>
                                        <span class="myo-temp-category">Social</span>
                                    </div>
                                    <span class="myo-temp-title" style="display: block; margin-bottom: 4px; font-size: 13px;">Grow to 5,000 X Followers</span>
                                    <p style="font-size: 11px; color: #666; margin: 0 0 8px 0; line-height: 1.4;">Verify follower count milestones on X.</p>
                                    <div style="font-size: 10px; color: #888; display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;">
                                        <span>Estimated Verification Source: <strong>X API</strong></span>
                                    </div>
                                </div>
                                <button class="myo-temp-btn">Create Commitment</button>
                            </div>

                            <div class="myo-temp-card" onclick="window.router.navigate('/market')" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 170px;">
                                <div>
                                    <div class="myo-temp-header" style="margin-bottom: 8px;">
                                        <span class="myo-temp-platform" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
                                            <img src="https://cdn.simpleicons.org/amazon/FF9900" alt="Amazon" width="14" height="14" style="display:block; flex-shrink:0;" /> Amazon
                                        </span>
                                        <span class="myo-temp-category">Commerce</span>
                                    </div>
                                    <span class="myo-temp-title" style="display: block; margin-bottom: 4px; font-size: 13px;">Fulfill 200 Amazon Orders</span>
                                    <p style="font-size: 11px; color: #666; margin: 0 0 8px 0; line-height: 1.4;">Fulfill order volume threshold verification.</p>
                                    <div style="font-size: 10px; color: #888; display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;">
                                        <span>Estimated Verification Source: <strong>Amazon Seller API</strong></span>
                                    </div>
                                </div>
                                <button class="myo-temp-btn">Create Commitment</button>
                            </div>
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
