// Function to initialize Three.js scene, camera, renderer, and object
function initThreeJS() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();
  //renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(400,400);
  document.getElementById('threejs3dobject').appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry();
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  // Function to update object orientation based on accelerometer data
  function updateOrientation(data) {
    cube.rotation.x = data.x;
    cube.rotation.y = data.y;
    cube.rotation.z = data.z;
  }

  // WebSocket connection to receive accelerometer data
  var socket = new WebSocket('ws://' + window.location.hostname + ':50100');
  socket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    console.log("socket data",data)
    updateOrientation(data);
    updateCoordinateDisplay(data);
    updateCoordinateText(data);
  };

  // Function to update HTML element to display coordinates
function updateCoordinateDisplay(data) {
  var coordinateDisplay = document.getElementById('coordinateDisplay');
  coordinateDisplay.innerText = 'X: ' + data.x.toFixed(2) + ', Y: ' + data.y.toFixed(2) + ', Z: ' + data.z.toFixed(2);
}

// Function to create and update Three.js text object to display coordinates inside the scene
function updateCoordinateText(data) {
  // Remove existing text object if exists
  scene.remove(coordinateTextMesh);

  // Create new text geometry
  var textGeometry = new THREE.TextGeometry('X: ' + data.x.toFixed(2) + ', Y: ' + data.y.toFixed(2) + ', Z: ' + data.z.toFixed(2), {
      font: 'helvetiker',
      size: 0.2,
      height: 0.02,
  });
  var textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  coordinateTextMesh = new THREE.Mesh(textGeometry, textMaterial);
  coordinateTextMesh.position.set(0, 2, 0); // Adjust position as needed
  scene.add(coordinateTextMesh);
}


  // Function to render the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

// Initialize Three.js when the page is loaded
window.onload = function () {
  initThreeJS();
};
