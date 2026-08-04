// import HTML data
const modeBtn = document.getElementById('mode');
const modeBtnIcon = document.querySelector('#mode span');
const main = document.body;
const cells = document.querySelectorAll('.cell');
const msg = document.getElementById('message');
const resetBtn = document.getElementById('reset');
const winX = document.getElementById('winX');
const winO = document.getElementById('winO');
const resetScoreBtn = document.getElementById('resetScore');
const display = document.getElementById('display');
const content = document.getElementById('content');
const headMsg = document.getElementById('hMsg');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const showDisplay = document.getElementById('showDisplay');

// import sounds
const clickSound = new Audio('./sounds/click.mp3');
const winSound = new Audio('./sounds/win.mp3');
const removeSound = new Audio('./sounds/remove.mp3');

// add JS data
const savedMode = localStorage.getItem('mode') || '';
let player = 'O';
let end = false;
let scoreX = 0;
let scoreO = 0;
let gameMode = '';
let how = '';
let step = 'mode';
let xMove = [];
let oMove = [];
let aiLevel = '';


// sound function
function sound(s) {
    s.currentTime = 0;
    s.play();
}

// mode function
modeBtn.addEventListener('click', () => {
    main.classList.toggle('dark');

    setTimeout(() => {
        // delay the transition of the icon change
        modeBtnIcon.textContent = main.classList.contains('dark') ? 'dark_mode' : 'light_mode';
    }, 500);

    // save the mode to local storge
    localStorage.setItem('mode', main.classList.contains('dark') ? 'dark' : 'light');
});

// check the mode from local storage
if(savedMode === 'dark') {
    main.classList.add('dark');
    modeBtnIcon.textContent = main.classList.contains('dark') ? 'dark_mode' : 'light_mode';
}

//! game function

// reset function
function reset() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.border = 'none';
    });
    end = false;
    msg.textContent = "Game reset !";
    oMove = [];
    xMove = [];

    if (player === 'X') {
        easyNor()
    }

}

resetBtn.addEventListener('click', () => {
    if ([...cells].every(cell => cell.textContent === '')) return;

    sound(removeSound);
    reset();
});

resetScoreBtn.addEventListener('click', () => {
    if (scoreX === 0 && scoreO === 0) return;

    sound(removeSound);
    reset();
    scoreX = 0;
    scoreO = 0;
    winX.textContent = scoreX;
    winO.textContent = scoreO;
});

// draw
function draw() {
    if(!end){
        // logic for handling a draw
        const isDraw = Array.from(cells).every(cell => cell.textContent !== '');
        if(isDraw) {
            end = true;
            msg.textContent = "It's a draw !";
        }
    }
}

// add border color to the winning cells
function borderColor(el, color) {
    el.style.border = `5px solid ${color}`;
}

// win
function checkWin() {
    const winCond = [
        // row
        [0, 1, 2],
        [3, 4, 5],
        [6 ,7, 8],

        // column
        [0, 3, 6],
        [1 ,4 ,7],
        [2 ,5, 8],

        // diagonal
        [0 ,4, 8],
        [2, 4, 6]
    ]

    for(let win of winCond) {
        const [a, b, c] = win;

        if(cells[a].textContent === cells[b].textContent && cells[b].textContent === cells[c].textContent && cells[a].textContent !== '') {
            borderColor(cells[a], '#06923E');
            borderColor(cells[b], '#06923E');
            borderColor(cells[c], '#06923E');
            end = true;
            msg.textContent = `${cells[a].textContent} wins !`;
            sound(winSound)
            if(cells[a].textContent === 'X') {
                scoreX++;
                winX.textContent = scoreX;
            } else {
                scoreO++;
                winO.textContent = scoreO;
            }
            return;
        }
    }
}

// main
function n2p(cell, index) {
    if(cell.textContent === '') {
        cell.textContent = player;
        cell.style.color = player === 'O' ? '#ff4d6d' : '#4d79ff';
        player = player === 'O' ? 'X' : 'O';
        msg.textContent = `${player}'s turn`;
        checkWin();
        draw();
    }
}

function l2p(cell, index) {
    if(cell.textContent === ''){
        if(player === 'O') {
            if(oMove.length < 3) {
                oMove.push(index);
            } else {
                oMove.splice(0 ,1);
                oMove.push(index);
            }
        } else {
            if(xMove.length < 3) {
                xMove.push(index)
            } else {
                xMove.splice(0 ,1);
                xMove.push(index);
            }
        }

        player = player === 'O' ? 'X' : 'O';
        msg.textContent = `${player}'s turn`;
    }

    cells.forEach(cell => {
        cell.textContent = '';
    })

    for (let i of oMove) {
        cells[i].textContent = 'O';
        cells[i].style.color = '#ff4d6d';
    }

    for (let i of xMove) {
        cells[i].textContent = 'X';
        cells[i].style.color = '#4d79ff';
    }

    checkWin();
}

function n1p(cell, index) {

    if (end) return;

    if (cell.textContent === '') {
        if (player === 'O') {
            cell.textContent = player;
            
            checkWin();
            draw();

            cell.style.color = '#ff4d6d';
            player = player === 'O' ? 'X' : 'O';
            msg.textContent = `${player}'s turn`;
            if ([...cells].some(cell => cell.textContent === '')) {
                easyNor()
            }
        }
    }
}

// game bot
function easyNor() {    
    let num;
    if (player === 'X') {
        do {
            num = Math.floor(Math.random() * 9)
        } while (cells[num].textContent !== '');

        setTimeout(() => {
            if (end) return;

            cells[num].textContent = player;

            checkWin();
            draw();

            cells[num].style.color = '#4d79ff';
            player = player === 'O' ? 'X' : 'O';
            msg.textContent = `${player}'s turn`;
            sound(clickSound)
        }, 500);
    }
}

// start the game as thse user want to play
function start() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
        
            if (end) return;

            sound(clickSound)

            if(gameMode === 'normal' && how === '2-player') {
                n2p(cell, index)
            }
            else if(gameMode === 'normal' && how === '1-player') {
                n1p(cell, index)
            }
            else if(gameMode === 'limited' && how === '2-player') {
                l2p(cell, index)
            }
        })
    })
}

// display
function displays() {
    content.classList.add('hide');

    setTimeout(() => {
        headMsg.textContent = 'choose the opponent';
        btn1.textContent = '2 player';
        btn2.textContent = '1 player';
        content.classList.remove('hide');

        step = 'opponent';

    }, 500);
}

btn1.addEventListener('click', () => {
    if(step === 'mode') {
        displays()
        gameMode = 'normal';
    } else {
        display.classList.add('hide');
        how = '2-player';
        start()
    }
})

btn2.addEventListener('click', () => {
    if(step === 'mode') {
        displays()
        gameMode = 'limited';
    } else {
        display.classList.add('hide');
        how = '1-player';
        start()
    }
})

showDisplay.addEventListener('click', () => {
    step = 'mode';
    gameMode = '';
    how = '';
    btn1.textContent = 'normal';
    btn2.textContent = 'limited';
    headMsg.textContent = 'choose the game mode';
    display.classList.remove('hide');
})