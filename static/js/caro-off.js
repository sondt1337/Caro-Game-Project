// Kết nối socket thông qua SERVER (BẮT BUỘC - nếu local thì kết nối qua https://)
let socket = io.connect('https://project1caro.redipsspider.repl.co');

// Khai báo bảng và người chơi đầu được sử dụng "X"
let boardElement = document.getElementById('board');
let statusElement = document.getElementById('status');
let board = [];
let currentPlayer = 'X';

// Tạo bảng 20x20 
for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick, { once: true });
        boardElement.appendChild(cell);
        board.push(cell);
    }
}

// Handle mỗi Click và xử lý logic sau mỗi lần chọn vị trí
function handleClick(e) {
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());
    // Highlight cell sau khi đánh
    e.target.classList.add('highlight');
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    socket.emit('move_off', { index: board.indexOf(e.target), player: e.target.textContent });
}

socket.on('move_off', function(data) {
    board[data.index].textContent = data.player;
    currentPlayer = data.player === 'X' ? 'O' : 'X';
    if (checkWin(data.index, data.player)) {
        statusElement.textContent = data.player + ' wins!';
        alert(data.player + ' wins!');
        resetGame();
    }
});


// Hàm kiểm tra trả về kết quả (Thắng - Hòa)
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

function resetGame() {
    // Xóa tất cả các nước đi trên bảng
    for (let i = 0; i < board.length; i++) {
        board[i].textContent = '';
        // Thêm lại sự kiện click vào ô
        board[i].addEventListener('click', handleClick, { once: true });
        // Xóa các sự kiện highlight và tô màu 
        board[i].classList.remove('x', 'o', 'highlight');
    }
    // Đặt lại người chơi hiện tại
    currentPlayer = 'X';
    // Cập nhật trạng thái trò chơi
    statusElement.textContent = 'Game reset!!!';
}