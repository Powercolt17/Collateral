/**
 * Collateral Branded Loader — Premium Text Shimmer
 * Returns inline SVG HTML for loading states.
 *
 * @param {number} size - Pixel size of the loader (default 140)
 * @returns {string} HTML string
 */
export function collateralSpinner(size = 140) {
    return `
        <div style="position:relative;width:${size}px;display:inline-flex;justify-content:center;">
            <img src="/logo.svg" alt="Loading..." style="width:100%;height:auto;
                -webkit-mask-image: linear-gradient(110deg, rgba(0,0,0,0.15) 35%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.15) 65%);
                -webkit-mask-size: 200% 100%;
                mask-image: linear-gradient(110deg, rgba(0,0,0,0.15) 35%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.15) 65%);
                mask-size: 200% 100%;
                animation: cl-shimmer 2.5s infinite ease-in-out;
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
            @keyframes cl-shimmer {
                0% { -webkit-mask-position: 100% 0; mask-position: 100% 0; }
                100% { -webkit-mask-position: 0% 0; mask-position: 0% 0; }
            }
            @keyframes cl-pulse-text {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.7; }
            }
        </style>`;
}
