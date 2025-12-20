let currentYear = '';
let searchQuery = '';
let sortType = 'none';

function renderTabs() {
    const container = document.getElementById('tabs-container');
    const years = MemberService.getAllYears();
    container.innerHTML = '';

    years.forEach((year, index) => {
        const btn = document.createElement('button');
        btn.innerText = year;
        btn.className = `tab-btn px-8 py-3 rounded-xl border border-transparent font-bold text-stone-600 hover:text-orange-600 ${index === 0 ? 'active' : ''}`;
        btn.onclick = (e) => {
            currentYear = year;
            filterYear(year, e.target);
        };
        container.appendChild(btn);
    });

    if (years.length > 0) {
        currentYear = years[0];
        updateDisplay();
    }
}

function updateDisplay() {
    const grid = document.getElementById('member-grid');
    grid.innerHTML = '';
    
    // Lấy một bản sao của mảng để tránh thay đổi dữ liệu gốc
    let members = [...MemberService.getMembersByYear(currentYear)];
    
    // Lọc theo tên (Search)
    if (searchQuery) {
        members = members.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sắp xếp (Sort)
    if (sortType === 'name-asc') {
        members.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortType === 'name-desc') {
        members.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
    }
    // Nếu sortType === 'none', chúng ta không làm gì vì mảng đã ở thứ tự ban đầu

    if (members.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-20 text-center text-stone-400 italic">
                Không tìm thấy thành viên nào phù hợp...
            </div>
        `;
        return;
    }

    members.forEach(m => {
        const card = `
            <div class="profile-card fade-in">
                <div class="image-outer">
                    <img src="${m.img}" alt="${m.name}" class="profile-img">
                </div>
                <h2 class="text-lg font-bold text-stone-800 mb-1 leading-tight">${m.name}</h2>
                <p class="text-[10px] text-stone-500 mb-2 font-medium">${m.info}</p>
                <span class="bg-tag px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                    ${m.tag}
                </span>
                <p class="text-stone-500 text-xs leading-relaxed text-center italic font-serif">
                    "${m.quote}"
                </p>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function filterYear(year, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateDisplay();
}

// Lắng nghe sự kiện tìm kiếm
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    updateDisplay();
});

// Lắng nghe sự kiện sắp xếp
document.getElementById('sort-select').addEventListener('change', (e) => {
    sortType = e.target.value;
    updateDisplay();
});

function createLotus() {
    const lotus = document.createElement('div');
    lotus.className = 'lotus-particle';
    lotus.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10C50 10 35 40 10 50C35 60 50 90 50 90C50 90 65 60 90 50C65 40 50 10 50 10Z" fill="#fdba74" opacity="0.6"/>
            <circle cx="50" cy="50" r="10" fill="#fb923c" opacity="0.4"/>
        </svg>
    `;
    lotus.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 20 + 20;
    lotus.style.width = size + 'px';
    const duration = Math.random() * 5 + 8;
    lotus.style.animationDuration = duration + 's';
    document.body.appendChild(lotus);
    setTimeout(() => lotus.remove(), duration * 1000);
}

window.onload = () => {
    renderTabs();
    setInterval(createLotus, 1500);
    for(let i=0; i<5; i++) setTimeout(createLotus, i * 500);
};