const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");

const fallbackContent = {
    heroEyebrow: "Content Marketing - Social Media - SEO cơ bản",
    heroTitle: "Kim Thắm giúp thương hiệu nhỏ biến ý tưởng rời rạc thành nội dung có kế hoạch.",
    heroLead: "Mình hỗ trợ xây dựng thông điệp, lịch nội dung, bài viết và tối ưu SEO cơ bản để kênh số của bạn rõ ràng hơn, đăng đều hơn và dễ theo dõi hiệu quả hơn.",
    primaryCta: "Gửi brief tư vấn",
    secondaryCta: "Xem case study",
    profileCta: "Tải profile/CV",
    profileUrl: "files/profile-kim-tham.html",
    profileName: "Kim Thắm",
    profileSummary: "Freelance Content & Social Media Marketer",
    servicesTitle: "Những phần mình có thể hỗ trợ ngay.",
    servicesIntro: "Phù hợp với cá nhân, cửa hàng nhỏ hoặc dự án mới cần người triển khai nội dung có cấu trúc, dễ phối hợp và biết đo lường cơ bản.",
    packagesTitle: "Chọn phạm vi vừa đủ để bắt đầu rõ ràng.",
    projectsTitle: "Dự án được trình bày theo vấn đề, vai trò và đầu ra.",
    processTitle: "Làm việc gọn, rõ đầu việc và có phản hồi theo từng bước.",
    aboutTitle: "Một người làm nội dung đang xây nền tảng marketing bằng sự chỉn chu và tinh thần học nhanh.",
    aboutParagraph1: "Mình quan tâm đến cách nội dung giúp một thương hiệu được hiểu đúng hơn: từ thông điệp, lịch đăng, góc nhìn khách hàng đến cách đo hiệu quả sau mỗi chiến dịch nhỏ.",
    aboutParagraph2: "Khi làm việc, mình ưu tiên brief rõ, timeline thực tế, tài liệu dễ theo dõi và nội dung có thể triển khai được trên kênh thật.",
    proofTitle: "Điểm mạnh khi phối hợp",
    contactTitle: "Gửi brief ngắn, mình sẽ phản hồi hướng triển khai phù hợp.",
    email: "hello@kimtham.id.vn",
    phone: "0972295710",
    facebook: "",
    linkedin: "",
    csrfToken: "",
    services: [
        { title: "Content Marketing", text: "Lên ý tưởng, viết bài, xây lịch nội dung và điều chỉnh thông điệp theo nhóm khách hàng mục tiêu." },
        { title: "Social Media", text: "Sắp xếp tuyến nội dung Facebook, Instagram hoặc TikTok để kênh nhìn nhất quán và dễ duy trì." },
        { title: "SEO cơ bản", text: "Nghiên cứu từ khóa, tối ưu tiêu đề, mô tả và cấu trúc nội dung cho trang bán hàng hoặc bài viết." }
    ],
    packages: [
        { title: "Content Plan Starter", text: "Phù hợp khi bạn cần định hướng nội dung 2-4 tuần, gồm trụ cột nội dung, lịch đăng và gợi ý định dạng." },
        { title: "Social Media Care", text: "Dành cho kênh cần đăng đều: lên ý tưởng, viết caption, checklist hình ảnh và ghi chú tối ưu sau mỗi tuần." },
        { title: "SEO & Channel Audit", text: "Rà soát website, bài viết hoặc gian hàng để tìm điểm cần sửa về từ khóa, tiêu đề, mô tả và trải nghiệm đọc." }
    ],
    projects: [
        { tag: "SEO / E-commerce", title: "SEO Shopee - Mắt kính Titanus", context: "Sản phẩm cần dễ được tìm thấy hơn trên sàn thương mại điện tử.", role: "Nghiên cứu từ khóa, nhóm nhu cầu tìm kiếm và đề xuất cấu trúc nội dung sản phẩm.", result: "Bộ gợi ý tiêu đề, mô tả và nhóm từ khóa có thể áp dụng cho trang sản phẩm." },
        { tag: "Customer Insight", title: "VietJet Air - Trải nghiệm khi chuyến bay delay", context: "Khách hàng dễ có cảm xúc tiêu cực trong thời gian chờ chuyến.", role: "Phân tích điểm đau và đề xuất hướng truyền thông hỗ trợ trải nghiệm.", result: "Ý tưởng hoạt động giúp khách hàng được cập nhật, trấn an và cảm thấy được quan tâm hơn." },
        { tag: "Social Media", title: "SHOOTING Kombucha", context: "Thương hiệu đồ uống cần tăng nhận diện và tương tác trên kênh xã hội.", role: "Xây dựng concept nội dung, lịch đăng và hướng hình ảnh trẻ trung.", result: "Khung triển khai social media dễ dùng cho Facebook và Instagram." }
    ],
    process: [
        { title: "Nhận brief", text: "Làm rõ mục tiêu, khách hàng, kênh triển khai, timeline, ngân sách và tài nguyên đang có." },
        { title: "Đề xuất hướng làm", text: "Gửi khung nội dung, thông điệp chính và đầu việc ưu tiên để thống nhất trước khi triển khai." },
        { title: "Triển khai & tối ưu", text: "Hoàn thiện nội dung, tiếp nhận phản hồi và ghi chú điểm cải thiện cho lần tiếp theo." }
    ],
    proofs: [
        "Biết tổ chức thông tin thành kế hoạch dễ theo dõi.",
        "Viết nội dung rõ ràng, đúng mục tiêu và có thể chỉnh theo giọng thương hiệu.",
        "Có nền tảng SEO, social media và phân tích hiệu quả cơ bản."
    ]
};

function setLink(selector, href, label) {
    const element = document.querySelector(selector);
    if (!element) return;

    const cleanHref = String(href || "").trim();
    if (!cleanHref) {
        element.hidden = true;
        return;
    }

    element.hidden = false;
    element.href = selector.includes("email") ? `mailto:${cleanHref}` : selector.includes("phone") ? `tel:${cleanHref}` : cleanHref;
    element.textContent = label || cleanHref;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderCards(selector, items, type = "service") {
    const container = document.querySelector(selector);
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = items.map((item, index) => {
        const tag = item.tag ? `<span class="tag">${escapeHtml(item.tag)}</span>` : `<span class="number">${String(index + 1).padStart(2, "0")}</span>`;
        const body = item.context || item.role || item.result
            ? `<dl class="case-details">
                ${item.context ? `<div><dt>Bối cảnh</dt><dd>${escapeHtml(item.context)}</dd></div>` : ""}
                ${item.role ? `<div><dt>Vai trò</dt><dd>${escapeHtml(item.role)}</dd></div>` : ""}
                ${item.result ? `<div><dt>Đầu ra</dt><dd>${escapeHtml(item.result)}</dd></div>` : ""}
            </dl>`
            : `<p>${escapeHtml(item.text || "")}</p>`;

        return `<article class="${type}-card reveal">${tag}<h3>${escapeHtml(item.title || "")}</h3>${body}</article>`;
    }).join("");
}

function renderProofs(items) {
    const list = document.querySelector("[data-list='proofs']");
    if (!list || !Array.isArray(items)) return;
    list.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function applyContent(content) {
    const data = { ...fallbackContent, ...content };

    document.querySelectorAll("[data-content]").forEach((element) => {
        const value = data[element.dataset.content];
        if (value) element.textContent = value;
    });

    document.querySelectorAll("[data-content-attr]").forEach((element) => {
        const value = data[element.dataset.contentAttr];
        if (value) element.textContent = value;
    });

    setLink("[data-link='email']", data.email, data.email);
    setLink("[data-link='phone']", data.phone, data.phone);
    setLink("[data-link='facebook']", data.facebook, "Facebook");
    setLink("[data-link='linkedin']", data.linkedin, "LinkedIn");

    const profileLink = document.querySelector(".optional-profile-link");
    if (profileLink) {
        const profileUrl = String(data.profileUrl || "").trim();
        profileLink.hidden = !profileUrl;
        if (profileUrl) profileLink.href = profileUrl;
    }

    renderCards("[data-list='services']", data.services, "service");
    renderCards("[data-list='packages']", data.packages, "package");
    renderCards("[data-list='projects']", data.projects, "project");
    renderCards("[data-list='process']", data.process, "process");
    renderProofs(data.proofs);
    window.kimthamCsrfToken = data.csrfToken || "";
}

async function loadContent() {
    try {
        const response = await fetch("api/content.php", { headers: { Accept: "application/json" } });
        const data = await response.json();
        applyContent(data.ok ? data.content : fallbackContent);
    } catch {
        applyContent(fallbackContent);
    } finally {
        observeReveal();
    }
}

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

navItems.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());

function observeReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    document.querySelectorAll(".reveal:not(.visible)").forEach((element) => revealObserver.observe(element));
}

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

sections.forEach((section) => activeObserver.observe(section));

function trackEvent(name, payload = {}) {
    const events = JSON.parse(localStorage.getItem("kimthamAnalytics") || "[]");
    events.push({ name, payload, path: location.pathname, at: new Date().toISOString() });
    localStorage.setItem("kimthamAnalytics", JSON.stringify(events.slice(-80)));
}

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-track]");
    if (target) trackEvent(target.dataset.track, { text: target.textContent.trim() });
});

contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    contactStatus.textContent = "Đang gửi liên hệ...";
    contactStatus.classList.remove("success");
    trackEvent("contact-form-attempt");

    try {
        const payload = Object.fromEntries(new FormData(contactForm).entries());
        const response = await fetch("api/contact.php", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": window.kimthamCsrfToken || ""
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok || !data.ok) throw new Error(data.message || "Không thể gửi liên hệ.");

        contactForm.reset();
        contactStatus.textContent = "Đã nhận thông tin. Mình sẽ phản hồi sớm.";
        contactStatus.classList.add("success");
        trackEvent("contact-form-success");
    } catch (error) {
        contactStatus.textContent = error.message;
        trackEvent("contact-form-error", { message: error.message });
    }
});

loadContent();
