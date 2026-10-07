const copyButton = document.querySelector(".copy-email");
if (navigator.clipboard && copyButton) {
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
        const status = document.getElementById("copy-status");
        try {
            await navigator.clipboard.writeText("Stonecoleman4563@gmail.com");
            status.textContent = "Email address copied.";
        } catch {
            status.textContent = "Could not copy. Use the Email Me link instead.";
        }
        clearTimeout(window.copyNoticeTimer);
        window.copyNoticeTimer = setTimeout(() => { status.textContent = ""; }, 5000);
    });
}
// Measure the navigation so anchor links remain visible after text wraps.
const header = document.querySelector(".site-header");
if (header && "ResizeObserver" in window) {
    new ResizeObserver(() => {
        document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    }).observe(header);
}
