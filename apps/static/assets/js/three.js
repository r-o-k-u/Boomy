
let scene, sceneCSS, camera, object, controls, objectToRender, rendererWEBGL;

init();

function init() {
  console.log("THREE JS INITIALIZED")
  // core THREE.js //
  scene = new THREE.Scene();
  sceneCSS = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 6;

  //Instantiate a loader for the .json file
  const loader = new THREE.ObjectLoader();

  //Load the file
  loader.load(
    `/static/assets/3d/bb-unit-threejs/bb-unit.json`,
    // onLoad callback
    // Here the loaded data is assumed to be an object
    function (obj) {
      // Add the loaded object to the scene
      scene.add(obj);
    },

    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },

    // onError callback
    function (err) {
      console.error("An error happened");
    }
  );



  rendererWEBGL = new THREE.WebGLRenderer( { alpha: true } );
  rendererWEBGL.setSize( window.innerWidth, window.innerHeight );
  document.getElementById('boomy3D').appendChild( rendererWEBGL.domElement );
}
