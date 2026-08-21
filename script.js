document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LOADER
    ===================================================== */

    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            loader?.classList.add("hide");
        }, 900);
    });


    /* =====================================================
       SCROLL PROGRESS
    ===================================================== */

    const updateProgress = () => {

        const scrollTop = window.scrollY;

        const height =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            height > 0 ? scrollTop / height : 0;

        document.body.style.setProperty(
            "--scroll-progress",
            progress
        );

        const bar =
            document.body;

        bar.style.setProperty(
            "background-size",
            `${progress * 100}% 3px`
        );
    };

    window.addEventListener(
        "scroll",
        updateProgress,
        { passive:true }
    );


    /* =====================================================
       HEADER
    ===================================================== */

    const header =
        document.getElementById("header");

    const handleHeader = () => {

        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    };

    window.addEventListener(
        "scroll",
        handleHeader,
        { passive:true }
    );

    handleHeader();


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuBtn =
        document.getElementById("menuBtn");

    const nav =
        document.getElementById("nav");

    if (menuBtn && nav) {

        menuBtn.addEventListener("click", () => {

            const opened =
                nav.classList.toggle("show");

            menuBtn.textContent =
                opened ? "×" : "☰";

        });

        nav.querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    nav.classList.remove("show");

                    menuBtn.textContent = "☰";

                });

            });
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchBtn =
        document.getElementById("searchBtn");

    const searchOverlay =
        document.getElementById("searchOverlay");

    const searchClose =
        document.getElementById("searchClose");

    const searchInput =
        document.getElementById("searchInput");

    const openSearch = () => {

        searchOverlay?.classList.add("show");

        document.body.style.overflow = "hidden";

        setTimeout(() => {
            searchInput?.focus();
        }, 250);
    };

    const closeSearch = () => {

        searchOverlay?.classList.remove("show");

        document.body.style.overflow = "";

    };

    searchBtn?.addEventListener(
        "click",
        openSearch
    );

    searchClose?.addEventListener(
        "click",
        closeSearch
    );

    searchOverlay?.addEventListener(
        "click",
        e => {

            if (e.target === searchOverlay) {
                closeSearch();
            }

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener("keydown", e => {

        if (e.key !== "Escape") return;

        closeSearch();

        nav?.classList.remove("show");

        if (menuBtn) {
            menuBtn.textContent = "☰";
        }

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold:.12,
                rootMargin:"0px 0px -70px 0px"
            }
        );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =====================================================
       COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll(
            "[data-number]"
        );

    const animateCounter = element => {

        const target =
            Number(
                element.dataset.number
            );

        const duration = 1700;

        let startTime = null;

        const update = time => {

            if (!startTime) {
                startTime = time;
            }

            const progress =
                Math.min(
                    (time - startTime) /
                    duration,
                    1
                );

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    4
                );

            const value =
                Math.floor(
                    target * eased
                );

            element.textContent =
                value.toLocaleString("vi-VN");

            if (progress < 1) {
                requestAnimationFrame(update);
            }

        };

        requestAnimationFrame(update);
    };

    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    animateCounter(
                        entry.target
                    );

                    counterObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold:.7
            }
        );

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });


    /* =====================================================
       CURSOR GLOW
    ===================================================== */

    if (
        window.matchMedia(
            "(pointer:fine)"
        ).matches
    ) {

        let mouseX = -300;
        let mouseY = -300;

        let currentX = -300;
        let currentY = -300;

        window.addEventListener(
            "mousemove",
            e => {

                mouseX = e.clientX;
                mouseY = e.clientY;

            },
            { passive:true }
        );

        const cursorLoop = () => {

            currentX +=
                (mouseX - currentX) * .12;

            currentY +=
                (mouseY - currentY) * .12;

            document.body.style.setProperty(
                "--mouse-x",
                `${currentX}px`
            );

            document.body.style.setProperty(
                "--mouse-y",
                `${currentY}px`
            );

            requestAnimationFrame(
                cursorLoop
            );
        };

        cursorLoop();
    }


    /* =====================================================
       PARALLAX
    ===================================================== */

    const parallaxElements = [
        {
            selector:".hero-background",
            speed:.08
        },
        {
            selector:".hero-card",
            speed:.025
        },
        {
            selector:".about-card",
            speed:.045
        }
    ];

    let ticking = false;

    const updateParallax = () => {

        const scroll =
            window.scrollY;

        parallaxElements.forEach(item => {

            document
                .querySelectorAll(item.selector)
                .forEach(element => {

                    const rect =
                        element.getBoundingClientRect();

                    if (
                        rect.bottom < -100 ||
                        rect.top >
                        window.innerHeight + 100
                    ) {
                        return;
                    }

                    const center =
                        rect.top +
                        rect.height / 2;

                    const offset =
                        (
                            center -
                            window.innerHeight / 2
                        ) * item.speed;

                    element.style.setProperty(
                        "--parallax-y",
                        `${offset}px`
                    );

                    element.style.transform =
                        `translate3d(
                            0,
                            ${offset}px,
                            0
                        )`;

                });

        });

        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateParallax
                );

                ticking = true;

            }

        },
        { passive:true }
    );


    /* =====================================================
       3D PRODUCT CARDS
    ===================================================== */

    if (
        window.matchMedia(
            "(pointer:fine)"
        ).matches
    ) {

        document
            .querySelectorAll(".product-card")
            .forEach(card => {

                card.addEventListener(
                    "mousemove",
                    e => {

                        const rect =
                            card.getBoundingClientRect();

                        const x =
                            e.clientX -
                            rect.left;

                        const y =
                            e.clientY -
                            rect.top;

                        const rotateY =
                            (
                                x /
                                rect.width -
                                .5
                            ) * 8;

                        const rotateX =
                            (
                                y /
                                rect.height -
                                .5
                            ) * -8;

                        card.style.transform =
                            `perspective(1000px)
                             rotateX(${rotateX}deg)
                             rotateY(${rotateY}deg)
                             translateY(-8px)`;

                    }
                );

                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                    }
                );

            });
    }


    /* =====================================================
       SERVICE 3D
    ===================================================== */

    if (
        window.matchMedia(
            "(pointer:fine)"
        ).matches
    ) {

        document
            .querySelectorAll(".service-card")
            .forEach(card => {

                card.addEventListener(
                    "mousemove",
                    e => {

                        const rect =
                            card.getBoundingClientRect();

                        const x =
                            e.clientX -
                            rect.left;

                        const y =
                            e.clientY -
                            rect.top;

                        const rotateY =
                            (
                                x /
                                rect.width -
                                .5
                            ) * 5;

                        const rotateX =
                            (
                                y /
                                rect.height -
                                .5
                            ) * -5;

                        card.style.transform =
                            `perspective(900px)
                             rotateX(${rotateX}deg)
                             rotateY(${rotateY}deg)
                             translateY(-7px)`;

                    }
                );

                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                    }
                );

            });
    }


    /* =====================================================
       MAGNETIC BUTTONS
    ===================================================== */

    if (
        window.matchMedia(
            "(pointer:fine)"
        ).matches
    ) {

        document
            .querySelectorAll(
                ".btn,.header-cta"
            )
            .forEach(button => {

                button.addEventListener(
                    "mousemove",
                    e => {

                        const rect =
                            button.getBoundingClientRect();

                        const x =
                            e.clientX -
                            rect.left -
                            rect.width / 2;

                        const y =
                            e.clientY -
                            rect.top -
                            rect.height / 2;

                        button.style.transform =
                            `translate(
                                ${x * .12}px,
                                ${y * .12}px
                            )`;

                    }
                );

                button.addEventListener(
                    "mouseleave",
                    () => {

                        button.style.transform =
                            "";

                    }
                );

            });
    }


    /* =====================================================
       FAVORITES
    ===================================================== */

    document
        .querySelectorAll(".favorite")
        .forEach(button => {

            button.addEventListener(
                "click",
                e => {

                    e.preventDefault();

                    const active =
                        button.classList.toggle(
                            "active"
                        );

                    button.textContent =
                        active ? "♥" : "♡";

                }
            );

        });


    /* =====================================================
       SEARCH ENTER
    ===================================================== */

    searchInput?.addEventListener(
        "keydown",
        e => {

            if (e.key !== "Enter")
                return;

            const keyword =
                searchInput.value.trim();

            if (!keyword)
                return;

            window.location.href =
                `products.html?search=${
                    encodeURIComponent(keyword)
                }`;

        }
    );


    /* =====================================================
       SMOOTH ANCHORS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                e => {

                    const id =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !id ||
                        id === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            id
                        );

                    if (!target)
                        return;

                    e.preventDefault();

                    target.scrollIntoView({
                        behavior:"smooth",
                        block:"start"
                    });

                }
            );

        });


    /* =====================================================
       ACTIVE NAV ON SCROLL
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    if (sections.length) {

        const navLinks =
            document.querySelectorAll(
                ".nav a"
            );

        window.addEventListener(
            "scroll",
            () => {

                let current = "";

                sections.forEach(section => {

                    const top =
                        section.offsetTop -
                        180;

                    if (
                        window.scrollY >=
                        top
                    ) {
                        current =
                            section.id;
                    }

                });

                navLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );

                    if (
                        link.getAttribute(
                            "href"
                        ) === `#${current}`
                    ) {
                        link.classList.add(
                            "active"
                        );
                    }

                });

            },
            { passive:true }
        );

    }


    /* =====================================================
       TILT HERO WITH MOUSE
    ===================================================== */

    const heroCard =
        document.querySelector(
            ".hero-card"
        );

    if (
        heroCard &&
        window.matchMedia(
            "(pointer:fine)"
        ).matches
    ) {

        heroCard.addEventListener(
            "mousemove",
            e => {

                const rect =
                    heroCard.getBoundingClientRect();

                const x =
                    e.clientX -
                    rect.left;

                const y =
                    e.clientY -
                    rect.top;

                const rx =
                    (
                        y /
                        rect.height -
                        .5
                    ) * -3;

                const ry =
                    (
                        x /
                        rect.width -
                        .5
                    ) * 4;

                heroCard.style.animation =
                    "none";

                heroCard.style.transform =
                    `perspective(1200px)
                     rotateX(${rx}deg)
                     rotateY(${ry}deg)
                     translateY(-8px)`;

            }
        );

        heroCard.addEventListener(
            "mouseleave",
            () => {

                heroCard.style.transform =
                    "";

                heroCard.style.animation =
                    "";

            }
        );

    }


    /* =====================================================
       IMAGE / PRODUCT HOVER GLOW
    ===================================================== */

    document
        .querySelectorAll(
            ".product-image"
        )
        .forEach(image => {

            image.addEventListener(
                "mousemove",
                e => {

                    const rect =
                        image.getBoundingClientRect();

                    const x =
                        (
                            e.clientX -
                            rect.left
                        ) / rect.width * 100;

                    const y =
                        (
                            e.clientY -
                            rect.top
                        ) / rect.height * 100;

                    image.style.background =
                        `
                        radial-gradient(
                            circle at ${x}% ${y}%,
                            rgba(255,255,255,.09),
                            transparent 35%
                        ),
                        radial-gradient(
                            circle at 50% 45%,
                            #272c35,
                            transparent 35%
                        ),
                        #101217
                        `;

                }
            );

            image.addEventListener(
                "mouseleave",
                () => {

                    image.style.background =
                        "";

                }
            );

        });


    /* =====================================================
       INITIAL
    ===================================================== */

    updateProgress();

});
