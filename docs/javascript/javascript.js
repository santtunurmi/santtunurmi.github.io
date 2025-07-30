/* Script for managing the pages that are currently active on the site, allowing for seamless transition between the different sections of the page. */

    /* Adds event listeneres to the nav bar for changing site content. */

    function navEventListener() {
        document.querySelectorAll("nav a").forEach(nav_row => nav_row.addEventListener("click", _ => {JS_NavLoading(nav_row.dataset.id); JS_PageLoading(nav_row.dataset.id)}));
    };

    /* Handles which nav bar should be active on the site. */

    function JS_NavLoading(nav_id) {
        let pages = document.querySelectorAll("div.active, div.inactive");
        pages.forEach(page => {page.classList.remove("active"); page.classList.add("inactive")});
        pages[nav_id - 1].classList.remove("inactive");
        pages[nav_id - 1].classList.add("active");
    };

    /* Handles which page should be active on the site. */

    function JS_PageLoading(nav_id) {
        let pages = document.querySelectorAll("article.active, article.inactive");
        pages.forEach(page => {page.classList.remove("active"); page.classList.add("inactive")});
        pages[nav_id - 1].classList.remove("inactive");
        pages[nav_id - 1].classList.add("active");
    };

/* Script for setting up "read more" -pages when viewport is less than 600px. */

    function buttonReadMore(checks, fullText) {
        document.querySelectorAll("article.read-more")[checks].innerHTML = fullText;
        document.querySelectorAll("button.read-more-button")[checks].classList.add("inactive");
        document.querySelectorAll("button.read-more-button")[checks].classList.remove("active");
        checks += 1
    }

    function ReadMoreAdd() {
        let ReadMores = document.querySelectorAll("article.read-more");
        let shortText;
        checks = ReadMores.length - 1
        const shortTextLength = 231;
        ReadMores.forEach(Readmore => {
            fullText = Readmore.innerHTML;
            shortText = Readmore.innerHTML.substr(0, shortTextLength) + "... </p>" +
            "<button class='read-more-button'>Show more</button>";
            Readmore.innerHTML = shortText;
            document.querySelectorAll("button.read-more-button").forEach(button => button.addEventListener("click", _ => {buttonReadMore(checks, fullText)}));
        });
    };

    function ReadMoreRemove() {
        document.querySelectorAll("article.read-more").forEach(Readmore => {try{Readmore.innerHTML = fullText} catch{""}})
        document.querySelectorAll("button.read-more-button").forEach(page => {page.classList.remove("active"); page.classList.add("inactive")});
    };

    /* Viewport monitoring */

    if (matchMedia) {
        var mq = window.matchMedia("(max-width: 600px)");
        mq.addListener(WidthChange);
    }

    function WidthChange(mq) {
        if (mq.matches) { 
            ReadMoreAdd();
        } 
        else { 
            ReadMoreRemove();
        }
    }