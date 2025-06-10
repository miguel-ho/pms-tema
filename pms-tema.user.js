// ==UserScript==
// @name         Tema por hotel – Ulyses PMS Github
// @namespace    https://orqui.ulysescloud.com
// @version      1.1
// @description  Cambia el color primario y el favicon según el hotel activo
// @downloadURL  https://TU_USUARIO.github.io/pms-tema/pms-tema.user.js
// @updateURL    https://TU_USUARIO.github.io/pms-tema/pms-tema.user.js
// @match        https://orqui.ulysescloud.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(() => {

    //1
    const selector = 'body > ulyses-cloud > uc-navigation > navigation-desktop > div.color-navbar > nav > div > div.actions > div:nth-child(8) > button > span > span';

    const themes = {
        'HLA La Laguna': {
            hex: '#1e5e32',
            rgb: '30, 94, 50',
            dark: '#164727',
            light: '#2f8649',
        },
        'HTA Hotel Tabur': {
            hex: '#b36b00',
            rgb: '179, 139, 0',
            dark: '#8f6f00',
            light: '#d5aa2a',
        }
    };

    let currentHotel = null;

    function applyTheme(theme) {
        const html = document.documentElement;
        html.style.setProperty('--primary', theme.hex);
        html.style.setProperty('--primary-rgb', theme.rgb);
        html.style.setProperty('--primary-dark-1', theme.dark);
        html.style.setProperty('--primary-light-1', theme.light);
        updateFavicon(theme.hex);
    }

    function updateFavicon(hex) {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, 2 * Math.PI);
        ctx.fill();
        const dataUrl = canvas.toDataURL('image/png');

        document.querySelectorAll('link[rel~="icon"]').forEach(el => el.remove());

        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = dataUrl;
        document.head.appendChild(link);
    }

    function detectHotel() {
        const el = document.querySelector(selector);
        if (!el) return;

        const text = el.textContent.trim();
        for (const name in themes) {
            if (text.startsWith(name)) {
                if (currentHotel !== name) {
                    currentHotel = name;
                    applyTheme(themes[name]);
                }
                return;
            }
        }
    }

    const watch = () => {
        const target = document.querySelector(selector);
        if (!target) return;
        new MutationObserver(detectHotel).observe(target, {
            characterData: true,
            childList: true,
            subtree: true,
        });
    };

    new MutationObserver(() => {
        if (currentHotel) applyTheme(themes[currentHotel]);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    const ready = setInterval(() => {
        if (document.querySelector(selector)) {
            clearInterval(ready);
            detectHotel();
            watch();
        }
    }, 300);
})();
