// =============================================================================
// COLLATERAL MODAL — Professional modal system replacing browser alert/confirm
// Matches site's institutional dark aesthetic with Inter typography
// =============================================================================

const MODAL_CSS = `
.cl-modal-overlay {
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,0.55); backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center;
    animation: cl-modal-fade-in 0.15s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.cl-modal-box {
    background: #fff; border-radius: 2px; width: 90%; max-width: 420px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05);
    animation: cl-modal-slide-up 0.2s ease-out;
    overflow: hidden;
}
.cl-modal-header {
    padding: 20px 24px 0; display: flex; align-items: center; gap: 10px;
}
.cl-modal-icon {
    width: 32px; height: 32px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
}
.cl-modal-icon.success { background: #f0fdf4; color: #16a34a; }
.cl-modal-icon.error { background: #fef2f2; color: #dc2626; }
.cl-modal-icon.warning { background: #fffbeb; color: #d97706; }
.cl-modal-icon.info { background: #f5f5f5; color: #1a1a1a; }
.cl-modal-icon.confirm { background: #f5f5f5; color: #1a1a1a; }
.cl-modal-title {
    font-family: 'Inter', monospace; font-size: 11px;
    font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: #1a1a1a;
}
.cl-modal-body {
    padding: 14px 24px 20px; font-size: 13.5px; line-height: 1.6;
    color: #444; word-break: break-word;
}
.cl-modal-actions {
    padding: 0 24px 20px; display: flex; gap: 8px; justify-content: flex-end;
}
.cl-modal-btn {
    padding: 10px 20px; border: none; border-radius: 1px; cursor: pointer;
    font-family: 'Inter', monospace; font-size: 10px;
    font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    transition: all 0.15s ease;
}
.cl-modal-btn.primary {
    background: #1a1a1a; color: #fff;
}
.cl-modal-btn.primary:hover { background: #333; }
.cl-modal-btn.secondary {
    background: #fff; color: #752122; border: 1px solid #eee;
}
.cl-modal-btn.secondary:hover { background: #fafafa; border-color: #ddd; }
.cl-modal-btn.danger {
    background: #752122; color: #fff;
}
.cl-modal-btn.danger:hover { background: #8b2a2b; }
@keyframes cl-modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes cl-modal-slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

// Inject CSS once
let cssInjected = false;
function injectCSS() {
    if (cssInjected) return;
    const style = document.createElement('style');
    style.textContent = MODAL_CSS;
    document.head.appendChild(style);
    cssInjected = true;
}

const ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: '⚡',
    confirm: '?',
};

/**
 * Show a professional modal alert (replaces browser alert)
 * @param {string} message - The message to display
 * @param {object} opts - Optional: { type: 'success'|'error'|'warning'|'info', title: string }
 * @returns {Promise<void>} Resolves when dismissed
 */
export function showAlert(message, opts = {}) {
    injectCSS();
    const type = opts.type || 'info';
    const title = opts.title || { success: 'Success', error: 'Error', warning: 'Warning', info: 'Notice' }[type] || 'Notice';

    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'cl-modal-overlay';
        overlay.innerHTML = `
            <div class="cl-modal-box">
                <div class="cl-modal-header">
                    <div class="cl-modal-icon ${type}">${ICONS[type] || '⚡'}</div>
                    <div class="cl-modal-title">${title}</div>
                </div>
                <div class="cl-modal-body">${message}</div>
                <div class="cl-modal-actions">
                    <button class="cl-modal-btn primary" id="cl-modal-ok">OK</button>
                </div>
            </div>
        `;

        const dismiss = () => { overlay.remove(); resolve(); };
        overlay.querySelector('#cl-modal-ok').addEventListener('click', dismiss);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape' || e.key === 'Enter') { document.removeEventListener('keydown', handler); dismiss(); }
        });

        document.body.appendChild(overlay);
        overlay.querySelector('#cl-modal-ok').focus();
    });
}

/**
 * Show a professional confirm dialog (replaces browser confirm)
 * @param {string} message - The message to display
 * @param {object} opts - Optional: { title, confirmText, cancelText, type, danger }
 * @returns {Promise<boolean>} true if confirmed, false if cancelled
 */
export function showConfirm(message, opts = {}) {
    injectCSS();
    const type = opts.type || 'confirm';
    const title = opts.title || 'Confirm Action';
    const confirmText = opts.confirmText || 'CONFIRM';
    const cancelText = opts.cancelText || 'CANCEL';
    const btnClass = opts.danger ? 'danger' : 'primary';

    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'cl-modal-overlay';
        overlay.innerHTML = `
            <div class="cl-modal-box">
                <div class="cl-modal-header">
                    <div class="cl-modal-icon ${type}">${ICONS[type] || '?'}</div>
                    <div class="cl-modal-title">${title}</div>
                </div>
                <div class="cl-modal-body">${message}</div>
                <div class="cl-modal-actions">
                    <button class="cl-modal-btn secondary" id="cl-modal-cancel">${cancelText}</button>
                    <button class="cl-modal-btn ${btnClass}" id="cl-modal-confirm">${confirmText}</button>
                </div>
            </div>
        `;

        const done = (val) => { overlay.remove(); resolve(val); };
        overlay.querySelector('#cl-modal-confirm').addEventListener('click', () => done(true));
        overlay.querySelector('#cl-modal-cancel').addEventListener('click', () => done(false));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) done(false); });
        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') { document.removeEventListener('keydown', handler); done(false); }
        });

        document.body.appendChild(overlay);
        overlay.querySelector('#cl-modal-confirm').focus();
    });
}

// Attach to window for inline onclick handlers
window.CollateralModal = { showAlert, showConfirm };
