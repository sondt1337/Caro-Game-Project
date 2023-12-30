// Kết nối socket qua server (KHI KHỞI TẠO TRÊN SERVER)
let socket = io.connect('https://project1caro.redipsspider.repl.co/');

// Kết nối socket thông qua LAN (BUILD TRÊN LOCAL)
// let socket = io.connect('http://' + document.domain + ':' + location.port);

// Tạo mã phòng để bắt đầu chơi
document.getElementById('create-room-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let roomCode = document.getElementById('create-room-code').value;
    fetch('/create', {
        method: 'POST',
        body: new URLSearchParams({
            'room_code': roomCode,
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to create room');
        }
        alert('Room created successfully');
    });
});


// Lấy room-form từ Frontend để kiểm tra mã phòng 
document.getElementById('join-room-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let roomCode = document.getElementById('join-room-code').value;
    socket.emit('join', { room_code: roomCode }, function(error) {
        if (error) {
            alert("Can't join this room!");
        } else {
            alert('Joined room successfully');
        }
    });
});


// Khai báo bảng và người chơi đầu được sử dụng "X"
let boardElement = document.getElementById('board');
let statusElement = document.getElementById('status');
let board = [];
let currentPlayer;

// Tạo biến để theo dõi số lượng người chơi trong phòng
let playerCount = 0;

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


let roomCode;
let check = [];
let currentSid;
// Khi một người chơi tham gia phòng, lấy số lượng người chơi từ server
socket.on('join', function(data) {
    resetGame() // đang có vấn đề
    roomCode = data.room_code;
    players = data.players;
    currentSid = data.request_sid;

    // Hiển thị số lượng người chơi và thông tin roles trong phòng
    document.getElementById('player-count').textContent = 'Số người chơi: ' + players.length;
    currentPlayer = players.find(player => player.id === currentSid);
    if (check.length === 0 && currentPlayer === players[0]) {
        check.push('X');
    } else if (check.length === 0 && currentPlayer === players[1]) {
        check.push('O');
    }
    // Kiểm tra xem có đủ 2 người chơi hay không và players[0] không phải là undefined
    if (players.length === 2) {
        players[0].symbol = 'X';
        players[1].symbol = 'O';
        // Kiểm tra xem currentPlayer có tồn tại không trước khi gán giá trị
        let playerInfoElement = document.getElementById('player-info');
        if (playerInfoElement) {
            playerInfoElement.textContent = 'Bạn là: ' + check[0];
        }
    }
});

let currentTurn = 1;

// Handle mỗi Click và xử lý logic sau mỗi lần chọn vị trí
function handleClick(e) {
    setTimeout(startCountdown, 0); // đang có vấn đề
    if (currentTurn % 2 === ((check[0] === players[0].symbol) ? 1 : 0)) {
        // Kiểm tra xem ô đã được đánh chưa và xem có phải lượt của người chơi này không
        if (e.target.textContent === '') {
            e.target.textContent = check[0];
            // Thêm CSS vào symbol
            e.target.classList.add(check[0].toLowerCase());
            e.target.classList.add('highlight');
            if (checkWin(board.indexOf(e.target), check[0])) {
                setTimeout(function() {
                    alert(check[0] + ' wins!');
                    resetGame();
                }, 100); // Thêm trễ 100ms
            } else {
                currentTurn++;
            }
            socket.emit('playerMove', { room_code: roomCode, index: board.indexOf(e.target), player: e.target.textContent, currentTurn: currentTurn });
        } else {
            alert('Chưa đến lượt của bạn!');
        }
    }
}


// Socket listener để xác định lượt đánh của đối thủ
socket.on('opponentMove', function(data) {
    let index = data.index;
    let opponentSymbol = (check[0] === 'X') ? 'O' : 'X';

    // Kiểm tra xem ô đã được đánh chưa
    if (board[index].textContent === '') {
        board[index].textContent = opponentSymbol;
        board[index].classList.add(opponentSymbol.toLowerCase());
        board[index].classList.add('highlight');

        // Kiểm tra điều kiện thắng và xử lý
        if (checkWin(index, opponentSymbol)) {
            setTimeout(function() {
                alert(opponentSymbol + ' wins!');
                resetGame();
            }, 100); // Thêm trễ 100ms
        }

        // Chuyển lượt cho người chơi hiện tại
        currentTurn++;
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
    currentTurn = 1;
    // Cập nhật trạng thái trò chơi
    statusElement.textContent = 'Game reset!!!';
}

var remainingTime; // Cho mỗi người khoảng 5 phút --> biến gloabal
var countdown;

function startCountdown() {
    clearInterval(countdown);
    remainingTime = 300;
    countdown = setInterval(function() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        document.getElementById('countdown').textContent = 'Thời gian còn lại: ' + formattedTime;
        remainingTime--;
        if (remainingTime <= 0) {
            clearInterval(countdown);
            alert('Hết giờ! Bạn đã thua.');
            resetGame();
        }
    }, 1000); // Cập nhật mỗi 1 giây
}