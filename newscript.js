
// ========== MOBILE NAVIGATION ==========
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.innerHTML = isOpen
            ? '<i class="fas fa-xmark"></i>'
            : '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ========== SCROLL REVEAL ANIMATION ==========
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
});

// ========== NAVBAR SCROLL EFFECT + ACTIVE LINK ==========
const navbar = document.querySelector(".navbar");
const pageSections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

function updateNavigation() {
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    }

    let currentSection = "home";

    pageSections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 160) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
}

window.addEventListener("scroll", updateNavigation, { passive: true });
updateNavigation();

// ========== CERTIFICATE POPUP ==========
const certificateModal = document.getElementById("certificate-modal");
const certificateImage = document.getElementById("certificate-image");
const modalClose = document.getElementById("modal-close");

function openCertificate(imagePath) {
    if (!certificateModal || !certificateImage) return;

    certificateImage.src = imagePath;
    certificateModal.classList.add("open");
    certificateModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeCertificate() {
    if (!certificateModal || !certificateImage) return;

    certificateModal.classList.remove("open");
    certificateModal.setAttribute("aria-hidden", "true");
    certificateImage.src = "";
    document.body.style.overflow = "";
}

document.querySelectorAll(".certificate-button").forEach(button => {
    button.addEventListener("click", () => {
        openCertificate(button.dataset.certificate);
    });
});

if (modalClose) {
    modalClose.addEventListener("click", closeCertificate);
}

if (certificateModal) {
    certificateModal.querySelectorAll("[data-close-modal]").forEach(element => {
        element.addEventListener("click", closeCertificate);
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCertificate();
    }
});

// ========== FOOTER YEAR ==========
const footerYear = document.getElementById("footer-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// ========== CONTACT FORM ==========
const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const submitButton = contactForm?.querySelector(".submit-button");

// IMPORTANT:
// Add your own Web3Forms access key below to enable online form submission.
// Get a key from https://web3forms.com/
// Do not publish your key in public repositories.
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

if (contactForm) {
    contactForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (!formNote || !submitButton) return;

        if (
            !WEB3FORMS_ACCESS_KEY ||
            WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY"
        ) {
            formNote.textContent =
                "Contact form setup pending. Please email me directly using the email link on this page.";
            formNote.className = "form-note error";
            return;
        }

        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        formNote.textContent = "";

        const formData = new FormData(contactForm);
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);
        formData.append("from_name", "Archana Portfolio");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                formNote.textContent = "Message sent successfully!";
                formNote.className = "form-note success";
                contactForm.reset();
            } else {
                throw new Error(result.message || "Message could not be sent.");
            }
        } catch (error) {
            formNote.textContent =
                "Message could not be sent. Please email me directly instead.";
            formNote.className = "form-note error";
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}