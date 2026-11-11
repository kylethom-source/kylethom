
/* =========================================
   PORTFOLIO INTERACTIONS
   ========================================= */

(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // =====================================
    // SCROLL PROGRESS INDICATOR
    // =====================================

    const progressBar = document.querySelector(".scroll-progress");

    function updateScrollProgress() {
        if (!progressBar) return;

        const scrollableHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const scrollProgress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        const percentage = Math.min(
            100,
            Math.max(0, scrollProgress)
        );

        progressBar.style.width = `${percentage}%`;
    }


    // =====================================
    // BACK TO TOP BUTTON
    // =====================================

    const backToTopButton = document.querySelector(".back-to-top");

    function updateBackToTop() {
        if (!backToTopButton) return;

        const shouldShow = window.scrollY > 500;

        backToTopButton.classList.toggle("visible", shouldShow);
    }

    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion.matches
                    ? "instant"
                    : "smooth"
            });
        });
    }


    // =====================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealElements = document.querySelectorAll(
        ".reveal"
    );

    function revealAllElements() {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    if (
        "IntersectionObserver" in window &&
        !prefersReducedMotion.matches
    ) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealAllElements();
    }

    // Reveal everything if reduced-motion preference changes.
    prefersReducedMotion.addEventListener("change", event => {
        if (event.matches) {
            revealAllElements();
        }
    });


    // =====================================
    // PROJECT CARD INTERACTIONS
    // =====================================

    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach(card => {
        // Highlight cards when keyboard focus is inside.
        card.addEventListener("focusin", () => {
            card.classList.add("focused");
        });

        card.addEventListener("focusout", event => {
            if (!card.contains(event.relatedTarget)) {
                card.classList.remove("focused");
            }
        });
    });


    // =====================================
    // EXTERNAL LINK SECURITY
    // =====================================

    const externalLinks = document.querySelectorAll(
        'a[target="_blank"]'
    );

    externalLinks.forEach(link => {
        const existingRel = link.getAttribute("rel") || "";
        const relValues = new Set(existingRel.split(/\s+/).filter(Boolean));

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute("rel", Array.from(relValues).join(" "));
    });


    // =====================================
    // SCROLL EVENT OPTIMIZATION
    // =====================================

    let scrollTicking = false;

    function handleScroll() {
        if (scrollTicking) return;

        scrollTicking = true;

        window.requestAnimationFrame(() => {
            updateScrollProgress();
            updateBackToTop();

            scrollTicking = false;
        });
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    window.addEventListener("resize", handleScroll, {
        passive: true
    });

    // =====================================
    // INITIALIZE
    // =====================================

    updateScrollProgress();
    updateBackToTop();

    // =====================================

    /* =========================================
       ROTATING CONTACT HEADING
       ========================================= */

    const rotatingWord = document.getElementById("rotating-word");

    if (rotatingWord) {
        const words = [
            "meaningful.",
            "creative.",
            "fun.",
            "challenging.",
            "new.",
            "interesting."
        ];

        let wordIndex = 0;

        const fadeDuration = 800;   // 0.8 seconds
        const displayDuration = 2500; // Time word stays visible

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (!reducedMotion.matches) {

            function rotateWord() {

                // Fade the current word out.
                rotatingWord.classList.add("fade-out");

                setTimeout(() => {

                    // Change the word after fade-out finishes.
                    wordIndex = (wordIndex + 1) % words.length;
                    rotatingWord.textContent = words[wordIndex];

                    // Fade the new word back in.
                    rotatingWord.classList.remove("fade-out");

                    // Schedule the next rotation after fade-in.
                    setTimeout(rotateWord, fadeDuration + displayDuration);

                }, fadeDuration);
            }

            // Begin after the first word has been displayed.
            setTimeout(rotateWord, displayDuration);
        }
    }

})();
