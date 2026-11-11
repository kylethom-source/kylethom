
/* =========================================
   LIGHT / DARK THEME TOGGLE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle = document.querySelector(".theme-toggle");
    const root = document.documentElement;

    if (!themeToggle) {
        console.error("Theme toggle button not found!");
        return;
    }

    // Get saved theme or system preference.
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("portfolio-theme");
    } catch (error) {
        console.warn("Theme preference storage unavailable.");
    }

    const systemPrefersLight = window.matchMedia(
        "(prefers-color-scheme: light)"
    ).matches;

    const initialTheme =
        savedTheme === "light" || savedTheme === "dark"
            ? savedTheme
            : systemPrefersLight ? "light" : "dark";

    // Apply theme and update button.
    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);

        if (theme === "dark") {
            themeToggle.textContent = "☀️";
            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );
        } else {
            themeToggle.textContent = "🌙";
            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );
        }

        themeToggle.setAttribute(
            "aria-pressed",
            String(theme === "dark")
        );
    }

    applyTheme(initialTheme);

    // Switch themes when clicked.
    themeToggle.addEventListener("click", () => {

        const currentTheme = root.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(newTheme);

        try {
            localStorage.setItem("portfolio-theme", newTheme);
        } catch (error) {
            console.warn("Could not save theme preference.");
        }

        console.log("Theme changed to:", newTheme);
    });

});
