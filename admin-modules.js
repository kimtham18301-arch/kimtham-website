/* ===== ADMIN MODULES – Route Handlers ===== */

// ==================== DASHBOARD ====================
Admin.registerRoute('dashboard', async (main) => {
    main.innerHTML = '<div class="page-header"><div><h1>Dashboard</h1><p>Tổng quan website Kim Thắm</p></div></div><div class="stats-grid" id="dashStats"></div><div class="page-header"><div><h1 style="font-size:1.3rem">Hoạt động gần đây</h1></div></div><div class="activity-list" id="dashActivity"><div class="empty-state"><p>Đang tải...</p></div></div>';
    try {
        const [blogs, portfolio, products] = await Promise.all([
            Admin.api('blogs.php').catch(() => ({blogs:[]})),
            Admin.api('portfolio.php').catch(() => ({items:[]})),
            Admin.api('products.php').catch(() => ({items:[]}))
        ]);
        const b = blogs.blogs || [];
        const p = portfolio.items || [];
        const pr = products.items || [];
        Admin.$('#dashStats').innerHTML = `
            <div class="stat-card stat-card--pink"><div class="stat-card-label">Blog Posts</div><div class="stat-card-value">${b.length}</div><div class="stat-card-sub">${b.filter(x=>x.status==='published').length} đã xuất bản</div></div>
            <div class="stat-card stat-card--green"><div class="stat-card-label">Portfolio</div><div class="stat-card-value">${p.length}</div><div class="stat-card-sub">Case studies</div></div>
            <div class="stat-card stat-card--gold"><div class="stat-card-label">Sản phẩm</div><div class="stat-card-value">${pr.length}</div><div class="stat-card-sub">Nước hoa</div></div>`;
        const recent = b.slice(0,5).map(x => `<div class="activity-item"><div class="activity-icon">✍️</div><div class="activity-text"><strong>${Admin.esc(x.title)}</strong></div><div class="activity-time">${x.date||''}</div></div>`).join('');
        Admin.$('#dashActivity').innerHTML = recent || '<div class="empty-state"><p>Chưa có hoạt động</p></div>';
    } catch(e) { Admin.toast(e.message,'error'); }
});

// ==================== BLOGS ====================
Admin.registerRoute('blogs', async (main, param) => {
    if (param === 'new' || param === 'edit') return Admin.blogForm(main, param === 'edit');
    main.innerHTML = '<div class="page-header"><div><h1>Blog</h1><p>Quản lý bài viết</p></div><div class="page-actions"><button class="btn btn--primary" id="btnNewBlog">+ Bài viết mới</button></div></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Tiêu đề</th><th>Danh mục</th><th>Trạng thái</th><th>Ngày</th><th></th></tr></thead><tbody id="blogTable"></tbody></table></div>';
    Admin.$('#btnNewBlog').onclick = () => Admin.navigate('#/blogs/new');
    try {
        const data = await Admin.api('blogs.php');
        const rows = (data.blogs||[]).map(b => `<tr>
            <td><strong>${Admin.esc(b.title)}</strong></td>
            <td><span class="tag tag--pink">${Admin.esc(b.category)}</span></td>
            <td><span class="tag tag--${b.status==='published'?'published':'draft'}">${b.status==='published'?'Đã xuất bản':'Nháp'}</span></td>
            <td>${Admin.esc(b.date||'')}</td>
            <td><div class="row-actions"><button class="btn btn--ghost btn--small" data-edit="${b.id}">Sửa</button><button class="btn btn--danger btn--small" data-del="${b.id}">Xóa</button></div></td>
        </tr>`).join('');
        Admin.$('#blogTable').innerHTML = rows || '<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">✍️</div><h3>Chưa có bài viết</h3></div></td></tr>';
        Admin.$$('[data-edit]').forEach(btn => btn.onclick = () => { Admin._editBlogId = btn.dataset.edit; Admin.navigate('#/blogs/edit'); });
        Admin.$$('[data-del]').forEach(btn => btn.onclick = async () => {
            if (await Admin.confirm('Xóa bài viết', 'Bạn có chắc muốn xóa bài viết này?')) {
                try { await Admin.api('blogs.php', { method:'DELETE', body: JSON.stringify({id:btn.dataset.del}) }); Admin.toast('Đã xóa','success'); Admin.handleRoute(); } catch(e) { Admin.toast(e.message,'error'); }
            }
        });
    } catch(e) { Admin.toast(e.message,'error'); }
});

Admin.blogForm = async (main, isEdit) => {
    main.innerHTML = `<div class="page-header"><div><h1>${isEdit?'Sửa bài viết':'Bài viết mới'}</h1></div><div class="page-actions"><button class="btn btn--ghost" id="btnBackBlog">← Quay lại</button></div></div>
    <div class="form-panel"><div class="form-grid"><div class="form-group"><label class="form-label">Tiêu đề</label><input class="form-input" id="blogTitle" placeholder="Tiêu đề bài viết"></div>
    <div class="form-group"><label class="form-label">Danh mục</label><select class="form-select" id="blogCat"><option value="marketing">Marketing</option><option value="yoga">Yoga</option><option value="scent">Scent</option><option value="mentoring">Mentoring</option><option value="lifestyle">Lifestyle</option></select></div>
    <div class="form-group"><label class="form-label">Tag</label><input class="form-input" id="blogTag" placeholder="#HashTag"></div>
    <div class="form-group"><label class="form-label">Thời gian đọc</label><input class="form-input" id="blogRead" placeholder="5 phút đọc"></div>
    <div class="form-group form-group--full"><label class="form-label">Tóm tắt</label><textarea class="form-textarea" id="blogExcerpt" rows="2" placeholder="Mô tả ngắn..."></textarea></div>
    <div class="form-group form-group--full"><label class="form-label">Nội dung</label><div class="editor-wrap"><div id="blogEditor"></div></div></div>
    <div class="form-group"><label class="form-label">Trạng thái</label><select class="form-select" id="blogStatus"><option value="draft">Nháp</option><option value="published">Xuất bản</option></select></div>
    <div class="form-group"><label class="form-label">Ngày</label><input class="form-input" type="date" id="blogDate"></div>
    </div><div class="form-actions"><button class="btn btn--primary" id="btnSaveBlog">Lưu bài viết</button></div></div>`;
    Admin.$('#btnBackBlog').onclick = () => Admin.navigate('#/blogs');
    const quill = Admin.initQuill('#blogEditor');
    let editData = null;
    if (isEdit && Admin._editBlogId) {
        try {
            const data = await Admin.api('blogs.php');
            editData = (data.blogs||[]).find(b => b.id === Admin._editBlogId);
            if (editData) {
                Admin.$('#blogTitle').value = editData.title||'';
                Admin.$('#blogCat').value = editData.category||'marketing';
                Admin.$('#blogTag').value = editData.tag||'';
                Admin.$('#blogRead').value = editData.readTime||'';
                Admin.$('#blogExcerpt').value = editData.excerpt||'';
                Admin.$('#blogStatus').value = editData.status||'draft';
                Admin.$('#blogDate').value = editData.date||'';
                if (quill && editData.content) quill.root.innerHTML = editData.content;
            }
        } catch(e) { Admin.toast(e.message,'error'); }
    }
    Admin.$('#btnSaveBlog').onclick = async () => {
        const body = {
            title: Admin.$('#blogTitle').value.trim(),
            category: Admin.$('#blogCat').value,
            tag: Admin.$('#blogTag').value.trim(),
            readTime: Admin.$('#blogRead').value.trim(),
            excerpt: Admin.$('#blogExcerpt').value.trim(),
            content: quill ? quill.root.innerHTML : '',
            status: Admin.$('#blogStatus').value,
            date: Admin.$('#blogDate').value
        };
        if (!body.title) { Admin.toast('Vui lòng nhập tiêu đề','error'); return; }
        try {
            if (isEdit && editData) {
                body.id = editData.id;
                await Admin.api('blogs.php', { method:'PUT', body: JSON.stringify(body) });
            } else {
                await Admin.api('blogs.php', { method:'POST', body: JSON.stringify(body) });
            }
            Admin.toast('Đã lưu bài viết','success');
            Admin.navigate('#/blogs');
        } catch(e) { Admin.toast(e.message,'error'); }
    };
};

// ==================== PORTFOLIO ====================
Admin.registerRoute('portfolio', async (main, param) => {
    if (param === 'new' || param === 'edit') return Admin.portfolioForm(main, param === 'edit');
    main.innerHTML = '<div class="page-header"><div><h1>Portfolio</h1><p>Quản lý case studies</p></div><div class="page-actions"><button class="btn btn--primary" id="btnNewCase">+ Case study mới</button></div></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Tiêu đề</th><th>Tag</th><th></th></tr></thead><tbody id="caseTable"></tbody></table></div>';
    Admin.$('#btnNewCase').onclick = () => Admin.navigate('#/portfolio/new');
    try {
        const data = await Admin.api('portfolio.php');
        const rows = (data.items||[]).map(c => `<tr>
            <td><strong>${Admin.esc(c.title)}</strong></td>
            <td><span class="tag tag--${c.tagColor||'pink'}">${Admin.esc(c.tag)}</span></td>
            <td><div class="row-actions"><button class="btn btn--ghost btn--small" data-cedit="${c.id}">Sửa</button><button class="btn btn--danger btn--small" data-cdel="${c.id}">Xóa</button></div></td>
        </tr>`).join('');
        Admin.$('#caseTable').innerHTML = rows || '<tr><td colspan="3"><div class="empty-state"><h3>Chưa có case study</h3></div></td></tr>';
        Admin.$$('[data-cedit]').forEach(btn => btn.onclick = () => { Admin._editCaseId = btn.dataset.cedit; Admin.navigate('#/portfolio/edit'); });
        Admin.$$('[data-cdel]').forEach(btn => btn.onclick = async () => {
            if (await Admin.confirm('Xóa case study','Bạn có chắc?')) {
                try { await Admin.api('portfolio.php',{method:'DELETE',body:JSON.stringify({id:btn.dataset.cdel})}); Admin.toast('Đã xóa','success'); Admin.handleRoute(); } catch(e){Admin.toast(e.message,'error');}
            }
        });
    } catch(e) { Admin.toast(e.message,'error'); }
});

Admin.portfolioForm = async (main, isEdit) => {
    const fields = ['tag','title','problem','insight','strategy','execution','result'];
    main.innerHTML = `<div class="page-header"><div><h1>${isEdit?'Sửa':'Thêm'} Case Study</h1></div><div class="page-actions"><button class="btn btn--ghost" id="btnBackCase">← Quay lại</button></div></div>
    <div class="form-panel"><div class="form-grid">
    ${fields.map(f => `<div class="form-group ${f==='problem'||f==='result'?'form-group--full':''}"><label class="form-label">${f.charAt(0).toUpperCase()+f.slice(1)}</label>${f.length>10||['problem','insight','strategy','execution','result'].includes(f)?`<textarea class="form-textarea" id="case_${f}" rows="3"></textarea>`:`<input class="form-input" id="case_${f}">`}</div>`).join('')}
    <div class="form-group"><label class="form-label">Tag Color</label><select class="form-select" id="case_tagColor"><option value="pink">Pink</option><option value="lavender">Lavender</option><option value="sage">Sage</option><option value="gold">Gold</option></select></div>
    </div><div class="form-actions"><button class="btn btn--primary" id="btnSaveCase">Lưu</button></div></div>`;
    Admin.$('#btnBackCase').onclick = () => Admin.navigate('#/portfolio');
    let editData = null;
    if (isEdit && Admin._editCaseId) {
        try {
            const data = await Admin.api('portfolio.php');
            editData = (data.items||[]).find(c => c.id === Admin._editCaseId);
            if (editData) { fields.forEach(f => { const el = Admin.$(`#case_${f}`); if(el) el.value = editData[f]||''; }); Admin.$('#case_tagColor').value = editData.tagColor||'pink'; }
        } catch(e) { Admin.toast(e.message,'error'); }
    }
    Admin.$('#btnSaveCase').onclick = async () => {
        const body = { tagColor: Admin.$('#case_tagColor').value };
        fields.forEach(f => body[f] = Admin.$(`#case_${f}`).value.trim());
        if (!body.title) { Admin.toast('Nhập tiêu đề','error'); return; }
        try {
            if (isEdit && editData) { body.id = editData.id; await Admin.api('portfolio.php',{method:'PUT',body:JSON.stringify(body)}); }
            else { await Admin.api('portfolio.php',{method:'POST',body:JSON.stringify(body)}); }
            Admin.toast('Đã lưu','success'); Admin.navigate('#/portfolio');
        } catch(e) { Admin.toast(e.message,'error'); }
    };
};

// ==================== PRODUCTS ====================
Admin.registerRoute('products', async (main, param) => {
    if (param === 'new' || param === 'edit') return Admin.productForm(main, param === 'edit');
    main.innerHTML = '<div class="page-header"><div><h1>Store</h1><p>Quản lý sản phẩm nước hoa</p></div><div class="page-actions"><button class="btn btn--primary" id="btnNewProd">+ Sản phẩm mới</button></div></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Tên</th><th>Danh mục</th><th>Emoji</th><th></th></tr></thead><tbody id="prodTable"></tbody></table></div>';
    Admin.$('#btnNewProd').onclick = () => Admin.navigate('#/products/new');
    try {
        const data = await Admin.api('products.php');
        const rows = (data.items||[]).map(p => `<tr>
            <td><strong>${Admin.esc(p.name)}</strong></td>
            <td><span class="tag tag--${p.tagColor||'pink'}">${Admin.esc(p.category)}</span></td>
            <td>${p.emoji||''}</td>
            <td><div class="row-actions"><button class="btn btn--ghost btn--small" data-pedit="${p.id}">Sửa</button><button class="btn btn--danger btn--small" data-pdel="${p.id}">Xóa</button></div></td>
        </tr>`).join('');
        Admin.$('#prodTable').innerHTML = rows || '<tr><td colspan="4"><div class="empty-state"><h3>Chưa có sản phẩm</h3></div></td></tr>';
        Admin.$$('[data-pedit]').forEach(btn => btn.onclick = () => { Admin._editProdId = btn.dataset.pedit; Admin.navigate('#/products/edit'); });
        Admin.$$('[data-pdel]').forEach(btn => btn.onclick = async () => {
            if (await Admin.confirm('Xóa sản phẩm','Bạn có chắc?')) {
                try { await Admin.api('products.php',{method:'DELETE',body:JSON.stringify({id:btn.dataset.pdel})}); Admin.toast('Đã xóa','success'); Admin.handleRoute(); } catch(e){Admin.toast(e.message,'error');}
            }
        });
    } catch(e) { Admin.toast(e.message,'error'); }
});

Admin.productForm = async (main, isEdit) => {
    main.innerHTML = `<div class="page-header"><div><h1>${isEdit?'Sửa':'Thêm'} Sản phẩm</h1></div><div class="page-actions"><button class="btn btn--ghost" id="btnBackProd">← Quay lại</button></div></div>
    <div class="form-panel"><div class="form-grid">
    <div class="form-group"><label class="form-label">Tên</label><input class="form-input" id="prod_name"></div>
    <div class="form-group"><label class="form-label">Danh mục</label><input class="form-input" id="prod_category" placeholder="Tươi mát, Ngọt ấm..."></div>
    <div class="form-group"><label class="form-label">Emoji</label><input class="form-input" id="prod_emoji" placeholder="🌿"></div>
    <div class="form-group"><label class="form-label">Tag Color</label><select class="form-select" id="prod_tagColor"><option value="sage">Sage</option><option value="pink">Pink</option><option value="lavender">Lavender</option><option value="gold">Gold</option></select></div>
    <div class="form-group form-group--full"><label class="form-label">Câu chuyện</label><textarea class="form-textarea" id="prod_story" rows="3"></textarea></div>
    <div class="form-group"><label class="form-label">CTA Text</label><input class="form-input" id="prod_ctaText" value="Nhắn mình để chọn mùi này"></div>
    <div class="form-group"><label class="form-label">CTA URL</label><input class="form-input" id="prod_ctaUrl" value="contact.html?intent=perfume"></div>
    </div><div class="form-actions"><button class="btn btn--primary" id="btnSaveProd">Lưu</button></div></div>`;
    Admin.$('#btnBackProd').onclick = () => Admin.navigate('#/products');
    let editData = null;
    if (isEdit && Admin._editProdId) {
        try {
            const data = await Admin.api('products.php');
            editData = (data.items||[]).find(p => p.id === Admin._editProdId);
            if (editData) { ['name','category','emoji','story','ctaText','ctaUrl'].forEach(f => { const el=Admin.$(`#prod_${f}`); if(el) el.value=editData[f]||''; }); Admin.$('#prod_tagColor').value=editData.tagColor||'sage'; }
        } catch(e) { Admin.toast(e.message,'error'); }
    }
    Admin.$('#btnSaveProd').onclick = async () => {
        const body = {};
        ['name','category','emoji','tagColor','story','ctaText','ctaUrl'].forEach(f => body[f] = Admin.$(`#prod_${f}`).value.trim());
        if (!body.name) { Admin.toast('Nhập tên','error'); return; }
        try {
            if (isEdit && editData) { body.id = editData.id; await Admin.api('products.php',{method:'PUT',body:JSON.stringify(body)}); }
            else { await Admin.api('products.php',{method:'POST',body:JSON.stringify(body)}); }
            Admin.toast('Đã lưu','success'); Admin.navigate('#/products');
        } catch(e) { Admin.toast(e.message,'error'); }
    };
};

// ==================== LEADS ====================
Admin.registerRoute('leads', async (main) => {
    main.innerHTML = '<div class="page-header"><div><h1>Leads</h1><p>Danh sách liên hệ</p></div><div class="page-actions"><button class="btn btn--ghost" id="btnReloadLeads">🔄 Tải lại</button></div></div><div id="leadsList"><div class="empty-state"><p>Đang tải...</p></div></div>';
    const loadLeads = async () => {
        try {
            const data = await Admin.api('leads.php');
            const leads = data.leads || [];
            Admin.$('#leadsList').innerHTML = leads.length ? leads.map(l => `
                <div class="lead-card"><div class="lead-card-header"><h3>${Admin.esc(l.name||'Không tên')}</h3><span class="lead-card-time">${Admin.esc(l.createdAt||'')}</span></div>
                <div class="lead-card-field"><strong>Email:</strong> ${Admin.esc(l.email||'')}</div>
                <div class="lead-card-field"><strong>SĐT:</strong> ${Admin.esc(l.phone||'N/A')}</div>
                <div class="lead-card-field"><strong>Dịch vụ:</strong> ${Admin.esc(l.service||'')}</div>
                <div class="lead-card-field"><strong>Tin nhắn:</strong> ${Admin.esc(l.message||'')}</div></div>
            `).join('') : '<div class="empty-state"><div class="empty-state-icon">📬</div><h3>Chưa có lead</h3><p>Khi có người liên hệ qua form, dữ liệu sẽ hiển thị tại đây.</p></div>';
        } catch(e) { Admin.toast(e.message,'error'); }
    };
    Admin.$('#btnReloadLeads').onclick = loadLeads;
    await loadLeads();
});

// ==================== PAGES ====================
Admin.registerRoute('pages', async (main) => {
    main.innerHTML = '<div class="page-header"><div><h1>Trang</h1><p>Chỉnh sửa nội dung các trang</p></div></div><div class="form-panel" id="pagesForm"><p>Đang tải...</p></div>';
    try {
        const data = await Admin.api('pages.php');
        const pages = data.pages || {};
        const home = pages.home || {};
        const contact = pages.contact || {};
        Admin.$('#pagesForm').innerHTML = `<h2>Trang chủ – Hero</h2>
        <div class="form-grid">
            <div class="form-group"><label class="form-label">Eyebrow</label><input class="form-input" id="pg_heroEyebrow" value="${Admin.esc(home.heroEyebrow||'')}"></div>
            <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="pg_heroTitle" value="${Admin.esc(home.heroTitle||'')}"></div>
            <div class="form-group"><label class="form-label">Subtitle</label><input class="form-input" id="pg_heroSubtitle" value="${Admin.esc(home.heroSubtitle||'')}"></div>
            <div class="form-group form-group--full"><label class="form-label">Hero Lead</label><textarea class="form-textarea" id="pg_heroLead" rows="2">${Admin.esc(home.heroLead||'')}</textarea></div>
            <div class="form-group form-group--full"><label class="form-label">Hero Outro</label><textarea class="form-textarea" id="pg_heroOutro" rows="2">${Admin.esc(home.heroOutro||'')}</textarea></div>
        </div>
        <h2 style="margin-top:28px">Liên hệ</h2>
        <div class="form-grid">
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="pg_email" value="${Admin.esc(contact.email||'')}"></div>
            <div class="form-group"><label class="form-label">SĐT</label><input class="form-input" id="pg_phone" value="${Admin.esc(contact.phone||'')}"></div>
            <div class="form-group"><label class="form-label">Zalo URL</label><input class="form-input" id="pg_zaloUrl" value="${Admin.esc(contact.zaloUrl||'')}"></div>
        </div>
        <div class="form-actions"><button class="btn btn--primary" id="btnSavePages">Lưu thay đổi</button></div>`;
        Admin.$('#btnSavePages').onclick = async () => {
            const updated = JSON.parse(JSON.stringify(pages));
            updated.home = updated.home || {};
            updated.home.heroEyebrow = Admin.$('#pg_heroEyebrow').value.trim();
            updated.home.heroTitle = Admin.$('#pg_heroTitle').value.trim();
            updated.home.heroSubtitle = Admin.$('#pg_heroSubtitle').value.trim();
            updated.home.heroLead = Admin.$('#pg_heroLead').value.trim();
            updated.home.heroOutro = Admin.$('#pg_heroOutro').value.trim();
            updated.contact = updated.contact || {};
            updated.contact.email = Admin.$('#pg_email').value.trim();
            updated.contact.phone = Admin.$('#pg_phone').value.trim();
            updated.contact.zaloUrl = Admin.$('#pg_zaloUrl').value.trim();
            try {
                await Admin.api('pages.php', { method:'POST', body: JSON.stringify({ page: 'home', data: updated.home }) });
                await Admin.api('pages.php', { method:'POST', body: JSON.stringify({ page: 'contact', data: updated.contact }) });
                Admin.toast('Đã lưu trang','success');
            } catch(e) { Admin.toast(e.message,'error'); }
        };
    } catch(e) { Admin.toast(e.message,'error'); }
});

// ==================== MEDIA ====================
Admin.registerRoute('media', async (main) => {
    main.innerHTML = `<div class="page-header">
        <div><h1>Media</h1><p>Quan ly hinh anh upload cho website</p></div>
        <div class="page-actions">
            <button class="btn btn--ghost" id="btnReloadMedia">Tai lai</button>
            <button class="btn btn--primary" id="btnPickMedia">Upload anh</button>
        </div>
    </div>
    <input type="file" accept="image/*" hidden id="mediaFile" multiple>
    <div class="media-toolbar">
        <input class="form-input" id="mediaSearch" placeholder="Tim theo ten anh...">
        <span class="media-count" id="mediaCount"></span>
    </div>
    <div class="media-grid" id="mediaGrid"><div class="empty-state"><p>Dang tai...</p></div></div>`;

    let mediaItems = [];

    const formatSize = bytes => {
        const n = Number(bytes || 0);
        if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + ' MB';
        if (n >= 1024) return Math.round(n / 1024) + ' KB';
        return n + ' B';
    };

    const renderMedia = () => {
        const keyword = Admin.$('#mediaSearch').value.trim().toLowerCase();
        const items = mediaItems.filter(item => !keyword || (item.filename || '').toLowerCase().includes(keyword));
        Admin.$('#mediaCount').textContent = `${items.length} anh`;

        Admin.$('#mediaGrid').innerHTML = `
            <label class="media-upload" id="mediaUpload">
                <div class="media-upload-icon">+</div>
                <div class="media-upload-text">Upload anh moi</div>
            </label>
            ${items.map(item => {
                const size = item.width && item.height ? `${item.width}x${item.height} - ${formatSize(item.size)}` : formatSize(item.size);
                return `<article class="media-card">
                    <img src="${Admin.assetUrl(item.url)}" alt="${Admin.esc(item.name)}" loading="lazy">
                    <div class="media-card-body">
                        <strong>${Admin.esc(item.name)}</strong>
                        <span>${Admin.esc(size)}</span>
                        <code>${Admin.esc(item.url)}</code>
                    </div>
                    <div class="media-card-actions">
                        <button class="btn btn--ghost btn--small" data-copy="${Admin.esc(item.url)}">Copy URL</button>
                        <a class="btn btn--ghost btn--small" href="${Admin.assetUrl(item.url)}" target="_blank">Mo</a>
                        ${item.deletable ? `<button class="btn btn--danger btn--small" data-delete="${Admin.esc(item.filename)}">Xoa</button>` : ''}
                    </div>
                </article>`;
            }).join('')}`;

        Admin.$('#mediaUpload').onclick = () => Admin.$('#mediaFile').click();
        Admin.$$('[data-copy]').forEach(btn => btn.onclick = async () => {
            await navigator.clipboard.writeText(btn.dataset.copy);
            Admin.toast('Da copy URL anh', 'success');
        });
        Admin.$$('[data-delete]').forEach(btn => btn.onclick = async () => {
            if (await Admin.confirm('Xoa anh', 'Ban co chac muon xoa anh nay?')) {
                try {
                    await Admin.api('media.php', { method:'DELETE', body: JSON.stringify({ filename: btn.dataset.delete }) });
                    Admin.toast('Da xoa anh', 'success');
                    await loadMedia();
                } catch(e) { Admin.toast(e.message, 'error'); }
            }
        });
    };

    const loadMedia = async () => {
        try {
            const data = await Admin.api('media.php');
            mediaItems = data.items || [];
            renderMedia();
        } catch(e) {
            Admin.$('#mediaGrid').innerHTML = '<div class="empty-state"><h3>Khong tai duoc thu vien anh</h3><p>' + Admin.esc(e.message) + '</p></div>';
        }
    };

    Admin.$('#btnPickMedia').onclick = () => Admin.$('#mediaFile').click();
    Admin.$('#btnReloadMedia').onclick = loadMedia;
    Admin.$('#mediaSearch').oninput = renderMedia;
    Admin.$('#mediaFile').onchange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        try {
            for (const file of files) {
                await Admin.apiUpload(file);
            }
            Admin.toast(`Da upload ${files.length} anh`, 'success');
            e.target.value = '';
            await loadMedia();
        } catch(err) { Admin.toast(err.message, 'error'); }
    };

    await loadMedia();
});

// ==================== SETTINGS ====================
Admin.registerRoute('settings', (main) => {
    main.innerHTML = `<div class="page-header"><div><h1>Cài đặt</h1><p>Thông tin website</p></div></div>
    <div class="form-panel"><div class="settings-grid">
        <div class="form-group"><label class="form-label">Tên website</label><input class="form-input" value="Kim Thắm – Personal Brand Hub" disabled></div>
        <div class="form-group"><label class="form-label">Domain</label><input class="form-input" value="kimtham.id.vn" disabled></div>
        <div class="form-group"><label class="form-label">Phiên bản Admin</label><input class="form-input" value="2.0 – CMS (01/05/2026)" disabled></div>
    </div></div>`;
});
