// framework.js - Auto-injects CAD Title Block signature

// Safari Initial Scroll Runway Trick
document.addEventListener('DOMContentLoaded', () => {
    // Only run on iOS devices where this Safari quirk occurs
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS && window.scrollY === 0) {
        // Instantly force a 1-pixel scroll shift and back to break the top-bar block
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
    }
});

// Inject CAD Title Block signature on page load
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
