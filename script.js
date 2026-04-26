const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const savedSiteContent = JSON.parse(localStorage.getItem("kimthamSiteContent") || "{}");

const contentBindings = {
    heroTitle: ".hero h1",
    heroEyebrow: ".hero .eyebrow",
    heroLead: ".hero-lead",
    profileName: ".profile-card h2",
    profileSummary: ".profile-card > p",
    aboutTitle: "#about .section-heading h2",
    aboutParagraph1: ".about-copy p:nth-child(1)",
    aboutParagraph2: ".about-copy p:nth-child(2)",
    email: ".contact-card a[href^='mailto:']",
    phone: ".contact-card a[href^='tel:']",
    facebook: ".contact-card a[href*='facebook.com']",
    linkedin: ".contact-card a[href*='linkedin.com']"
};

function applySavedContent() {
    Object.entries(contentBindings).forEach(([key, selector]) => {
        const value = savedSiteContent[key];
        const element = document.querySelector(selector);

        if (!value || !element) {
            return;
        }

        if (key === "email") {
            element.href = `mailto:${value}`;
        }

        if (key === "phone") {
            element.href = `tel:${value}`;
        }

        if (key === "facebook" || key === "linkedin") {
            element.href = value;
        }

        element.firstChild.textContent = value;
    });
}

applySavedContent();

function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
});

navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});

const activeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navItems.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    }
);

sections.forEach((section) => {
    activeObserver.observe(section);
});
