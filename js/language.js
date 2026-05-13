let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    
    // Translate all text content
    document.querySelectorAll('[data-en]').forEach(el => {
        const newText = lang === 'am' 
            ? (el.getAttribute('data-am') || el.textContent)
            : (el.getAttribute('data-en') || el.textContent);
        
        if (newText) {
            el.textContent = newText;
        }
    });

    // Update ALL language buttons (both desktop and mobile)
    const allEnBtns = document.querySelectorAll('#lang-en, #lang-en-mobile');
    const allAmBtns = document.querySelectorAll('#lang-am, #lang-am-mobile');

    allEnBtns.forEach(btn => {
        btn.classList.toggle('active', lang === 'en');
    });

    allAmBtns.forEach(btn => {
        btn.classList.toggle('active', lang === 'am');
    });

    // Save preference
    localStorage.setItem('preferredLang', lang);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    if (savedLang === 'am') {
        switchLanguage('am');
    }
});