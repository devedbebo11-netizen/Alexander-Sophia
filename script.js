function openEnvelope(event) {
    event.stopPropagation();
    document.getElementById('envelope').classList.toggle('open');
}

function goToInvitation(event) {
    event.stopPropagation();
    document.getElementById('screen1').style.display = 'none';
    document.getElementById('screen2').style.display = 'block';
    window.scrollTo(0, 0);
}

// ================= نظام المتاهة المفتوح والسهل للحل =================
const boardSize = 240;
const step = 24; 

// تم تعديل نقاط البداية والنهاية عشان تكون متناسقة داخل المربعات بالظبط
let groomPos = { x: 2, y: 2 };       
let bridePos = { x: 218, y: 218 };   

// جدران المتاهة المفتوحة (تمت مراجعتها عشان تفتح ممرات حقيقية وعريضة للحركة)
const lines = [
    {x: 48, y: 0, w: 2, h: 48},
    {x: 48, y: 96, w: 2, h: 72},
    {x: 96, y: 48, w: 2, h: 48},
    {x: 96, y: 144, w: 2, h: 48},
    {x: 144, y: 0, w: 2, h: 96},
    {x: 192, y: 48, w: 2, h: 120},
    
    {x: 0, y: 48, w: 48, h: 2},
    {x: 48, y: 96, w: 48, h: 2},
    {x: 96, y: 48, w: 48, h: 2},
    {x: 0, y: 144, w: 48, h: 2},
    {x: 144, y: 144, w: 48, h: 2},
    {x: 48, y: 192, w: 120, h: 2}
];

const board = document.getElementById('maze-board');
lines.forEach(l => {
    const lineEl = document.createElement('div');
    lineEl.className = 'maze-line';
    lineEl.style.left = l.x + 'px';
    lineEl.style.top = l.y + 'px';
    lineEl.style.width = l.w + 'px';
    lineEl.style.height = l.h + 'px';
    board.appendChild(lineEl);
});

function updatePositions() {
    document.getElementById('groom').style.left = groomPos.x + 'px';
    document.getElementById('groom').style.top = groomPos.y + 'px';
    document.getElementById('bride').style.left = bridePos.x + 'px';
    document.getElementById('bride').style.top = bridePos.y + 'px';
}
updatePositions();

// فحص تصادم دقيق ومرن يسمح بمرور العريس من الفتحات
function isColliding(nextX, nextY) {
    // منع الخروج برا الصندوق الأساسي للمتاهة
    if (nextX < 0 || nextX + 20 > boardSize || nextY < 0 || nextY + 20 > boardSize) return true;
    
    // فحص عدم تخطي الخطوط
    for (let l of lines) {
        if (l.w > l.h) { // خط أفقي
            if (nextX < l.x + l.w && nextX + 20 > l.x && nextY < l.y + 2 && nextY + 20 > l.y - 2) {
                return true;
            }
        } else { // خط رأسي
            if (nextX < l.x + 2 && nextX + 20 > l.x - 2 && nextY < l.y + l.h && nextY + 20 > l.y) {
                return true;
            }
        }
    }
    return false;
}

function moveGroom(dir) {
    let nextX = groomPos.x;
    let nextY = groomPos.y;

    if (dir === 'up') nextY -= step;
    if (dir === 'down') nextY += step;
    if (dir === 'left') nextX -= step;
    if (dir === 'right') nextX += step;

    if (!isColliding(nextX, nextY)) {
        groomPos.x = nextX;
        groomPos.y = nextY;
        updatePositions();
        checkWin();
    }
}

// تشغيل التحكم بأسهم الكيبورد للكمبيوتر فوراً
window.addEventListener('keydown', (e) => {
    if(document.getElementById('screen2').style.display === 'block') {
        if(e.key === 'ArrowUp' || e.key === 'w') moveGroom('up');
        if(e.key === 'ArrowDown' || e.key === 's') moveGroom('down');
        if(e.key === 'ArrowLeft' || e.key === 'a') moveGroom('left');
        if(e.key === 'ArrowRight' || e.key === 'd') moveGroom('right');
    }
});

function checkWin() {
    // تصفير نسبة الخطأ في التلامس بين العريس والعروسة
    if (Math.abs(groomPos.x - bridePos.x) < 10 && Math.abs(groomPos.y - bridePos.y) < 10) {
        document.getElementById('maze-success').style.display = 'flex';
    }
}

// دالة إظهار المحتوى المخفي بالكامل تحت المتاهة
function revealLowerContent() {
    document.getElementById('maze-success').style.display = 'none';
    const hiddenDetails = document.getElementById('hidden-details');
    hiddenDetails.style.display = 'block';
    setTimeout(() => { hiddenDetails.style.opacity = '1'; }, 50);
    startCountdown();
}

// تشغيل العداد التنازلي
function startCountdown() {
    const weddingDate = new Date("August 13, 2026 18:00:00").getTime();
    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(interval);
            document.getElementById("countdown-clock").innerHTML = "<div style='color:var(--gold)'>The Celebration Has Begun!</div>";
        }
    }, 1000);
}