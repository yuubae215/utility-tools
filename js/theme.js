/**
 * theme.js — shared dark-mode toggle logic (ES Module).
 *
 * Assumes theme-init.js has already applied the 'dark-mode' class to <body>
 * based on localStorage / system preference.
 *
 * Usage:
 *   import { initTheme } from './theme.js';
 *   initTheme();
 */
export function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const icon   = toggle.querySelector('i');

    function apply(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('dark', isDark);
        icon.classList.toggle('fa-sun',  isDark);
        icon.classList.toggle('fa-moon', !isDark);
        toggle.setAttribute('aria-pressed', String(isDark));
    }

    // Sync icon with the state already applied by theme-init.js.
    apply(document.body.classList.contains('dark-mode'));

    toggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        apply(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}
