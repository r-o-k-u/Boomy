
document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/audio');

    // Event listener for audio source change
    document.getElementById('sourceForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var selectedSource = document.getElementById('sourceSelect').value;
        socket.emit('change_source', {source: selectedSource});
    });

    // Event listener for updating audio source info
    socket.on('source_info', function(data) {
        document.getElementById('audioInfo').innerHTML = 'Audio source: ' + data.source + ', Connected clients: ' + data.clients;
    });

    // Event listener for receiving recognized text
    socket.on('text', function(data) {
        document.getElementById('recognizedText').innerHTML = data.text;
    });

    // Event listener for receiving audio data and updating the audio visualizer
    socket.on('audio_data', function(data) {
        // Process audio data or update the audio visualizer
        console.log('Received audio data:', data);
    });

    // Request audio source options when page loads
    socket.emit('get_audio_sources');
});
document.addEventListener('DOMContentLoaded', function () {
    const videoForm = document.getElementById('videoForm'); 
    const videoFrame = document.getElementById('videoFrame');
    const changeSourceBtn = document.getElementById('changeSourceBtn');

    videoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(videoForm);
        fetch('/submit-settings', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        }); 
    });

   
});
