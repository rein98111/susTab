// --- 1. 時間與日期功能 ---
function updateTime() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    if (!clockEl || !dateEl) return;

    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString('zh-TW', { hour12: false });
    dateEl.innerText = now.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' });
}
setInterval(updateTime, 1000);
updateTime();

// --- 2. 常用網站生成 (修正排版歪掉的問題) ---
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
    linksGrid.innerHTML = ''; // 清空舊內容防止排版重疊
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

// --- 3. 自動天氣圖示 ---
async function getRealTimeWeather() {
    try {
        const response = await fetch('https://www.7timer.info/bin/astro.php?lon=121.2&lat=24.9&ac=0&unit=metric&output=json');
        const data = await response.json();
        const temp = data.dataseries[0].temp2m;
        const weatherType = data.dataseries[0].prec_type; 
        const sky = data.dataseries[0].cloudcover; 

        let emoji = "☀️";
        if (weatherType !== "none") emoji = "🌧️"; 
        else if (sky > 5) emoji = "☁️";
        else if (sky > 2) emoji = "⛅";

        const weatherEl = document.getElementById('weather');
        if (weatherEl) weatherEl.innerText = `桃園市 ${temp}°C ${emoji}`;
    } catch (error) {
        console.error("天氣獲取失敗", error);
    }
}
getRealTimeWeather();

// --- 4. 音樂播放器邏輯 (修正無法播放問題) ---
let player;
const playlist = ['C-CYwNz3z8w', '8Cm-7oCq9HA', 'BI9Ue6JwJic', 'OSeSYGiDf9w', 'kqj7b59D85Y'];
let currentTrack = 0;
let isApiReady = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-audio-player', {
        height: '0',
        width: '0',
        videoId: playlist[currentTrack],
        playerVars: { 
            'autoplay': 0, // 初始設為0，等用戶點擊按鈕再播
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onReady': (e) => { 
                isApiReady = true;
                e.target.setVolume(50); 
                document.getElementById('music-title').innerText = "音樂已就緒";
            },
            'onStateChange': (e) => { 
                if (e.data === YT.PlayerState.ENDED) nextMusic(); 
            }
        }
    });
}

function nextMusic() {
    currentTrack = (currentTrack + 1) % playlist.length;
    if (player && isApiReady) {
        player.loadVideoById(playlist[currentTrack]);
        document.getElementById('music-title').innerText = "正在播放新曲目...";
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
        // 關鍵：在用戶點擊開啟面板時，手動觸發播放
        if (player && isApiReady) {
            player.playVideo();
            document.getElementById('music-title').innerText = "BGM 播放中...";
        }
    } else {
        btn.innerText = "🎵 播放音樂";
        btn.style.bottom = "30px";
    }
}

// --- 5. 推薦影片彈窗 ---
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
