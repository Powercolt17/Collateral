/**
 * Collateral Branded Loader — Premium Text Fill
 * Returns inline SVG HTML for loading states.
 *
 * @param {number} size - Pixel size of the loader (default 140)
 * @returns {string} HTML string
 */
export function collateralSpinner(size = 140) {
    return `
        <div style="position:relative;width:${size}px;display:inline-flex;justify-content:center;align-items:center;">
            <span class="logo-wordmark" style="opacity:0.15;font-size:calc(${size}px * 0.16);margin:0;padding:0;">COLLATERAL</span>
            <span class="logo-wordmark cl-decode-text cl-loop-decode" data-target="COLLATERAL" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);font-size:calc(${size}px * 0.16);margin:0;padding:0;
                white-space: nowrap;
                color: #5C1414;
            ">COLLATERAL</span>
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
            ${message ? `<div style="font-family:'JetBrains Mono', monospace;font-size:10px;color:#888;letter-spacing:0.15em;text-transform:uppercase;margin-top:24px;animation:cl-pulse-text 2s ease-in-out infinite;">${message}</div>` : ''}
        </div>`;
}

/**
 * Shared CSS keyframes needed for the loader (inject once per page)
 * @returns {string} CSS string wrapped in <style> tags
 */
export function collateralLoaderStyles() {
    return `
        <style>
            @keyframes cl-fill {
                0% { clip-path: inset(0 100% 0 0); -webkit-clip-path: inset(0 100% 0 0); opacity: 0; }
                5% { clip-path: inset(0 100% 0 0); -webkit-clip-path: inset(0 100% 0 0); opacity: 1; }
                50%, 80% { clip-path: inset(0 0 0 0); -webkit-clip-path: inset(0 0 0 0); opacity: 1; }
                100% { clip-path: inset(0 0 0 0); -webkit-clip-path: inset(0 0 0 0); opacity: 0; }
            }
            @keyframes cl-pulse-text {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.7; }
            }
        </style>`;
}
