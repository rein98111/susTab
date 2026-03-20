// --- 1. 時間功能 ---
function updateTime() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('zh-TW', { hour12: false });
    document.getElementById('date').innerText = now.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' });
}
setInterval(updateTime, 1000); updateTime();

// --- 2. 常用網站生成 ---
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
myLinks.forEach(link => {
    const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(link.url).hostname}`;
    linksGrid.innerHTML += `
        <a href="${link.url}" class="link-item" target="_blank">
            <img src="${iconUrl}" class="link-icon">
            <span>${link.name}</span>
        </a>`;
});

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

        document.getElementById('weather').innerText = `桃園市 ${temp}°C ${emoji}`;
    } catch (error) {
        document.getElementById('weather').innerText = "桃園市 20°C ☁️";
    }
}
getRealTimeWeather();

// --- 4. 音樂播放器邏輯 ---
let player;
const playlist = ['C-CYwNz3z8w', '8Cm-7oCq9HA', 'BI9Ue6JwJic', 'OSeSYGiDf9w', 'kqj7b59D85Y']; // 可更換 ID
let currentTrack = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-audio-player', {
        height: '0', width: '0',
        videoId: playlist[currentTrack],
        playerVars: { 'autoplay': 1, 'controls': 0 },
        events: {
            'onReady': (e) => { e.target.setVolume(50); document.getElementById('music-title').innerText = "BGM 播放中..."; },
            'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) nextMusic(); }
        }
    });
}

function nextMusic() {
    currentTrack = (currentTrack + 1) % playlist.length;
    player.loadVideoById(playlist[currentTrack]);
}

function toggleMusicBar() {
    const bar = document.getElementById('music-bar');
    const btn = document.querySelector('.music-btn-toggle');
    bar.classList.toggle('active');
    
    if (bar.classList.contains('active')) {
        btn.innerText = "❌ 關閉面板";
        btn.style.bottom = "90px"; // 面板開啟時按鈕上移
    } else {
        btn.innerText = "🎵 播放音樂";
        btn.style.bottom = "30px";
    }
}

// --- 5. 推薦影片彈窗 ---
function playVideo(id) {
    document.getElementById('video-player').src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    document.getElementById('video-modal').style.display = 'flex';
}
function closeVideo() {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
}
