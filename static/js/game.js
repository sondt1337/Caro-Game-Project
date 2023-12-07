const board = Array(9).fill(null);
const gameBoard = document.getElementById('game-board');

function handleClick(index) {
    if (board[index] !== null) {
        return;
    }

    board[index] = 'X';
    gameBoard.children[index].innerText = 'X';
}

for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => handleClick(i));
    gameBoard.appendChild(cell);
}