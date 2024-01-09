import subprocess
import shutil
import os

caro_game_project_path = "Caro-Game-Project"
if os.path.exists(caro_game_project_path):
     shutil.rmtree(caro_game_project_path)
    
git_clone_command = "git clone https://github.com/spid3r1337/Caro-Game-Project.git"
subprocess.run(git_clone_command, shell=True)

app_py_path = os.path.join(caro_game_project_path, "app.py")

if os.path.exists(app_py_path):
    command = f"python {app_py_path}"
    subprocess.run(command, shell=True)
else:
    print(f"File app.py not found in {caro_game_project_path}.")