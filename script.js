// --- 1. 時間功能 ---
function updateTime() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    if (clockEl && dateEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString('zh-TW', { hour12: false });
        dateEl.innerText = now.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' });
    }
}
setInterval(updateTime, 1000); updateTime();

// --- 2. 常用網站生成 (優化：增加 null 檢查) ---
const myLinks = [
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'Twitch', url: 'https://www.twitch.tv' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Pixiv', url: 'https://www.pixiv.net' },
    { name: 'Gemini', url: 'https://gemini.google.com' },
    { name: 'Anime', url: 'https://ani.gamer.com.tw' },
    { name: 'Threads', url: 'https://www.threads.com' },
    { name: 'susFries', url: 'https://sites.google.com/view/osufries' },
    { name: 'osu!', url: 'https://osu.ppy.sh' },
    { name: 'Bilibili', url: 'https://www.bilibili.com' }
];

const linksGrid = document.getElementById('links-grid');
if (linksGrid) {
    linksGrid.innerHTML = '';
    myLinks.forEach(link => {
        const domain = new URL(link.url).hostname;
        const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
        linksGrid.innerHTML += `
            <a href="${link.url}" class="link-item" target="_blank">
                <img src="${iconUrl}" class="link-icon" onerror="this.src='https://www.google.com/s2/favicons?sz=64&domain=google.com'">
                <span>${link.name}</span>
            </a>`;
    });
}

// --- 3. 音樂播放器邏輯 (核心修復) ---
let player;
const playlist = ['C-CYwNz3z8w', '8Cm-7oCq9HA', 'BI9Ue6JwJic', 'OSeSYGiDf9w', 'kqj7b59D85Y']; 
let currentTrack = 0;
let playerReady = false; // 新增：用來判斷 player 是否準備好

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-audio-player', {
        height: '0', width: '0',
        videoId: playlist[currentTrack],
        playerVars: { 'autoplay': 1, 'controls': 0 },
        events: {
            'onReady': (e) => { 
                playerReady = true; // 標記為已就緒
                e.target.setVolume(50); 
                document.getElementById('music-title').innerText = "音樂已就緒，請點擊播放"; 
            },
            'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) nextMusic(); }
        }
    });
}

// 統一的播放/暫停控制函式 (避免直接在 HTML 讀取 player 物件)
function playMusic() {
    if (playerReady && player) {
        player.playVideo();
        document.getElementById('music-title').innerText = "BGM 播放中...";
    } else {
        console.warn("播放器尚未準備好");
    }
}

function pauseMusic() {
    if (playerReady && player) player.pauseVideo();
}

function nextMusic() {
    if (playerReady && player) {
        currentTrack = (currentTrack + 1) % playlist.length;
        player.loadVideoById(playlist[currentTrack]);
    }
}

function toggleMusicBar() {
    const bar = document.getElementById('music-bar');
    const btn = document.querySelector('.music-btn-toggle');
    if (!bar || !btn) return;

    bar.classList.toggle('active');
    
    if (bar.classList.contains('active')) {
        btn.innerText = "❌ 關閉面板";
        btn.style.bottom = "90px";
        playMusic(); // 開啟時自動嘗試播放
    } else {
        btn.innerText = "🎵 播放音樂";
        btn.style.bottom = "30px";
    }
}

// --- 4. 推薦影片彈窗 ---
function playVideo(id) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-player');
    if (modal && iframe) {
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        modal.style.display = 'flex';
    }
}
function closeVideo() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-player');
    if (modal && iframe) {
        modal.style.display = 'none';
        iframe.src = '';
    }
}
