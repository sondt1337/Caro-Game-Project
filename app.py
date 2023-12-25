from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import jsonify

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
    player_count = 0
    return 'Room created successfully'

global_player_count = 0

# Join phòng chơi (check các điều kiện)
@socketio.on('join')
def on_join(data):
    global global_player_count
    room_code = data['room_code']
    if room_code not in rooms or len(rooms[room_code]['players']) >= 2:
        return 'Room is full', 400
    player = {'id': request.sid, 'symbol': 'X' if len(rooms[room_code]['players']) == 0 else 'O'}
    rooms[room_code]['players'].append(player)
    join_room(room_code)
    emit('join', {'room_code': room_code, 'player': player['symbol']}, room=room_code)
    global_player_count += 1


# Cập nhật các bước đánh của người chơi
@socketio.on('move')
def on_move(data):
    emit('move', data, room=data['room_code'])
    
@socketio.on('move_off')
def on_move(data):
    emit('move_off', data)
    
@socketio.on('move_computer')
def on_move(data):
    emit('move_computer', data)

@app.route('/get_player_count/<room_code>', methods=['GET'])
def get_player_count(room_code):
    if room_code in rooms:
        return str(len(rooms[room_code]['players']))
    else:
        return 'Room does not exist', 400


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8000, debug=True)
