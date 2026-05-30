/* ===== ADMIN APP – Bootstrap ===== */
document.addEventListener('DOMContentLoaded', () => {
    Admin.initTheme();
    Admin.initAuth();
    Admin.initSidebar();
    window.addEventListener('hashchange', () => Admin.handleRoute());
    Admin.checkSession();
});
