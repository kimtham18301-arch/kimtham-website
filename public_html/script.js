/* ===== KIM THẮM – MULTI-PAGE SCRIPT ===== */

const page = document.body.dataset.page || "home";
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");

/* ===== BLOG DATA ===== */
const blogPosts = [
    {
        slug: "aida-va-pheu-chuyen-doi-co-ban",
        title: "AIDA và phễu chuyển đổi: hiểu hành trình khách hàng",
        category: "marketing",
        tag: "#MarketingBasics",
        readTime: "5 phút đọc",
        date: "2026-05-01",
        excerpt: "AIDA giúp mình nhìn một nội dung marketing theo từng bước: thu hút chú ý, tạo hứng thú, làm khách muốn thử và dẫn họ đến hành động.",
        content: `<h2>AIDA là gì?</h2><p>AIDA là viết tắt của Attention, Interest, Desire, Action. Đây là một cách rất dễ nhớ để xem khách hàng đang ở đâu trong hành trình ra quyết định.</p><h2>4 bước cơ bản</h2><p><strong>Attention</strong> là làm khách dừng lại và chú ý. Tiêu đề, hình ảnh, câu mở đầu hoặc vấn đề quen thuộc đều có thể làm nhiệm vụ này.<br><strong>Interest</strong> là khiến khách thấy nội dung có liên quan đến mình. Ở bước này, mình cần nói đúng nỗi đau, mong muốn hoặc bối cảnh của họ.<br><strong>Desire</strong> là làm khách bắt đầu muốn sản phẩm, dịch vụ hoặc giải pháp. Đừng chỉ nói tính năng; hãy nói lợi ích và cảm giác sau khi vấn đề được giải quyết.<br><strong>Action</strong> là lời kêu gọi hành động rõ ràng: nhắn tin, đặt lịch, mua hàng, tải tài liệu hoặc để lại thông tin.</p><h2>Ví dụ đơn giản</h2><p>Nếu viết bài bán một lớp học tiếng Anh, câu mở đầu có thể đánh vào nỗi sợ giao tiếp. Phần giữa giải thích lớp học giúp người học luyện phản xạ như thế nào. Cuối bài nên có lời mời cụ thể: đăng ký học thử hoặc nhắn tin để kiểm tra trình độ.</p><blockquote><p>Nội dung tốt không chỉ hay. Nội dung tốt dẫn người đọc đi từng bước đến một hành động phù hợp.</p></blockquote>`
    },
    {
        slug: "customer-insight-la-gi",
        title: "Customer insight là gì? Cách tìm sự thật phía sau khách hàng",
        category: "marketing",
        tag: "#MarketingBasics",
        readTime: "5 phút đọc",
        date: "2026-05-01",
        excerpt: "Insight không chỉ là một quan sát như \"khách hàng thích giá rẻ\". Insight là lý do sâu hơn khiến họ suy nghĩ, chọn mua hoặc từ chối.",
        content: `<h2>Insight không phải là dữ liệu thô</h2><p>Dữ liệu có thể nói rằng nhiều khách hàng bỏ giỏ hàng ở bước thanh toán. Nhưng insight cần đi sâu hơn: họ bỏ vì phí ship cao, vì chưa tin shop, vì thiếu đánh giá, hay vì chưa thật sự cần ngay?</p><h2>Công thức dễ nhớ</h2><p>Một insight tốt thường trả lời được ba câu hỏi: khách hàng đang gặp vấn đề gì, họ cảm thấy gì về vấn đề đó, và vì sao những giải pháp hiện tại chưa đủ tốt với họ.</p><h2>Tìm insight bằng cách nào?</h2><p><strong>Quan sát</strong> hành vi thật của khách hàng: họ hỏi gì, than phiền gì, dừng lại ở đâu.<br><strong>Lắng nghe</strong> bình luận, review, tin nhắn và câu chuyện đời thường.<br><strong>Phỏng vấn</strong> vài người trong nhóm khách hàng mục tiêu, hỏi lý do phía sau lựa chọn của họ.<br><strong>So sánh</strong> giữa điều họ nói và điều họ làm, vì hai thứ này đôi khi không giống nhau.</p><h2>Ví dụ</h2><p>Khách mua nước hoa mini không chỉ vì giá thấp. Có thể insight là: họ muốn thử nhiều mùi để tìm ra phong cách riêng mà không sợ mua sai chai lớn.</p><blockquote><p>Insight hay thường làm mình thốt lên: đúng rồi, khách hàng thật sự nghĩ như vậy.</p></blockquote>`
    },
    {
        slug: "stp-trong-marketing",
        title: "STP trong marketing: chọn đúng khách hàng trước khi truyền thông",
        category: "marketing",
        tag: "#MarketingBasics",
        readTime: "5 phút đọc",
        date: "2026-05-01",
        excerpt: "STP gồm Segmentation, Targeting và Positioning. Đây là bước giúp thương hiệu không nói chuyện với tất cả mọi người một cách mơ hồ.",
        content: `<h2>STP là gì?</h2><p>STP là khung tư duy gồm ba bước: chia thị trường thành các nhóm nhỏ, chọn nhóm khách hàng ưu tiên, rồi xác định vị trí thương hiệu trong tâm trí nhóm đó.</p><h2>Segmentation: chia thị trường</h2><p>Không phải ai cũng có cùng nhu cầu. Mình có thể chia thị trường theo độ tuổi, thu nhập, khu vực sống, lối sống, vấn đề đang gặp hoặc hành vi mua hàng. Càng hiểu nhóm nhỏ, thông điệp càng dễ sắc nét.</p><h2>Targeting: chọn khách hàng mục tiêu</h2><p>Sau khi chia nhóm, thương hiệu cần chọn nhóm phù hợp nhất với nguồn lực và lợi thế của mình. Một nhóm tốt thường có nhu cầu rõ, đủ quy mô, có khả năng chi trả và thương hiệu có thể tiếp cận được.</p><h2>Positioning: định vị</h2><p>Định vị là câu trả lời cho câu hỏi: khi khách hàng nghĩ đến mình, họ nhớ điều gì? Ví dụ: giá tốt, chuyên nghiệp, thân thiện, cao cấp, cá nhân hóa hoặc đáng tin.</p><blockquote><p>Làm marketing không bắt đầu bằng việc đăng bài. Nó bắt đầu bằng việc biết mình đang nói với ai.</p></blockquote>`
    },
    {
        slug: "marketing-mix-4p-co-ban",
        title: "Marketing Mix 4P: nền tảng đầu tiên khi học marketing",
        category: "marketing",
        tag: "#MarketingBasics",
        readTime: "6 phút đọc",
        date: "2026-05-01",
        excerpt: "4P gồm Product, Price, Place và Promotion. Đây là khung cơ bản giúp mình nhìn một sản phẩm không chỉ ở phần quảng cáo, mà ở toàn bộ cách nó ra thị trường.",
        content: `<h2>4P là gì?</h2><p>Marketing Mix 4P là một mô hình kinh điển trong marketing, gồm <strong>Product</strong>, <strong>Price</strong>, <strong>Place</strong> và <strong>Promotion</strong>. Khi mới học marketing, mình từng nghĩ marketing chủ yếu là chạy quảng cáo hoặc viết content. Nhưng 4P cho thấy quảng cáo chỉ là một phần trong bức tranh lớn hơn.</p><h2>Product: sản phẩm</h2><p>Sản phẩm không chỉ là thứ mình bán, mà là giải pháp cho một nhu cầu cụ thể. Khi phân tích Product, hãy hỏi: sản phẩm giải quyết vấn đề gì, khác gì so với lựa chọn khác, bao bì ra sao, chất lượng có ổn định không, trải nghiệm sau khi mua có tốt không?</p><h2>Price: giá</h2><p>Giá không chỉ là con số. Giá tạo cảm nhận về vị trí thương hiệu. Một mức giá thấp có thể giúp dễ thử, nhưng cũng có thể làm khách nghi ngờ chất lượng. Một mức giá cao cần đi cùng giá trị, niềm tin và trải nghiệm đủ tốt.</p><h2>Place: phân phối</h2><p>Place là nơi và cách khách hàng mua được sản phẩm. Với một thương hiệu nhỏ, Place có thể là Facebook, TikTok Shop, website, cửa hàng offline hoặc các sàn thương mại điện tử. Kênh bán càng thuận tiện, rào cản mua càng thấp.</p><h2>Promotion: truyền thông</h2><p>Promotion là cách thương hiệu nói với thị trường: quảng cáo, content, khuyến mãi, PR, KOL, email hoặc sự kiện. Nhưng truyền thông chỉ hiệu quả khi ba chữ P còn lại đủ rõ.</p><blockquote><p>4P nhắc mình rằng marketing tốt không cứu một sản phẩm mơ hồ. Marketing tốt bắt đầu từ một đề xuất giá trị rõ ràng.</p></blockquote>`
    },
    {
        slug: "hoc-marketing-tu-so-0",
        title: "Cách mình học marketing từ con số 0",
        category: "marketing",
        tag: "#MarketingMindset",
        readTime: "5 phút đọc",
        date: "2026-04-20",
        excerpt: "Không có nền tảng, không có mentor – mình bắt đầu marketing từ Google, YouTube và rất nhiều sai lầm. Đây là hành trình thật của mình.",
        content: `<h2>Bắt đầu từ đâu?</h2><p>Mình không học marketing ở trường từ đầu. Mọi thứ bắt đầu từ việc mình tự hỏi: "Làm sao để mọi người biết đến mình?"</p><blockquote><p>Marketing không phải bán hàng. Marketing là giúp người đúng tìm thấy giá trị đúng.</p></blockquote><h2>Những bước đầu tiên</h2><p>Mình bắt đầu bằng việc đọc blog HubSpot, xem YouTube về SEO cơ bản, và thử viết content cho fanpage của bạn bè. Sai rất nhiều, nhưng mỗi lần sai đều học được điều gì đó.</p><h2>Bài học lớn nhất</h2><p>Đừng chờ "đủ giỏi" mới bắt đầu. Hãy bắt đầu, rồi giỏi dần. Marketing là kỹ năng thực hành – bạn phải làm mới hiểu được.</p>`
    },
    {
        slug: "mot-ngay-cua-minh",
        title: "Một ngày của mình: học – tập yoga – đi làm",
        category: "yoga",
        tag: "#YogaFlow",
        readTime: "4 phút đọc",
        date: "2026-04-15",
        excerpt: "5:30 thức dậy, yoga 30 phút, ăn sáng nhẹ, rồi bắt đầu ngày mới. Nghe đơn giản nhưng thay đổi rất nhiều thứ.",
        content: `<h2>Tại sao yoga?</h2><p>Mình bắt đầu yoga vì stress. Nhưng sau 3 tháng, yoga không chỉ giúp mình bớt stress – nó thay đổi cách mình nhìn mọi thứ.</p><h2>Lịch một ngày thật</h2><p><strong>5:30</strong> – Thức dậy, uống nước ấm<br><strong>6:00</strong> – Yoga 30 phút (YouTube hoặc tự tập)<br><strong>6:30</strong> – Ăn sáng nhẹ, đọc sách 15 phút<br><strong>7:30</strong> – Bắt đầu công việc<br><strong>12:00</strong> – Nghỉ trưa, đi bộ<br><strong>18:00</strong> – Kết thúc, thời gian cho bản thân</p><blockquote><p>Sống có kế hoạch không phải sống cứng nhắc. Mà là sống có chủ đích.</p></blockquote>`
    },
    {
        slug: "nuoc-hoa-huong-noi",
        title: "Mùi nước hoa dành cho người hướng nội",
        category: "scent",
        tag: "#ScentStories",
        readTime: "3 phút đọc",
        date: "2026-04-10",
        excerpt: "Người hướng nội không cần mùi nước hoa quá nổi bật. Họ cần một mùi khiến mình cảm thấy an toàn và tự tin.",
        content: `<h2>Hướng nội ≠ nhạt nhẽo</h2><p>Nhiều người nghĩ hướng nội thì không cần nước hoa. Sai. Người hướng nội cần nước hoa – nhưng đúng loại.</p><h2>Gợi ý mùi hương</h2><p><strong>Tươi mát nhẹ</strong> – Cho ngày thường, đi học, đi làm. Mùi sạch, không phô trương.<br><strong>Gỗ ấm</strong> – Cho buổi tối yên tĩnh. Mùi ôm lấy bạn như một cái chăn ấm.<br><strong>Trà xanh / Trắng</strong> – Tinh tế, thanh lịch, không ai biết bạn xịt gì nhưng ai cũng thấy bạn thơm.</p><blockquote><p>Nước hoa không phải để gây chú ý. Mà là để bạn cảm thấy "mình đang là phiên bản tốt nhất".</p></blockquote>`
    },
    {
        slug: "day-hoc-la-hoc",
        title: "Dạy học cũng là cách học tốt nhất",
        category: "mentoring",
        tag: "#MentoringDiary",
        readTime: "4 phút đọc",
        date: "2026-04-05",
        excerpt: "Mình bắt đầu làm gia sư không phải vì giỏi, mà vì muốn hiểu sâu hơn. Và kết quả thì bất ngờ.",
        content: `<h2>Vì sao mình dạy?</h2><p>Không phải vì mình giỏi hơn ai. Mà vì khi dạy, mình buộc phải hiểu rõ ràng hơn, giải thích đơn giản hơn, và nhìn vấn đề từ nhiều góc hơn.</p><h2>Điều mình học được từ học trò</h2><p>Mỗi học trò dạy mình một bài học mới. Có bạn dạy mình kiên nhẫn. Có bạn dạy mình cách nhìn vấn đề từ góc hoàn toàn khác. Có bạn dạy mình rằng đôi khi, chỉ cần lắng nghe là đủ.</p><blockquote><p>Nếu bạn muốn hiểu thật sâu một thứ gì đó, hãy thử dạy nó cho người khác.</p></blockquote>`
    }
];

/* ===== MENU TOGGLE ===== */
function closeMenu() {
    navLinks?.classList.remove("open");
    menuToggle?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
}

menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
});

document.querySelectorAll(".nav-links a").forEach(l => l.addEventListener("click", closeMenu));
document.addEventListener("keydown", e => e.key === "Escape" && closeMenu());

/* Close menu when tapping outside (on the overlay background) */
navLinks?.addEventListener("click", e => {
    if (e.target === navLinks) closeMenu();
});

/* ===== REVEAL ANIMATIONS ===== */
function observeReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => obs.observe(el));
}

/* ===== ANALYTICS ===== */
function trackEvent(name, payload = {}) {
    const events = JSON.parse(localStorage.getItem("kimthamAnalytics") || "[]");
    events.push({ name, payload, path: location.pathname, at: new Date().toISOString() });
    localStorage.setItem("kimthamAnalytics", JSON.stringify(events.slice(-80)));
}

document.addEventListener("click", e => {
    const t = e.target.closest("[data-track]");
    if (t) trackEvent(t.dataset.track, { text: t.textContent.trim() });
});

/* ===== ESCAPE HTML ===== */
function esc(v) {
    return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

async function loadPublishedBlogs() {
    const endpoints = ["api/blogs.php?status=published", "public_html/api/blogs.php?status=published"];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${endpoint}&_=${Date.now()}`, {
                headers: { Accept: "application/json" },
                cache: "no-store"
            });
            const data = await response.json();
            if (!response.ok || !data.ok || !Array.isArray(data.blogs)) {
                throw new Error(data.message || "Cannot load blogs");
            }
            return data.blogs;
        } catch (err) {
            console.warn(`Cannot load blogs from ${endpoint}:`, err);
        }
    }

    if (location.protocol === "file:") {
        console.warn("Using fallback blog data for local file preview.");
        return blogPosts;
    }

    throw new Error("Không tải được blog từ CMS. Kiểm tra API hoặc quyền đọc file storage/blogs.json.");
}

async function loadPageData(pageName) {
    const endpoints = [`api/pages.php?page=${encodeURIComponent(pageName)}`, `public_html/api/pages.php?page=${encodeURIComponent(pageName)}`];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${endpoint}&_=${Date.now()}`, {
                headers: { Accept: "application/json" },
                cache: "no-store"
            });
            const data = await response.json();
            if (!response.ok || !data.ok || !data.page) {
                throw new Error(data.message || "Cannot load page data");
            }
            return data.page;
        } catch (err) {
            console.warn(`Cannot load page data from ${endpoint}:`, err);
        }
    }

    return null;
}

function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value != null) el.textContent = value;
}

function setLink(selector, text, href) {
    const el = document.querySelector(selector);
    if (!el) return;
    if (text != null) el.textContent = text;
    if (href != null) el.setAttribute("href", href);
}

function setImage(selector, src, alt) {
    const img = document.querySelector(selector);
    if (!img || !src) return;
    img.src = src;
    if (alt) img.alt = alt;
}

async function initHomePage() {
    const home = await loadPageData("home");
    if (!home) return;

    setText(".hero .eyebrow", home.heroEyebrow);
    setText(".hero h1", home.heroTitle);
    setText(".hero-content .hero-lead:nth-of-type(2)", home.heroSubtitle);
    setText(".hero-content .hero-lead:nth-of-type(3)", home.heroLead);
    setText(".hero-content .hero-lead:nth-of-type(4)", home.heroOutro);

    const introList = document.querySelector(".hero-intro-list");
    if (introList && Array.isArray(home.heroList)) {
        introList.innerHTML = home.heroList.map(item => `<li>${esc(item)}</li>`).join("");
    }

    setLink('.hero-actions a[data-track="cta-start"]', home.primaryCta, home.primaryCtaUrl);
    setLink('.hero-actions a[data-track="cta-blog"]', home.secondaryCta, home.secondaryCtaUrl);
    setLink('.hero-actions a[data-track="cta-portfolio"]', home.ghostCta, home.ghostCtaUrl);
    setImage(".hero-portrait img", home.heroImage, "Ảnh Kim Thắm");
    setText("#dashboard .section-heading .eyebrow", home.dashboardEyebrow);
    setText("#dashboard .section-heading h2", home.dashboardTitle);
    setText(".bento-card--scent p", home.scentOfDay);
    setText(".bento-stat-number", home.statNumber);
    setText(".bento-stat-label", home.statLabel);
}

async function initAboutPage() {
    const about = await loadPageData("about");
    if (!about) return;
    setImage(".about-portrait img", about.heroImage, "Kim Thắm portrait");
}

async function initPerfumePage() {
    const perfume = await loadPageData("perfume");
    if (!perfume) return;
    setImage(".perfume-visual img", perfume.heroImage, "Bộ nước hoa tinh tế");
}

/* ===== BLOG PAGE ===== */
async function initBlog() {
    const grid = document.getElementById("blogGrid");
    const filters = document.getElementById("blogFilters");
    if (!grid) return;

    let allPosts = [];
    try {
        allPosts = await loadPublishedBlogs();
    } catch (err) {
        grid.innerHTML = `<div class="empty-state"><h3>Không tải được blog</h3><p>${esc(err.message)}</p></div>`;
        return;
    }

    function renderBlog(filter = "all") {
        const posts = filter === "all" ? allPosts : allPosts.filter(p => p.category === filter);
        if (!posts.length) {
            grid.innerHTML = `<div class="empty-state"><h3>Chưa có bài viết đã xuất bản</h3><p>Hãy chuyển trạng thái bài viết trong admin sang Xuất bản.</p></div>`;
            return;
        }
        grid.innerHTML = posts.map(p => {
            const thumb = p.thumbnail
                ? `<img class="blog-card-thumb" src="${esc(p.thumbnail)}" alt="${esc(p.title)}" loading="lazy">`
                : `<div class="blog-card-thumb" style="background:linear-gradient(135deg,var(--primary-soft),var(--surface-warm));display:grid;place-items:center;font-size:2.5rem;color:var(--primary);">✍️</div>`;
            return `
            <a href="blog-post.html?slug=${esc(p.slug)}" class="blog-card reveal visible">
                ${thumb}
                <div class="blog-card-body">
                    <div class="blog-card-meta">
                        <span class="tag tag--pink">${esc(p.tag)}</span>
                        <span>⏱️ ${esc(p.readTime)}</span>
                    </div>
                    <h3>${esc(p.title)}</h3>
                    <p>${esc(p.excerpt)}</p>
                </div>
            </a>
        `;
        }).join("");
    }

    renderBlog();

    filters?.addEventListener("click", e => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderBlog(btn.dataset.filter);
    });
}

/* ===== BLOG POST PAGE ===== */
async function initBlogPost() {
    const header = document.getElementById("postHeader");
    const content = document.getElementById("postContent");
    const progress = document.getElementById("readingProgress");
    if (!header || !content) return;

    const slug = new URLSearchParams(location.search).get("slug");
    let posts = [];
    try {
        posts = await loadPublishedBlogs();
    } catch (err) {
        header.innerHTML = `<h1>Không tải được bài viết</h1><p style="color:var(--muted)">${esc(err.message)}</p>`;
        return;
    }
    const post = posts.find(p => p.slug === slug);

    if (!post) {
        header.innerHTML = `<h1>Bài viết không tìm thấy</h1><p style="color:var(--muted)">Quay lại <a href="blog.html" style="color:var(--primary);font-weight:600;">blog</a>.</p>`;
        return;
    }

    document.title = `${post.title} | Kim Thắm`;

    header.innerHTML = `
        <a href="blog.html" style="color:var(--primary);font-weight:600;font-size:.88rem;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;">← Quay lại blog</a>
        <span class="tag tag--pink" style="display:inline-flex;margin-bottom:12px;">${esc(post.tag)}</span>
        <h1>${esc(post.title)}</h1>
        <div class="post-meta">
            <span>📅 ${esc(post.date)}</span>
            <span>⏱️ ${esc(post.readTime)}</span>
        </div>
        ${post.thumbnail ? `<img class="post-cover" src="${esc(post.thumbnail)}" alt="${esc(post.title)}">` : ''}
    `;

    content.innerHTML = post.content;

    if (progress) {
        window.addEventListener("scroll", () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0";
        });
    }
}

/* ===== PORTFOLIO PAGE ===== */
async function loadPortfolioCases() {
    const endpoints = ["api/portfolio.php", "public_html/api/portfolio.php"];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${endpoint}?_=${Date.now()}`, {
                headers: { Accept: "application/json" },
                cache: "no-store"
            });
            const data = await response.json();
            const cases = data.cases || data.items;
            if (!response.ok || !data.ok || !Array.isArray(cases)) {
                throw new Error(data.message || "Cannot load portfolio");
            }
            return cases;
        } catch (err) {
            console.warn(`Cannot load portfolio from ${endpoint}:`, err);
        }
    }

    throw new Error("Không tải được portfolio từ CMS. Kiểm tra API hoặc quyền đọc file storage/portfolio.json.");
}

async function initPortfolio() {
    const grid = document.getElementById("caseGrid");
    if (!grid) return;

    try {
        const cases = await loadPortfolioCases();
        if (!cases.length) {
            grid.innerHTML = `<div class="empty-state"><h3>Chưa có case study</h3><p>Hãy thêm case study trong admin để hiển thị tại đây.</p></div>`;
            return;
        }

        grid.innerHTML = cases.map(item => {
            const tagColor = ["pink", "sage", "lavender", "gold"].includes(item.tagColor) ? item.tagColor : "pink";
            const image = item.image ? `<img class="case-card-image" src="${esc(item.image)}" alt="${esc(item.title || '')}" loading="lazy">` : '';
            return `
                <article class="case-card reveal visible">
                    ${image}
                    <div class="case-card-header">
                        <div>
                            <span class="tag tag--${tagColor}">${esc(item.tag || "")}</span>
                            <h2 style="font-size:1.4rem;margin-top:8px;">${esc(item.title || "")}</h2>
                        </div>
                    </div>
                    <div class="case-card-body">
                        <dl class="case-field"><dt>Problem</dt><dd>${esc(item.problem || "")}</dd></dl>
                        <dl class="case-field"><dt>Insight</dt><dd>${esc(item.insight || "")}</dd></dl>
                        <dl class="case-field"><dt>Strategy</dt><dd>${esc(item.strategy || "")}</dd></dl>
                        <dl class="case-field"><dt>Execution</dt><dd>${esc(item.execution || "")}</dd></dl>
                    </div>
                    <div class="case-result">
                        <dl class="case-field"><dt>Result</dt><dd>${esc(item.result || "")}</dd></dl>
                    </div>
                </article>
            `;
        }).join("");
    } catch (err) {
        grid.innerHTML = `<div class="empty-state"><h3>Không tải được portfolio</h3><p>${esc(err.message)}</p></div>`;
    }
}

/* ===== STORE – DYNAMIC PRODUCTS + QUIZ ===== */
async function loadProducts() {
    const endpoints = ["api/products.php", "public_html/api/products.php"];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${endpoint}?_=${Date.now()}`, {
                headers: { Accept: "application/json" },
                cache: "no-store"
            });
            const data = await response.json();
            const items = data.products || data.items;
            if (!response.ok || !data.ok || !Array.isArray(items)) {
                throw new Error(data.message || "Cannot load products");
            }
            return items;
        } catch (err) {
            console.warn(`Cannot load products from ${endpoint}:`, err);
        }
    }

    // No API available – return empty (static HTML fallback will remain)
    return null;
}

async function initStore() {
    const grid = document.getElementById("productGrid");
    const store = await loadPageData("store");
    if (store) {
        setImage(".store-hero-visual img", store.heroImage, "Bộ sưu tập nước hoa");
    }

    // Load dynamic products from CMS
    if (grid) {
        try {
            const products = await loadProducts();
            if (products && products.length) {
                grid.innerHTML = products.map((p, i) => {
                    const tagColor = ["pink", "sage", "lavender", "gold"].includes(p.tagColor) ? p.tagColor : "sage";
                    const delay = i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : "";
                    const visual = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name || '')}" loading="lazy">` : (p.emoji || '🌸');
                    return `
                        <article class="product-card reveal visible${delay}">
                            <div class="product-card-visual">${visual}</div>
                            <div class="product-card-body">
                                <span class="tag tag--${tagColor}">${esc(p.category || '')}</span>
                                <h3 style="margin-top:10px;">${esc(p.name || '')}</h3>
                                <p class="product-card-story">"${esc(p.story || '')}"</p>
                                <a class="btn primary" href="${esc(p.ctaUrl || 'contact.html?intent=perfume')}" data-track="product-${esc(p.name || '').toLowerCase().replace(/\s+/g,'-')}">${esc(p.ctaText || 'Nhắn mình để chọn mùi này')}</a>
                            </div>
                        </article>
                    `;
                }).join("");
            }
        } catch (err) {
            console.warn("Store: using static HTML fallback", err);
        }
    }

    // Quiz functionality
    initStoreQuiz();
}

function initStoreQuiz() {
    const options = document.getElementById("quizOptions");
    const result = document.getElementById("quizResult");
    const resultText = document.getElementById("quizResultText");
    if (!options) return;

    const vibeMap = {
        gentle: "🌿 Gợi ý: Morning Breeze – mùi tươi mát, nhẹ nhàng cho ngày thường.",
        sweet: "🌸 Gợi ý: Soft Bloom – ngọt ấm, nữ tính, hoàn hảo cho buổi hẹn.",
        bold: "✨ Gợi ý: Velvet Night – sang trọng, có dấu ấn, cho dịp đặc biệt.",
        modern: "🍃 Gợi ý: Urban Calm – unisex, hiện đại, linh hoạt mọi hoàn cảnh."
    };

    options.addEventListener("click", e => {
        const opt = e.target.closest(".quiz-option");
        if (!opt) return;
        options.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        resultText.textContent = vibeMap[opt.dataset.vibe] || "";
        result.style.display = "block";
        trackEvent("quiz-select", { vibe: opt.dataset.vibe });
    });
}

function formatPhoneForDisplay(phone) {
    const raw = String(phone || "").trim();
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) {
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    return raw;
}

function phoneHref(phone) {
    const raw = String(phone || "").trim();
    const normalized = raw.replace(/[^\d+]/g, "");
    return normalized ? `tel:${normalized}` : "";
}

async function initContactPage() {
    initContactIntent();

    const contact = await loadPageData("contact");
    if (!contact) return;

    setText(".section-heading .eyebrow", contact.eyebrow);
    setText(".section-heading h1", contact.title);
    setText(".section-heading p[style]", contact.subtitle);

    const email = String(contact.email || "").trim();
    const phone = String(contact.phone || "").trim();
    const zaloUrl = String(contact.zaloUrl || "").trim();

    const emailCard = document.querySelector('[data-contact-card="email"]');
    if (emailCard && email) {
        emailCard.href = `mailto:${email}`;
        const small = emailCard.querySelector("small");
        if (small) small.textContent = email;
    }

    const phoneCard = document.querySelector('[data-contact-card="phone"]');
    if (phoneCard && phone) {
        const href = phoneHref(phone);
        if (href) phoneCard.href = href;
        const small = phoneCard.querySelector("small");
        if (small) small.textContent = formatPhoneForDisplay(phone);
    }

    const zaloCard = document.querySelector('[data-contact-card="zalo"]');
    if (zaloCard && (zaloUrl || phone)) {
        zaloCard.href = zaloUrl || `https://zalo.me/${phone.replace(/\D/g, "")}`;
    }
}

/* ===== CONTACT INTENT ===== */
function initContactIntent() {
    const intentGrid = document.getElementById("intentGrid");
    const intentField = document.getElementById("intentField");
    const serviceSelect = document.getElementById("serviceSelect");
    if (!intentGrid) return;

    // Check URL param
    const urlIntent = new URLSearchParams(location.search).get("intent");
    if (urlIntent) selectIntent(urlIntent);

    intentGrid.addEventListener("click", e => {
        const card = e.target.closest(".intent-card");
        if (!card) return;
        selectIntent(card.dataset.intent);
    });

    function selectIntent(intent) {
        intentGrid.querySelectorAll(".intent-card").forEach(c => c.classList.remove("active"));
        const active = intentGrid.querySelector(`[data-intent="${intent}"]`);
        if (active) active.classList.add("active");
        if (intentField) intentField.value = intent;
        if (serviceSelect) {
            const map = { marketing: "Học marketing", perfume: "Tư vấn nước hoa", general: "Hỏi chung" };
            serviceSelect.value = map[intent] || "Hỏi chung";
        }
        trackEvent("intent-select", { intent });
    }
}

/* ===== CONTACT FORM ===== */
if (contactForm) {
    contactForm.addEventListener("submit", async e => {
        e.preventDefault();
        contactStatus.textContent = "Đang gửi...";
        contactStatus.className = "form-status";
        trackEvent("contact-form-attempt");

        try {
            const payload = Object.fromEntries(new FormData(contactForm).entries());
            const response = await fetch("api/contact.php", {
                method: "POST",
                headers: { Accept: "application/json", "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error("Máy chủ đang trả phản hồi không hợp lệ. Vui lòng thử lại sau.");
            }
            if (!response.ok || !data.ok) throw new Error(data.message || "Không thể gửi.");

            contactForm.reset();
            contactStatus.textContent = "Đã nhận! Mình sẽ phản hồi sớm 💝";
            contactStatus.classList.add("success");
            trackEvent("contact-form-success");
        } catch (err) {
            contactStatus.textContent = err.message;
            contactStatus.classList.add("error");
            trackEvent("contact-form-error", { message: err.message });
        }
    });
}

/* ===== INIT PER PAGE ===== */
switch (page) {
    case "home": initHomePage(); break;
    case "about": initAboutPage(); break;
    case "blog": initBlog(); break;
    case "blog-post": initBlogPost(); break;
    case "portfolio": initPortfolio(); break;
    case "store": initStore(); break;
    case "perfume": initPerfumePage(); break;
    case "contact": initContactPage(); break;
}

observeReveal();

/* ===== SCROLL TO TOP BUTTON ===== */
(function initScrollTop() {
    const btn = document.createElement("button");
    btn.className = "scroll-top";
    btn.setAttribute("aria-label", "Lên đầu trang");
    btn.innerHTML = "↑";
    document.body.appendChild(btn);

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                btn.classList.toggle("visible", window.scrollY > 400);
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        trackEvent("scroll-top");
    });
})();
