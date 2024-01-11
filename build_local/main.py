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