/**
 * Collateral Branded Loader - Premium Shimmer
 * Returns inline HTML for loading states.
 *
 * @param {number} size - Pixel size of the loader (default 140)
 * @returns {string} HTML string
 */
export function collateralSpinner(size = 140) {
    const fontSize = `calc(${size}px * 0.16)`;
    return `
        <div style="position:relative;width:${size}px;display:inline-flex;justify-content:center;align-items:center;height:${fontSize};">
            <span class="cl-premium-loader-glow" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);font-size:${fontSize};margin:0;padding:0;white-space:nowrap;text-transform:none!important;">Collateral</span>
            <span class="cl-premium-loader-text" style="font-size:${fontSize};margin:0;padding:0;position:relative;z-index:2;white-space:nowrap;text-transform:none!important;">Collateral</span>
        </div>`;
}

/**
 * Full-page loading overlay with centered Collateral loader
 * @param {string} [message] - Optional loading message
 * @returns {string} HTML string
 */
export function collateralFullLoader(message = '') {
    return `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 0;">
            ${collateralSpinner(160)}
            ${message ? `<div style="font-family:'JetBrains Mono', monospace;font-size:10px;color:#444;letter-spacing:0.2em;text-transform:uppercase;margin-top:32px;animation:cl-pulse-text 2s ease-in-out infinite;">${message}</div>` : ''}
        </div>`;
}

/**
 * Shared CSS keyframes needed for the loader (inject once per page)
 * @returns {string} CSS string wrapped in <style> tags
 */
export function collateralLoaderStyles() {
    return `
        <style>
            @keyframes cl-premium-shimmer {
                0% { background-position: 200% 50%; }
                100% { background-position: -200% 50%; }
            }
            @keyframes cl-premium-pulse {
                0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.98); }
                50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
            }
            .cl-premium-loader-text {
                font-family: 'Science', 'Azonix', 'Corke', 'Molgan', 'Aquire', sans-serif !important;
                font-weight: bold !important;
                background: linear-gradient(
                    90deg, 
                    rgba(255,255,255,0.05) 0%, 
                    rgba(255,255,255,0.05) 40%, 
                    #8B2020 48%, 
                    #ff4d4d 50%,
                    #8B2020 52%,
                    rgba(255,255,255,0.05) 60%, 
                    rgba(255,255,255,0.05) 100%
                );
                background-size: 300% auto;
                color: transparent !important;
                -webkit-background-clip: text !important;
                background-clip: text !important;
                animation: cl-premium-shimmer 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
            }
            .cl-premium-loader-glow {
                font-family: 'Science', 'Azonix', 'Corke', 'Molgan', 'Aquire', sans-serif !important;
                font-weight: bold !important;
                color: #8B2020 !important;
                filter: blur(12px);
                animation: cl-premium-pulse 2s ease-in-out infinite;
                z-index: 1;
            }
            @keyframes cl-pulse-text {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.7; }
            }
        </style>`;
}
