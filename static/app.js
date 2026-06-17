import { CodeJar } from "/lib/codejar.min.js";

const pageCache = new Map();

const getSavedTheme = () => {
    try {
        const val = localStorage.getItem("hugo-geekdoc.color-theme");
        return val ? JSON.parse(val) : "auto";
    } catch (e) {
        return "auto";
    }
};

const applyTheme = (theme) => {
    let targetTheme = theme;
    if (theme === "auto") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        targetTheme = isDark ? "dark" : "light";
    }
    document.documentElement.setAttribute("color-theme", targetTheme);
    document.documentElement.setAttribute("class", "color-toggle-" + theme);
    const themeBgColor = targetTheme === "dark" ? "#1e2029" : "#ffffff";
    let metaTheme = document.getElementById("meta-theme-color");
    if (!metaTheme) {
        metaTheme = document.createElement("meta");
        metaTheme.id = "meta-theme-color";
        metaTheme.name = "theme-color";
        document.head.appendChild(metaTheme);
    }
    metaTheme.content = themeBgColor;
};

const bindThemeToggle = () => {
    const oldButton = document.getElementById("gdoc-color-theme");
    if (!oldButton) return;

    const newButton = oldButton.cloneNode(true);
    oldButton.parentNode.replaceChild(newButton, oldButton);

    const toggleTheme = () => {
        const currentTheme = getSavedTheme();
        const themes = ["auto", "dark", "light"];
        const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        localStorage.setItem("hugo-geekdoc.color-theme", JSON.stringify(nextTheme));
        applyTheme(nextTheme);
    };

    newButton.addEventListener("click", toggleTheme);
    newButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            toggleTheme();
            e.preventDefault();
        }
    });
};

const prefetchPage = async (url) => {
    if (pageCache.has(url)) return;
    try {
        const res = await fetch(url);
        const html = await res.text();
        pageCache.set(url, html);
    } catch (e) { }
};

const initAllPlaygrounds = () => {
    document.querySelectorAll('[id^="stdin-"]').forEach(el => {
        if (el.dataset.initialized) return;
        el.dataset.initialized = "true";
        const id = el.id.replace("stdin-", "");
        initPlayground(id);
    });
};

const highlightNonPlaygrounds = () => {
    if (typeof Prism !== 'undefined') {
        document.querySelectorAll("pre code[class*='language-']:not([id^='stdin-'])").forEach(el => {
            Prism.highlightElement(el);
        });
    }
};

const bindCopyButtons = () => {
    document.querySelectorAll(".c3block button[id^='copy-']").forEach(btn => {
        if (btn.dataset.initialized) return;
        btn.dataset.initialized = "true";
        const id = btn.id.replace("copy-", "");
        const codeEl = document.getElementById("code-" + id);
        if (codeEl) {
            btn.addEventListener("click", () => {
                navigator.clipboard.writeText(codeEl.textContent);
                btn.classList.add("copied");
                const icon = btn.querySelector("div");
                icon.classList.remove("icon-copy");
                icon.classList.add("icon-check");
                setTimeout(() => {
                    btn.classList.remove("copied");
                    icon.classList.remove("icon-check");
                    icon.classList.add("icon-copy");
                }, 1500);
            });
        }
    });
};

const swapContent = (html, url) => {
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(html, "text/html");

    const currentContainer = document.querySelector(".wrapper");
    const newContainer = newDoc.querySelector(".wrapper");

    if (currentContainer && newContainer) {
        currentContainer.innerHTML = newContainer.innerHTML;
        document.title = newDoc.title;
        history.pushState({}, "", url);
        window.scrollTo({ top: 0 });

        bindThemeToggle();
        highlightNonPlaygrounds();
        bindCopyButtons();
        initAllPlaygrounds();
    } else {
        window.location.href = url;
    }
};

try {
    const theme = getSavedTheme();
    applyTheme(theme);
} catch (e) { }

document.addEventListener("DOMContentLoaded", () => {
    bindThemeToggle();
    initAllPlaygrounds();
    highlightNonPlaygrounds();
    bindCopyButtons();
});

document.addEventListener("mouseover", (e) => {
    const link = e.target.closest("a");
    if (!link || !link.href) return;

    const url = new URL(link.href);
    if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
        prefetchPage(link.href);
    }
});

document.addEventListener("click", async (e) => {
    const link = e.target.closest("a");
    if (!link || !link.href) return;

    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();

    if (pageCache.has(link.href)) {
        swapContent(pageCache.get(link.href), link.href);
    } else {
        try {
            const res = await fetch(link.href);
            const html = await res.text();
            pageCache.set(link.href, html);
            swapContent(html, link.href);
        } catch (err) {
            window.location.href = link.href;
        }
    }
});

window.addEventListener("popstate", async () => {
    const currentUrl = window.location.href;
    if (pageCache.has(currentUrl)) {
        swapContent(pageCache.get(currentUrl), currentUrl);
    } else {
        window.location.reload();
    }
});

export function initPlayground(id) {
    const STDOUT = document.getElementById(`stdout-${id}`);
    const STDIN = document.getElementById(`stdin-${id}`);
    const defcod = document.getElementById(`defcod-${id}`).textContent.trim();
    let editor = CodeJar(STDIN, (e) => Prism.highlightElement(e, false), { tab: '\t' });
    editor.updateCode(defcod);
    STDIN.style.opacity = "1";
    const trim_newline = (str) => str.endsWith("\n") ? str.slice(0, -1) : str;

    $(`#clear-${id}`).click(() => {
        const clearBtn = $(`#clear-${id}`);
        clearBtn.addClass("clearing");
        setTimeout(() => clearBtn.removeClass("clearing"), 300);
        STDOUT.textContent = "";
        STDOUT.hidden = true;
        editor.updateCode('');
    });

    $(`#reset-${id}`).click(() => {
        const resetBtn = $(`#reset-${id}`);
        resetBtn.addClass("resetting");
        setTimeout(() => resetBtn.removeClass("resetting"), 600);
        editor.updateCode(defcod);
        STDOUT.textContent = "";
        STDOUT.hidden = true;
    });

    $(`#copy-${id}`).click(() => {
        navigator.clipboard.writeText(editor.toString());
        const copyBtn = $(`#copy-${id}`);
        const icon = copyBtn.find("div");
        copyBtn.addClass("copied");
        icon.removeClass("icon-copy").addClass("icon-check");
        setTimeout(() => {
            copyBtn.removeClass("copied");
            icon.removeClass("icon-check").addClass("icon-copy");
        }, 1500);
    });

    $(`#run-${id}`).click(() => {
        const runBtn = $(`#run-${id}`);
        runBtn.addClass("running");
        STDOUT.classList.remove("stderr");
        STDOUT.hidden = false;
        STDOUT.style.height = "";
        STDOUT.textContent = "Processing...";
        STDOUT.style.height = STDOUT.scrollHeight + "px";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.learn-c3.org/");
        xhr.responseType = "json";
        xhr.send(JSON.stringify({ c: editor.toString() }));
        xhr.onload = () => {
            const res = xhr.response;
            if (res.compile.stderr != "") {
                STDOUT.classList.add("stderr");
                STDOUT.innerHTML = trim_newline(res.compile.stderr);
            } else {
                STDOUT.classList.remove("stderr");
                STDOUT.innerHTML = trim_newline(res.run.output);
            }
            STDOUT.style.height = STDOUT.scrollHeight + "px";
            runBtn.removeClass("running");
        }
    });
}
