/**
 * Collateral Branded Loader - Global Consistent Spinner
 * Returns inline HTML for loading states.
 *
 * @param {number} size - Pixel size of the loader (default 48)
 * @returns {string} HTML string
 */
export function collateralSpinner(size = 48) {
    return `
        <div style="position:relative;width:${size}px;height:${size}px;display:inline-block;vertical-align:middle;">
            <svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="15.5" stroke="#3B0001" stroke-width="2"/>
                <line x1="32" y1="19.5" x2="32" y2="44.5" stroke="#3B0001" stroke-width="1.5" stroke-linecap="round" style="animation:cl-pulse 1.6s ease-in-out infinite"/>
            </svg>
            <svg style="position:absolute;top:0;left:0;width:100%;height:100%;animation:cl-spin 2.4s linear infinite;transform-origin:center center" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="32" cy="32" rx="26.5" ry="7.5" stroke="#3B0001" stroke-width="1.1" fill="none" transform="rotate(-27 32 32)"/>
            </svg>
        </div>`;
}

/**
 * Full-page loading block with centered Collateral loader
 * @param {string} [message] - Optional loading message
 * @param {number} [size] - Loader size
 * @returns {string} HTML string
 */
export function collateralFullLoader(message = '', size = 48) {
    return `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 0;gap:16px;">
            ${collateralSpinner(size)}
            ${message ? `<div style="font-family:'JetBrains Mono', monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0;">${message}</div>` : ''}
        </div>`;
}
