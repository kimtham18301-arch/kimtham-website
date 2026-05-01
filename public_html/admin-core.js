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
    if (res.status === 401 && endpoint !== 'login.php') {
        Admin.showLogin();
        Admin.toast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
        throw new Error(data.message || 'Phiên đăng nhập hết hạn');
    }
    if (!res.ok || !data.ok) throw new Error(data.message || 'Có lỗi xảy ra');
    return data;
};

Admin.apiUpload = async (file) => {
    await Admin._detectApi();
    const normalizeImage = async (source) => {
        if (!/^image\/(jpeg|png|webp)$/i.test(source.type) || (source.size <= 700 * 1024)) {
            return source;
        }

        const imageUrl = URL.createObjectURL(source);
        try {
            const img = await new Promise((resolve, reject) => {
                const el = new Image();
                el.onload = () => resolve(el);
                el.onerror = reject;
                el.src = imageUrl;
            });
            const maxSide = 1600;
            const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
            canvas.height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const outputType = source.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
            const blob = await new Promise(resolve => canvas.toBlob(resolve, outputType, 0.82));
            if (!blob || blob.size >= source.size) return source;
            const ext = outputType === 'image/jpeg' ? 'jpg' : 'webp';
            const baseName = source.name.replace(/\.[^.]+$/, '') || 'image';
            return new File([blob], `${baseName}.${ext}`, { type: outputType });
        } finally {
            URL.revokeObjectURL(imageUrl);
        }
    };

    const uploadFile = await normalizeImage(file);
    const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(uploadFile);
    });
    const base64Payload = String(base64Data).split(';base64,')[1] || '';
    const chunkSize = 4 * 1024;
    const total = Math.max(1, Math.ceil(base64Payload.length / chunkSize));
    const uploadId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    let data = {};

    for (let index = 0; index < total; index++) {
        const headers = { 'Content-Type': 'application/json' };
        if (Admin.csrfToken) headers['X-CSRF-Token'] = Admin.csrfToken;
        const body = {
            mode: 'chunk',
            uploadId,
            index,
            total,
            name: uploadFile.name,
            type: uploadFile.type,
            size: uploadFile.size,
            chunk: base64Payload.slice(index * chunkSize, (index + 1) * chunkSize)
        };
        const res = await fetch(Admin.API + 'upload.php', { method: 'POST', headers, body: JSON.stringify(body), credentials: 'include' });
        const raw = await res.text();
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch {
            throw new Error('API khong tra ve JSON hop le. Hay kiem tra loi PHP hoac quyen ghi tren hosting.');
        }
        if (data.csrfToken) Admin.csrfToken = data.csrfToken;
        if (res.status === 401) {
            Admin.showLogin();
            Admin.toast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
            throw new Error(data.message || 'Phiên đăng nhập hết hạn');
        }
        if (!res.ok || !data.ok) throw new Error(data.message || 'Upload thất bại');
    }

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
