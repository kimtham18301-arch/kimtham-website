const loginForm = document.querySelector("#loginForm");
const contentForm = document.querySelector("#contentForm");
const statusBox = document.querySelector("#adminStatus");
const logoutButton = document.querySelector("#logoutButton");
const reloadButton = document.querySelector("#reloadContent");

function setStatus(message, isSaved = false) {
    statusBox.textContent = message;
    statusBox.classList.toggle("saved", isSaved);
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.message || "Có lỗi xảy ra.");
    }

    return data;
}

function fillForm(content) {
    Object.entries(content).forEach(([key, value]) => {
        const field = contentForm.elements[key];

        if (field) {
            field.value = value;
        }
    });
}

function getFormContent() {
    return Array.from(new FormData(contentForm).entries()).reduce((content, [key, value]) => {
        content[key] = value.trim();
        return content;
    }, {});
}

function showAdmin() {
    loginForm.hidden = true;
    contentForm.hidden = false;
    logoutButton.hidden = false;
}

function showLogin() {
    loginForm.hidden = false;
    contentForm.hidden = true;
    logoutButton.hidden = true;
}

async function loadContent() {
    const data = await apiRequest("api/content.php");
    fillForm(data.content);
}

async function checkSession() {
    try {
        const session = await apiRequest("api/session.php");

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
        await apiRequest("api/login.php", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(new FormData(loginForm).entries()))
        });
        showAdmin();
        await loadContent();
        loginForm.reset();
        setStatus("Đăng nhập thành công", true);
    } catch (error) {
        setStatus(error.message);
    }
});

contentForm.addEventListener("input", () => {
    setStatus("Có thay đổi chưa lưu");
});

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

logoutButton.addEventListener("click", async () => {
    try {
        await apiRequest("api/logout.php", { method: "POST", body: "{}" });
    } finally {
        showLogin();
        setStatus("Đã đăng xuất");
    }
});

checkSession();
