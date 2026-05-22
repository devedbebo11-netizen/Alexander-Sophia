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

// ================= خريطة المتاهة الحسابية الصارمة =================
// 25 مربع مبنيين بنظام الـ الحدود المغلقة والمفتوحة (ممر سالك ومضمون)
const mazeData = [
    { r:0, c:0, top:false, bottom:false, left:false, right:true },
    { r:0, c:1, top:false, bottom:true,  left:true,  right:false },
    { r:0, c:2, top:false, bottom:false, left:false, right:true },
    { r:0, c:3, top:false, bottom:true,  left:true,  right:false },
    { r:0, c:4, top:false, bottom:false, left:false, right:false },

    { r:1, c:0, top:false, bottom:false, left:false, right:true },
    { r:1, c:1, top:true,  bottom:false, left:true,  right:false },
    { r:1, c:2, top:false, bottom:true,  left:false, right:false },
    { r:1, c:3, top:true,  bottom:false, left:false, right:true },
    { r:1, c:4, top:false, bottom:false, left:true,  right:false },

    { r:2, c:0, top:false, bottom:false, left:false, right:true },
    { r:2, c:1, top:false, bottom:true,  left:true,  right:false },
    { r:2, c:2, top:true,  bottom:false, left:false, right:true },
    { r:2, c:3, top:false, bottom:false, left:true,  right:false },
    { r:2, c:4, top:false, bottom:true,  left:false, right:false },

    { r:3, c:0, top:false, bottom:false, left:false, right:true },
    { r:3, c:1, top:true,  bottom:false, left:true,  right:false },
    { r:3, c:2, top:false, bottom:false, left:false, right:true },
    { r:3, c:3, top:false, bottom:true,  left:true,  right:false },
    { r:3, c:4, top:true,  bottom:false, left:false, right:false },

    { r:4, c:0, top:false, bottom:false, left:false, right:false },
    { r:4, c:1, top:false, bottom:false, left:false, right:true },
    { r:4, c:2, top:false, bottom:false, left:true,  right:false },
    { r:4, c:3, top:true,  bottom:false, left:false, right:true },
    { r:4, c:4, top:false, bottom:false, left:true,  right:false }
];

let groomGrid = { r: 0, c: 0 }; 
let brideGrid = { r: 4, c: 4 }; 

const board = document.getElementById('maze-board');
board.innerHTML = ""; 

// بناء المربعات وحقن حوائطها
mazeData.forEach(cell => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    if (cell.top) cellEl.classList.add('w-top');
    if (cell.bottom) cellEl.classList.add('w-bottom');
    if (cell.left) cellEl.classList.add('w-left');
    if (cell.right) cellEl.classList.add('w-right');
    
    cellEl.setAttribute('id', `cell-${cell.r}-${cell.c}`);
    board.appendChild(cellEl);
});

// إنشاء العناصر
const groomEl = document.createElement('div');
groomEl.id = 'groom';
groomEl.className = 'player-inside groom-img';

const brideEl = document.createElement('div');
brideEl.id = 'bride';
brideEl.className = 'target-inside bride-img';

function renderPlayers() {
    const groomCell = document.getElementById(`cell-${groomGrid.r}-${groomGrid.c}`);
    const brideCell = document.getElementById(`cell-${brideGrid.r}-${brideGrid.c}`);
    
    if(groomCell) groomCell.appendChild(groomEl);
    if(brideCell) brideCell.appendChild(brideEl);
}
renderPlayers();

// فحص الحوائط المعتمد على حدود المربعات الحقيقية (مستحيل يخترق)
function moveGroom(dir) {
    const currentCell = mazeData.find(cell => cell.r === groomGrid.r && cell.c === groomGrid.c);
    
    if (dir === 'up') {
        if (groomGrid.r === 0 || currentCell.top) return;
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r - 1 && cell.c === groomGrid.c);
        if (nextCell && nextCell.bottom) return;
        groomGrid.r--;
    }
    if (dir === 'down') {
        if (groomGrid.r === 4 || currentCell.bottom) return;
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r + 1 && cell.c === groomGrid.c);
        if (nextCell && nextCell.top) return;
        groomGrid.r++;
    }
    if (dir === 'left') {
        if (groomGrid.c === 0 || currentCell.left) return;
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r && cell.c === groomGrid.c - 1);
        if (nextCell && nextCell.right) return;
        groomGrid.c--;
    }
    if (dir === 'right') {
        if (groomGrid.c === 4 || currentCell.right) return;
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r && cell.c === groomGrid.c + 1);
        if (nextCell && nextCell.left) return;
        groomGrid.c++;
    }

    renderPlayers();
    checkWin();
}

window.addEventListener('keydown', (e) => {
    if(document.getElementById('screen2').style.display === 'block') {
        if(e.key === 'ArrowUp' || e.key === 'w') moveGroom('up');
        if(e.key === 'ArrowDown' || e.key === 's') moveGroom('down');
        if(e.key === 'ArrowLeft' || e.key === 'a') moveGroom('left');
        if(e.key === 'ArrowRight' || e.key === 'd') moveGroom('right');
    }
});

function checkWin() {
    if (groomGrid.r === brideGrid.r && groomGrid.c === brideGrid.c) {
        document.getElementById('maze-success').style.display = 'flex';
    }
}

function revealLowerContent() {
    document.getElementById('maze-success').style.display = 'none';
    const hiddenDetails = document.getElementById('hidden-details');
    hiddenDetails.style.display = 'block';
    setTimeout(() => { hiddenDetails.style.opacity = '1'; }, 50);
    startCountdown();
}

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
            document.getElementById("countdown-clock").innerHTML = "<div>The Celebration Has Begun!</div>";
        }
    }, 1000);
}