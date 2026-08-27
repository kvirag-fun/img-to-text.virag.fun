// framework.js - Auto-injects CAD Title Block signature
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
