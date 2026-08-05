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
const chooseAIPage = document.getElementById('aiDisplay');
const back = document.getElementById('back');
const easy = document.getElementById('easy');
const medium = document.getElementById('medium');
const hard = document.getElementById('hard');

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
let select = -1;
let phase = 'place';

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
    select = -1;
    phase = 'place';

    cells.forEach(cell => {
        cell.classList.remove('select');
    });

    if (player === 'X') {
        if (gameMode === 'normal' && how === '1-player') {
            if (aiLevel === 'easy') {
                easyNor()
            }
            else if (aiLevel === 'medium') {
                medNor()
            }
            else if (aiLevel === 'hard') {
                hardNor()
            }
        }
        else if (gameMode === 'limited' && how === '1-player') {
            if (aiLevel === 'easy') {
                easylim()
            }
            else if (aiLevel === 'medium') {
                medLim()
            }
        }
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

function renderBoard() {
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
}

function l2p(cell, index) {

    if (end) return;

    const move = player === 'O' ? oMove : xMove;

    if (phase === 'place') {
        if (cell.textContent !== '') return;

        move.push(index);

        renderBoard()
        checkWin()

        if (end) return;

        if (oMove.length === 3 && xMove.length === 3) {
            phase = 'move';
        }

        player = player === 'O' ? 'X' : 'O';
        msg.textContent = `${player}'s turn`;

        return;
    }

    if (cell.textContent === player) {

        cells.forEach(c => {
            c.classList.remove('select');
        });

        select = index;
        cell.classList.add('select');

        return;
    }

    if (cell.textContent === "") {

        const place = move.indexOf(select);

        move[place] = index;

        select = -1;

        renderBoard();

        checkWin();

        if (end) return;

        player = player === "O" ? "X" : "O";
        msg.textContent = `${player}'s turn`;
    }
}

function n1p(cell, index) {

    if (end) return;

    if (cell.textContent === '') {
        if (player === 'O') {
            cell.textContent = player;
            cell.style.color = '#ff4d6d';
            
            checkWin();
            draw();
            player = player === 'O' ? 'X' : 'O';


            if (end) return;

            msg.textContent = `${player}'s turn`;
            if ([...cells].some(cell => cell.textContent === '')) {
                if (aiLevel === 'easy') {
                    easyNor()
                }
                else if (aiLevel === 'medium') {
                    medNor()
                }
                else if (aiLevel === 'hard') {
                    hardNor()
                }
            }
        }
    }
}

function l1p(cell, index) {

    if (end) return;
    
    if (player === 'O') {

        const move = player === 'O' ? oMove : xMove;

        if (phase === 'place') {
            if (cell.textContent !== '') return;

            move.push(index);

            renderBoard()
            checkWin()

            if (end) return;

            if (oMove.length === 3 && xMove.length === 3) {
                phase = 'move';
            }

            if (end) return;

            player = 'X';

            if (aiLevel === 'easy') {
                easylim()
            } 
            else if (aiLevel === 'medium') {
                medLim()
            }

            msg.textContent = `${player}'s turn`;

            return;
        }

        if (cell.textContent === player) {

            cells.forEach(c => {
                c.classList.remove('select');
            });

            select = index;
            cell.classList.add('select');

            return;
        }

        if (cell.textContent === "" && select !== -1) {

            const place = move.indexOf(select);

            move[place] = index;

            select = -1;

            renderBoard();

            checkWin();

            player = 'X';

            if (end) return;

            if (aiLevel === 'easy') {
                easylim()
            } 
            else if (aiLevel === 'medium') {
                medLim()
            }

            msg.textContent = `${player}'s turn`;
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
            player = 'O';
            msg.textContent = `${player}'s turn`;
            sound(clickSound)
        }, 500);
    }
}

function easylim() {

    if (player !== "X" || end) return;

    const empty = getEmpty(getBoard());

    setTimeout(() => {

        if (end) return;

        const num = empty[Math.floor(Math.random() * empty.length)];

        if (phase === "place") {

            xMove.push(num);

            if (oMove.length === 3 && xMove.length === 3) {
                phase = "move";
            }

        } else {

            const piece = Math.floor(Math.random() * xMove.length);

            xMove[piece] = num;
        }

        renderBoard();

        checkWin();
        draw();

        if (end) return;

        player = "O";
        msg.textContent = `${player}'s turn`;

        sound(clickSound);

    }, 500);
}

function getBoard() {
    return [...cells].map(cell => cell.textContent);
}

function getEmpty(board) {
    const empty = []

    for(let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            empty.push(i);
        }
    }

    return empty;
}

function checkBoard(board) {
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

        if(board[a] === board[b] && board[b] === board[c] && board[a] !== '') {
            
            if (board[a] === 'O') return -10;
            if (board[a] === 'X') return 10;

        }
    }

    return 0;
}

function minMax(board, max, depth) {
    const score = checkBoard(board);

    if (score === -10) return depth -10;
    if (score === 10) return 10 - depth;

    const empty = getEmpty(board);

    if (empty.length === 0) return 0;

    if (max) {
        let best = -Infinity;

        for (let place of empty) {
            board[place] = 'X';
            const score = minMax(board, false, depth + 1);
            board[place] = '';
            best = Math.max(best, score);
        }

        return best;
    } else {
        let best = Infinity;

        for (let place of empty) {
            board[place] = 'O';
            const score = minMax(board, true, depth + 1);
            board[place] = '';
            best = Math.min(best, score);
        }

        return best;
    }
}

function bestMoveMed() {
    const board = getBoard();
    const empty = getEmpty(board);

    if (Math.random() < 0.5) {
        return empty[Math.floor(Math.random() * empty.length)];
    }

    let bestScore = -Infinity;
    let bestPlace = -1;

    for (let place of empty) {

        board[place] = "X";

        const score = minMax(board, false, 0);

        board[place] = "";

        if (score > bestScore) {
            bestScore = score;
            bestPlace = place;
        }
    }

    return bestPlace;
}

function bestMoveMedLim() {

    const board = getBoard();
    const empty = getEmpty(board);

    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < xMove.length; i++) {

        const from = xMove[i];

        for (let to of empty) {

            board[from] = "";
            board[to] = "X";

            const score = checkBoard(board);

            board[to] = "";
            board[from] = "X";

            if (score > bestScore) {
                bestScore = score;
                bestMove = {
                    piece: i,
                    to: to
                };
            }
        }
    }

    if (!bestMove && empty.length > 0) {
        bestMove = {
            piece: Math.floor(Math.random() * xMove.length),
            to: empty[Math.floor(Math.random() * empty.length)]
        };
    }

    return bestMove;
}

function bestMoveHard() {
    const board = getBoard();
    const empty = getEmpty(board);

    let bestScore = -Infinity;
    let bestPlace = -1;    

    for (let place of empty) {

        board[place] = "X";

        const score = minMax(board, false, 0);
        console.log(board);
        

        board[place] = "";

        if (score > bestScore) {
            bestScore = score;
            bestPlace = place;
        }
    }

    return bestPlace;
}

function medNor() {

    if (end) return;
    
    const move = bestMoveMed();

    if (move === -1) return;

    setTimeout(() => {
        if (end) return;

        cells[move].textContent = "X";
        cells[move].style.color = "#00b4d8";

        checkWin();
        draw();

        player = "O";
        msg.textContent = `${player}'s turn`;

    }, 500);
}

function medLim() {
    if (player !== "X" || end) return;

    setTimeout(() => {

        if (end) return;

        if (phase === "place") {

            const move = bestMoveMed();

            if (move === -1) return;

            xMove.push(move);

            renderBoard();

            checkWin();
            draw();

            if (end) return;

            if (oMove.length === 3 && xMove.length === 3) {
                phase = "move";
            }

            player = "O";
            msg.textContent = `${player}'s turn`;
        }else {

            const move = bestMoveMedLim();

            if (!move) return;

            xMove[move.piece] = move.to;

            renderBoard();

            checkWin();
            draw();

            if (end) return;

            player = "O";
            msg.textContent = `${player}'s turn`;
        }
    }, 500);
}

function hardNor() {

    if (end) return;

    const move = bestMoveHard();

    if (move === -1) return;

    setTimeout(() => {
        if (end) return;

        cells[move].textContent = "X";
        cells[move].style.color = "#00b4d8";

        checkWin();
        draw();

        player = "O";
        msg.textContent = `${player}'s turn`;

    }, 500);
}

// start the game as the user want to play
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
            else if(gameMode === 'limited' && how === '1-player') {
                l1p(cell, index)
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
        chooseAIPage.classList.add('show');
        how = '1-player';
        start()
    }
})

function showData() {
    step = 'mode';
    gameMode = '';
    how = '';
    btn1.textContent = 'normal';
    btn2.textContent = 'limited';
    headMsg.textContent = 'choose the game mode';
    display.classList.remove('hide');
}

showDisplay.addEventListener('click', () => {
    showData()
    reset()
    scoreX = 0;
    scoreO = 0;
    winX.textContent = scoreX;
    winO.textContent = scoreO;
    player = 'O';
})

back.addEventListener('click', () => {
    showData()
    chooseAIPage.classList.remove('show');
})

easy.addEventListener('click', () => {
    aiLevel = 'easy';
    chooseAIPage.classList.remove('show');
})

medium.addEventListener('click', () => {
    aiLevel = 'medium';
    chooseAIPage.classList.remove('show');
})

hard.addEventListener('click', () => {
    aiLevel = 'hard';
    chooseAIPage.classList.remove('show');
})