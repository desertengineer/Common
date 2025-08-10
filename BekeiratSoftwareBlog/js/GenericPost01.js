document.addEventListener('DOMContentLoaded', function () {
    var date = new Date();
    var option = date.getDay() + 1;
    var theme = '';
    if (option === 1) {
        theme =
            ':root{' +
            '--bg-main:#f7fafc !important;' +
            '--color-main:#222 !important;' +
            '--bg-header:#e3f2fd !important;' +
            '--color-header:#1a237e !important;' +
            '--bg-bs-section:#fff !important;' +
            '--color-bs-section-heading:#0d47a1 !important;' +
            '--color-bs-section-text:#263238 !important;' +
            '--bg-img:#cfd8dc !important;' +
            '--bg-final:#e0f7fa !important;' +
            '--color-final-heading:#006064 !important;' +
            '--color-final-text:#263238 !important;}';
    }
    if (option === 2) {
        theme =
            ':root{' +
            '--bg-main:#fff8e1 !important;' +
            '--color-main:#4e342e !important;' +
            '--bg-header:#ffe0b2 !important;' +
            '--color-header:#1a0cbf !important;' +
            '--bg-bs-section:#fffde7 !important;' +
            '--color-bs-section-heading:#e65100 !important;' +
            '--color-bs-section-text:#3e2723 !important;' +
            '--bg-img:#ffe0b2 !important;' +
            '--bg-final:#fff3e0 !important;' +
            '--color-final-heading:#bf360c !important;' +
            '--color-final-text:#3e2723 !important;}';
    }
    if (option === 3) {
        theme =
            ':root{' +
            '--bg-main:#e8f5e9 !important;' +
            '--color-main:#1b5e20 !important;' +
            '--bg-header:#c8e6c9 !important;' +
            '--color-header:#388e3c !important;' +
            '--bg-bs-section:#ffffff !important;' +
            '--color-bs-section-heading:#2e7d32 !important;' +
            '--color-bs-section-text:#3949ab !important;' +
            '--bg-img:#a5d6a7 !important;' +
            '--bg-final:#b2dfdb !important;' +
            '--color-final-heading:#004d40 !important;' +
            '--color-final-text:#263238 !important;}';
    }
    if (option === 4) {
        theme =
            ':root{' +
            '--bg-main:#fce4ec !important;' +
            '--color-main:#6a1b9a !important;' +
            '--bg-header:#f8bbd0 !important;' +
            '--color-header:#ad1457 !important;' +
            '--bg-bs-section:#fff !important;' +
            '--color-bs-section-heading:#8e24aa !important;' +
            '--color-bs-section-text:#4a148c !important;' +
            '--bg-img:#f8bbd0 !important;' +
            '--bg-final:#f3e5f5 !important;' +
            '--color-final-heading:#6a1b9a !important;' +
            '--color-final-text:#4a148c !important;}';
    }
    if (option === 5) {
        theme =
            ':root{' +
            '--bg-main:#e3f2fd !important;' +
            '--color-main:#01579b !important;' +
            '--bg-header:#bbdefb !important;' +
            '--color-header:#0277bd !important;' +
            '--bg-bs-section:#e1f5fe !important;' +
            '--color-bs-section-heading:#039be5 !important;' +
            '--color-bs-section-text:#01579b !important;' +
            '--bg-img:#b3e5fc !important;' +
            '--bg-final:#e0f7fa !important;' +
            '--color-final-heading:#00838f !important;' +
            '--color-final-text:#004d40 !important;}';
    }
    if (option === 6) {
        theme =
            ':root{' +
            '--bg-main:#fff3e0 !important;' +
            '--color-main:#e65100 !important;' +
            '--bg-header:#ffe0b2 !important;' +
            '--color-header:#ff6f00 !important;' +
            '--bg-bs-section:#fffde7 !important;' +
            '--color-bs-section-heading:#ff9800 !important;' +
            '--color-bs-section-text:#e65100 !important;' +
            '--bg-img:#ffe0b2 !important;' +
            '--bg-final:#ffe0b2 !important;' +
            '--color-final-heading:#e65100 !important;' +
            '--color-final-text:#6d4c41 !important;}';
    }
    if (option === 7) {
        theme =
            ':root{' +
            '--bg-main:#f1f8e9 !important;' +
            '--color-main:#33691e !important;' +
            '--bg-header:#dcedc8 !important;' +
            '--color-header:#558b2f !important;' +
            '--bg-bs-section:#ffffff !important;' +
            '--color-bs-section-heading:#689f38 !important;' +
            '--color-bs-section-text:#33691e !important;' +
            '--bg-img:#c5e1a5 !important;' +
            '--bg-final:#f1f8e9 !important;' +
            '--color-final-heading:#558b2f !important;' +
            '--color-final-text:#33691e !important;}';
    }
    document.getElementById('dynamic-theme').innerHTML = theme;
});
