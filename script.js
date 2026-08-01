// import HTML data
const modeBtn = document.getElementById('mode');
const modeBtnIcon = document.querySelector('#mode span');
const main = document.body;
const cells = document.querySelectorAll('.cell');
const msg = document.getElementById('message');
const resetBtn = document.getElementById('reset');

// add JS data
const savedMode = localStorage.getItem('mode') || '';
let player = 'O';
let end = false;

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
resetBtn.addEventListener('click', () => {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.border = 'none';
    });
    end = false;
    msg.textContent = "Game reset!";
});

// draw
function draw() {
    if(!end){
        // logic for handling a draw
        const isDraw = Array.from(cells).every(cell => cell.textContent !== '');
        if(isDraw) {
            end = true;
            msg.textContent = "It's a draw!";
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
        }
    }
}

// main
function game() {
    cells.forEach(cell => {
        cell.addEventListener('click', () => {

            if(end) return;

            if(cell.textContent === '') {
                cell.textContent = player;
                cell.style.color = player === 'O' ? '#ff4d6d' : '#4d79ff';
                player = player === 'O' ? 'X' : 'O';
                checkWin();
                draw();
            }
        })
    })
}

game()