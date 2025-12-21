/* =======================
    STATE
======================= */
let currentYear = Constant.EMPTY;
let searchQuery = Constant.EMPTY;
let sortType = Constant.NONE;
let player; // YouTube player object
let currentPage = 1;

/* =======================
    INIT
======================= */
window.onload = async () => {
    await renderTabs();
    initLotusEffect();
    initMusic();
};

/* =======================
    MUSIC LOGIC
======================= */
function initMusic() {
    const audio = document.getElementById("bg-music");
    const btn = document.getElementById("music-toggle");

    btn.onclick = () => {
        if (audio.paused) {
            audio.play();
            updateMusicUI(true);
        } else {
            audio.pause();
            updateMusicUI(false);
        }
    };
}

function updateMusicUI(isPlaying) {
    const icon = document.getElementById("music-icon");
    const tooltip = document.getElementById("music-tooltip");

    if (isPlaying) {
        icon.classList.add("music-pulse");
        tooltip.textContent = "Tắt nhạc thiền";
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
        `;
    } else {
        icon.classList.remove("music-pulse");
        tooltip.textContent = "Bật nhạc thiền";
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
        `;
    }
}

/* =======================
    RENDER TABS
======================= */
async function renderTabs() {
    const container = document.getElementById("tabs-container");
    const years = MemberService.getAllYears();
    container.innerHTML = Constant.EMPTY;
    if (!years.length) return;

    years.forEach((year, index) => {
        const btn = document.createElement("button");
        btn.innerText = year;
        btn.className = `tab-btn px-8 py-3 rounded-xl border border-transparent font-bold text-stone-600 hover:text-orange-600 transition-all ${index === 0 ? "active" : ""}`;
        btn.onclick = async () => {
            currentYear = year;
            currentPage = 1;
            document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            await updateDisplay();
        };
        container.appendChild(btn);
    });
    currentYear = years[0];
    await updateDisplay();
}

/* =======================
    RENDER MEMBERS WITH PAGINATION
======================= */
async function updateDisplay() {
    const grid = document.getElementById("member-grid");
    const paginContainer = document.getElementById("pagination");
    grid.innerHTML = Constant.EMPTY;
    paginContainer.innerHTML = Constant.EMPTY;

    let members = await MemberService.getMembersByYear(currentYear);
    console.log(members)
    members = applySearch(members);
    members = applySort(members);

    if (!members.length) {
        grid.innerHTML = getEmptyTemplate();
        return;
    }

    // Phân trang
    const totalPages = Math.ceil(members.length / Constant.ITEMS_PER_PAGE);
    const start = (currentPage - 1) * Constant.ITEMS_PER_PAGE;
    const paginatedItems = members.slice(
        start,
        start + Constant.ITEMS_PER_PAGE
    );

    grid.innerHTML = paginatedItems.map(renderMemberCard).join("");

    if (totalPages > 1) {
        renderPaginationUI(totalPages);
    }
}

function renderPaginationUI(totalPages) {
    const container = document.getElementById("pagination");
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = `page-link w-10 h-10 rounded-lg border border-orange-200 flex items-center justify-center font-bold text-sm transition-all hover:bg-orange-50 ${
            i === currentPage ? "active" : "bg-white text-stone-600"
        }`;
        btn.onclick = async () => {
            currentPage = i;
            window.scrollTo({ top: 0, behavior: "smooth" });
            await updateDisplay();
        };
        container.appendChild(btn);
    }
}

/* =======================
   HELPERS
======================= */
function applySearch(members) {
    if (!searchQuery) return members;

    return members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

function applySort(members) {
    if (sortType === "name-asc") {
        return [...members].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }

    if (sortType === "name-desc") {
        return [...members].sort((a, b) => b.name.localeCompare(a.name, "vi"));
    }

    return members;
}

function renderMemberCard(m) {
    return `
        <div class="profile-card fade-in">
            <div class="image-outer">
                <img src="${m.img}" alt="${m.name}" class="profile-img">
            </div>
            <h2 class="text-lg font-bold text-stone-800 mb-1">${m.name}</h2>
            <p class="text-[10px] text-stone-500 mb-2">${m.info}</p>
            <span class="bg-tag px-2 py-0.5 rounded-full text-[10px] font-bold">
                ${m.tag}
            </span>
            <p class="text-stone-500 text-xs italic mt-2">
                "${m.quote}"
            </p>
        </div>
    `;
}

function getEmptyTemplate() {
    return `
        <div class="col-span-full py-20 text-center text-stone-400 italic">
            Không tìm thấy thành viên nào phù hợp...
        </div>
    `;
}

/* =======================
   EVENTS
======================= */
document.getElementById("search-input").addEventListener("input", async (e) => {
    searchQuery = e.target.value;
    await updateDisplay();
});

document.getElementById("sort-select").addEventListener("change", async (e) => {
    sortType = e.target.value;
    await updateDisplay();
});

/* =======================
   LOTUS EFFECT
======================= */
function initLotusEffect() {
    setInterval(createLotus, 1500);
    for (let i = 0; i < 5; i++) {
        setTimeout(createLotus, i * 500);
    }
}

function createLotus() {
    const lotus = document.createElement("div");
    lotus.className = "lotus-particle";

    lotus.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 100 100">
            <path d="M50 10C50 10 35 40 10 50
                     C35 60 50 90 50 90
                     C50 90 65 60 90 50
                     C65 40 50 10 50 10Z"
                  fill="#fdba74" opacity="0.6"/>
            <circle cx="50" cy="50" r="10"
                    fill="#fb923c" opacity="0.4"/>
        </svg>
    `;

    lotus.style.left = Math.random() * 100 + "vw";
    const size = Math.random() * 20 + 20;
    lotus.style.width = size + "px";
    lotus.style.animationDuration = Math.random() * 5 + 8 + "s";

    document.body.appendChild(lotus);
    setTimeout(() => lotus.remove(), 10000);
}
