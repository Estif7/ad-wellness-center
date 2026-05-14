let currentLang = 'en';

function translateElement(el) {
    if (!el) return;
    const newText = currentLang === 'am' 
        ? (el.getAttribute('data-am') || el.textContent)
        : (el.getAttribute('data-en') || el.textContent);
    
    if (newText) el.textContent = newText;
}

function translatePage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        translateElement(el);
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    translatePage();

    // Update all language buttons
    document.querySelectorAll('#lang-en, #lang-en-mobile').forEach(btn => {
        btn.classList.toggle('active', lang === 'en');
    });
    document.querySelectorAll('#lang-am, #lang-am-mobile').forEach(btn => {
        btn.classList.toggle('active', lang === 'am');
    });

    localStorage.setItem('preferredLang', lang);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    if (savedLang === 'am') {
        currentLang = 'am';
    }
    translatePage();
});

// Expose functions globally so auth.js can use them
window.switchLanguage = switchLanguage;
window.translatePage = translatePage;