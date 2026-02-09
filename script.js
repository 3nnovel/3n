// --- 1. GLOBAL STATE (Conflict-Free) ---
window.currentUser = localStorage.getItem('logged_user') || null;
window.isPremium = localStorage.getItem('3n_premium') === 'true';

const defaultDB = {
    "Solo Leveling": {
        img: "https://m.media-amazon.com/images/I/81L9D8+K6JL._AC_UF1000,1000_QL80_.jpg",
        freeLimit: 2,
        chapters: ["Chapter 1: The Awakening", "Chapter 2: The Trial", "Chapter 3: [LOCKED] System Error"]
    }
};

window.db = JSON.parse(localStorage.getItem('3N_MASTER_DB')) || defaultDB;
window.activeNovel = "";
window.activeIndex = 0;

// --- 2. INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    updateUIState();
    renderHome();
});

function updateUIState() {
    const authBtn = document.getElementById('authBtn');
    const userStatus = document.getElementById('userStatus');
    
    if (window.currentUser && authBtn) {
        authBtn.innerText = "LOGOUT";
        authBtn.onclick = logout;
    }

    if (window.isPremium && userStatus) {
        userStatus.innerText = "PREMIUM HUNTER";
        userStatus.style.color = "#ffcc00";
    }
}

// --- 3. RENDERING ---
function renderHome() {
    const grid = document.getElementById('mainGrid');
    if (!grid) return;

    grid.innerHTML = Object.keys(window.db).map(name => `
        <div class="novel-card" onclick="openReader('${name}')">
            <img src="${window.db[name].img || 'https://via.placeholder.com/300x450'}">
            <div class="card-overlay">
                <h3>${name}</h3>
                <p>Free Chapters: ${window.db[name].freeLimit}</p>
            </div>
        </div>
    `).join('');
}

// --- 4. ADMIN PORTAL (Fix) ---
function toggleAdmin() {
    const panel = document.getElementById('admin-panel');
    if(panel) {
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
        panel.scrollIntoView({ behavior: 'smooth' });
    }
}

function publishNovel() {
    const name = document.getElementById('admName').value.trim();
    const limit = parseInt(document.getElementById('admLimit').value) || 2;
    const text = document.getElementById('admText').value.trim();

    if (!name || !text) return alert("Pura data bhariye!");

    if (!window.db[name]) {
        window.db[name] = { img: "", freeLimit: limit, chapters: [] };
    }
    window.db[name].chapters.push(text);
    
    localStorage.setItem('3N_MASTER_DB', JSON.stringify(window.db));
    alert("Novel Published Successfully!");
    location.reload();
}

// --- 5. READER & AUTH ---
function openReader(name) {
    if (!window.currentUser) return openAuth();
    window.activeNovel = name;
    window.activeIndex = 0;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('reader-view').style.display = 'block';
    updateContent();
}

function updateContent() {
    const contentBox = document.getElementById('rContent');
    const limit = window.db[window.activeNovel].freeLimit;
    
    if (window.activeIndex >= limit && !window.isPremium) {
        contentBox.innerHTML = `<div class="lock-container"><h2>LOCKED</h2><button class="btn btn-gold" onclick="buyMembership()">UPGRADE</button></div>`;
    } else {
        contentBox.innerText = window.db[window.activeNovel].chapters[window.activeIndex];
    }
}

function openAuth() { document.getElementById('auth-modal').style.display = 'flex'; }
function closeAuth() { document.getElementById('auth-modal').style.display = 'none'; }
function handleAuth() {
    const email = document.getElementById('userEmail').value;
    localStorage.setItem('logged_user', email);
    location.reload();
}
function logout() { localStorage.removeItem('logged_user'); location.reload(); }
function buyMembership() { localStorage.setItem('3n_premium', 'true'); location.reload(); }
