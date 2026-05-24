/**
 * Collateral Branded Loader — Premium Text Fill
 * Returns inline SVG HTML for loading states.
 *
 * @param {number} size - Pixel size of the loader (default 140)
 * @returns {string} HTML string
 */
export function collateralSpinner(size = 140) {
    return `
        <div style="position:relative;width:${size}px;aspect-ratio:217/44;display:inline-flex;justify-content:center;">
            <img src="/logo-official.png" alt="" style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.15;" />
            <img src="/logo-official.png" alt="Loading..." style="position:absolute;top:0;left:0;width:100%;height:100%;
                clip-path: inset(0 100% 0 0);
                -webkit-clip-path: inset(0 100% 0 0);
                animation: cl-fill 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
            " />
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
