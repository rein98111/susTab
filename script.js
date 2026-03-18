function updateTime() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('zh-TW', { hour12: false });
    document.getElementById('date').innerText = now.toLocaleDateString('zh-TW');
}

// 每秒更新時間
setInterval(updateTime, 1000);
updateTime();

// 氣溫部分可以串接 OpenWeather API，或暫時手動輸入
document.getElementById('weather').innerText = "桃園市 22°C";
