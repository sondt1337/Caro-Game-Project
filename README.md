# Caro Game Project
## Introduction
This repository contains the source code for the "Cờ Caro" game project, developed by Đinh Thái Sơn, studentID: 20210750 as part of the Project 1 course, under the guidance of our instructor.

## Project Overview
The chosen project focuses on the classic board game "Cờ Caro" and aims to implement three key features:

1. Single Player Mode (Đấu với máy):

Default gameplay mode where the player competes against an AI opponent.
2. Local Multiplayer Mode (Đấu offline 2 người):

Allows two players to compete on the same device, taking turns to make their moves.
3. Online Multiplayer Mode (Đấu online 2 người):

Enables players to challenge each other over the internet, enhancing the game's appeal and interaction.

## Project Structure
The project is organized into a Python Flask application with WebSocket integration for real-time communication between players. The main components of the project include the game logic, user interface, and multiplayer functionality.

## Requirements
To set up and run the project locally, ensure you have the following dependencies installed:
```
# pip install flask
# pip install flask-socketio
# pip install jinja2
# pip uninstall eventlet
# pip install eventlet==0.30.0
# pip install gevent
# pip install gevent-websocket
```

## Local Deployment
After installing the dependencies, you can run the application locally:
```bash
python app.py
```

Visit http://localhost:5000/ (default port of Flask) in your web browser to access the game.

Feel free to explore, contribute, or provide feedback on this Caro Game project!