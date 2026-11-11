
/* =========================================
   PORTFOLIO MAIN SCRIPT
   ========================================= */

(() => {
    "use strict";

    // =====================================
    // SITE CONFIGURATION
    // =====================================

    const CONFIG = {
        siteName: "Portfolio",
        debug: false,
        mobileBreakpoint: 768
    };


    // =====================================
    // DEBUG LOGGING
    // =====================================

    function log(message, ...args) {
        if (CONFIG.debug) {
            console.log(`[${CONFIG.siteName}] ${message}`, ...args);
        }
    }


    // =====================================
    // COPYRIGHT YEAR
    // =====================================

    function updateCopyrightYear() {
        const yearElements = document.querySelectorAll(
            "[data-current-year]"
        );

        const currentYear = new Date().getFullYear();

        yearElements.forEach(element => {
            element.textContent = currentYear;
        });

        log("Copyright year updated:", currentYear);
    }


    // =====================================
    // EXTERNAL LINKS
    // =====================================

    function initializeExternalLinks() {
        const links = document.querySelectorAll("a[href]");

        links.forEach(link => {
            const href = link.getAttribute("href");

            if (!href) return;

            try {
                const url = new URL(href, window.location.href);

                // Only modify external HTTP(S) links.
                if (
                    !["http:", "https:"].includes(url.protocol) ||
                    url.origin === window.location.origin
                ) {
                    return;
                }

                // Open external links in a new tab.
                link.setAttribute("target", "_blank");

                // Protect against reverse tabnabbing.
                const rel = new Set(
                    (link.getAttribute("rel") || "")
                        .split(/\s+/)
                        .filter(Boolean)
                );

                rel.add("noopener");
                rel.add("noreferrer");

                link.setAttribute(
                    "rel",
                    Array.from(rel).join(" ")
                );

            } catch (error) {
                log("Skipping invalid link:", href);
            }
        });

        log("External links initialized");
    }


    // =====================================
    // IMAGE LOADING
    // =====================================

    function initializeImages() {
        const images = document.querySelectorAll("img");

        images.forEach(image => {
            // Lazy-load images that are not marked as high priority.
            if (!image.hasAttribute("loading")) {
                if (image.dataset.priority !== "high") {
                    image.loading = "lazy";
                }
            }

            // Decode asynchronously where supported.
            image.decoding = "async";

            // Add a loaded class when the image finishes.
            if (image.complete && image.naturalWidth > 0) {
                image.classList.add("loaded");
            } else {
                image.addEventListener("load", () => {
                    image.classList.add("loaded");
                }, { once: true });
            }
        });

        log("Images initialized");
    }


    // =====================================
    // ANCHOR LINK VALIDATION
    // =====================================

    function validateAnchorLinks() {
        const anchorLinks = document.querySelectorAll(
            'a[href^="#"]'
        );

        anchorLinks.forEach(link => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const targetId = href.slice(1);
            const target = document.getElementById(targetId);

            if (!target) {
                log(`Missing anchor target: ${href}`);
            }
        });
    }


    // =====================================
    // PAGE VISIBILITY
    // =====================================

    function initializePageVisibility() {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                log("Page moved to background");
            } else {
                log("Page became visible");
            }
        });
    }


    // =====================================
    // SITE INITIALIZATION
    // =====================================

    function initializeSite() {
        log("Initializing portfolio...");

        updateCopyrightYear();
        initializeExternalLinks();
        initializeImages();
        validateAnchorLinks();
        initializePageVisibility();

        // Mark initialization as complete.
        document.documentElement.classList.add("site-ready");

        log("Portfolio initialized successfully");
    }


    // =====================================
    // DOM READY
    // =====================================

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeSite,
            { once: true }
        );
    } else {
        initializeSite();
    }

})();
