// =============================================
// GOLDEN HOUR SALON — navigation.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop().split('#')[0];
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const logoArea = document.querySelector('.logo-area');
    if (logoArea) {
        logoArea.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const hamburger   = document.querySelector('.hamburger-toggle');
    const navbar      = document.querySelector('.navbar');
    const overlay     = document.querySelector('.mobile-nav-overlay');

    function openMobileNav() {
        hamburger.classList.add('active');
        navbar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            const isOpen = navbar.classList.contains('active');
            isOpen ? closeMobileNav() : openMobileNav();
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => closeMobileNav());
        });

        if (overlay) overlay.addEventListener('click', closeMobileNav);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMobileNav();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMobileNav();
        });
    }

    const chatbotRoot = document.getElementById('chatbotRoot');

    if (chatbotRoot) {
        fetch('bot.html')
            .then(res => {
                if (!res.ok) throw new Error('Could not load chatbot component');
                return res.text();
            })
            .then(html => {
                chatbotRoot.innerHTML = html;
                document.dispatchEvent(new CustomEvent('chatbotReady'));
            })
            .catch(err => {
                console.error('Chatbot failed to load:', err);
            });
    }

});