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

// ================= نظام المتاهة الحقيقي الحسابي الصارم =================
// مصفوفة الخرائط الـ 25 مربع المأخوذة من حيطان لقطة الشاشة الأصلية بالملي
const mazeData = [
    // الصف الأول (0 إلى 4)
    { r:0, c:0, top:true,  bottom:false, left:true,  right:false },
    { r:0, c:1, top:true,  bottom:true,  left:false, right:false },
    { r:0, c:2, top:true,  bottom:false, left:false, right:true  },
    { r:0, c:3, top:true,  bottom:false, left:true,  right:false },
    { r:0, c:4, top:true,  bottom:false, left:false, right:true  },
    // الصف الثاني (5 إلى 9)
    { r:1, c:0, top:false, bottom:false, left:true,  right:true  },
    { r:1, c:1, top:true,  bottom:false, left:true,  right:false },
    { r:1, c:2, top:false, bottom:true,  left:false, right:false },
    { r:1, c:3, top:false, bottom:true,  left:false, right:true  },
    { r:1, c:4, top:false, bottom:false, left:true,  right:true  },
    // الصف الثالث (10 إلى 14)
    { r:2, c:0, top:false, bottom:true,  left:true,  right:false },
    { r:2, c:1, top:false, bottom:true,  left:false, right:true  },
    { r:2, c:2, top:true,  bottom:false, left:true,  right:false },
    { r:2, c:3, top:true,  bottom:false, left:false, right:true  },
    { r:2, c:4, top:false, bottom:true,  left:true,  right:true  },
    // الصف الرابع (15 === 19)
    { r:3, c:0, top:true,  bottom:false, left:true,  right:true  },
    { r:3, c:1, top:true,  bottom:false, left:true,  right:false },
    { r:3, c:2, top:false, bottom:true,  left:false, right:true  },
    { r:3, c:3, top:false, bottom:false, left:true,  right:false },
    { r:3, c:4, top:true,  bottom:false, left:false, right:true  },
    // الصف الخامس (20 === 24)
    { r:4, c:0, top:false, bottom:true,  left:true,  right:false },
    { r:4, c:1, top:false, bottom:true,  left:false, right:true  },
    { r:4, c:2, top:true,  bottom:true,  left:true,  right:false },
    { r:4, c:3, top:false, bottom:true,  left:false, right:false },
    { r:4, c:4, top:false, bottom:true,  left:false, right:true  }
];

let groomGrid = { r: 0, c: 0 }; // يبدأ أعلى اليسار بالظبط
let brideGrid = { r: 4, c: 4 }; // العروسة أسفل اليمين بالظبط

const board = document.getElementById('maze-board');

// بناء الخلايا وحوائطها المضيئة ديناميكياً
mazeData.forEach(cell => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    if (cell.top) cellEl.classList.add('w-top');
    if (cell.bottom) cellEl.classList.add('w-bottom');
    if (cell.left) cellEl.classList.add('w-left');
    if (cell.right) cellEl.classList.add('w-right');
    
    cellEl.setAttribute('data-r', cell.r);
    cellEl.setAttribute('data-c', cell.c);
    board.appendChild(cellEl);
});

// حقن العريس والعروسة داخل الـ DOM
const groomEl = document.createElement('div');
groomEl.id = 'groom';
groomEl.className = 'player-inside groom-img';

const brideEl = document.createElement('div');
brideEl.id = 'bride';
brideEl.className = 'target-inside bride-img';

function renderPlayers() {
    // جلب المربعات الحالية ووضع الصور جواها
    const groomTargetCell = document.querySelector(`[data-r='${groomGrid.r}'][data-c='${groomGrid.c}']`);
    const brideTargetCell = document.querySelector(`[data-r='${brideGrid.r}'][data-c='${brideGrid.c}']`);
    
    if(groomTargetCell) groomTargetCell.appendChild(groomEl);
    if(brideTargetCell) brideTargetCell.appendChild(brideEl);
}
renderPlayers();

// فحص قفل الحوائط الحسابي الصارم لمنع اختراق الحوائط
function moveGroom(dir) {
    const currentCell = mazeData.find(cell => cell.r === groomGrid.r && cell.c === groomGrid.c);
    
    if (dir === 'up') {
        if (currentCell.top || groomGrid.r === 0) return; // حيطة سد
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r - 1 && cell.c === groomGrid.c);
        if (nextCell.bottom) return; 
        groomGrid.r--;
    }
    if (dir === 'down') {
        if (currentCell.bottom || groomGrid.r === 4) return; // حيطة سد
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r + 1 && cell.c === groomGrid.c);
        if (nextCell.top) return;
        groomGrid.r++;
    }
    if (dir === 'left') {
        if (currentCell.left || groomGrid.c === 0) return; // حيطة سد
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r && cell.c === groomGrid.c - 1);
        if (nextCell.right) return;
        groomGrid.c--;
    }
    if (dir === 'right') {
        if (currentCell.right || groomGrid.c === 4) return; // حيطة سد
        const nextCell = mazeData.find(cell => cell.r === groomGrid.r && cell.c === groomGrid.c + 1);
        if (nextCell.left) return;
        groomGrid.c++;
    }

    renderPlayers();
    checkWin();
}

// الكيبورد شغال علطول مع الأسهم و W,A,S,D
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