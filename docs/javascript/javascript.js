function navEventListener() {
    document.querySelectorAll("nav a").forEach(nav_row => nav_row.addEventListener("click", _ => {JS_NavLoading(nav_row.dataset.id); JS_PageLoading(nav_row.dataset.id)}));
};

function JS_NavLoading(nav_id) {
    let pages = document.querySelectorAll("div.active, div.inactive");
    console.log(pages);
    pages.forEach(page => {page.classList.remove("active"); page.classList.add("inactive")});
    pages[nav_id - 1].classList.remove("inactive");
    pages[nav_id - 1].classList.add("active")
};

function JS_PageLoading(nav_id) {
    let pages = document.querySelectorAll("article.active, article.inactive");
    console.log(pages);
    pages.forEach(page => {page.classList.remove("active"); page.classList.add("inactive")});
    pages[nav_id - 1].classList.remove("inactive");
    pages[nav_id - 1].classList.add("active")
};

navEventListener();