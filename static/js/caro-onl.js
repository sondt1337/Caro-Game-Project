// Kết nối socket thông qua LAN 
let socket = io.connect('http://' + document.domain + ':' + location.port);

// Kết nối socket qua server
// let socket = io.connect('https://project1caro.redipsspider.repl.co/');

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
            alert(error);
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
    if (!currentPlayer) {
        return;
    }
    e.target.textContent = currentPlayer;
    socket.emit('move', { room_code: roomCode, index: board.indexOf(e.target), player: e.target.textContent });
}

socket.on('join', function(data) {
    roomCode = data.room_code;
    currentPlayer = data.player;
});

socket.on('move', function(data) {
    board[data.index].textContent = data.player;
    currentPlayer = data.player === 'X' ? 'O' : 'X';
    if (checkWin(data.index, data.player)) {
        statusElement.textContent = data.player + ' wins!';
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