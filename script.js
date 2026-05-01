/* ===== KIM THẮM – MULTI-PAGE SCRIPT ===== */

const page = document.body.dataset.page || "home";
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");

/* ===== BLOG DATA ===== */
const blogPosts = [
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
    try {
        const response = await fetch("api/blogs.php?status=published", {
            headers: { Accept: "application/json" },
            cache: "no-store"
        });
        const data = await response.json();
        if (!response.ok || !data.ok || !Array.isArray(data.blogs)) {
            throw new Error(data.message || "Cannot load blogs");
        }
        return data.blogs;
    } catch (err) {
        console.warn("Using fallback blog data:", err);
        return blogPosts;
    }
}

/* ===== BLOG PAGE ===== */
async function initBlog() {
    const grid = document.getElementById("blogGrid");
    const filters = document.getElementById("blogFilters");
    if (!grid) return;

    const allPosts = await loadPublishedBlogs();

    function renderBlog(filter = "all") {
        const posts = filter === "all" ? allPosts : allPosts.filter(p => p.category === filter);
        grid.innerHTML = posts.map(p => `
            <a href="blog-post.html?slug=${esc(p.slug)}" class="blog-card reveal visible">
                <div class="blog-card-thumb" style="background:linear-gradient(135deg,var(--primary-soft),var(--surface-warm));display:grid;place-items:center;font-size:2.5rem;color:var(--primary);">✍️</div>
                <div class="blog-card-body">
                    <div class="blog-card-meta">
                        <span class="tag tag--pink">${esc(p.tag)}</span>
                        <span>⏱️ ${esc(p.readTime)}</span>
                    </div>
                    <h3>${esc(p.title)}</h3>
                    <p>${esc(p.excerpt)}</p>
                </div>
            </a>
        `).join("");
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
    const posts = await loadPublishedBlogs();
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
    `;

    content.innerHTML = post.content;

    if (progress) {
        window.addEventListener("scroll", () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0";
        });
    }
}

/* ===== STORE QUIZ ===== */
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
            const data = await response.json();
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
    case "blog": initBlog(); break;
    case "blog-post": initBlogPost(); break;
    case "store": initStoreQuiz(); break;
    case "contact": initContactIntent(); break;
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
