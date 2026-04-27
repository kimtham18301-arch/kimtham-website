const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const samePageNavItems = [...navItems].filter((link) => (link.getAttribute("href") || "").startsWith("#"));
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");

const fallbackContent = {
    heroEyebrow: "Tư vấn nước hoa cá nhân",
    heroTitle: "Chọn nước hoa hợp gu, đúng dịp và vừa ngân sách.",
    heroLead: "Kim Thắm giúp bạn tìm mùi hương dễ dùng cho đi làm, đi chơi, hẹn hò hoặc làm quà tặng. Chỉ cần gửi gu mùi, người dùng và ngân sách, mình sẽ gợi ý vài lựa chọn phù hợp qua Zalo.",
    primaryCta: "Nhắn Zalo tư vấn",
    secondaryCta: "Gọi 0972295710",
    profileCta: "Xem profile",
    profileUrl: "files/profile-kim-tham.html",
    profileName: "Kim Thắm",
    profileSummary: "Tư vấn nước hoa theo gu cá nhân",
    servicesTitle: "Không cần nhớ thuật ngữ mùi hương, chỉ cần nói bạn muốn dùng trong hoàn cảnh nào.",
    servicesIntro: "Mỗi gợi ý sẽ dựa trên người dùng, môi trường sử dụng, độ nổi bật mong muốn và mức ngân sách bạn thấy thoải mái.",
    packagesTitle: "Dễ chọn hơn khi bắt đầu từ người nhận và dịp sử dụng.",
    projectsTitle: "Câu hỏi thường gặp",
    processTitle: "Gửi vài thông tin cơ bản, nhận gợi ý mùi hương rõ ràng và dễ quyết định.",
    aboutTitle: "Những câu hỏi thường gặp trước khi chọn nước hoa.",
    aboutParagraph1: "Kim Thắm tư vấn nước hoa theo gu, dịp sử dụng và ngân sách.",
    aboutParagraph2: "Bạn có thể nhắn Zalo để được gợi ý nhanh trước khi đặt mua.",
    proofTitle: "Vì sao nên tư vấn trước khi mua",
    contactTitle: "Bạn gửi gu mùi và ngân sách, mình sẽ gợi ý lựa chọn phù hợp.",
    email: "hello@kimtham.id.vn",
    phone: "0972295710",
    facebook: "",
    linkedin: "",
    csrfToken: "",
    services: [
        { tag: "Đi làm", title: "Sạch, gọn và dễ gần", text: "Gợi ý các mùi tươi mát, nhẹ nhàng, không quá nồng để dùng trong văn phòng hoặc lớp học." },
        { tag: "Đi chơi", title: "Nổi bật vừa đủ", text: "Chọn mùi có cá tính hơn nhưng vẫn dễ dùng, hợp cà phê, dạo phố hoặc gặp bạn bè." },
        { tag: "Hẹn hò", title: "Ấm, mềm và cuốn hút", text: "Ưu tiên nhóm ngọt ấm, hoa, gỗ hoặc xạ hương để tạo cảm giác gần gũi và có dấu ấn." },
        { tag: "Quà tặng", title: "An toàn nhưng tinh tế", text: "Tư vấn theo độ tuổi, giới tính, phong cách và thông điệp bạn muốn gửi đến người nhận." },
        { tag: "Unisex", title: "Hiện đại và linh hoạt", text: "Phù hợp người thích mùi ít ranh giới nam nữ, dùng được nhiều hoàn cảnh và nhiều mùa." }
    ],
    packages: [
        { title: "Mua cho bản thân", text: "Bắt đầu từ thói quen dùng hằng ngày, phong cách ăn mặc, môi trường làm việc và những mùi bạn từng thích." },
        { title: "Mua làm quà", text: "Chọn mùi dễ tạo thiện cảm, có câu chuyện rõ ràng và phù hợp độ tuổi, tính cách, dịp tặng." },
        { title: "Mua theo ngân sách", text: "Khoanh vùng lựa chọn theo mức chi mong muốn để tránh lan man và dễ chốt sản phẩm hơn." }
    ],
    projects: [
        { tag: "Tư vấn có mất phí không?", title: "Tư vấn nhanh qua Zalo", context: "Bạn có thể nhắn nhu cầu, gu mùi và ngân sách để nhận gợi ý ban đầu.", role: "Kim Thắm sẽ hỏi thêm vài chi tiết nếu cần.", result: "Sau đó bạn nhận 2-4 hướng mùi phù hợp để cân nhắc." },
        { tag: "Có chọn được quà không?", title: "Có, chỉ cần mô tả người nhận", context: "Hãy gửi giới tính, độ tuổi, phong cách, dịp tặng và ngân sách.", role: "Mình sẽ ưu tiên các mùi dễ dùng, lịch sự và có cảm giác tinh tế.", result: "Phù hợp sinh nhật, kỷ niệm, lễ tết hoặc quà cảm ơn." },
        { tag: "Nếu chưa biết gu?", title: "Bắt đầu từ cảm giác muốn có", context: "Bạn chỉ cần nói thích sạch, ngọt, sang, nhẹ, nổi bật hoặc trưởng thành.", role: "Mình sẽ chuyển cảm giác đó thành nhóm hương dễ hiểu.", result: "Bạn không cần biết quá nhiều thuật ngữ nước hoa." }
    ],
    process: [
        { title: "Gửi gu và ngân sách", text: "Nhắn Zalo hoặc điền form: mua cho ai, dịp dùng, ngân sách và cảm giác mùi mong muốn." },
        { title: "Nhận gợi ý phù hợp", text: "Mình đề xuất vài lựa chọn theo nhóm hương, độ dễ dùng và hoàn cảnh sử dụng." },
        { title: "Chốt mùi và cách dùng", text: "Sau khi chọn, bạn được hướng dẫn cách xịt, bảo quản và dùng sao cho mùi lên đẹp hơn." }
    ],
    proofs: [
        "Tư vấn theo nhu cầu thật, không bắt đầu bằng danh sách sản phẩm quá dài.",
        "Ưu tiên các mùi dễ dùng, hợp hoàn cảnh và vừa ngân sách.",
        "Có thể hỗ trợ chọn quà cho người chưa biết rõ về nước hoa."
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
                ${item.role ? `<div><dt>Cách tư vấn</dt><dd>${escapeHtml(item.role)}</dd></div>` : ""}
                ${item.result ? `<div><dt>Kết quả</dt><dd>${escapeHtml(item.result)}</dd></div>` : ""}
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
        samePageNavItems.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

if (samePageNavItems.length) {
    sections.forEach((section) => activeObserver.observe(section));
}

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
    contactStatus.textContent = "Đang gửi yêu cầu tư vấn...";
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

        if (!response.ok || !data.ok) throw new Error(data.message || "Không thể gửi yêu cầu tư vấn.");

        contactForm.reset();
        contactStatus.textContent = "Đã nhận thông tin. Mình sẽ liên hệ lại qua Zalo/điện thoại sớm.";
        contactStatus.classList.add("success");
        trackEvent("contact-form-success");
    } catch (error) {
        contactStatus.textContent = error.message;
        trackEvent("contact-form-error", { message: error.message });
    }
});

loadContent();
