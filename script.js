document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       LOADER
    ========================= */

    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (loader) loader.classList.add("hide");
        }, 900);
    });


    /* =========================
       HEADER SCROLL
    ========================= */

    const header = document.getElementById("header");

    const handleScroll = () => {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();


    /* =========================
       MOBILE MENU
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    if (menuBtn && nav) {

        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("show");

            menuBtn.textContent =
                nav.classList.contains("show") ? "×" : "☰";
        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                nav.classList.remove("show");
                menuBtn.textContent = "☰";
            });

        });
    }


    /* =========================
       SEARCH OVERLAY
    ========================= */

    const searchBtn = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchClose = document.getElementById("searchClose");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn && searchOverlay) {

        searchBtn.addEventListener("click", () => {

            searchOverlay.classList.add("show");

            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 200);

        });
    }

    if (searchClose) {

        searchClose.addEventListener("click", () => {
            searchOverlay.classList.remove("show");
        });

    }

    if (searchOverlay) {

        searchOverlay.addEventListener("click", e => {

            if (e.target === searchOverlay) {
                searchOverlay.classList.remove("show");
            }

        });

    }

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            if (searchOverlay) {
                searchOverlay.classList.remove("show");
            }

            if (nav) {
                nav.classList.remove("show");
            }

            if (menuBtn) {
                menuBtn.textContent = "☰";
            }

        }

    });


    /* =========================
       REVEAL ANIMATION
    ========================= */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold:0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =========================
       NUMBER COUNTER
    ========================= */

    const counters = document.querySelectorAll("[data-number]");

    const runCounter = element => {

        const target = Number(
            element.getAttribute("data-number")
        );

        const duration = 1600;
        const start = performance.now();

        const update = currentTime => {

            const progress = Math.min(
                (currentTime - start) / duration,
                1
            );

            const eased =
                1 - Math.pow(1 - progress, 3);

            const current =
                Math.floor(target * eased);

            element.textContent =
                current.toLocaleString("vi-VN");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent =
                    target.toLocaleString("vi-VN");
            }

        };

        requestAnimationFrame(update);
    };


    const counterObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    runCounter(entry.target);

                    counterObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold:0.5
        }
    );

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });


    /* =========================
       FAVORITE BUTTON
    ========================= */

    const favorites =
        document.querySelectorAll(".favorite");

    favorites.forEach(button => {

        button.addEventListener("click", () => {

            const active =
                button.classList.toggle("active");

            button.textContent =
                active ? "♥" : "♡";

        });

    });


    /* =========================
       SEARCH DEMO
    ========================= */

    if (searchInput) {

        searchInput.addEventListener("keydown", e => {

            if (e.key !== "Enter") return;

            const keyword =
                searchInput.value.trim();

            if (!keyword) return;

            window.location.href =
                `products.html?search=${encodeURIComponent(keyword)}`;

        });

    }


    /* =========================
       SMOOTH INTERNAL LINKS
    ========================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

        });

    });


    /* =========================
       PRODUCT HOVER EFFECT
    ========================= */

    document.querySelectorAll(".product-card")
        .forEach(card => {

            card.addEventListener("mousemove", e => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    e.clientX - rect.left;

                const y =
                    e.clientY - rect.top;

                const rotateX =
                    ((y / rect.height) - 0.5) * -4;

                const rotateY =
                    ((x / rect.width) - 0.5) * 4;

                card.style.transform =
                    `perspective(800px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;

            });

            card.addEventListener("mouseleave", () => {

                card.style.transform =
                    "perspective(800px) rotateX(0) rotateY(0)";

            });

        });


    /* =========================
       SERVICE HOVER
    ========================= */

    document.querySelectorAll(".service-card")
        .forEach(card => {

            card.addEventListener("mousemove", e => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    ((e.clientX - rect.left) /
                    rect.width) * 100;

                const y =
                    ((e.clientY - rect.top) /
                    rect.height) * 100;

                card.style.background =
                    `radial-gradient(
                        circle at ${x}% ${y}%,
                        rgba(255,255,255,.07),
                        #101217 45%
                    )`;

            });

            card.addEventListener("mouseleave", () => {

                card.style.background = "";

            });

        });


    /* =========================
       CURRENT YEAR
    ========================= */

    document.querySelectorAll("[data-year]")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });


    /* =========================
       PAGE READY
    ========================= */

    document.body.classList.add("page-ready");

});
