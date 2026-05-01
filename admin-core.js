/* ===== ADMIN CORE – Utilities, Router, Auth ===== */
const Admin = {};

// --- Config ---
// On hosting: admin.html is in public_html/, API at api/ (relative)
// On local dev: admin.html is at root, API at public_html/api/
Admin.API = 'api/';
Admin.csrfToken = '';
Admin.quillInstance = null;

// Auto-detect API path on first call
Admin._apiDetected = false;
Admin._detectApi = async () => {
    if (Admin._apiDetected) return;
    try {
        const res = await fetch('api/session.php', { method: 'HEAD', credentials: 'include' });
        if (res.status === 404) throw 0;
        Admin.API = 'api/';
    } catch {
        Admin.API = 'public_html/api/';
    }
    Admin._apiDetected = true;
};

// --- Helpers ---
Admin.esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
Admin.$ = s => document.querySelector(s);
Admin.$$ = s => document.querySelectorAll(s);
Admin.genId = p => p + '_' + Date.now().toString(36);
Admin.assetUrl = url => {
    if (!url || /^(https?:)?\/\//.test(url) || url.startsWith('/')) return url || '';
    return Admin.API.startsWith('public_html/') && url.startsWith('images/') ? 'public_html/' + url : url;
};

// --- Toast ---
Admin.toast = (msg, type='info') => {
    const c = Admin.$('#toastContainer');
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.style.animation='toast-out .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3000);
};

// --- Confirm Dialog ---
Admin.confirm = (title, msg) => new Promise(resolve => {
    const m = Admin.$('#confirmModal');
    Admin.$('#confirmTitle').textContent = title;
    Admin.$('#confirmMessage').textContent = msg;
    m.hidden = false;
    const ok = Admin.$('#confirmOk'), cancel = Admin.$('#confirmCancel');
    const cleanup = v => { m.hidden = true; ok.onclick = null; cancel.onclick = null; resolve(v); };
    ok.onclick = () => cleanup(true);
    cancel.onclick = () => cleanup(false);
});

// --- API ---
Admin.api = async (endpoint, opts = {}) => {
    await Admin._detectApi();
    const headers = { 'Accept': 'application/json' };
    // Only set Content-Type for requests with body
    if (opts.method && opts.method !== 'GET') {
        headers['Content-Type'] = 'application/json';
    }
    if (Admin.csrfToken) headers['X-CSRF-Token'] = Admin.csrfToken;
    const res = await fetch(Admin.API + endpoint, {
        ...opts,
        credentials: 'include',
        headers: { ...headers, ...(opts.headers || {}) }
    });
    const raw = await res.text();
    let data = {};
    try {
        data = raw ? JSON.parse(raw) : {};
    } catch {
        throw new Error('API khong tra ve JSON hop le. Hay kiem tra loi PHP hoac quyen ghi tren hosting.');
    }
    // Always update CSRF token if provided in response
    if (data.csrfToken) Admin.csrfToken = data.csrfToken;
    // Handle auth failure
    if (res.status === 401) {
        Admin.showLogin();
        Admin.toast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
        throw new Error(data.message || 'Phiên đăng nhập hết hạn');
    }
    if (!res.ok || !data.ok) throw new Error(data.message || 'Có lỗi xảy ra');
    return data;
};

Admin.apiUpload = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const headers = {};
    if (Admin.csrfToken) headers['X-CSRF-Token'] = Admin.csrfToken;
    const res = await fetch(Admin.API + 'upload.php', { method: 'POST', headers, body: fd, credentials: 'include' });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || 'Upload thất bại');
    return data;
};

// --- Router ---
Admin.routes = {};
Admin.currentRoute = '';
Admin.navigate = hash => { window.location.hash = hash; };

Admin.registerRoute = (name, renderFn) => { Admin.routes[name] = renderFn; };

Admin.handleRoute = () => {
    const hash = window.location.hash.slice(2) || 'dashboard';
    const parts = hash.split('/');
    const route = parts[0];
    const param = parts[1] || null;
    Admin.currentRoute = route;

    // Update sidebar active
    Admin.$$('.sidebar-link[data-route]').forEach(link => {
        link.classList.toggle('active', link.dataset.route === route);
    });

    // Update topbar title
    const activeLink = Admin.$(`.sidebar-link[data-route="${route}"]`);
    const title = activeLink ? activeLink.querySelector('span:last-child').textContent : 'Dashboard';
    Admin.$('#topbarTitle').textContent = title;

    // Render
    const main = Admin.$('#adminMain');
    if (Admin.routes[route]) {
        Admin.routes[route](main, param);
    } else {
        main.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🚧</div><h3>Chưa có nội dung</h3><p>Trang này đang được xây dựng.</p></div>';
    }
};

// --- Auth ---
Admin.showLogin = () => { Admin.$('#loginScreen').hidden = false; Admin.$('#adminShell').hidden = true; };
Admin.showAdmin = () => { Admin.$('#loginScreen').hidden = true; Admin.$('#adminShell').hidden = false; };

Admin.checkSession = async () => {
    await Admin._detectApi();
    try {
        const s = await Admin.api('session.php');
        Admin.csrfToken = s.csrfToken || '';
        if (s.authenticated) { Admin.showAdmin(); Admin.handleRoute(); return; }
    } catch(e) {}
    Admin.showLogin();
};

Admin.initAuth = () => {
    Admin.$('#loginForm').addEventListener('submit', async e => {
        e.preventDefault();
        const st = Admin.$('#loginStatus');
        st.textContent = 'Đang đăng nhập...';
        try {
            const fd = new FormData(e.target);
            const data = await Admin.api('login.php', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(fd.entries()))
            });
            Admin.csrfToken = data.csrfToken || Admin.csrfToken;
            Admin.showAdmin();
            e.target.reset();
            st.textContent = '';
            Admin.handleRoute();
            Admin.toast('Đăng nhập thành công', 'success');
        } catch(err) { st.textContent = err.message; }
    });

    Admin.$('#logoutBtn').addEventListener('click', async () => {
        try { await Admin.api('logout.php', { method: 'POST', body: '{}' }); } catch(e) {}
        Admin.csrfToken = '';
        Admin.showLogin();
        Admin.toast('Đã đăng xuất', 'info');
    });
};

// --- Sidebar ---
Admin.initSidebar = () => {
    const sidebar = Admin.$('#sidebar');
    Admin.$('#sidebarToggle').addEventListener('click', () => sidebar.classList.add('open'));
    Admin.$('#sidebarClose').addEventListener('click', () => sidebar.classList.remove('open'));
    Admin.$$('.sidebar-link[data-route]').forEach(link => {
        link.addEventListener('click', () => sidebar.classList.remove('open'));
    });
};

// --- Quill Helper ---
Admin.initQuill = (selector) => {
    if (Admin.quillInstance) { Admin.quillInstance = null; }
    const el = document.querySelector(selector);
    if (!el) return null;
    Admin.quillInstance = new Quill(el, {
        theme: 'snow',
        placeholder: 'Viết nội dung tại đây...',
        modules: { toolbar: [[{header:[2,3,false]}],['bold','italic','underline','blockquote'],['link','image'],[{list:'ordered'},{list:'bullet'}],['clean']] }
    });
    return Admin.quillInstance;
};
