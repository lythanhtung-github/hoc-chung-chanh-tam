/* =======================
   STATE
======================= */
let currentYear = Constant.EMPTY;
let searchQuery = Constant.EMPTY;
let sortType = Constant.NONE;

/* =======================
   INIT
======================= */
window.onload = async () => {
    await renderTabs();
    initLotusEffect();
};

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
        btn.className = getTabClass(index === 0);

        btn.onclick = async () => {
            currentYear = year;
            setActiveTab(btn);
            await updateDisplay();
        };

        container.appendChild(btn);
    });

    currentYear = years[0];
    await updateDisplay();
}

function getTabClass(isActive) {
    return `tab-btn px-8 py-3 rounded-xl border border-transparent font-bold
            text-stone-600 hover:text-orange-600 ${isActive ? "active" : ""}`;
}

function setActiveTab(activeBtn) {
    document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));

    activeBtn.classList.add("active");
}

/* =======================
   RENDER MEMBERS
======================= */
async function updateDisplay() {
    const grid = document.getElementById("member-grid");
    grid.innerHTML = Constant.EMPTY;

    let members = await MemberService.getMembersByYear(currentYear);

    members = applySearch(members);
    members = applySort(members);

    if (!members.length) {
        grid.innerHTML = getEmptyTemplate();
        return;
    }

    grid.innerHTML = members.map(renderMemberCard).join("");
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
