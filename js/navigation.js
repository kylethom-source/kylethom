
/* =========================================
   NAVIGATION MANAGEMENT
   ========================================= */

(() => {
    "use strict";

    // Navigation elements
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navigationLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    const header = document.querySelector("header");

    // =====================================
    // MOBILE MENU
    // =====================================

    function openMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.add("active");
        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function toggleMenu() {
        if (navLinks.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle && navLinks) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-controls", "primary-navigation");

        // Toggle menu when hamburger is clicked.
        menuToggle.addEventListener("click", toggleMenu);

        // Close menu when a navigation link is selected.
        navigationLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Close menu when clicking outside navigation.
        document.addEventListener("click", event => {
            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close menu with Escape key.
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Close mobile menu if window is resized to desktop.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }


    // =====================================
    // SMOOTH SCROLLING
    // =====================================

    navigationLinks.forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            // Ignore empty or invalid anchor links.
            if (!targetId || targetId === "#") return;

            const targetSection = document.querySelector(targetId);

            if (!targetSection) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                targetSection.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            // Update the URL without jumping to the anchor.
            history.replaceState(null, "", targetId);
        });
    });


    // =====================================
    // ACTIVE NAVIGATION LINK
    // =====================================

    const sections = document.querySelectorAll("main section[id]");

    function updateActiveLink() {
        if (sections.length === 0) return;

        const headerHeight = header
            ? header.offsetHeight
            : 0;

        const scrollPosition =
            window.scrollY + headerHeight + 100;

        let currentSection = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSection = section.id;
            }
        });

        // Handle the bottom of the page.
        if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5
        ) {
            currentSection = sections[sections.length - 1].id;
        }

        navigationLinks.forEach(link => {
            const isActive =
                link.getAttribute("href") === `#${currentSection}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // Update active link while scrolling.
    window.addEventListener("scroll", updateActiveLink, {
        passive: true
    });

    // Set the correct link when the page loads.
    updateActiveLink();


    // =====================================
    // HEADER SCROLL EFFECT
    // =====================================

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

})();
