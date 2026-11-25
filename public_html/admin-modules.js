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
    ${Admin.imageField('blogThumbnail', 'Anh dai dien bai viet')}
    <div class="form-group form-group--full"><label class="form-label">Tóm tắt</label><textarea class="form-textarea" id="blogExcerpt" rows="2" placeholder="Mô tả ngắn..."></textarea></div>
    <div class="form-group form-group--full"><label class="form-label">Nội dung</label><div class="editor-wrap"><div id="blogEditor"></div></div></div>
    <div class="form-group"><label class="form-label">Trạng thái</label><select class="form-select" id="blogStatus"><option value="published">Xuất bản</option><option value="draft">Nháp</option></select></div>
    <div class="form-group"><label class="form-label">Ngày</label><input class="form-input" type="date" id="blogDate"></div>
    </div><div class="form-actions"><button class="btn btn--primary" id="btnSaveBlog">Lưu bài viết</button></div></div>`;
    Admin.$('#btnBackBlog').onclick = () => Admin.navigate('#/blogs');
    Admin.bindImageFields(main);
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
                Admin.$('#blogThumbnail').value = editData.thumbnail||'';
                Admin.$('#blogThumbnail').dispatchEvent(new Event('input'));
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
            thumbnail: Admin.$('#blogThumbnail').value.trim(),
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
    
    main.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Portfolio</h1>
                <p>Quản lý nội dung slides và case studies</p>
            </div>
        </div>
        
        <div class="tabs">
            <button class="tab-btn active" data-tab="slide-content">Nội dung Slide</button>
            <button class="tab-btn" data-tab="case-studies">Case Studies</button>
        </div>
        
        <div class="tab-content active" id="tab-slide-content">
            <div class="form-panel" id="portfolioSlidesForm">
                <p>Đang tải...</p>
            </div>
        </div>
        
        <div class="tab-content" id="tab-case-studies">
            <div class="page-actions" style="margin-bottom: 20px; display: flex; justify-content: flex-end;">
                <button class="btn btn--primary" id="btnNewCase">+ Case study mới</button>
            </div>
            <div class="data-table-wrap">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Tag</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="caseTable"></tbody>
                </table>
            </div>
        </div>
    `;
    
    // Tab switching
    Admin.$$('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            Admin.$$('.tab-btn').forEach(b => b.classList.remove('active'));
            Admin.$$('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            Admin.$(`#tab-${tabId}`).classList.add('active');
        };
    });
    
    Admin.$('#btnNewCase').onclick = () => Admin.navigate('#/portfolio/new');
    
    try {
        const [pagesData, casesData] = await Promise.all([
            Admin.api('pages.php'),
            Admin.api('portfolio.php')
        ]);
        
        const pages = pagesData.pages || {};
        const portfolio = pages.portfolio || {};
        const cases = casesData.items || [];
        
        // Render slide content form in Tab 1
        Admin.$('#portfolioSlidesForm').innerHTML = `
            <div class="form-grid">
                <div class="form-group form-group--full"><h3>Thông tin Cover (Slide 01)</h3></div>
                <div class="form-group"><label class="form-label">Cover Title</label><input class="form-input" id="pg_ptCoverTitle" value="${Admin.esc(portfolio.coverTitle||'')}"></div>
                <div class="form-group"><label class="form-label">Cover Name</label><input class="form-input" id="pg_ptCoverName" value="${Admin.esc(portfolio.coverName||'')}"></div>
                <div class="form-group"><label class="form-label">Cover Role</label><input class="form-input" id="pg_ptCoverRole" value="${Admin.esc(portfolio.coverRole||'')}"></div>
                ${Admin.imageField('pg_ptCoverImage1', 'Ảnh Cover 1 (Chân dung chính)', portfolio.coverImage1 || '')}
                ${Admin.imageField('pg_ptCoverImage2', 'Ảnh Cover 2 (Góc làm việc)', portfolio.coverImage2 || '')}
                ${Admin.imageField('pg_ptCoverImage3', 'Ảnh Cover 3 (Setup quay phim)', portfolio.coverImage3 || '')}
                ${Admin.imageField('pg_ptCoverImage4', 'Ảnh Cover 4 (Trưng bày thương hiệu)', portfolio.coverImage4 || '')}
                
                <div class="form-group form-group--full"><h3>Kênh TikTok & Truyền thông (Slide 02)</h3></div>
                <div class="form-group"><label class="form-label">Kênh Giáo dục - Tên hiển thị</label><input class="form-input" id="pg_ptTiktokEduName" value="${Admin.esc(portfolio.tiktokEduName||'@chamchiontap')}"></div>
                <div class="form-group"><label class="form-label">Kênh Giáo dục - Link TikTok</label><input class="form-input" id="pg_ptTiktokEduLink" value="${Admin.esc(portfolio.tiktokEduLink||'https://www.tiktok.com/@chamchiontap')}"></div>
                <div class="form-group form-group--full"><label class="form-label">Kênh Giáo dục - Định hướng kênh (Bio)</label><textarea class="form-textarea" id="pg_ptEduBio" rows="2">${Admin.esc(portfolio.tiktokEduBio||'')}</textarea></div>
                
                <div class="form-group"><label class="form-label">Kênh Cá nhân - Tên hiển thị</label><input class="form-input" id="pg_ptTiktokPersonalName" value="${Admin.esc(portfolio.tiktokPersonalName||'@tham_hoc_ai')}"></div>
                <div class="form-group"><label class="form-label">Kênh Cá nhân - Link TikTok</label><input class="form-input" id="pg_ptTiktokPersonalLink" value="${Admin.esc(portfolio.tiktokPersonalLink||'https://www.tiktok.com/@tham_hoc_ai')}"></div>
                <div class="form-group form-group--full"><label class="form-label">Kênh Cá nhân - Định hướng kênh (Bio)</label><textarea class="form-textarea" id="pg_ptPersonalBio" rows="2">${Admin.esc(portfolio.tiktokPersonalBio||'')}</textarea></div>

                <div class="form-group form-group--full"><h3>Về tôi & Mục tiêu (Slide 03)</h3></div>
                <div class="form-group form-group--full"><label class="form-label">Giới thiệu bản thân (Biography Quote)</label><textarea class="form-textarea" id="pg_ptAboutBio" rows="4">${Admin.esc(portfolio.aboutBio||'Tôi là một Digital Marketer gen Z mang tư duy thực chiến, đam mê công nghệ và sự sáng tạo không giới hạn. Tốt nghiệp chuyên ngành Digital Marketing tại Đại học Văn Lang kết hợp cùng kinh nghiệm thực tế trong việc ứng dụng AI Automation vào tối ưu quy trình vận hành và tăng trưởng Organic Traffic, tôi luôn hướng tới mục tiêu tối thượng: Tạo ra chuyển đổi thực tế và giá trị kinh tế bền vững cho doanh nghiệp.')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Mục tiêu ngắn hạn</label><textarea class="form-textarea" id="pg_ptShortTerm" rows="3">${Admin.esc(portfolio.aboutShortTerm||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Mục tiêu dài hạn</label><textarea class="form-textarea" id="pg_ptLongTerm" rows="3">${Admin.esc(portfolio.aboutLongTerm||'')}</textarea></div>
                
                <div class="form-group form-group--full"><h3>Thông tin Cá nhân & Liên hệ (Slide 03)</h3></div>
                <div class="form-group"><label class="form-label">Ngày sinh</label><input class="form-input" id="pg_ptBirthday" value="${Admin.esc(portfolio.aboutBirthday||'')}"></div>
                <div class="form-group"><label class="form-label">Điện thoại</label><input class="form-input" id="pg_ptPhone" value="${Admin.esc(portfolio.aboutPhone||'')}"></div>
                <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="pg_ptEmail" value="${Admin.esc(portfolio.aboutEmail||'')}"></div>
                <div class="form-group"><label class="form-label">Địa chỉ</label><input class="form-input" id="pg_ptAddress" value="${Admin.esc(portfolio.aboutAddress||'')}"></div>
                ${Admin.imageField('pg_ptAboutImageTop', 'Ảnh Giới thiệu 1 (Góc trên phải)', portfolio.aboutImageTop || '')}
                ${Admin.imageField('pg_ptAboutImageBottom', 'Ảnh Giới thiệu 2 (Phía dưới/Văn phòng)', portfolio.aboutImageBottom || '')}
                
                <div class="form-group form-group--full"><h3>Chỉ số chi tiết Kênh @chamchiontap (Slide 04)</h3></div>
                <div class="form-group form-group--full"><label class="form-label">Tệp khán giả</label><textarea class="form-textarea" id="pg_ptEduAudience" rows="2">${Admin.esc(portfolio.tiktokEduAudience||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Chỉ số nổi bật 1 (Tìm kiếm)</label><textarea class="form-textarea" id="pg_ptEduStat1" rows="3">${Admin.esc(portfolio.tiktokEduStat1||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Chỉ số nổi bật 2 (Chuyển đổi)</label><textarea class="form-textarea" id="pg_ptEduStat2" rows="3">${Admin.esc(portfolio.tiktokEduStat2||'')}</textarea></div>
                ${Admin.imageField('pg_ptTiktokEduProof1', 'Ảnh Proof TikTok (Hồ sơ)', portfolio.tiktokEduProof1 || '')}
                ${Admin.imageField('pg_ptTiktokEduProof2', 'Ảnh Proof TikTok (Tăng trưởng)', portfolio.tiktokEduProof2 || '')}
    
                <div class="form-group form-group--full"><h3>Chỉ số chi tiết Kênh @tham_hoc_ai (Slide 05)</h3></div>
                <div class="form-group form-group--full"><label class="form-label">Tệp khán giả</label><textarea class="form-textarea" id="pg_ptPersonalAudience" rows="2">${Admin.esc(portfolio.tiktokPersonalAudience||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Chỉ số nổi bật 1</label><textarea class="form-textarea" id="pg_ptPersonalStat1" rows="3">${Admin.esc(portfolio.tiktokPersonalStat1||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Chỉ số nổi bật 2</label><textarea class="form-textarea" id="pg_ptPersonalStat2" rows="3">${Admin.esc(portfolio.tiktokPersonalStat2||'')}</textarea></div>
                
                <div class="form-group form-group--full"><h3>Kỹ năng chuyên môn (Slide 06)</h3></div>
                <div class="form-group form-group--full"><label class="form-label">AI Tools & Automation</label><textarea class="form-textarea" id="pg_ptSkillAI" rows="2">${Admin.esc(portfolio.skillAI||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Data Analysis & SEO</label><textarea class="form-textarea" id="pg_ptSkillSEO" rows="2">${Admin.esc(portfolio.skillSEO||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Creative Content & Production</label><textarea class="form-textarea" id="pg_ptSkillCreative" rows="2">${Admin.esc(portfolio.skillCreative||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Soft Skills</label><textarea class="form-textarea" id="pg_ptSkillSoft" rows="2">${Admin.esc(portfolio.skillSoft||'')}</textarea></div>
    
                <div class="form-group form-group--full"><h3>Học vấn & Chứng chỉ (Slide 07)</h3></div>
                <div class="form-group form-group--full"><label class="form-label">Học vấn</label><textarea class="form-textarea" id="pg_ptEduText" rows="2">${Admin.esc(portfolio.eduText||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Chứng chỉ</label><textarea class="form-textarea" id="pg_ptCertText" rows="2">${Admin.esc(portfolio.certText||'')}</textarea></div>
    
                <div class="form-group form-group--full"><h3>Kinh nghiệm & Đối tác (Slide 07)</h3></div>
                ${Admin.imageField('pg_ptExperienceImageDecor', 'Ảnh Decor CLICK Agency', portfolio.experienceImageDecor || '')}

                <div class="form-group form-group--full"><h3>Phản hồi từ quản lý & khách hàng (Slide 09)</h3></div>
                <div class="form-group form-group--full"><label class="form-label">Đánh giá 1 (Quản lý)</label><textarea class="form-textarea" id="pg_ptFeedback1" rows="2">${Admin.esc(portfolio.feedback1||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Đánh giá 2 (Khách hàng 1)</label><textarea class="form-textarea" id="pg_ptFeedback2" rows="2">${Admin.esc(portfolio.feedback2||'')}</textarea></div>
                <div class="form-group form-group--full"><label class="form-label">Đánh giá 3 (Khách hàng 2)</label><textarea class="form-textarea" id="pg_ptFeedback3" rows="2">${Admin.esc(portfolio.feedback3||'')}</textarea></div>
                ${Admin.imageField('pg_ptFeedbackImage', 'Ảnh Feedback Zalo Mockup', portfolio.feedbackImage || '')}

                <div class="form-group form-group--full"><h3>Liên hệ & Hợp tác (Slide 13)</h3></div>
                ${Admin.imageField('pg_ptContactAvatar', 'Ảnh đại diện liên hệ (Avatar)', portfolio.contactAvatar || '')}
            </div>
            
            <div class="form-actions" style="margin-top:20px;">
                <button class="btn btn--primary" id="btnSavePortfolioSlides">Lưu cấu hình Slide</button>
            </div>
        `;
        
        Admin.bindImageFields(Admin.$('#portfolioSlidesForm'));
        
        // Save slide content logic
        Admin.$('#btnSavePortfolioSlides').onclick = async () => {
            const updatedPortfolio = {
                coverTitle: Admin.$('#pg_ptCoverTitle').value.trim(),
                coverName: Admin.$('#pg_ptCoverName').value.trim(),
                coverRole: Admin.$('#pg_ptCoverRole').value.trim(),
                coverImage1: Admin.$('#pg_ptCoverImage1').value.trim(),
                coverImage2: Admin.$('#pg_ptCoverImage2').value.trim(),
                coverImage3: Admin.$('#pg_ptCoverImage3').value.trim(),
                coverImage4: Admin.$('#pg_ptCoverImage4').value.trim(),
                tiktokEduName: Admin.$('#pg_ptTiktokEduName').value.trim(),
                tiktokEduLink: Admin.$('#pg_ptTiktokEduLink').value.trim(),
                tiktokPersonalName: Admin.$('#pg_ptTiktokPersonalName').value.trim(),
                tiktokPersonalLink: Admin.$('#pg_ptTiktokPersonalLink').value.trim(),
                aboutBio: Admin.$('#pg_ptAboutBio').value.trim(),
                aboutShortTerm: Admin.$('#pg_ptShortTerm').value.trim(),
                aboutLongTerm: Admin.$('#pg_ptLongTerm').value.trim(),
                aboutBirthday: Admin.$('#pg_ptBirthday').value.trim(),
                aboutPhone: Admin.$('#pg_ptPhone').value.trim(),
                aboutEmail: Admin.$('#pg_ptEmail').value.trim(),
                aboutAddress: Admin.$('#pg_ptAddress').value.trim(),
                aboutImageTop: Admin.$('#pg_ptAboutImageTop').value.trim(),
                aboutImageBottom: Admin.$('#pg_ptAboutImageBottom').value.trim(),
                tiktokEduBio: Admin.$('#pg_ptEduBio').value.trim(),
                tiktokEduAudience: Admin.$('#pg_ptEduAudience').value.trim(),
                tiktokEduStat1: Admin.$('#pg_ptEduStat1').value.trim(),
                tiktokEduStat2: Admin.$('#pg_ptEduStat2').value.trim(),
                tiktokEduProof1: Admin.$('#pg_ptTiktokEduProof1').value.trim(),
                tiktokEduProof2: Admin.$('#pg_ptTiktokEduProof2').value.trim(),
                tiktokPersonalBio: Admin.$('#pg_ptPersonalBio').value.trim(),
                tiktokPersonalAudience: Admin.$('#pg_ptPersonalAudience').value.trim(),
                tiktokPersonalStat1: Admin.$('#pg_ptPersonalStat1').value.trim(),
                tiktokPersonalStat2: Admin.$('#pg_ptPersonalStat2').value.trim(),
                skillAI: Admin.$('#pg_ptSkillAI').value.trim(),
                skillSEO: Admin.$('#pg_ptSkillSEO').value.trim(),
                skillCreative: Admin.$('#pg_ptSkillCreative').value.trim(),
                skillSoft: Admin.$('#pg_ptSkillSoft').value.trim(),
                eduText: Admin.$('#pg_ptEduText').value.trim(),
                certText: Admin.$('#pg_ptCertText').value.trim(),
                experienceImageDecor: Admin.$('#pg_ptExperienceImageDecor').value.trim(),
                feedback1: Admin.$('#pg_ptFeedback1').value.trim(),
                feedback2: Admin.$('#pg_ptFeedback2').value.trim(),
                feedback3: Admin.$('#pg_ptFeedback3').value.trim(),
                feedbackImage: Admin.$('#pg_ptFeedbackImage').value.trim(),
                contactAvatar: Admin.$('#pg_ptContactAvatar').value.trim()
            };
            
            try {
                await Admin.api('pages.php', { method:'POST', body: JSON.stringify({ page: 'portfolio', data: updatedPortfolio }) });
                Admin.toast('Đã lưu cấu hình slide thành công!','success');
            } catch(e) { Admin.toast(e.message,'error'); }
        };
        
        // Render cases table in Tab 2
        const rows = (cases||[]).map(c => `<tr>
            <td><strong>${Admin.esc(c.title)}</strong></td>
            <td><span class="tag tag--${c.tagColor||'pink'}">${Admin.esc(c.tag)}</span></td>
            <td><div class="row-actions"><button class="btn btn--ghost btn--small" data-cedit="${c.id}">Sửa</button><button class="btn btn--danger btn--small" data-cdel="${c.id}">Xóa</button></div></td>
        </tr>`).join('');
        Admin.$('#caseTable').innerHTML = rows || '<tr><td colspan="3"><div class="empty-state"><h3>Chưa có case study</h3></div></td></tr>';
        
        Admin.$$('[data-cedit]').forEach(btn => btn.onclick = () => { Admin._editCaseId = btn.dataset.cedit; Admin.navigate('#/portfolio/edit'); });
        Admin.$$('[data-cdel]').forEach(btn => btn.onclick = async () => {
            if (await Admin.confirm('Xóa case study','Bạn có chắc?')) {
                try { 
                    await Admin.api('portfolio.php',{method:'DELETE',body:JSON.stringify({id:btn.dataset.cdel})}); 
                    Admin.toast('Đã xóa','success'); 
                    Admin.handleRoute(); 
                } catch(e){Admin.toast(e.message,'error');}
            }
        });
        
    } catch(e) { 
        Admin.$('#portfolioSlidesForm').innerHTML = `<div class="empty-state"><h3>Không thể tải dữ liệu</h3><p>${Admin.esc(e.message)}</p></div>`;
        Admin.toast(e.message,'error'); 
    }
});

Admin.portfolioForm = async (main, isEdit) => {
    const fields = ['tag','title','problem','insight','strategy','execution','result'];
    main.innerHTML = `<div class="page-header"><div><h1>${isEdit?'Sửa':'Thêm'} Case Study</h1></div><div class="page-actions"><button class="btn btn--ghost" id="btnBackCase">← Quay lại</button></div></div>
    <div class="form-panel"><div class="form-grid">
    ${fields.map(f => `<div class="form-group ${f==='problem'||f==='result'?'form-group--full':''}"><label class="form-label">${f.charAt(0).toUpperCase()+f.slice(1)}</label>${f.length>10||['problem','insight','strategy','execution','result'].includes(f)?`<textarea class="form-textarea" id="case_${f}" rows="3"></textarea>`:`<input class="form-input" id="case_${f}">`}</div>`).join('')}
    ${Admin.imageField('case_image', 'Anh case study')}
    <div class="form-group"><label class="form-label">Tag Color</label><select class="form-select" id="case_tagColor"><option value="pink">Pink</option><option value="lavender">Lavender</option><option value="sage">Sage</option><option value="gold">Gold</option></select></div>
    </div><div class="form-actions"><button class="btn btn--primary" id="btnSaveCase">Lưu</button></div></div>`;
    Admin.$('#btnBackCase').onclick = () => Admin.navigate('#/portfolio');
    Admin.bindImageFields(main);
    let editData = null;
    if (isEdit && Admin._editCaseId) {
        try {
            const data = await Admin.api('portfolio.php');
            editData = (data.items||[]).find(c => c.id === Admin._editCaseId);
            if (editData) { fields.forEach(f => { const el = Admin.$(`#case_${f}`); if(el) el.value = editData[f]||''; }); Admin.$('#case_image').value = editData.image||''; Admin.$('#case_image').dispatchEvent(new Event('input')); Admin.$('#case_tagColor').value = editData.tagColor||'pink'; }
        } catch(e) { Admin.toast(e.message,'error'); }
    }
    Admin.$('#btnSaveCase').onclick = async () => {
        const body = { tagColor: Admin.$('#case_tagColor').value };
        fields.forEach(f => body[f] = Admin.$(`#case_${f}`).value.trim());
        body.image = Admin.$('#case_image').value.trim();
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
    ${Admin.imageField('prod_image', 'Anh san pham')}
    <div class="form-group form-group--full"><label class="form-label">Câu chuyện</label><textarea class="form-textarea" id="prod_story" rows="3"></textarea></div>
    <div class="form-group"><label class="form-label">CTA Text</label><input class="form-input" id="prod_ctaText" value="Nhắn mình để chọn mùi này"></div>
    <div class="form-group"><label class="form-label">CTA URL</label><input class="form-input" id="prod_ctaUrl" value="contact.html?intent=perfume"></div>
    </div><div class="form-actions"><button class="btn btn--primary" id="btnSaveProd">Lưu</button></div></div>`;
    Admin.$('#btnBackProd').onclick = () => Admin.navigate('#/products');
    Admin.bindImageFields(main);
    let editData = null;
    if (isEdit && Admin._editProdId) {
        try {
            const data = await Admin.api('products.php');
            editData = (data.items||[]).find(p => p.id === Admin._editProdId);
            if (editData) { ['name','category','emoji','image','story','ctaText','ctaUrl'].forEach(f => { const el=Admin.$(`#prod_${f}`); if(el) el.value=editData[f]||''; }); Admin.$('#prod_image').dispatchEvent(new Event('input')); Admin.$('#prod_tagColor').value=editData.tagColor||'sage'; }
        } catch(e) { Admin.toast(e.message,'error'); }
    }
    Admin.$('#btnSaveProd').onclick = async () => {
        const body = {};
        ['name','category','emoji','tagColor','image','story','ctaText','ctaUrl'].forEach(f => body[f] = Admin.$(`#prod_${f}`).value.trim());
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
        const about = pages.about || {};
        const store = pages.store || {};
        const perfume = pages.perfume || {};
        const contact = pages.contact || {};
        const portfolio = pages.portfolio || {};
        Admin.$('#pagesForm').innerHTML = `<h2>Trang chủ – Phần giới thiệu (Hero)</h2>
        <p style="color:var(--a-muted);margin-bottom:20px;font-size:0.9rem;">
            Bạn có thể chỉnh sửa nội dung hoặc bấm công tắc <strong>Bật / Tắt</strong> bên cạnh để ẩn hoặc hiện bất kỳ phần tử nào trên website.
        </p>

        <!-- Dòng trên cùng Eyebrow -->
        <div class="hero-block-item" id="block_heroEyebrow">
            <div class="hero-block-head">
                <span class="hero-block-title">🏷️ Dòng trên cùng (Eyebrow)</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroEyebrow" ${home.showHeroEyebrow !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroEyebrow !== false ? 'Hiển thị' : 'Đã ẩn'}</span>
                </label>
            </div>
            <div class="form-group">
                <input class="form-input" id="pg_heroEyebrow" value="${Admin.esc(home.heroEyebrow||'')}" placeholder="Marketing – Lifestyle – Scent">
            </div>
        </div>

        <!-- Tiêu đề Title -->
        <div class="hero-block-item" id="block_heroTitle">
            <div class="hero-block-head">
                <span class="hero-block-title">✍️ Tiêu đề chính (Title)</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroTitle" ${home.showHeroTitle !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroTitle !== false ? 'Hiển thị' : 'Đã ẩn'}</span>
                </label>
            </div>
            <div class="form-group">
                <input class="form-input" id="pg_heroTitle" value="${Admin.esc(home.heroTitle||'')}" placeholder="Kim Thắm">
            </div>
        </div>

        <!-- Phụ đề Subtitle -->
        <div class="hero-block-item" id="block_heroSubtitle">
            <div class="hero-block-head">
                <span class="hero-block-title">✨ Phụ đề / Định vị (Subtitle)</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroSubtitle" ${home.showHeroSubtitle !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroSubtitle !== false ? 'Hiển thị' : 'Đã ẩn'}</span>
                </label>
            </div>
            <div class="form-group">
                <input class="form-input" id="pg_heroSubtitle" value="${Admin.esc(home.heroSubtitle||'')}" placeholder="Marketing Student | Lifestyle Creator">
            </div>
        </div>

        <!-- Ảnh chân dung tròn -->
        <div class="hero-block-item" id="block_heroImage">
            <div class="hero-block-head">
                <span class="hero-block-title">🖼️ Ảnh chân dung tròn</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroImage" ${home.showHeroImage !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroImage !== false ? 'Hiển thị' : 'Đã ẩn'}</span>
                </label>
            </div>
            ${Admin.imageField('pg_homeHeroImage', 'Chọn hoặc tải ảnh chân dung', home.heroImage || 'images/kim-tham.svg')}
        </div>

        <!-- Lời dẫn chủ đề Lead -->
        <div class="hero-block-item" id="block_heroLead">
            <div class="hero-block-head">
                <span class="hero-block-title">💬 Lời dẫn chủ đề (Lead)</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroLead" ${home.showHeroLead !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroLead !== false ? 'Hiển thị' : 'Đã ẩn'}</span>
                </label>
            </div>
            <div class="form-group">
                <input class="form-input" id="pg_heroLead" value="${Admin.esc(home.heroLead||'')}" placeholder="Mình chia sẻ về một số chủ đề:">
            </div>
        </div>

        <!-- Danh sách các gạch đầu dòng Hero List -->
        <div class="hero-block-item" id="block_heroList">
            <div class="hero-block-head">
                <span class="hero-block-title">📋 Danh sách chủ đề chia sẻ (Gạch đầu dòng)</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroList" ${home.showHeroList !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroList !== false ? 'Hiển thị' : 'Đã ẩn'}</span>
                </label>
            </div>
            <div class="form-group">
                <textarea class="form-textarea" id="pg_heroList" rows="3" placeholder="Marketing dễ hiểu&#10;Hành trình sống healthy (yoga & mindset)&#10;Và cách chọn mùi hương đúng gu">${Admin.esc(Array.isArray(home.heroList) ? home.heroList.join('\n') : (home.heroList || ''))}</textarea>
                <div class="form-hint">Mỗi dòng là một mục gạch đầu dòng trên website. Bấm tắt ở góc trên nếu bạn muốn ẩn danh sách này.</div>
            </div>
        </div>

        <!-- Châm ngôn Outro -->
        <div class="hero-block-item" id="block_heroOutro">
            <div class="hero-block-head">
                <span class="hero-block-title">🌸 Châm ngôn / Lời kết (Outro & #NKT)</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroOutro" ${home.showHeroOutro !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroOutro !== false ? 'Hiển thị' : 'Đã ẩn'}</span>
                </label>
            </div>
            <div class="form-group">
                <textarea class="form-textarea" id="pg_heroOutro" rows="2" placeholder="Hãy đi đi, nào mỏi chân thì dừng lại nghỉ mệt. Hãy làm đi, nào mệt thì úp mặt xuống ngủ. #NKT">${Admin.esc(home.heroOutro||'')}</textarea>
            </div>
        </div>

        <!-- Cụm các nút bấm CTA -->
        <div class="hero-block-item" id="block_heroActions">
            <div class="hero-block-head">
                <span class="hero-block-title">🔘 Cụm các nút bấm hành động (CTA)</span>
                <label class="switch-control">
                    <input type="checkbox" id="pg_showHeroActions" ${home.showHeroActions !== false ? 'checked' : ''}>
                    <span class="switch-track"></span>
                    <span class="switch-text">${home.showHeroActions !== false ? 'Hiển thị cụm nút' : 'Đã ẩn cụm nút'}</span>
                </label>
            </div>
            <div class="form-grid" style="margin-top:12px;">
                <div class="form-group" style="grid-column: 1 / -1; border-top: 1px dashed var(--a-line); padding-top: 12px; display:flex; justify-content:space-between; align-items:center;">
                    <strong>Nút 1: Bắt đầu từ đây (Chính)</strong>
                    <label class="switch-control">
                        <input type="checkbox" id="pg_showPrimaryCta" ${home.showPrimaryCta !== false ? 'checked' : ''}>
                        <span class="switch-track"></span>
                        <span class="switch-text">${home.showPrimaryCta !== false ? 'Bật nút 1' : 'Tắt'}</span>
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">Tên nút 1</label>
                    <input class="form-input" id="pg_primaryCta" value="${Admin.esc(home.primaryCta||'')}" placeholder="Bắt đầu từ đây">
                </div>
                <div class="form-group">
                    <label class="form-label">Đường dẫn nút 1 (Link)</label>
                    <input class="form-input" id="pg_primaryCtaUrl" value="${Admin.esc(home.primaryCtaUrl||'')}" placeholder="about.html">
                </div>

                <div class="form-group" style="grid-column: 1 / -1; border-top: 1px dashed var(--a-line); padding-top: 12px; display:flex; justify-content:space-between; align-items:center;">
                    <strong>Nút 2: Đọc blog (Phụ)</strong>
                    <label class="switch-control">
                        <input type="checkbox" id="pg_showSecondaryCta" ${home.showSecondaryCta !== false ? 'checked' : ''}>
                        <span class="switch-track"></span>
                        <span class="switch-text">${home.showSecondaryCta !== false ? 'Bật nút 2' : 'Tắt'}</span>
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">Tên nút 2</label>
                    <input class="form-input" id="pg_secondaryCta" value="${Admin.esc(home.secondaryCta||'')}" placeholder="Đọc blog">
                </div>
                <div class="form-group">
                    <label class="form-label">Đường dẫn nút 2 (Link)</label>
                    <input class="form-input" id="pg_secondaryCtaUrl" value="${Admin.esc(home.secondaryCtaUrl||'')}" placeholder="blog.html">
                </div>

                <div class="form-group" style="grid-column: 1 / -1; border-top: 1px dashed var(--a-line); padding-top: 12px; display:flex; justify-content:space-between; align-items:center;">
                    <strong>Nút 3: Xem mình làm gì (Ghost)</strong>
                    <label class="switch-control">
                        <input type="checkbox" id="pg_showGhostCta" ${home.showGhostCta !== false ? 'checked' : ''}>
                        <span class="switch-track"></span>
                        <span class="switch-text">${home.showGhostCta !== false ? 'Bật nút 3' : 'Tắt'}</span>
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">Tên nút 3</label>
                    <input class="form-input" id="pg_ghostCta" value="${Admin.esc(home.ghostCta||'')}" placeholder="Xem mình làm gì">
                </div>
                <div class="form-group">
                    <label class="form-label">Đường dẫn nút 3 (Link)</label>
                    <input class="form-input" id="pg_ghostCtaUrl" value="${Admin.esc(home.ghostCtaUrl||'')}" placeholder="portfolio.html">
                </div>
            </div>
        </div>

        <h2 style="margin-top:32px">Trang Giới thiệu (About)</h2>
        <div class="form-grid">
            <div class="form-group"><label class="form-label">Eyebrow</label><input class="form-input" id="pg_aboutEyebrow" value="${Admin.esc(about.eyebrow||'Về mình')}"></div>
            <div class="form-group"><label class="form-label">Tiêu đề trang</label><input class="form-input" id="pg_aboutTitle" value="${Admin.esc(about.title||'Mình là Kim Thắm')}"></div>
            <div class="form-group form-group--full"><label class="form-label">Giới thiệu - Đoạn 1 (Chuyên môn & Bằng cấp)</label><textarea class="form-textarea" id="pg_aboutStory1" rows="3">${Admin.esc(about.story1||'')}</textarea></div>
            <div class="form-group form-group--full"><label class="form-label">Giới thiệu - Đoạn 2 (Thành tích & Kênh thực tế)</label><textarea class="form-textarea" id="pg_aboutStory2" rows="3">${Admin.esc(about.story2||'')}</textarea></div>
            <div class="form-group form-group--full"><label class="form-label">Giới thiệu - Đoạn 3 (Ứng dụng AI & Định hướng)</label><textarea class="form-textarea" id="pg_aboutStory3" rows="3">${Admin.esc(about.story3||'')}</textarea></div>
            ${Admin.imageField('pg_aboutImage', 'Ảnh chân dung', about.heroImage || 'images/kim_tham_portrait.png')}
        </div>

        <h2 style="margin-top:32px">Ảnh các trang khác</h2>
        <div class="form-grid">
            ${Admin.imageField('pg_storeImage', 'Ảnh Store', store.heroImage || 'images/perfume-service-hero.png')}
            ${Admin.imageField('pg_perfumeImage', 'Ảnh trang nước hoa', perfume.heroImage || 'images/perfume-service-hero.png')}
        </div>
        <h2 style="margin-top:32px">Thông tin Liên hệ</h2>
        <div class="form-grid">
            <div class="form-group"><label class="form-label">Eyebrow</label><input class="form-input" id="pg_contactEyebrow" value="${Admin.esc(contact.eyebrow||'')}"></div>
            <div class="form-group"><label class="form-label">Tiêu đề liên hệ</label><input class="form-input" id="pg_contactTitle" value="${Admin.esc(contact.title||'')}"></div>
            <div class="form-group form-group--full"><label class="form-label">Mô tả liên hệ</label><textarea class="form-textarea" id="pg_contactSubtitle" rows="2">${Admin.esc(contact.subtitle||'')}</textarea></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="pg_email" value="${Admin.esc(contact.email||'')}"></div>
            <div class="form-group"><label class="form-label">Số điện thoại</label><input class="form-input" id="pg_phone" value="${Admin.esc(contact.phone||'')}"></div>
            <div class="form-group"><label class="form-label">Zalo URL</label><input class="form-input" id="pg_zaloUrl" value="${Admin.esc(contact.zaloUrl||'')}"></div>
        </div>
        
        <h2 style="margin-top:32px">Trang Portfolio</h2>
        <div class="form-grid">
            <div class="form-group form-group--full">
                <div style="background: var(--a-primary-soft); color: var(--a-primary); border-radius: var(--a-radius); padding: 16px; font-weight: 500; border-left: 4px solid var(--a-primary);">
                    💡 Nội dung slide và thông tin của trang Portfolio đã được di chuyển sang mục quản lý riêng biệt. 
                    Bạn có thể chỉnh sửa trực tiếp tại mục <a href="#/portfolio" style="color: var(--a-ink); text-decoration: underline; font-weight: 600;">Portfolio</a> (tab <strong>Nội dung Slide</strong>).
                </div>
            </div>
        </div>
        
        <div class="form-actions"><button class="btn btn--primary" id="btnSavePages">Lưu thay đổi</button></div>`;
        Admin.bindImageFields(Admin.$('#pagesForm'));

        // Bind interactive switches
        const setupSwitch = (inputEl, blockEl, onText = 'Hiển thị', offText = 'Đã ẩn') => {
            if (!inputEl) return;
            const txt = inputEl.closest('.switch-control')?.querySelector('.switch-text');
            const refresh = () => {
                if (txt) txt.textContent = inputEl.checked ? onText : offText;
                if (blockEl) blockEl.classList.toggle('is-disabled', !inputEl.checked);
            };
            inputEl.addEventListener('change', refresh);
            refresh();
        };

        setupSwitch(Admin.$('#pg_showHeroEyebrow'), Admin.$('#block_heroEyebrow'));
        setupSwitch(Admin.$('#pg_showHeroTitle'), Admin.$('#block_heroTitle'));
        setupSwitch(Admin.$('#pg_showHeroSubtitle'), Admin.$('#block_heroSubtitle'));
        setupSwitch(Admin.$('#pg_showHeroImage'), Admin.$('#block_heroImage'));
        setupSwitch(Admin.$('#pg_showHeroLead'), Admin.$('#block_heroLead'));
        setupSwitch(Admin.$('#pg_showHeroList'), Admin.$('#block_heroList'));
        setupSwitch(Admin.$('#pg_showHeroOutro'), Admin.$('#block_heroOutro'));
        setupSwitch(Admin.$('#pg_showHeroActions'), Admin.$('#block_heroActions'), 'Hiển thị cụm nút', 'Đã ẩn cụm nút');
        setupSwitch(Admin.$('#pg_showPrimaryCta'), null, 'Bật nút 1', 'Tắt');
        setupSwitch(Admin.$('#pg_showSecondaryCta'), null, 'Bật nút 2', 'Tắt');
        setupSwitch(Admin.$('#pg_showGhostCta'), null, 'Bật nút 3', 'Tắt');

        Admin.$('#btnSavePages').onclick = async () => {
            const updated = JSON.parse(JSON.stringify(pages));
            updated.home = updated.home || {};
            updated.home.showHeroEyebrow = Admin.$('#pg_showHeroEyebrow').checked;
            updated.home.heroEyebrow = Admin.$('#pg_heroEyebrow').value.trim();
            updated.home.showHeroTitle = Admin.$('#pg_showHeroTitle').checked;
            updated.home.heroTitle = Admin.$('#pg_heroTitle').value.trim();
            updated.home.showHeroSubtitle = Admin.$('#pg_showHeroSubtitle').checked;
            updated.home.heroSubtitle = Admin.$('#pg_heroSubtitle').value.trim();
            updated.home.showHeroImage = Admin.$('#pg_showHeroImage').checked;
            updated.home.heroImage = Admin.$('#pg_homeHeroImage').value.trim();
            updated.home.showHeroLead = Admin.$('#pg_showHeroLead').checked;
            updated.home.heroLead = Admin.$('#pg_heroLead').value.trim();
            updated.home.showHeroList = Admin.$('#pg_showHeroList').checked;
            const rawHeroList = Admin.$('#pg_heroList').value.trim();
            updated.home.heroList = rawHeroList ? rawHeroList.split('\n').map(s => s.trim()).filter(Boolean) : [];
            updated.home.showHeroOutro = Admin.$('#pg_showHeroOutro').checked;
            updated.home.heroOutro = Admin.$('#pg_heroOutro').value.trim();
            updated.home.showHeroActions = Admin.$('#pg_showHeroActions').checked;
            updated.home.showPrimaryCta = Admin.$('#pg_showPrimaryCta').checked;
            updated.home.primaryCta = Admin.$('#pg_primaryCta').value.trim();
            updated.home.primaryCtaUrl = Admin.$('#pg_primaryCtaUrl').value.trim();
            updated.home.showSecondaryCta = Admin.$('#pg_showSecondaryCta').checked;
            updated.home.secondaryCta = Admin.$('#pg_secondaryCta').value.trim();
            updated.home.secondaryCtaUrl = Admin.$('#pg_secondaryCtaUrl').value.trim();
            updated.home.showGhostCta = Admin.$('#pg_showGhostCta').checked;
            updated.home.ghostCta = Admin.$('#pg_ghostCta').value.trim();
            updated.home.ghostCtaUrl = Admin.$('#pg_ghostCtaUrl').value.trim();
            updated.about = updated.about || {};
            updated.about.eyebrow = Admin.$('#pg_aboutEyebrow').value.trim();
            updated.about.title = Admin.$('#pg_aboutTitle').value.trim();
            updated.about.story1 = Admin.$('#pg_aboutStory1').value.trim();
            updated.about.story2 = Admin.$('#pg_aboutStory2').value.trim();
            updated.about.story3 = Admin.$('#pg_aboutStory3').value.trim();
            updated.about.heroImage = Admin.$('#pg_aboutImage').value.trim();
            updated.store = updated.store || {};
            updated.store.heroImage = Admin.$('#pg_storeImage').value.trim();
            updated.perfume = updated.perfume || {};
            updated.perfume.heroImage = Admin.$('#pg_perfumeImage').value.trim();
            updated.contact = updated.contact || {};
            updated.contact.eyebrow = Admin.$('#pg_contactEyebrow').value.trim();
            updated.contact.title = Admin.$('#pg_contactTitle').value.trim();
            updated.contact.subtitle = Admin.$('#pg_contactSubtitle').value.trim();
            updated.contact.email = Admin.$('#pg_email').value.trim();
            updated.contact.phone = Admin.$('#pg_phone').value.trim();
            updated.contact.zaloUrl = Admin.$('#pg_zaloUrl').value.trim();
            
            try {
                await Admin.api('pages.php', { method:'POST', body: JSON.stringify({ page: 'home', data: updated.home }) });
                await Admin.api('pages.php', { method:'POST', body: JSON.stringify({ page: 'about', data: updated.about }) });
                await Admin.api('pages.php', { method:'POST', body: JSON.stringify({ page: 'store', data: updated.store }) });
                await Admin.api('pages.php', { method:'POST', body: JSON.stringify({ page: 'perfume', data: updated.perfume }) });
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
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    main.innerHTML = `<div class="page-header"><div><h1>Cài đặt</h1><p>Thông tin website</p></div></div>
    <div class="form-panel"><div class="settings-grid">
        <div class="form-group"><label class="form-label">Tên website</label><input class="form-input" value="Kim Thắm – Personal Brand Hub" disabled></div>
        <div class="form-group"><label class="form-label">Domain</label><input class="form-input" value="kimtham.id.vn" disabled></div>
        <div class="form-group"><label class="form-label">Giao diện quản trị</label>
            <select class="form-select" id="settingThemeSelect">
                <option value="light">Giao diện sáng (Mặc định)</option>
                <option value="dark">Giao diện tối</option>
            </select>
        </div>
        <div class="form-group"><label class="form-label">Phiên bản Admin</label><input class="form-input" value="2.0 – CMS (01/05/2026)" disabled></div>
    </div></div>`;

    const select = Admin.$('#settingThemeSelect');
    if (select) {
        select.value = currentTheme;
        select.addEventListener('change', (e) => {
            Admin.setTheme(e.target.value);
        });
    }
});
