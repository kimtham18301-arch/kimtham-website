const loginForm = document.querySelector("#loginForm");
const adminWorkspace = document.querySelector("#adminWorkspace");
const contentForm = document.querySelector("#contentForm");
const statusBox = document.querySelector("#adminStatus");
const logoutButton = document.querySelector("#logoutButton");
const reloadButton = document.querySelector("#reloadContent");
const reloadLeadsButton = document.querySelector("#reloadLeads");
const leadsList = document.querySelector("#leadsList");
const tabButtons = document.querySelectorAll(".tab-button");

let csrfToken = "";

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setStatus(message, isSaved = false) {
    statusBox.textContent = message;
    statusBox.classList.toggle("saved", isSaved);
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
            ...(options.headers || {})
        },
        ...options
    });
    const data = await response.json();

    if (!response.ok || !data.ok) throw new Error(data.message || "Có lỗi xảy ra.");
    return data;
}

function fillForm(content) {
    Object.entries(content).forEach(([key, value]) => {
        const field = contentForm.elements[key];
        if (!field) return;
        field.value = field.dataset.json === "true" ? JSON.stringify(value || [], null, 2) : (value || "");
    });
}

function getFormContent() {
    return Array.from(new FormData(contentForm).entries()).reduce((content, [key, value]) => {
        const field = contentForm.elements[key];
        const trimmed = value.trim();

        if (field?.dataset.json === "true") {
            content[key] = trimmed ? JSON.parse(trimmed) : [];
            return content;
        }

        content[key] = trimmed;
        return content;
    }, {});
}

function showAdmin() {
    loginForm.hidden = true;
    adminWorkspace.hidden = false;
    logoutButton.hidden = false;
}

function showLogin() {
    loginForm.hidden = false;
    adminWorkspace.hidden = true;
    logoutButton.hidden = true;
}

async function loadContent() {
    const data = await apiRequest("api/content.php");
    csrfToken = data.csrfToken || csrfToken;
    fillForm(data.content);
}

function renderLead(lead) {
    return `
        <article class="lead-card">
            <small>${escapeHtml(lead.createdAt || "")}</small>
            <h3>${escapeHtml(lead.name || "Không có tên")}</h3>
            <p><strong>Email:</strong> ${escapeHtml(lead.email || "")}</p>
            <p><strong>Điện thoại:</strong> ${escapeHtml(lead.phone || "Không cung cấp")}</p>
            <p><strong>Dịch vụ:</strong> ${escapeHtml(lead.service || "")}</p>
            <p><strong>Mục tiêu:</strong> ${escapeHtml(lead.goal || "Chưa cung cấp")}</p>
            <p><strong>Kênh:</strong> ${escapeHtml(lead.channels || "Chưa cung cấp")}</p>
            <p><strong>Timeline:</strong> ${escapeHtml(lead.timeline || "Chưa cung cấp")}</p>
            <p><strong>Ngân sách:</strong> ${escapeHtml(lead.budget || "Chưa cung cấp")}</p>
            <p>${escapeHtml(lead.message || "")}</p>
        </article>
    `;
}

async function loadLeads() {
    const data = await apiRequest("api/leads.php");
    const leads = data.leads || [];

    leadsList.innerHTML = leads.length
        ? leads.map(renderLead).join("")
        : "<p>Chưa có lead liên hệ.</p>";
}

async function checkSession() {
    try {
        const session = await apiRequest("api/session.php");
        csrfToken = session.csrfToken || csrfToken;

        if (session.authenticated) {
            showAdmin();
            await loadContent();
            setStatus(`Đã đăng nhập: ${session.username}`, true);
            return;
        }

        showLogin();
        setStatus("Vui lòng đăng nhập");
    } catch (error) {
        showLogin();
        setStatus(error.message);
    }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Đang đăng nhập");

    try {
        const data = await apiRequest("api/login.php", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(new FormData(loginForm).entries()))
        });
        csrfToken = data.csrfToken || csrfToken;
        showAdmin();
        await loadContent();
        loginForm.reset();
        setStatus("Đăng nhập thành công", true);
    } catch (error) {
        setStatus(error.message);
    }
});

contentForm.addEventListener("input", () => setStatus("Có thay đổi chưa lưu"));

contentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Đang lưu nội dung");

    try {
        await apiRequest("api/content.php", {
            method: "POST",
            body: JSON.stringify(getFormContent())
        });
        setStatus("Đã lưu nội dung", true);
    } catch (error) {
        setStatus(error.message);
    }
});

reloadButton.addEventListener("click", async () => {
    try {
        await loadContent();
        setStatus("Đã tải lại nội dung", true);
    } catch (error) {
        setStatus(error.message);
    }
});

reloadLeadsButton.addEventListener("click", async () => {
    try {
        await loadLeads();
        setStatus("Đã tải lead liên hệ", true);
    } catch (error) {
        setStatus(error.message);
    }
});

logoutButton.addEventListener("click", async () => {
    try {
        await apiRequest("api/logout.php", { method: "POST", body: "{}" });
    } finally {
        csrfToken = "";
        showLogin();
        setStatus("Đã đăng xuất");
    }
});

tabButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        tabButtons.forEach((item) => item.classList.toggle("active", item === button));
        document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));

        const panel = document.querySelector(`#${button.dataset.tab}`);
        panel?.classList.add("active");

        if (button.dataset.tab === "leadsPanel") {
            await loadLeads();
        }
    });
});

checkSession();
