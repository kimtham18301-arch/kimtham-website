const storageKey = "kimthamSiteContent";
const form = document.querySelector("#contentForm");
const statusBox = document.querySelector("#adminStatus");
const loadDemoButton = document.querySelector("#loadDemo");
const resetButton = document.querySelector("#resetContent");

const demoContent = {
    heroEyebrow: "Digital Marketing Intern / Content & Social Media",
    heroTitle: "Kim Thắm",
    heroLead: "Mình đang phát triển năng lực trong Digital Marketing, tập trung vào lập kế hoạch nội dung, quản lý mạng xã hội, SEO cơ bản và phân tích hiệu quả truyền thông.",
    profileName: "Kim Thắm",
    profileSummary: "Content Marketing • Social Media • SEO cơ bản",
    aboutTitle: "Hồ sơ cá nhân rõ ràng, đáng tin cậy và hướng đến môi trường thực tế.",
    aboutParagraph1: "Website này giới thiệu hành trình học tập, kỹ năng và các dự án thực hành của Kim Thắm trong lĩnh vực Digital Marketing.",
    aboutParagraph2: "Mình quan tâm đến cách nội dung có thể kết nối thương hiệu với đúng nhóm khách hàng và tạo ra kế hoạch truyền thông có thể triển khai.",
    email: "your-email@gmail.com",
    phone: "0972295710",
    facebook: "https://facebook.com/yourname",
    linkedin: "https://linkedin.com/in/yourname"
};

function setStatus(message, isSaved = false) {
    statusBox.textContent = message;
    statusBox.classList.toggle("saved", isSaved);
}

function fillForm(content) {
    Object.entries(content).forEach(([key, value]) => {
        const field = form.elements[key];

        if (field) {
            field.value = value;
        }
    });
}

function getFormContent() {
    return Array.from(new FormData(form).entries()).reduce((content, [key, value]) => {
        content[key] = value.trim();
        return content;
    }, {});
}

fillForm(JSON.parse(localStorage.getItem(storageKey) || "{}"));

form.addEventListener("input", () => {
    setStatus("Có thay đổi chưa lưu");
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(getFormContent()));
    setStatus("Đã lưu nội dung", true);
});

loadDemoButton.addEventListener("click", () => {
    fillForm(demoContent);
    setStatus("Đã điền nội dung mẫu");
});

resetButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    form.reset();
    setStatus("Đã xóa dữ liệu đã lưu");
});
