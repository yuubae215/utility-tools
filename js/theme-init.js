// FOUC prevention — must run synchronously before first paint.
// Loaded via <script src="js/theme-init.js"> (no defer/async/module).
(function () {
    var s = localStorage.getItem('theme');
    var p = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (s === 'dark' || (s === null && p)) {
        // dark-mode: CSS-variable pages; dark: Tailwind (file-binder)
        document.body.classList.add('dark-mode', 'dark');
    }
}());
