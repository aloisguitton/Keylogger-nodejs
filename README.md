
# Cyber security project - ENSEIRB MATMECA

This project is for education only !

For this project, we created a real-time keylogger. This keylogger is installed on the victim's machine using a python script (compiled as .exe). This script downloads the keylogger (in nodejs) which captures keystrokes and allows commands to be executed on the victim's machine, it also allows screenshots and photos to be taken using the webcam. 


# Keylogger executable 

This folder contains the python script to deploy the keylogger. We have created two executables, which trick the victim into thinking he is opening a pdf file or an image. 

# Keylogger script

The folder contains the NodeJS keylogger. 

Beware! Do not use the "npm run install" command. We use a library (IoHook), we had to correct this library and recompile it so that it works on Windows 11 and MacOS ARM.

# WebInterface

The folder contains the web interface; it talks to the server via sockets

# server

This is a server :) 

