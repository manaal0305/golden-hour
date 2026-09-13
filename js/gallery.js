// =============================================
// GOLDEN HOUR SALON — gallery.js
// Coverflow-style stylist photo carousel
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.coverflow').forEach(initCoverflow);
});

function initCoverflow(root) {
    const track   = root.querySelector('.cf-track');
    const slides  = Array.from(track.querySelectorAll('.cf-slide'));
    const prevBtn = root.querySelector('.cf-prev');
    const nextBtn = root.querySelector('.cf-next');
    const total   = slides.length;
    let current   = 0;

    function render() {
        slides.forEach((slide, i) => {
            slide.classList.remove('cf-active', 'cf-side-left', 'cf-side-right', 'cf-hidden');
            let offset = i - current;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            if (offset === 0) slide.classList.add('cf-active');
            else if (offset === -1) slide.classList.add('cf-side-left');
            else if (offset === 1) slide.classList.add('cf-side-right');
            else slide.classList.add('cf-hidden');
        });
    }

    prevBtn.addEventListener('click', () => {
        current = (current - 1 + total) % total;
        render();
    });

    nextBtn.addEventListener('click', () => {
        current = (current + 1) % total;
        render();
    });

    slides.forEach((slide) => {
        slide.addEventListener('click', () => {
            if (slide.classList.contains('cf-side-left')) {
                current = (current - 1 + total) % total;
                render();
            } else if (slide.classList.contains('cf-side-right')) {
                current = (current + 1) % total;
                render();
            }
        });
    });

    render();
}