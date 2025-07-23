/* Script for managing the pages that are currently active on the site, allowing for seamless transition between the different sections of the page. */

    /* Adds event listeneres to the nav bar for changing site content. */

    function navEventListener() {
        document.querySelectorAll("nav a").forEach(nav_row => nav_row.addEventListener("click", _ => {JS_NavLoading(nav_row.dataset.id); JS_PageLoading(nav_row.dataset.id)}));
    };

    /* Handles which nav bar should be active on the site. */

    function JS_NavLoading(nav_id) {
        let pages = document.querySelectorAll("div.active, div.inactive");
        console.log(pages);
        pages.forEach(page => {page.classList.remove("active"); page.classList.add("inactive")});
        pages[nav_id - 1].classList.remove("inactive");
        pages[nav_id - 1].classList.add("active")
    };

    /* Handles which page should be active on the site. */

    function JS_PageLoading(nav_id) {
        let pages = document.querySelectorAll("article.active, article.inactive");
        console.log(pages);
        pages.forEach(page => {page.classList.remove("active"); page.classList.add("inactive")});
        pages[nav_id - 1].classList.remove("inactive");
        pages[nav_id - 1].classList.add("active")
    };

    /* The script is ran by default. */

    navEventListener();