function navEventListener() {
    document.querySelectorAll("nav a").forEach(x => x.addEeventListener("click", _ => JS_PageLoading(x.dataset.id)))
};

function JS_PageLoading() {
    let pages = document.querySelectorAll("div article")
    pages.forEach(y => y.classList.remove("active"))
    pages[n-1].classList.add("active")
}