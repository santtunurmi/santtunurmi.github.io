/* Script for managing the pages that are currently active on the site, allowing for seamless transition between the different sections of the page. */

    /* Adds event listeneres to the nav bar for changing site content. */

    function navEventListener() {
        document.querySelectorAll("nav a.page").forEach(nav_row => nav_row.addEventListener("click", _ => {JS_NavLoading(nav_row.dataset.id); JS_PageLoading(nav_row.dataset.id); WidthChange(mq); jump()}));
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

    function jump(){
        var top = document.getElementById("root").offsetTop;
        window.scrollTo(0, top);
    }

/* Script for setting up "read more" -pages when viewport is less than 600px. */

    function readMore() {
        var readMores = document.getElementsByClassName("read-more")
        readMores = Array.from(readMores);
        readMores.forEach(readMore => { 
            var showMore = readMore.getElementsByClassName("more");
            var button = readMore.getElementsByClassName("read-more-button");
            button[0].classList.add("highlighted")
            showMore = Array.from(showMore);
            nav = document.querySelectorAll("nav.opening-card-nav")
            nav = Array.from(nav)
            if (showMore[0].style.display === "none") {
                button[0].innerHTML = "Read less";
                button[0].style.margin="0.5em 0 0 0";
                showMore.forEach(moreText => {moreText.style.display = "inline"});
                nav.forEach(nav => {nav.classList.add("test")});
            }
            
            else {
                button[0].innerHTML = "Read more";
                button[0].style.margin="0";
                showMore.forEach(moreText => {moreText.style.display = "none"});
                nav.forEach(nav => {nav.classList.remove("test")});
                button[0].classList.remove("highlighted");
            }
        })
    };

    /* Seperate script for read more pages that aren't located in an opening card. */

    function readMoreOther() {
        var readMores = document.getElementsByClassName("read-more-other")
        readMores = Array.from(readMores);
        readMores.forEach(readMore => { 
            var showMore = readMore.getElementsByClassName("more-other");
            var button = readMore.getElementsByClassName("read-more-other-button");
            button[0].classList.add("highlighted-more")
            showMore = Array.from(showMore);
            if (showMore[0].style.display === "none") {
                button[0].innerHTML = "Read less";
                showMore.forEach(moreText => {moreText.style.display = "inline"});
            }
            
            else {
                button[0].innerHTML = "Read more";
                showMore.forEach(moreText => {moreText.style.display = "none"});
                button[0].classList.remove("highlighted-more");
            }
        })
    };

    /* Viewport monitoring for scripts. */

    if (matchMedia) {
        var mq = window.matchMedia("(max-width: 600px)");
        mq.addListener(WidthChange);
    }

    function WidthChange(mq) {
        buttons = document.getElementsByClassName("read-more-button");
        buttons = Array.from(buttons);
        otherbuttons = document.getElementsByClassName("read-more-other-button");
        otherbuttons = Array.from(otherbuttons);
        showMore = document.getElementsByClassName("more");
        showMore = Array.from(showMore);
        showOthers = document.getElementsByClassName("more-other");
        showOthers = Array.from(showOthers);
        nav = document.querySelectorAll("nav.opening-card-nav")
        nav = Array.from(nav)
        if (mq.matches) {
            buttons.forEach(button => {button.classList.remove("inactive", "highlighted"); button.classList.add("active"); button.innerHTML="Read more"});
            otherbuttons.forEach(button => {button.classList.remove("inactive", "highlighted-more"); button.classList.add("active"); button.innerHTML="Read more"});
            showMore.forEach(moreText => {moreText.style.display = "none"});
            showOthers.forEach(moreText => {moreText.style.display = "none"});
            nav.forEach(nav => {nav.classList.remove("test")});
        }

        else {
            buttons.forEach(button => {button.classList.remove("active"); button.classList.add("inactive")});
            otherbuttons.forEach(button => {button.classList.remove("active"); button.classList.add("inactive")});
            showMore.forEach(moreText => {moreText.style.display = "block"});
            showOthers.forEach(moreText => {moreText.style.display = "block"});
            Array.from(document.querySelectorAll("span.more-other")).forEach(span => {span.style.display = "inline"});
        }
    }