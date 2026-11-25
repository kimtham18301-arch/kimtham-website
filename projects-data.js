/* ===== KIM THẮM – RECRUITER PROJECTS DATA & INTERACTION ===== */
(function () {
    const PROJECTS_DATA = [
        {
            id: "chatbot-ai-fanpage",
            category: "ai",
            categoryLabel: "AI & Automation",
            tagColor: "pink",
            featured: true,
            title: "Chatbot AI Fanpage Messenger (Botcake + Gemini + Google Sheets)",
            subtitle: "Tự động tư vấn dịch vụ 24/7 theo tài liệu doanh nghiệp và đồng bộ lead trực tiếp về Google Sheets.",
            role: "Kiến trúc hệ thống & Triển khai End-to-End",
            period: "11/2026",
            status: "Đang vận hành thực tế",
            image: "images/marketing_workspace.webp",
            imageFallback: "images/marketing_workspace.png",
            metricHighlight: "Tự động 24/7 • Ghi 100% Lead",
            problem: "Fanpage nhận tin nhắn tư vấn ngoài giờ hành chính khiến khách chờ lâu dễ rời bỏ, trong khi việc ghi chép thủ công thông tin khách hàng (SĐT, email, nhu cầu) dễ thiếu sót.",
            solution: "Thiết kế luồng webhook nối Botcake (Dynamic Block v2) tới server Node.js, gọi Gemini AI trả lời bám sát bộ tài liệu doanh nghiệp (Knowledge Base), lưu lịch sử hội thoại theo phiên và tự động ghi lead hợp lệ sang Google Sheets qua Apps Script kèm cơ chế bàn giao (handoff) cho nhân sự tư vấn.",
            result: "Đã kiểm thử và chạy thực tế trên Messenger: bot phản hồi tự nhiên chỉ trong vài giây, tự động trích xuất và lưu chính xác tên, SĐT, email, nhu cầu khách vào bảng quản trị.",
            stack: ["Gemini AI", "Botcake", "Node.js", "Google Sheets", "Apps Script", "Webhook API"],
            links: [
                { label: "Trao đổi demo hệ thống", url: "contact.html?intent=hiring", primary: true }
            ]
        },
        {
            id: "numiquick-math-webapp",
            category: "web",
            categoryLabel: "Web App & Sản phẩm số",
            tagColor: "lavender",
            featured: true,
            title: "NumiQuick — Web App Luyện Toán & Đặt Tính Lớp 1–9 (v2.9)",
            subtitle: "Nền tảng học tập tương tác chuẩn GDPT 2018 với 42 chuyên đề, bảng đặt tính, không gian Giáo viên và Supabase Cloud.",
            role: "Product Builder & Web Developer",
            period: "2026",
            status: "Hoàn thiện v2.9 • Cloud Sync",
            image: "images/project_numiquick.webp",
            imageFallback: "images/studio_aesthetic.png",
            metricHighlight: "42 Chuyên đề • Lớp 1–9",
            problem: "Học sinh cần công cụ luyện tính nhẩm và đặt tính trực quan không nhàm chán, còn giáo viên cần quản lý lớp học, giao bài nhanh và theo dõi tiến độ từng em trên nhiều thiết bị.",
            solution: "Phát triển web app offline-first (HTML/CSS/JS) gồm 42 chuyên đề Toán lớp 1–9, bảng 'Đặt tính rồi tính' tương tác, bảng nháp vẽ tay Canvas, lộ trình thích ứng + Spaced Repetition ôn câu sai, gamification và không gian Giáo viên / Admin kết hợp đồng bộ đám mây Supabase.",
            result: "Hoàn thiện sản phẩm chạy mượt trên desktop & tablet, hỗ trợ giao bài qua link 1 chạm, xuất báo cáo PDF tiến độ lớp học và đồng bộ dữ liệu đa thiết bị.",
            stack: ["HTML5/CSS3", "JavaScript", "Canvas API", "Supabase Cloud", "EdTech UX", "PWA"],
            links: [
                { label: "Xem thêm trên GitHub", url: "https://github.com/kimtham18301-arch", external: true },
                { label: "Đặt lịch xem demo", url: "contact.html?intent=hiring", primary: true }
            ]
        },
        {
            id: "tiktok-chamchiontap-seo",
            category: "marketing",
            categoryLabel: "Digital Marketing & Growth",
            tagColor: "sage",
            featured: true,
            title: "Hệ thống Kênh TikTok Giáo Dục @chamchiontap (SEO 0đ Ads)",
            subtitle: "Xây dựng kênh từ con số 0 bằng chiến lược TikTok SEO, đạt 87.4% traffic tìm kiếm tự nhiên và phễu cộng đồng kín.",
            role: "Founder, Content Strategist & Operator",
            period: "04/2026 – Hiện tại",
            status: "Đang tăng trưởng",
            image: "images/chamchiontap_profile_proof.webp",
            imageFallback: "images/chamchiontap_profile_proof.png",
            metricHighlight: "87.4% Organic Search • 0đ Ads",
            problem: "Kênh mới không có ngân sách Paid Ads cần nhanh chóng tiếp cận đúng tệp học sinh THCS & phụ huynh, đồng thời chuyển đổi người xem thành thành viên cộng đồng học tập.",
            solution: "Nghiên cứu Search Intent theo truy vấn bài tập Toán lớp 6, ứng dụng AI tối ưu quy trình lên kịch bản short-form trực quan và thiết kế phễu Bio Link kéo traffic vào nhóm học tập kín.",
            result: "Hơn 87.4% lưu lượng đến từ Tìm kiếm tự nhiên (89% người xem mới) hoàn toàn không chạy quảng cáo; chuyển đổi thành công 114+ thành viên chất lượng cao vào cộng đồng kín.",
            stack: ["TikTok SEO", "Content Strategy", "Short-form Video", "AI Scripting", "CapCut", "Analytics"],
            links: [
                { label: "Xem kênh @chamchiontap", url: "https://www.tiktok.com/@chamchiontap", external: true, primary: true },
                { label: "Xem số liệu Portfolio", url: "portfolio.html#tiktok-edu" }
            ]
        },
        {
            id: "lark-base-lead-workflow",
            category: "ai",
            categoryLabel: "AI & Automation",
            tagColor: "gold",
            featured: false,
            title: "Quy trình Phân Loại & Điều Phối Lead Sự Kiện trên Lark Base",
            subtitle: "Chuẩn hóa dữ liệu lead sự kiện TMĐT, kiểm soát thiếu liên hệ và thiết kế luồng điều phối đa team theo dịch vụ.",
            role: "Marketing Operations & Workflow Designer",
            period: "11/2026",
            status: "Triển khai DEMO & Tài liệu hóa",
            image: "images/project_lark_workflow.webp",
            imageFallback: "images/marketing_workspace.png",
            metricHighlight: "3 View kiểm soát • Đa team",
            problem: "Danh sách lead từ nhiều sự kiện TMĐT nằm rải rác, khó phát hiện lead thiếu SĐT/email hoặc chưa rõ dịch vụ, gây chậm trễ khi bàn giao cho các nhóm tư vấn chuyên môn.",
            solution: "Thiết kế kiến trúc dữ liệu trên Lark Base gồm List Event chung, bảng Lead Event – TMĐT với 3 view kiểm soát (Tổng hợp, Thiếu liên hệ, Đã lên Page chung) và sơ đồ hóa luồng đẩy tự động lên Page chung để phân bổ đa team theo từng dịch vụ.",
            result: "Chuẩn hóa toàn bộ quy trình tiếp nhận – lọc chất lượng – phân team cho khối TMĐT, giúp theo dõi trạng thái từng lead minh bạch và giảm thất thoát dữ liệu sự kiện.",
            stack: ["Lark Base", "Lead Operations", "Workflow Design", "CRM Automation", "Mermaid Diagram"],
            links: [
                { label: "Trao đổi về quy trình", url: "contact.html?intent=hiring", primary: true }
            ]
        },
        {
            id: "telegram-bot-ai-tools",
            category: "ai",
            categoryLabel: "AI & Automation",
            tagColor: "pink",
            featured: false,
            title: "Hệ thống Telegram Bot & Kênh Bán Hàng AI Tools 24/7",
            subtitle: "Tự động cập nhật bảng giá, đăng bài hằng ngày kết hợp seeding đa kênh giúp doanh thu tăng trưởng 250%.",
            role: "Owner & Automation Operator",
            period: "2026",
            status: "Vận hành thực tế",
            image: "images/timeline_ai_tools.webp",
            imageFallback: "images/timeline_ai_tools.png",
            metricHighlight: "+250% Doanh thu • >80 đơn/tháng",
            problem: "Sản phẩm AI Tools có giá biến động liên tục, khách cần phản hồi tức thì 24/7 trong khi mô hình vận hành tinh gọn không tốn ngân sách quảng cáo.",
            solution: "Triển khai Telegram Bot tự động cập nhật bảng giá và đăng bài mỗi ngày; thực thi chiến lược seeding tự nhiên tại các cộng đồng Zalo, Facebook, TikTok, Threads và tối ưu kịch bản CSKH giữ chân khách cũ.",
            result: "Đạt doanh thu đỉnh 5.000.000đ/tháng (>80 tài khoản bán ra), tăng trưởng 250% sau 4 tháng vận hành và duy trì trên 20 lượt khách hàng quay lại mỗi tháng.",
            stack: ["Telegram Bot", "Node.js", "Social Seeding", "Zalo CRM", "CRO"],
            links: [
                { label: "Xem Case Study chi tiết", url: "portfolio.html#kpis-deliverables", primary: true }
            ]
        },
        {
            id: "click-agency-seo-shopee",
            category: "marketing",
            categoryLabel: "Digital Marketing & Growth",
            tagColor: "sage",
            featured: false,
            title: "Tối ưu SEO Website & Vận hành Shopee — CLICK Marketing Agency",
            subtitle: "Thực chiến SEO On-page/Off-page cho website đối tác và tối ưu hiển thị, chiến lược giá gian hàng TMĐT.",
            role: "Digital Marketing Intern (SEO & E-commerce)",
            period: "2025 – 2026",
            status: "Hoàn thành",
            image: "images/timeline_click_agency.webp",
            imageFallback: "images/timeline_click_agency.png",
            metricHighlight: "Top Google • Tăng hiển thị Shopee",
            problem: "Website khách hàng cần cải thiện thứ hạng tìm kiếm tự nhiên, đồng thời gian hàng Shopee cần tối ưu hình ảnh, mô tả và mức giá cạnh tranh để tăng chuyển đổi.",
            solution: "Nghiên cứu từ khóa mục tiêu, tối ưu nội dung chuẩn SEO và quản trị layout/admin website; trực tiếp đăng tải, tinh chỉnh hình ảnh sản phẩm và phân tích cơ cấu giá cạnh tranh trên Shopee & TikTok Shop.",
            result: "Các bộ từ khóa trọng tâm đạt thứ hạng cao trên Google; gian hàng Shopee tăng trưởng lượng hiển thị tự nhiên và cải thiện rõ rệt hiệu suất chốt đơn.",
            stack: ["SEO On-page", "SEMrush", "Google Analytics", "Shopee Seller", "TikTok Shop"],
            links: [
                { label: "Xem đánh giá & KPI", url: "portfolio.html#experience-agency", primary: true }
            ]
        },
        {
            id: "web-tu-luyen-khtn",
            category: "web",
            categoryLabel: "Web App & Sản phẩm số",
            tagColor: "lavender",
            featured: false,
            title: "Website Tự Luyện Khoa Học Tự Nhiên Lớp 7–8",
            subtitle: "Nền tảng học Hóa – Lý – Sinh trực quan với bảng nháp viết tay cảm ứng, sổ tay công thức và xuất phiếu luyện tập PDF A4.",
            role: "Product Designer & Web Developer",
            period: "11/2026",
            status: "Đang phát triển & Hoàn thiện",
            image: "images/office_aesthetic.webp",
            imageFallback: "images/office_aesthetic.png",
            metricHighlight: "3 Môn Hóa-Lý-Sinh • PDF A4",
            problem: "Học sinh lớp 7–8 thường bị hổng kiến thức nền ở 3 phân môn Hóa học, Vật lý, Sinh học và thiếu công cụ vừa luyện bài tương tác vừa in phiếu tự luyện có lời giải tách riêng.",
            solution: "Thiết kế cấu trúc học tập theo lớp, môn, chủ đề và mức độ nhận biết – vận dụng; tích hợp bảng nháp cảm ứng (Apple Pencil/chuột), sổ tay công thức lưu tiến độ và tính năng tạo PDF A4 đề + lời giải đồng bộ mã phiếu.",
            result: "Hoàn thiện tài liệu đặc tả sản phẩm chi tiết và giao diện web luyện tập chạy trực tiếp trên trình duyệt, sẵn sàng tích hợp chấm ảnh bài làm tự luận bằng AI.",
            stack: ["HTML/CSS/JS", "Product Spec", "Canvas Scratchpad", "Print PDF A4", "AI EdTech"],
            links: [
                { label: "Trao đổi về sản phẩm", url: "contact.html?intent=hiring", primary: true }
            ]
        },
        {
            id: "personal-website-cms",
            category: "web",
            categoryLabel: "Web App & Sản phẩm số",
            tagColor: "pink",
            featured: false,
            title: "Website Thương Hiệu Cá Nhân & Mini CMS kimtham.id.vn",
            subtitle: "Tự thiết kế, lập trình web chuẩn SEO tích hợp Admin CMS quản trị nội dung và CI/CD GitHub Actions tự động deploy.",
            role: "Full-stack Builder & UI/UX Designer",
            period: "2026",
            status: "Đang chạy thực tế (Live)",
            image: "images/studio_aesthetic.webp",
            imageFallback: "images/studio_aesthetic.png",
            metricHighlight: "-87% Dung lượng ảnh • CI/CD Auto",
            problem: "Cần một nền tảng web cá nhân chuyên nghiệp thể hiện đồng thời năng lực Marketing, sản phẩm công nghệ và dễ dàng tự cập nhật bài viết, dự án mà không phải sửa code mỗi lần.",
            solution: "Xây dựng giao diện đa trang responsive, tích hợp backend PHP + JSON CMS (quản lý Blog, Portfolio, Store, Form liên hệ), tối ưu ảnh WebP + lazy loading và cấu hình GitHub Actions tự động deploy lên DirectAdmin Hosting.",
            result: "Website vận hành ổn định tại kimtham.id.vn, tốc độ tải nhanh (giảm ~87% dung lượng ảnh), chuẩn Schema SEO và đồng bộ tự động mỗi lần push GitHub.",
            stack: ["HTML/CSS/JS", "PHP API", "Mini CMS", "GitHub Actions", "Technical SEO", "WebP"],
            links: [
                { label: "Xem mã nguồn GitHub", url: "https://github.com/kimtham18301-arch/kimtham-website", external: true, primary: true }
            ]
        },
        {
            id: "tiktok-tham-hoc-ai-b2b",
            category: "marketing",
            categoryLabel: "Digital Marketing & Growth",
            tagColor: "gold",
            featured: false,
            title: "Personal Branding TikTok @tham_hoc_ai (Inbound B2B)",
            subtitle: "Nhật ký ứng dụng AI thiết kế website & tự động hóa công việc, tiếp cận trực tiếp nhà tuyển dụng và doanh nghiệp.",
            role: "Creator & Inbound B2B Marketer",
            period: "2026",
            status: "Đang vận hành",
            image: "images/timeline_tham_hoc_ai.webp",
            imageFallback: "images/timeline_tham_hoc_ai.png",
            metricHighlight: "1.307 Views ra mắt • 5.49% Full-watch",
            problem: "Thay vì cạnh tranh thuần túy bằng CV giấy, cần kênh nội dung chứng minh năng lực thực hành AI và tư duy sản phẩm trực tiếp trước mắt nhà tuyển dụng & doanh nghiệp.",
            solution: "Sản xuất video ngắn chia sẻ thực tế quy trình dùng AI dựng website, portfolio và công cụ hỗ trợ marketing; phân tích sâu thời gian xem trung bình và nhân khẩu học khán giả B2B.",
            result: "Video chủ đề thiết kế Website/Portfolio đạt 1.307 lượt xem ngay khi đăng tải, thời gian xem trung bình 11.2 giây, tỷ lệ xem hết 5.49% và tiếp cận đúng nhóm khán giả công nghệ & doanh nghiệp (81% Nam).",
            stack: ["B2B Inbound", "Personal Branding", "TikTok Analytics", "AI Workflow", "Storytelling"],
            links: [
                { label: "Xem kênh @tham_hoc_ai", url: "https://www.tiktok.com/@tham_hoc_ai", external: true, primary: true }
            ]
        },
        {
            id: "perfume-dubai-brand",
            category: "marketing",
            categoryLabel: "Digital Marketing & Growth",
            tagColor: "gold",
            featured: false,
            title: "Xây dựng Thương hiệu Bán lẻ Nước hoa Tinh dầu Dubai",
            subtitle: "Triển khai từ nhận diện nội dung, trải nghiệm chọn mùi theo cảm xúc đến quy trình tư vấn và chăm sóc khách hàng lặp lại.",
            role: "Founder, Content & CX Specialist",
            period: "2025 – 2026",
            status: "Vận hành ổn định",
            image: "images/brand_product_display.webp",
            imageFallback: "images/brand_product_display.png",
            metricHighlight: "40–60 chai/chu kỳ • Khách giới thiệu cao",
            problem: "Ngành nước hoa online cạnh tranh cao về giá và khó tạo niềm tin khi khách không thể thử mùi trực tiếp trước khi mua.",
            solution: "Xây dựng định vị kể chuyện mùi hương theo phong cách & dịp sử dụng (kèm Quiz chọn mùi trên web và bot hỗ trợ quản lý đơn hàng), kết hợp tư vấn cá nhân hóa 1-1 trên Facebook & Zalo.",
            result: "Duy trì doanh số ổn định 2.000.000đ – 2.500.000đ/tháng với 40–60 sản phẩm mỗi 1–2 tháng, nhiều khách cũ quay lại mua tiếp và chủ động giới thiệu khách mới.",
            stack: ["Brand Storytelling", "Social Commerce", "Customer Experience", "Content Production", "Zalo Sales"],
            links: [
                { label: "Xem trang Store mùi hương", url: "store.html", primary: true }
            ]
        }
    ];

    window.KIMTHAM_PROJECTS = PROJECTS_DATA;

    function esc(v) {
        return String(v || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function renderProjectCard(project, index) {
        const delayClass = index % 3 === 1 ? " reveal-delay-1" : index % 3 === 2 ? " reveal-delay-2" : "";
        const featuredBadge = project.featured
            ? `<span class="project-featured-badge">★ Tiêu biểu</span>`
            : "";

        return `
            <article class="project-showcase-card reveal visible${delayClass}" data-category="${esc(project.category)}" data-project-id="${esc(project.id)}">
                <div class="project-card-media">
                    <img src="${esc(project.image)}" alt="${esc(project.title)}" loading="lazy" decoding="async" width="600" height="375" onerror="this.onerror=null;this.src='${esc(project.imageFallback || 'images/marketing_workspace.png')}'">
                    <div class="project-media-badges">
                        <span class="tag tag--${esc(project.tagColor)}">${esc(project.categoryLabel)}</span>
                        ${featuredBadge}
                    </div>
                    <div class="project-metric-pill">${esc(project.metricHighlight)}</div>
                </div>
                <div class="project-card-content">
                    <div class="project-meta-row">
                        <span class="project-role">${esc(project.role)}</span>
                        <span class="project-period">${esc(project.period)}</span>
                    </div>
                    <h3>${esc(project.title)}</h3>
                    <p class="project-subtitle">${esc(project.subtitle)}</p>
                    <div class="project-impact-box">
                        <strong>Kết quả nổi bật:</strong> ${esc(project.result)}
                    </div>
                    <div class="project-stack">
                        ${project.stack.slice(0, 5).map(tech => `<span class="stack-pill">${esc(tech)}</span>`).join("")}
                    </div>
                    <div class="project-card-actions">
                        <button type="button" class="btn primary project-detail-trigger" data-project-open="${esc(project.id)}">Xem chi tiết dự án</button>
                        ${project.links && project.links[0] ? `<a class="btn secondary" href="${esc(project.links[0].url)}" ${project.links[0].external ? 'target="_blank" rel="noopener"' : ''}>${esc(project.links[0].label)}</a>` : ""}
                    </div>
                </div>
            </article>
        `;
    }

    function initProjectsPage() {
        const grid = document.getElementById("projectsShowcaseGrid");
        const tabsWrap = document.getElementById("projectCategoryTabs");
        const countEl = document.getElementById("projectResultCount");
        const modal = document.getElementById("projectModal");
        const modalBody = document.getElementById("projectModalBody");
        const modalClose = document.getElementById("projectModalClose");

        if (!grid) return;

        // Populate counts in tab buttons
        if (tabsWrap) {
            const counts = {
                all: PROJECTS_DATA.length,
                ai: PROJECTS_DATA.filter(p => p.category === "ai").length,
                web: PROJECTS_DATA.filter(p => p.category === "web").length,
                marketing: PROJECTS_DATA.filter(p => p.category === "marketing").length
            };
            tabsWrap.querySelectorAll("[data-filter]").forEach(btn => {
                const key = btn.dataset.filter;
                const badge = btn.querySelector(".tab-count");
                if (badge && counts[key] != null) badge.textContent = counts[key];
            });
        }

        function renderList(filter = "all") {
            const filtered = filter === "all"
                ? PROJECTS_DATA
                : PROJECTS_DATA.filter(p => p.category === filter);

            grid.innerHTML = filtered.map((p, i) => renderProjectCard(p, i)).join("");
            if (countEl) {
                countEl.textContent = `Hiển thị ${filtered.length} / ${PROJECTS_DATA.length} dự án thực chiến`;
            }
        }

        function openModal(projectId) {
            const p = PROJECTS_DATA.find(item => item.id === projectId);
            if (!p || !modal || !modalBody) return;

            modalBody.innerHTML = `
                <div class="project-modal-hero">
                    <img src="${esc(p.image)}" alt="${esc(p.title)}" decoding="async" onerror="this.onerror=null;this.src='${esc(p.imageFallback || 'images/marketing_workspace.png')}'">
                </div>
                <div class="project-modal-header">
                    <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px;">
                        <span class="tag tag--${esc(p.tagColor)}">${esc(p.categoryLabel)}</span>
                        <span class="project-status-chip">${esc(p.status)}</span>
                        <span class="project-period">${esc(p.period)}</span>
                    </div>
                    <h2>${esc(p.title)}</h2>
                    <p class="project-modal-role"><strong>Vai trò:</strong> ${esc(p.role)}</p>
                </div>
                <div class="project-modal-sections">
                    <div class="modal-info-block">
                        <h4>1. Bài toán &amp; Bối cảnh</h4>
                        <p>${esc(p.problem)}</p>
                    </div>
                    <div class="modal-info-block">
                        <h4>2. Giải pháp &amp; Cách triển khai</h4>
                        <p>${esc(p.solution)}</p>
                    </div>
                    <div class="modal-info-block modal-info-block--highlight">
                        <h4>3. Kết quả &amp; Giá trị mang lại</h4>
                        <p>${esc(p.result)}</p>
                    </div>
                </div>
                <div class="project-modal-stack">
                    <h4>Công cụ &amp; Kỹ năng áp dụng</h4>
                    <div class="project-stack">
                        ${p.stack.map(t => `<span class="stack-pill">${esc(t)}</span>`).join("")}
                    </div>
                </div>
                <div class="project-modal-footer">
                    ${(p.links || []).map(link => `
                        <a class="btn ${link.primary ? 'primary' : 'secondary'}" href="${esc(link.url)}" ${link.external ? 'target="_blank" rel="noopener"' : ''}>${esc(link.label)}</a>
                    `).join("")}
                    <a class="btn ghost" href="contact.html?intent=hiring">Liên hệ phỏng vấn</a>
                </div>
            `;

            modal.hidden = false;
            document.body.style.overflow = "hidden";
            modalClose?.focus();
        }

        function closeModal() {
            if (!modal || modal.hidden) return;
            modal.hidden = true;
            document.body.style.overflow = "";
        }

        // Check URL hash or query param ?cat=ai|web|marketing
        const urlCat = new URLSearchParams(location.search).get("cat");
        const initialFilter = ["ai", "web", "marketing"].includes(urlCat) ? urlCat : "all";
        if (tabsWrap && initialFilter !== "all") {
            tabsWrap.querySelectorAll(".projects-big-tab").forEach(b => {
                b.classList.toggle("active", b.dataset.filter === initialFilter);
                b.setAttribute("aria-selected", String(b.dataset.filter === initialFilter));
            });
        }
        renderList(initialFilter);

        tabsWrap?.addEventListener("click", e => {
            const btn = e.target.closest(".projects-big-tab");
            if (!btn) return;
            tabsWrap.querySelectorAll(".projects-big-tab").forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");
            renderList(btn.dataset.filter);
        });

        grid.addEventListener("click", e => {
            const trigger = e.target.closest("[data-project-open]");
            if (trigger) {
                openModal(trigger.dataset.projectOpen);
            }
        });

        modalClose?.addEventListener("click", closeModal);
        modal?.addEventListener("click", e => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") closeModal();
        });
    }

    function initHomeFeaturedProjects() {
        const homeGrid = document.getElementById("homeFeaturedProjects");
        if (!homeGrid) return;
        const featured = PROJECTS_DATA.filter(p => p.featured).slice(0, 3);
        homeGrid.innerHTML = featured.map((p, idx) => `
            <a href="projects.html?cat=${esc(p.category)}" class="home-project-card reveal visible${idx === 1 ? ' reveal-delay-1' : idx === 2 ? ' reveal-delay-2' : ''}">
                <div class="home-project-thumb">
                    <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" decoding="async" width="480" height="300" onerror="this.onerror=null;this.src='${esc(p.imageFallback || 'images/marketing_workspace.png')}'">
                    <span class="project-metric-pill">${esc(p.metricHighlight)}</span>
                </div>
                <div class="home-project-body">
                    <span class="tag tag--${esc(p.tagColor)}">${esc(p.categoryLabel)}</span>
                    <h3>${esc(p.title)}</h3>
                    <p>${esc(p.subtitle)}</p>
                    <span class="bento-link">Xem chi tiết dự án</span>
                </div>
            </a>
        `).join("");
    }

    if (document.body.dataset.page === "projects") {
        initProjectsPage();
    }
    if (document.body.dataset.page === "home") {
        initHomeFeaturedProjects();
    }
})();
