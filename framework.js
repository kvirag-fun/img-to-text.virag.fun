// framework.js - Auto-injects CAD Title Block signature

// 1. Immediately inject full-bleed meta tags for mobile status bar integration
(function setupViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        let content = viewport.getAttribute('content') || '';
        if (!content.includes('viewport-fit=cover')) {
            viewport.setAttribute('content', content + ', viewport-fit=cover');
        }
    } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
        document.head.appendChild(meta);
    }

    // Set mobile browser address bar color to match background
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
        themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        document.head.appendChild(themeColor);
    }
    themeColor.content = '#0b0f17';
})();

// 2. Inject CAD Title Block signature on page load
document.addEventListener('DOMContentLoaded', () => {
    // Create the footer container
    const footer = document.createElement('footer');
    footer.className = 'cad-title-block';

    // Populate with your details (Replace [YOUR NAME] with your real name)
    footer.innerHTML = `
        <div class="cad-spec">
            <span class="cad-label">DESIGNED BY</span>
            <span class="cad-value">KRISZTIÁN VIRÁG</span>
        </div>
        <div class="cad-spec">
            <span class="cad-label">ROLE</span>
            <span class="cad-value">STRUCTURAL ENGINEER / PRODUCT MANAGER</span>
        </div>
    `;

    // Append to the page automatically
    document.body.appendChild(footer);
});
