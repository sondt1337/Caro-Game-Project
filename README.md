# Caro Game Project
## Introduction
| Product       | Caro Game                 |
| ------------- | ------------------------- |
| Author (Name) | Thai Son Dinh             |
| StudentID     | 20210750                  |
| Email         | sondinh99999@gmail.com    |
| Frontend      | HTML, CSS, JavaScript     |
| Backend       | Flask (Python), WebSocket |

## Project Demo
You can experience the "Caro Game" through my demo below: [Demo Caro Game Project](https://thai-son-caro-game.glitch.me/)

## Project Overview
Developing a classic Caro game with diverse features to provide a unique gaming experience for players. Below is a detailed description of the key features of the project:


### Single Player Mode (Human vs Computer):
- Utilizing [Minimax Algorithm](https://youtu.be/fTBEjsrZKso?si=RCymjDB1boUf3Eq8) to implement this mode.
- The computer's moves will be based on calculating outcomes that involve both offensive (trying to achieve a sequence of 5 moves in a row) and defensive strategies (protecting against the opponent's attempt to achieve a sequence of 5 moves in a row). The computer will then choose the move corresponding to the best outcome in that scenario (if there are multiple outcomes with equal offensive/defensive values, it will be chosen randomly).

### Local Multiplayer Mode (Human vs Human - Offline):
- Enables two players to engage in a game on the same device.
- Does not employ an algorithm; instead, it straightforwardly checks for a victory when either of the two players achieves a sequence of 5 moves in a row or when the board is fully occupied.

### Online Multiplayer Mode (Human vs Human - Online):
- Based on the local multiplayer mode for two players (Local Multiplayer Mode), this feature allows two players to interact with the game on two separate devices over the Internet.
- Flask Socket acts as a bridge between the two devices on the server, automatically updating the moves and game state between the two players.
- The room creation, joining & leaving feature ensures that players do not conflict when participating in the game and enhances security measures.

## Interface
For more details about the product's interface, please visit [Product's Interface](Product-Interface/README.md)

## Project Structure
The project is organized as a Python Flask application with integrated WebSocket for real-time communication among players. The main components of the project include the game logic, user interface, and multiplayer functionality.

```
Caro-Game-Project
├── app.py
├───build_local
│   └── main.py
├───Product-Interface
│   ├── README.md
│   └── ...
├── __pycache__
│   └── game.cpython-39.pyc
├── README.md
├── static
│   ├── css
│   │   ├── styles-caro.css
│   │   └── styles-home.css
│   ├── images
│   │   ├── logo.png
│   │   └── background.jpg
│   └── js
│       ├── caro-computer.js
│       ├── caro-off.js
│       └── caro-onl.js
└── templates
    ├── caro-computer.html
    ├── caro-off.html
    ├── caro-onl.html
    └── index.html
```

## Prerequisites (Requirements)
Before building and running the project, ensure that Python has [the following libraries](requirements.txt)

```bash
$ pip install -r requirements.txt
```

## Run Locally (Local Deployment)

After downloading all the necessary libraries, you can run the application with the following command:
```bash
python app.py
```


Or run the following code snippet [main.py](build_local/main.py) to automatically download the project from GitHub and run it locally:

```python
# -*- coding: utf-8 -*-
import subprocess
import shutil
import os

caro_game_project_path = "Caro-Game-Project"
if os.path.exists(caro_game_project_path):
    shutil.rmtree(caro_game_project_path)

git_clone_command = "git clone https://github.com/spid3r1337/Caro-Game-Project.git"
subprocess.call(git_clone_command, shell=True)
subprocess.call("pip install flask", shell=True)
subprocess.call("pip install flask-socketio", shell=True)
subprocess.call("pip install python-socketio", shell=True)
subprocess.call("pip install jinja2", shell=True)


app_py_path = os.path.join(caro_game_project_path, "app.py")

if os.path.exists(app_py_path):
    command = "python {}".format(app_py_path)
    subprocess.call(command, shell=True)
else:
    print("File app.py not found in {}.".format(caro_game_project_path))
```

View the page http://localhost:8000/ (5000 is the default port for Flask, but in app.py, it has been modified to run on 0.0.0.0:8000) in any browser on your machine to access the game.

## Contact Author
Son Dinh Thai: 
- Personal Email: sondinh99999@gmail.com
- Student's Email: Son.DT210750@sis.hust.edu.vn 

Buy me a coffee ☕: https://www.buymeacoffee.com/spid3r

Thank you for visiting and using this project!

> Please note that the project is written in Vietnamese. If you have any questions or need further assistance, feel free to contact the author.