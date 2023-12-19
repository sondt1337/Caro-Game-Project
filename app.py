from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app)
rooms = {}

# Trang home
@app.route('/')
def index():
    return render_template('index.html')

# Trang chơi caro online 2 người
@app.route('/caro-onl')
def onl():
    return render_template('caro-onl.html')

# Trang chơi caro offline 2 người
@app.route('/caro-off')
def off():
    return render_template('caro-off.html')

# Trang chơi caro người - máy
@app.route('/caro-computer')
def computer():
    return render_template('caro-computer.html')

# Trang chơi caro máy - máy
@app.route('/caro-2computer')
def twocomputer():
    return render_template('caro-2computer.html')

# Tạo phòng chơi để join vào phòng 
@app.route('/create', methods=['POST'])
def create():
    room_code = request.form.get('room_code')
    if room_code in rooms:
        return 'Room already exists', 400
    rooms[room_code] = {'players': []}
    return 'Room created successfully'

# Join phòng chơi (check các điều kiện)
@socketio.on('join')
def on_join(data):
    room_code = data['room_code']
    if room_code not in rooms or len(rooms[room_code]['players']) >= 2:
        return 'Room is full', 400
    join_room(room_code)
    player = 'X' if len(rooms[room_code]['players']) == 0 else 'O'
    rooms[room_code]['players'].append(request.sid)
    emit('join', {'room_code': room_code, 'player': player}, room=room_code)

# Rời phòng
@socketio.on('leave')
def on_leave(data):
    room_code = data['room_code']
    if room_code in rooms and rooms[room_code]['players']:
        rooms[room_code]['players'].remove(request.sid)
    leave_room(room_code)
    
# Cập nhật các bước đánh của người chơi
@socketio.on('move')
def on_move(data):
    emit('move', data, room=data['room_code'])

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8000, debug=True)
