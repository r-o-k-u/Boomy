from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import pyaudio
import threading
from vosk import Model, KaldiRecognizer
import time
from modules.recognize import recognize_from_audio

app = Flask(__name__)
socketio = SocketIO(app)

# Global variables to store audio source information
audio_source = "Default"  # Default audio device or WebSocket
connected_clients = set()

# Global variable to store the last recognition time
last_recognition_time = 0


# dynamically select audio source
@socketio.on('change_source', namespace='/audio')
def change_source(data):
    global audio_source
    audio_source = data['source']
    emit('source_info', {'source': audio_source, 'clients': len(connected_clients)}, namespace='/audio')

def stream_audio():
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000  # Vosk model sample rate

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    global last_recognition_time
    while True:
        if audio_source == "Default":
            # Receive audio from default audio device
            data = stream.read(CHUNK)
            #print("Audio data:", data[:10]) 
            #print("Received audio from default audio device")  # Print when receiving audio from default device
        else:
            # Check if any clients are connected
            if len(connected_clients) > 0:
                data = b""
                # Receive audio from WebSocket client
                while True:
                    packet = request.environ.get('wsgi.input').read(CHUNK)
                    data += packet
                    if len(packet) < CHUNK:
                        break
                #print("Received audio from WebSocket client")  # Print when receiving audio from WebSocket client
            else:
                data = None
                print("No WebSocket clients connected")  # Print when no WebSocket clients are connected

        if data:
            current_time = time.time()
            # Check if enough time has passed since the last recognition
            if current_time - last_recognition_time >= 0.1:  # Adjust the delay time as needed
                # recognize_from_audio(data)
                last_recognition_time = current_time

# Route to serve webpage
@app.route('/')
def index():
    return render_template('index.html')

# WebSocket connection event
@socketio.on('connect', namespace='/audio')
def connect():
    connected_clients.add(request.sid)
    emit('source_info', {'source': audio_source, 'clients': len(connected_clients)})

# WebSocket disconnection event
@socketio.on('disconnect', namespace='/audio')
def disconnect():
    connected_clients.remove(request.sid)
    emit('source_info', {'source': audio_source, 'clients': len(connected_clients)})
def main():
    #setup_led()

    try:
        print("Voice assistant is running. Press ESC to exit.")
            # Adjust `listen_for_wake_word` to properly manage stream lifecycle
            # if listen_for_wake_word(recognizer, audio_interface, FORMAT, CHANNELS, RATE, CHUNK):
            #     wake_word_detected()
        stream_audio()
    finally:
        print("Voice assistant has shut down.")
if __name__ == '__main__':
    main()
    socketio.run(app, debug=True)
