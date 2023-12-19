let socket = io.connect('http://' + document.domain + ':' + location.port);

// let socket = io.connect('https://botcobac.redipsspider.repl.co');
let boardElement = document.getElementById('board');
let board = [];
let currentPlayer = 'X';

for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick, { once: true });
        boardElement.appendChild(cell);
        board.push(cell);
    }
}

function handleClick(e) {
    e.target.textContent = currentPlayer;
    socket.emit('move', { index: board.indexOf(e.target), player: e.target.textContent });
}

socket.on('move', function(data) {
    board[data.index].textContent = data.player;
    currentPlayer = data.player === 'X' ? 'O' : 'X';
    if (checkWin(data.index, data.player)) {
        alert(data.player + ' wins!');
    }
});

function checkWin(index, player) {
    let row = Math.floor(index / 20);
    let col = index % 20;
    let directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1]
    ];
    for (let [dx, dy] of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            let x = row + dx * i;
            let y = col + dy * i;
            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }
            count++;
        }
        for (let i = 1; i < 5; i++) {
            let x = row - dx * i;
            let y = col - dy * i;
            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }
            count++;
        }
        if (count >= 5) {
            return true;
        }
    }
    return false;
}