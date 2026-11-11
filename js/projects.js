
/* =========================================
   PROJECT MANAGEMENT
   ========================================= */

(() => {
    "use strict";

    // Project elements
    const projectsContainer = document.querySelector(".projects-grid");
    const projectCards = document.querySelectorAll(".project-card");

    // Optional filtering and search elements
    const filterButtons = document.querySelectorAll(".project-filter");
    const searchInput = document.querySelector("#project-search");
    const emptyMessage = document.querySelector("#no-projects");

    // Current filter
    let activeFilter = "all";
    let searchQuery = "";


    // =====================================
    // PROJECT FILTERING
    // =====================================

    function filterProjects() {
        if (!projectCards.length) return;

        let visibleCount = 0;

        projectCards.forEach(card => {
            // Read the project's category.
            const category = (
                card.dataset.category || ""
            ).toLowerCase();

            // Search the project's text.
            const searchableText = card.textContent.toLowerCase();

            const matchesCategory =
                activeFilter === "all" ||
                category.split(" ").includes(activeFilter);

            const matchesSearch =
                searchableText.includes(searchQuery);

            const isVisible =
                matchesCategory && matchesSearch;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        // Show a message if no projects match.
        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }

        // Update the number of visible projects, if a counter exists.
        const projectCount = document.querySelector("#project-count");

        if (projectCount) {
            projectCount.textContent =
                `${visibleCount} project${visibleCount === 1 ? "" : "s"}`;
        }
    }


    // =====================================
    // CATEGORY FILTER BUTTONS
    // =====================================

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeFilter = (
                button.dataset.filter || "all"
            ).toLowerCase();

            // Update active button styling.
            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            filterProjects();
        });
    });


    // =====================================
    // PROJECT SEARCH
    // =====================================

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchQuery = searchInput.value
                .trim()
                .toLowerCase();

            filterProjects();
        });
    }


    // =====================================
    // EXPANDABLE PROJECT DETAILS
    // =====================================

    const projectDetails = document.querySelectorAll(
        ".project-card details"
    );

    projectDetails.forEach(details => {
        details.addEventListener("toggle", () => {
            const card = details.closest(".project-card");

            if (!card) return;

            card.classList.toggle("expanded", details.open);
        });
    });


    // =====================================
    // PROJECT CARD INTERACTIONS
    // =====================================

    projectCards.forEach(card => {
        // Add a class when the card is hovered.
        card.addEventListener("mouseenter", () => {
            card.classList.add("hovered");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("hovered");
        });
    });


    // =====================================
    // INITIALIZE
    // =====================================

    // Ensure the initial filter button is accessible.
    filterButtons.forEach(button => {
        const isActive =
            button.dataset.filter === "all";

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    filterProjects();

})();
