# -*- coding: utf-8 -*-
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
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

      symbol = 'X' if global_player_count == 1 else 'O'
      player = {'id': request.sid, 'symbol': symbol}
      rooms[room_code]['players'].append(player)

      join_room(room_code)

      # Gửi thông tin của cả hai người chơi về client
      emit('join', {'room_code': room_code, 'player': player, 'request_sid': request.sid, 'players': rooms[room_code]['players']}, room=room_code)

      global_player_count += 1

# Xử lý sự kiện disconnect
@socketio.on('disconnect')
def handle_disconnect():
    global global_player_count

    # Lấy thông tin người chơi mất mạng
    disconnected_player = None
    room_code = None

    for room_code, room_data in rooms.items():
        for player in room_data['players']:
            if player['id'] == request.sid:
                disconnected_player = player
                room_data['players'].remove(player)
                break

    # Nếu có người chơi mất mạng, cập nhật thông tin và gửi sự kiện 'leave' đến các client trong phòng
    if disconnected_player:
        leave_room(room_code)
        emit('leave', {
            'room_code': room_code,
            'player': disconnected_player,
            'request_sid': request.sid,
            'players': room_data['players']
        }, room=room_code)

        global_player_count -= 1

        # Gửi thông báo về số người còn lại trong phòng
        emit('playerCountUpdate', {'room_code': room_code, 'player_count': len(room_data['players'])}, room=room_code)

        # Gửi sự kiện thông báo khi đối thủ mất kết nối cho từng người chơi còn lại
        opponent = next((p for p in room_data['players'] if p['id'] != request.sid), None)
        if opponent:
            emit('opponentDisconnected', room=opponent['id'])


# Rời phòng chơi
@socketio.on('leave')
def on_leave(data):
    global global_player_count
    room_code = data['room_code']

    if room_code not in rooms:
        return 'Room does not exist', 400

    player = next((player for player in rooms[room_code]['players'] if player['id'] == request.sid), None)
    if player is None:
        return 'Player not in room', 400

    rooms[room_code]['players'].remove(player)
    leave_room(room_code)

    # Gửi thông tin về việc rời phòng về client
    emit('leave', {'room_code': room_code, 'player': player, 'request_sid': request.sid, 'players': rooms[room_code]['players']}, room=room_code)

    global_player_count -= 1


# Cập nhật các bước đánh của người chơi
@socketio.on('playerMove')
def on_move(data):
  room_code = data['room_code']
  player = next((player for player in rooms.get(room_code, {}).get('players', []) if player['id'] == request.sid), None)
  if player:
      # Gửi bước đánh của người chơi hiện tại đến tất cả người chơi trong phòng
      emit('playerMove', data, room=room_code, include_self=True)
      # Xác định đối thủ của người chơi hiện tại
      opponent = next((p for p in rooms[room_code]['players'] if p['id'] != request.sid), None)
      if opponent and player['symbol'] != opponent['symbol']:
        # Gửi bước đánh của đối thủ đến toàn bộ phòng, tránh gửi lại cho chính người chơi hiện tại
        emit('opponentMove', data, room=room_code, skip_sid=request.sid)
      else:
          # Handle nếu không phải lượt của người chơi hoặc không xác định được đối thủ
          emit('invalidMove', {'message': 'It is not your turn or opponent not found'}, room=request.sid)
  else:
      # Handle nếu không phải người chơi trong phòng
      emit('invalidMove', {'message': 'You are not in this room'}, room=request.sid)
    
@socketio.on('move_off')
def on_move(data):
    emit('move_off', data)
    
@socketio.on('move_computer')
def on_move(data):
    emit('move_computer', data)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8000, debug=True, allow_unsafe_werkzeug=True)
