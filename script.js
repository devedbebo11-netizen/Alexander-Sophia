// ميكانيكية فتح الظرف
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

// ================= نظام المتاهة والفيزياء الحقيقية =================
const boardSize = 240;
const step = 24; // حجم الخطوة متناسق مع حجم اللاعب

let groomPos = { x: 0, y: 0 };
let bridePos = { x: 216, y: 216 }; // الزاوية المقابلة

// مصفوفة الجدران المبنية هندسياً (زي المتاهة الحقيقية المقفولة اللي في الفيديو)
const blocks = [
    // جدران عمودية (Vertical)
    {x: 48, y: 0, w: 24, h: 96},
    {x: 120, y: 48, w: 24, h: 96},
    {x: 48, y: 144, w: 24, h: 96},
    {x: 168, y: 96, w: 24, h: 144},
    // جدران أفقية (Horizontal)
    {x: 96, y: 48, w: 96, h: 24},
    {x: 0, y: 144, w: 96, h: 24},
    {x: 144, y: 144, w: 48, h: 2}
];

// رسم جدران المتاهة في الـ DOM
const board = document.getElementById('maze-board');
blocks.forEach(b => {
    const blockEl = document.createElement('div');
    blockEl.className = 'maze-block';
    blockEl.style.left = b.x + 'px';
    blockEl.style.top = b.y + 'px';
    blockEl.style.width = b.w + 'px';
    blockEl.style.height = b.h + 'px';
    board.appendChild(blockEl);
});

function updatePositions() {
    document.getElementById('groom').style.left = groomPos.x + 'px';
    document.getElementById('groom').style.top = groomPos.y + 'px';
    document.getElementById('bride').style.left = bridePos.x + 'px';
    document.getElementById('bride').style.top = bridePos.y + 'px';
}
updatePositions();

// دالة فحص التصادم الحقيقي (تمنع تخطي الجدران تماماً)
function isColliding(nextX, nextY) {
    // الخروج عن حدود الصندوق
    if (nextX < 0 || nextX >= boardSize || nextY < 0 || nextY >= boardSize) return true;
    
    // التداخل مع جدران المتاهة
    for (let b of blocks) {
        if (nextX < b.x + b.w && nextX + 20 > b.x && nextY < b.y + b.h && nextY + 20 > b.y) {
            return true; 
        }
    }
    return false;
}

// دالة الحركة عن طريق الأزرار أو الكيبورد
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

// دعم الكيبورد للكمبيوتر
window.addEventListener('keydown', (e) => {
    if(document.getElementById('screen2').style.display === 'block') {
        if(e.key === 'ArrowUp' || e.key === 'w') moveGroom('up');
        if(e.key === 'ArrowDown' || e.key === 's') moveGroom('down');
        if(e.key === 'ArrowLeft' || e.key === 'a') moveGroom('left');
        if(e.key === 'ArrowRight' || e.key === 'd') moveGroom('right');
    }
});

// التحقق من الوصول للعروسة
function checkWin() {
    if (groomPos.x === bridePos.x && groomPos.y === bridePos.y) {
        document.getElementById('maze-success').style.display = 'flex';
    }
}

// إظهار بقية المحتوى بعد الفوز
function revealLowerContent() {
    document.getElementById('maze-success').style.display = 'none';
    document.getElementById('hidden-details').style.display = 'block';
    startCountdown();
}

// ================= العداد التنازلي الحقيقي =================
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