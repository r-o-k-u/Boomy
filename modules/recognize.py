import json
from vosk import Model, KaldiRecognizer
RATE = 16000
CHUNK = 1024
model_path = "./static/models/vosk-model-small-en-us-0.15"
#model_path = "./static/models/vosk-model-en-us-0.22"
model = Model(model_path)  # Load Vosk model
recognizer = KaldiRecognizer(model, RATE)
def recognize_from_audio(stream):
    recognizer.Reset()
    while True:
        if recognizer.AcceptWaveform(stream):
            result = json.loads(recognizer.Result())
            text = result.get("text", "")
            print(f"Recognized: {text}")
            if "hey" in text.lower():
                #respond_with_text("Hello, what can I help you with?")
               # respond_with_minion_voice("Hello, what can I help you with?")
                #respond_with_minion_voice_librosa("Hello, what can I help you with?")
                # respond_with_dynamic_voice("Hello, what can I help you with?")
                return text
                # No need to recreate recognizer; continue using it for further recognition
        else:
            # This else block can continuously fetch partial results if needed
            partial = json.loads(recognizer.PartialResult())
            print(f"Partial: {partial.get('partial', '')}")
            # pass
            return partial

