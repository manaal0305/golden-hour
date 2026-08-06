// =============================================
// GOLDEN HOUR SALON — main.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    /* ============================
       MUSIC
       - Plays automatically on first visit
       - Continues position across page navigation
       - Manual pause persists across navigation
       - A hard refresh always restarts from 0 and plays
    ============================ */
    const audio    = document.getElementById('bg-music');
    const musicBtn = document.getElementById('musicControl');

    if (audio && musicBtn) {
        audio.volume = 0.15;

        // Detect reload vs normal navigation
        let navType = 'navigate';
        try {
            const navEntries = performance.getEntriesByType('navigation');
            if (navEntries && navEntries.length) {
                navType = navEntries[0].type; // 'navigate' | 'reload' | 'back_forward'
            } else if (performance.navigation) {
                navType = performance.navigation.type === 1 ? 'reload' : 'navigate';
            }
        } catch (e) { /* default stays 'navigate' */ }

        const isReload = navType === 'reload';

        if (isReload) {
            // Hard refresh: force restart from the beginning
            audio.currentTime = 0;
            localStorage.setItem('gh_music_time', '0');
            localStorage.setItem('gh_music_playing', 'true');
        } else {
            const storedTime = parseFloat(localStorage.getItem('gh_music_time'));
            if (!isNaN(storedTime) && storedTime > 0) {
                audio.currentTime = storedTime;
            }
        }

        function markPlaying() {
            musicBtn.classList.remove('paused');
            localStorage.setItem('gh_music_playing', 'true');
        }
        function markPaused() {
            musicBtn.classList.add('paused');
            localStorage.setItem('gh_music_playing', 'false');
        }

        const storedPlaying = localStorage.getItem('gh_music_playing');

        if (!isReload && storedPlaying === 'false') {
            // User paused it before navigating — respect that
            markPaused();
        } else {
            // First-ever visit, reload, or was playing before — try to (re)start
            audio.play().then(markPlaying).catch(() => {
                markPaused();
                const startOnInteraction = () => {
                    audio.play().then(markPlaying).catch(() => {});
                    document.removeEventListener('click', startOnInteraction);
                    document.removeEventListener('touchstart', startOnInteraction);
                };
                document.addEventListener('click', startOnInteraction, { once: true });
                document.addEventListener('touchstart', startOnInteraction, { once: true });
            });
        }

        musicBtn.addEventListener('click', e => {
            e.stopPropagation();
            if (audio.paused) {
                audio.play().then(markPlaying).catch(() => {});
            } else {
                audio.pause();
                markPaused();
            }
        });

        setInterval(() => {
            if (!audio.paused) {
                localStorage.setItem('gh_music_time', audio.currentTime);
            }
        }, 2000);

        window.addEventListener('pagehide', () => {
            localStorage.setItem('gh_music_time', audio.currentTime);
        });
    }

    document.addEventListener('chatbotReady', initChatbot);

    /* ============================
       CHATBOT DATA
    ============================ */
    const SALON_LINKS = {
        about:    "https://goldenhourridgewood.glossgenius.com/about",
        team:     "https://goldenhourridgewood.glossgenius.com/team",
        services: "https://goldenhourridgewood.glossgenius.com/services",
        contact:  "https://goldenhourridgewood.glossgenius.com/contact",
        book:     "https://goldenhourridgewood.glossgenius.com/book"
    };

    const SALON_ADDRESS       = "44 Franklin Ave, Ridgewood, NJ 07450";
    const SALON_PHONE_DISPLAY = "(201) 555-0199";
    const SALON_PHONE_TEL     = "+12015550199";

    const SALON_SERVICES = [
        { name: "Olaplex Treatment",              price: "$30",   time: "30 min",   keywords: ["olaplex"] },
        { name: "Bang Trim",                      price: "$15+",  time: "15+ min",  keywords: ["bang trim", "bangs", "fringe"] },
        { name: "Base Break",                     price: "$80+",  time: "30+ min",  keywords: ["base break"] },
        { name: "Blowout with Extensions",        price: "$70+",  time: "60+ min",  keywords: ["blowout with extension", "extension blowout"] },
        { name: "Blowout",                        price: "$60+",  time: "45+ min",  keywords: ["blowout", "blow out", "blow-dry", "blow dry"] },
        { name: "Bridal Hair — Trial",            price: "$200+", time: "90+ min",  keywords: ["bridal trial", "trial"] },
        { name: "Bridal Party — Day Of",          price: "$200+", time: "60+ min",  keywords: ["bridal party"] },
        { name: "Bride — Day Of",                 price: "$400+", time: "120+ min", keywords: ["bride day", "wedding day"] },
        { name: "Deep Conditioning Treatment",    price: "$25+",  time: "30+ min",  keywords: ["deep conditioning", "conditioning treatment"] },
        { name: "Double Process",                 price: "$200+", time: "120+ min", keywords: ["double process"] },
        { name: "Extensions — Consultation",      price: "$50+",  time: "30+ min",  keywords: ["extension"] },
        { name: "Face Frame Highlight",           price: "$160+", time: "45+ min",  keywords: ["face frame", "money piece"] },
        { name: "Full Custom Color",              price: "$425+", time: "120+ min", keywords: ["full custom color", "balayage", "full color", "fantasy color"] },
        { name: "Full Highlights",                price: "$350+", time: "135+ min", keywords: ["full highlight"] },
        { name: "Glaze",                          price: "$70+",  time: "30+ min",  keywords: ["glaze", "gloss", "tone treatment"] },
        { name: "Hair Botox",                     price: "$150+", time: "60+ min",  keywords: ["hair botox", "botox"] },
        { name: "Keratin Treatment",               price: "$350+", time: "120+ min", keywords: ["keratin"] },
        { name: "Lowlights",                      price: "$150+", time: "60+ min",  keywords: ["lowlight"] },
        { name: "Partial Custom Color",           price: "$325+", time: "150+ min", keywords: ["partial custom color", "partial color"] },
        { name: "Partial Highlights",             price: "$250+", time: "90+ min",  keywords: ["partial highlight"] },
        { name: "Party Blowout",                  price: "$75+",  time: "60+ min",  keywords: ["party blowout", "curling iron", "roller set"] },
        { name: "Shadow Root",                    price: "$80+",  time: "15+ min",  keywords: ["shadow root", "root melt"] },
        { name: "Single Process",                 price: "$90+",  time: "45+ min",  keywords: ["single process"] },
        { name: "Single Process & Glaze",         price: "$130+", time: "45+ min",  keywords: ["single process and glaze", "single process & glaze"] },
        { name: "Updo",                           price: "$175+", time: "90+ min",  keywords: ["updo"] },
        { name: "Updo — Child (up to age 12)",    price: "$100+", time: "60+ min",  keywords: ["child updo", "kid updo", "updo for kid"] }
    ];

    function initChatbot() {
        const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose  = document.getElementById('chatClose');
        const chatSend   = document.getElementById('chatSend');
        const chatInput  = document.getElementById('chatInput');
        const chatBody   = document.getElementById('chatBody');
        const chips      = document.querySelectorAll('.prompt-chip');

        if (!chatToggle || !chatWindow) return;

        chatToggle.addEventListener('click', () => chatWindow.classList.toggle('active'));
        chatClose.addEventListener('click',  () => chatWindow.classList.remove('active'));

        function sendMessage(text) {
            const msg = text || chatInput.value.trim();
            if (!msg) return;
            addBubble(msg, 'user-msg');
            chatInput.value = '';

            const tray = chatBody.querySelector('.suggested-prompts-tray');
            const typingEl = document.createElement('div');
            typingEl.classList.add('chat-msg', 'bot-msg', 'typing-indicator');
            typingEl.innerHTML = '<span></span><span></span><span></span>';
            tray ? chatBody.insertBefore(typingEl, tray) : chatBody.appendChild(typingEl);
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                typingEl.remove();
                addBubble(getReply(msg), 'bot-msg');
            }, 550);
        }

        function addBubble(content, cls) {
            const el = document.createElement('div');
            el.classList.add('chat-msg', cls);
            if (cls === 'user-msg') {
                el.innerText = content; // never render user input as HTML
            } else {
                el.innerHTML = content; // bot replies are built by us, safe to render links
            }
            const tray = chatBody.querySelector('.suggested-prompts-tray');
            tray ? chatBody.insertBefore(el, tray) : chatBody.appendChild(el);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        function mapsLink() {
            return `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SALON_ADDRESS)}" target="_blank" rel="noopener">${SALON_ADDRESS}</a>`;
        }
        function callLink() {
            return `<a href="tel:${SALON_PHONE_TEL}">${SALON_PHONE_DISPLAY}</a>`;
        }
        function bookLink(label) {
            return `<a href="${SALON_LINKS.book}" target="_blank" rel="noopener">${label || "Book now"}</a>`;
        }

        function findServiceMatches(q) {
            const matches = [];
            SALON_SERVICES.forEach(s => {
                for (const kw of s.keywords) {
                    if (q.includes(kw)) { matches.push(s); return; }
                }
            });
            return matches;
        }

        function getReply(input) {
            const q = input.toLowerCase().trim();

            if (/^(hi|hey|hello|yo|good morning|good afternoon|good evening)\b/.test(q)) {
                return "Hello! Welcome to Golden Hour Hair ✨ Ask me about services, pricing, our team, or how to book.";
            }

            if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('direction') || q.includes('map')) {
                return `We're located at ${mapsLink()} — tap it to open Google Maps. You can also call us at ${callLink()}.`;
            }

            if (q.includes('phone') || q.includes('call') || q.includes('number')) {
                return `You can reach us at ${callLink()}, or visit our <a href="${SALON_LINKS.contact}" target="_blank" rel="noopener">contact page</a>.`;
            }

            if (q.includes('book') || q.includes('appointment') || q.includes('schedule') || q.includes('reserve')) {
                return `You can ${bookLink("book your appointment here")}. Extensions and bridal services require a quick consultation first.`;
            }

            if (q.includes('team') || q.includes('stylist') || q.includes('who works') || q.includes('who cuts') || q.includes('artist')) {
                return `Meet our stylists on our <a href="${SALON_LINKS.team}" target="_blank" rel="noopener">team page</a> — each has their own specialties and availability.`;
            }

            if (q.includes('about') || q.includes('history') || q.includes('who are you')) {
                return `We're a serene unisex studio in Ridgewood, NJ. Read more <a href="${SALON_LINKS.about}" target="_blank" rel="noopener">about us here</a>.`;
            }

            if (q.includes('bridal') || q.includes('wedding')) {
                return `We offer full bridal packages — Trial ($200+, 90+ min), Bridal Party Day-Of ($200+), and Bride Day-Of ($400+). Travel available. ${bookLink("Book a bridal consultation")}.`;
            }

            if (q.includes('extension')) {
                return `Extensions are fully custom and start with a $50+ consultation (30+ min). ${bookLink("Book an extensions consultation")}.`;
            }

            if (q.includes('education') || q.includes('class') || q.includes('learn') || q.includes('student') || q.includes('training')) {
                return `Our Golden Education program teaches extension techniques to stylists and cosmetology students. Check the Golden Education tab, or email goldenhourhair44@gmail.com.`;
            }

            if (q.includes('suite') || q.includes('rent') || q.includes('lease')) {
                return `We have independent studio suites available. Call ${callLink()} to talk about leasing, or check the Suite Artists tab.`;
            }

            if (q.includes('haircut') || q.includes('hair cut')) {
                if (q.includes('men') || q.includes('man') || q.includes('guy')) {
                    return `Men's Haircut — $50+, 45+ min. ${bookLink("Book now")}.`;
                }
                if (q.includes('women') || q.includes('woman') || q.includes('girl')) {
                    return `Women's Haircut — $100+, 60+ min. ${bookLink("Book now")}.`;
                }
                return `We offer <strong>Men's Haircut</strong> — $50+, 45+ min and <strong>Women's Haircut</strong> — $100+, 60+ min. ${bookLink("Book now")}.`;
            }

            if (q.includes('service') || q.includes('menu') || q.includes('offer')) {
                return `We offer haircuts, color (balayage, highlights, glazes), treatments (keratin, Olaplex, hair botox), blowouts, updos, and bridal styling. See the full menu on our <a href="${SALON_LINKS.services}" target="_blank" rel="noopener">services page</a>, or ask about a specific service.`;
            }

            const matches = findServiceMatches(q);
            if (matches.length) {
                const top = matches.slice(0, 3);
                const lines = top.map(s => `<strong>${s.name}</strong> — ${s.price}, ${s.time}`).join('<br>');
                return `Here's what I have:<br>${lines}<br><span style="font-size:.78em;opacity:.75;">Exact pricing varies by stylist and is confirmed at booking.</span> ${bookLink()}`;
            }

            if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('how much')) {
                return `Pricing varies by stylist and service — starting rates are on our <a href="${SALON_LINKS.services}" target="_blank" rel="noopener">services page</a>, confirmed at booking. Try asking about a specific service, like "how much is a blowout?"`;
            }

            return `Thanks for reaching out! For custom scheduling or service questions, ${bookLink()} or call ${callLink()}.`;
        }

        chatSend.addEventListener('click', () => sendMessage());
        chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const q = chip.getAttribute('data-query');
                if (q) sendMessage(q);
            });
        });
    }

});