/**
 * Collateral Branded Loader - Global Consistent Spinner
 * Returns inline HTML for loading states.
 *
 * @param {number} size - Pixel size of the loader (default 48)
 * @returns {string} HTML string
 */
export function collateralSpinner(size = 48) {
    return `
        <div class="cl-premium-spinner" style="position:relative; width:${size}px; height:${size}px; display:inline-block; vertical-align:middle;">
            <!-- Outer Ring (Clockwise, Brand Red) -->
            <div style="position:absolute; inset:0; border:2px solid transparent; border-top-color:#8B2020; border-right-color:#8B2020; border-radius:50%; animation:cl-spin-clockwise 1s cubic-bezier(0.4, 0.1, 0.6, 0.9) infinite;"></div>
            <!-- Inner Dashed Ring (Counter-Clockwise, Muted Red) -->
            <div style="position:absolute; inset:calc(${size}px * 0.15); border:1.5px dashed rgba(139,32,32,0.3); border-radius:50%; animation:cl-spin-counter 1.5s linear infinite;"></div>
            <!-- Center Pulsing Core (Pulsing Brand Red) -->
            <div style="position:absolute; top:50%; left:50%; width:calc(${size}px * 0.25); height:calc(${size}px * 0.25); margin-top:calc(${size}px * -0.125); margin-left:calc(${size}px * -0.125); background:#8B2020; border-radius:50%; animation:cl-core-pulse 1.5s ease-in-out infinite;"></div>
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
