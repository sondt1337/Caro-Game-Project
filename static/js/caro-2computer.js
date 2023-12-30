// Kết nối socket thông qua LAN 
let socket = io.connect('http');

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
    // Kiểm tra xem ô đã được đánh chưa
    if (e.target.textContent === '') {
        e.target.textContent = currentPlayer;
        e.target.classList.add(currentPlayer.toLowerCase());
        // Highlight cell sau khi đánh
        e.target.classList.add('highlight');
        let index = board.indexOf(e.target);
        if (checkWin(index, currentPlayer)) {
            setTimeout(function() {
                alert('You win!');
                resetGame();
            }, 100); // Thêm trễ 100ms

        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        socket.emit('move_computer', { index: index, player: e.target.textContent });

        // Máy tính đánh ngay sau khi người chơi đã đánh
        if (currentPlayer === 'O') {
            computerMove();
        } else {
            computerMove2();
        }
    }
}

socket.on('move_computer', function(data) {
    board[data.index].textContent = data.player;
    currentPlayer = data.player === 'X' ? 'O' : 'X';
});

function checkWin(index, player) {
    let row = Math.floor(index / 20); // Lấy số hàng 
    let col = index % 20; // Lấy số cột
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

// Hàm minimax để tìm nước đi tốt nhất cho máy
function minimax(board, depth, isMaximizingPlayer) {
    let score;
    if (checkWin(board, 'O')) {
        return { score: MAP_SCORE_COMPUTER.get(5) };
    } else if (checkWin(board, 'X')) {
        return { score: -MAP_POINT_HUMAN.get(4) };
    } else if (isBoardFull(board)) {
        return { score: 0 };
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'O';
                let result = minimax(board, depth + 1, false);
                board[i].textContent = '';
                if (result.score > bestScore) {
                    bestScore = result.score;
                    move = i;
                }
            }
        }
        return { score: bestScore, move: move };
    } else {
        let bestScore = Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'X';
                let result = minimax(board, depth + 1, true);
                board[i].textContent = '';
                if (result.score < bestScore) {
                    bestScore = result.score;
                    move = i;
                }
            }
        }
        return { score: bestScore, move: move };
    }
}

// Hàm để kiểm tra xem bảng đã đầy chưa
function isBoardFull(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i].textContent === '') {
            return false;
        }
    }
    return true;
}

// Hàm để máy tính đánh
function computerMove() {
    // Nếu đây là bước đầu tiên của máy tính, đánh ngẫu nhiên
    if (currentPlayer === 'X' && isBoardEmpty(board)) {
        randomFirstMove();
    } else {
        let result = minimax(board, 0, true);
        board[result.move].textContent = 'O';
    }
}

// Hàm để máy tính đánh
function computerMove2() {
    let result = minimax(board, 0, false);
    board[result.move].textContent = 'X';
}

// Hàm để kiểm tra xem bảng có trống không
function isBoardEmpty(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i].textContent !== '') {
            return false;
        }
    }
    return true;
}

// Hàm để máy tính đánh ngẫu nhiên cho bước đầu tiên
function randomFirstMove() {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i].textContent === '') {
            emptyCells.push(i);
        }
    }
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    board[emptyCells[randomIndex]].textContent = 'O';
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
    statusElement.textContent = 'Player ' + currentPlayer + '\'s turn';
}