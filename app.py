from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('move')
def handle_move(data):
    emit('move', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
