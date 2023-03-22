import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Preload from "preload-it";
import "./style.css";
import Stats from 'three/examples/jsm/libs/stats.module.js';

let stats, model, camera, scene, renderer, controls, plane, material;
const group = new THREE.Group();
const preload = Preload();
preload.fetch(["epod2_split3.glb"]).then((items) => {
  console.log(items);
});

preload.oncomplete = (items) => {
  init();
  animate();
  const container2 = document.getElementById("container2");
  container2.style.opacity = 0;
  container2.remove();
  console.log(items);
};

preload.onprogress = (event) => {
  document.getElementById("progress").textContent = document.getElementById(
    "progress-bar"
  ).style.width = event.progress + "%";
};

preload.onfetched = (item) => {
  document.getElementById("loaded-items").innerHTML +=
    "> " + item.fileName + " <strong>[" + item.size + "]</strong><br>";
};

preload.onerror = (item) => {
  console.log(item);
};
gsap.registerPlugin(ScrollTrigger, TextPlugin);

function init() {
  // Programmatically generate html and WebGL container (WebGL Framework Threejs)
  let container = document.createElement("div");
  container.id = "container";
  container.className = "container";
  document.body.appendChild(container);

  let title = document.createElement("div");
  title.innerHTML = "<h1>MEET ePod 2</h1>";
  title.className = "title";
  title.id = "title";
  document.body.appendChild(title);

  let subtitle = document.createElement("div");
  subtitle.innerHTML =
    "<h2><b>SCROLL DOWN</b> TO EXPLORE<br>ALL THE UPGRADES</h2>";
  subtitle.id = "subtitle";
  subtitle.className = "subtitle";
  document.body.appendChild(subtitle);

  let start = document.createElement("div");
  start.id = "start";
  start.className = "start";
  start.style = "top:0";
  document.body.appendChild(start);

  let pods = document.createElement("div");
  pods.id = "pods";
  pods.className = "pods";
  document.body.appendChild(pods);

  let podstext = document.createElement("div");
  podstext.innerHTML =
    "<h2><b>COMPATIBLE</b> WITH ALL<br>EXISTING ePod PODS</h2>";
  podstext.id = "podstext";
  podstext.className = "podstext";
  document.body.appendChild(podstext);

  let led = document.createElement("div");
  led.id = "led";
  led.className = "led";
  document.body.appendChild(led);

  let ledtext = document.createElement("div");
  ledtext.innerHTML =
    "<h2>OPTIMISED FOR<b> MAXIMUM</b><br><b>VISIBILITY</b>, SO YOU<br>ALWAYS KNOW WHEN<br>YOU'RE GOOD TO GO</h2>";
  ledtext.id = "ledtext";
  ledtext.className = "ledtext";
  document.body.appendChild(ledtext);

  let chip = document.createElement("div");
  chip.id = "chip";
  chip.className = "chip";
  document.body.appendChild(chip);

  let chiptext = document.createElement("div");
  chiptext.innerHTML =
    "<h2>OUR FASTEST, SMARTEST,<br>SAFEST ePod CHARGING<br>TECHNOLOGY IS SUPPORTED <br>BY A CHIP <b>NO BIGGER THAN 3 mm<sup>2</sup></h2>";
    chiptext.id = "chiptext";
    chiptext.className = "chiptext";
  document.body.appendChild(chiptext);

  let orbit = document.createElement("div");
  orbit.id = "orbit";
  orbit.className = "orbit";
  document.body.appendChild(orbit);

  // WebGL Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.physicallyCorrectLights = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.3;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  
  // environement
  // const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene = new THREE.Scene();
  scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

  // 3D Model loader 
  const matloader = new THREE.TextureLoader();
  var mattexture = matloader.load('markingsE.png' );
  mattexture.flipY = false;
  const loader = new GLTFLoader().setPath("./");
  loader.load("epod2_split3.glb", function (gltf) {
    model = gltf.scene;
    model.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    model.getObjectByName("body").material.emissive.set( 0x111111 );
    model.getObjectByName("charger").position.set( 0,-50,0 );
    model.getObjectByName("body").material.color.set( 0x2c2c2c );
    model.getObjectByName("body").material.emissiveMap=  mattexture;
    group.add(gltf.scene);
    scene.add(group);
    group.rotation.set(0, 0, 0);

    gsap.to(model.getObjectByName("pod").position, {
      scrollTrigger: {
        trigger: ".start",
        start: "800px top",
        end: "+=100%",
        toggleActions: "play none none reverse",
        scrub: false,
      },
      duration: 1,
      x: 0,
      y: 7,
      z: 0,
      ease: "power2.inOut",
    });
    gsap.fromTo(model.getObjectByName("pod").position, {y:7},{
      scrollTrigger: {
        trigger: ".pods",
        start: "top top",
        end: "+=20%",
        toggleActions: "play none none reverse",
        scrub: false,
      },
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      ease: "power2.inOut",
    });
    gsap.to(model.getObjectByName("led").material.emissive, {
      scrollTrigger: {
        trigger: ".pods",
        start: "top top",
        end: "+=60%",
        toggleActions: "play none none reverse",
        scrub: false,
      },
      duration: 1,
      r:0.1,
      g:0.1,
      b:0.1,
      ease: "power1.inOut",
      repeat: 5,
      repeatDelay: 0.5,
      yoyo:true,
    });
    gsap.to(model.getObjectByName("led").material.color, {
      scrollTrigger: {
        trigger: ".pods",
        start: "top top",
        end: "+=60%",
        toggleActions: "play none none reverse",
        scrub: false,
      },
      duration: 1,
      r:0,
      g:0,
      b:0,
      ease: "power1.inOut",
      repeat: 5,
      repeatDelay: 0.5,
      yoyo:true,
    });
    gsap.set(model.getObjectByName("pod").position, {y:0});
 
  });  
   stats = new Stats();
				container.appendChild( stats.dom );

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.castShadow = true;
  directionalLight.position.set( 0, 20, 100 );
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.right = 120;
  directionalLight.shadow.camera.left = - 120;
  directionalLight.shadow.camera.top	= 120;
  directionalLight.shadow.camera.bottom = - 120;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.bias = - 0.01;
scene.add( directionalLight );
// scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );

  var mattexture2 = matloader.load('vuse_chip.png' );
  mattexture2.flipY = true;
  const geometry = new THREE.PlaneGeometry( 19.7, 65 );
  material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.FrontSide, map:mattexture2,transparent:true,opacity:0} );
  plane = new THREE.Mesh( geometry, material );
  plane.position.set(0.2,-16.5,6);
  group.add( plane );

  gsap.to(plane.material, {
    scrollTrigger: {
      trigger: ".chip",
      start: "900px top",
      end: "+=30%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    opacity: 1,
    ease: "power2.inOut",
  });
  gsap.fromTo(plane.material, {opacity:1},{
    scrollTrigger: {
      trigger: ".orbit",
      start: "top top",
      end: "30%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    opacity: 0,
    ease: "power2.inOut",
  });
  gsap.set(plane.material, {opacity:0});
  // epod color change
  const color1 = document.getElementById( 'color1' );
  color1.addEventListener ("click", function() {
    let tlc1 = gsap.timeline({});
    tlc1.fromTo(group.rotation,{x: 0, y: 0, z: 0}, {duration: 3, x: 0, y: 6.28319, z: 0, ease: "elastic.out",});
    tlc1.to(document.getElementById("colorid"), {duration:0.5, text: "BLACK", ease:"none"},"-=3");
    setTimeout(() => {model.getObjectByName("body").material.emissive.set( 0x111111 );model.getObjectByName("body").material.color.set( 0x171717 );},200);
});
  const color2 = document.getElementById( 'color2' );
  color2.addEventListener ("click", function() {
    let tlc2 = gsap.timeline({});
    tlc2.fromTo(group.rotation,{x: 0, y: 0, z: 0}, {duration: 3, x: 0, y: 6.28319, z: 0, ease: "elastic.out",});
    tlc2.to(document.getElementById("colorid"), {duration:0.5, text: "GRAPHITE", ease:"none"},"-=3");
    setTimeout(() => {model.getObjectByName("body").material.emissive.set( 0x111111 );model.getObjectByName("body").material.color.set( 0x2c2c2c );},200);//graphite
  });
  const color3 = document.getElementById( 'color3' );
  color3.addEventListener ("click", function() {
    let tlc3 = gsap.timeline({});
    tlc3.fromTo(group.rotation,{x: 0, y: 0, z: 0}, {duration: 3, x: 0, y: 6.28319, z: 0, ease: "elastic.out",});
    tlc3.to(document.getElementById("colorid"), {duration:0.5, text: "SILVER", ease:"none"},"-=3");
    setTimeout(() => {model.getObjectByName("body").material.emissive.set( 0x333333 ); model.getObjectByName("body").material.color.set( 0xC0C0C0 )},200); //silver    
  });
  const color4 = document.getElementById( 'color4' );
  color4.addEventListener ("click", function() {
    let tlc4 = gsap.timeline({});
    tlc4.fromTo(group.rotation,{x: 0, y: 0, z: 0}, {duration: 3, x: 0, y: 6.28319, z: 0, ease: "elastic.out",});
    tlc4.to(document.getElementById("colorid"), {duration:0.5, text: "GOLD", ease:"none"},"-=3");
    setTimeout(() => {model.getObjectByName("body").material.emissive.set( 0x333333 ); model.getObjectByName("body").material.color.set( 0xD7BE69 )},200); //gold    
  });
  const color5 = document.getElementById( 'color5' );
  color5.addEventListener ("click", function() {
    let tlc5 = gsap.timeline({});
    tlc5.fromTo(group.rotation,{x: 0, y: 0, z: 0}, {duration: 3, x: 0, y: 6.28319, z: 0, ease: "elastic.out",});
    tlc5.to(document.getElementById("colorid"), {duration:0.5, text: "DARK MIST", ease:"none"},"-=3");
    setTimeout(() => {model.getObjectByName("body").material.emissive.set( 0x333333 ); model.getObjectByName("body").material.color.set( 0x005CAF )},200); //dark mist (blue)        
  });
  const color6 = document.getElementById( 'color6' );
  color6.addEventListener ("click", function() {
    let tlc6 = gsap.timeline({});
    tlc6.fromTo(group.rotation,{x: 0, y: 0, z: 0}, {duration: 3, x: 0, y: 6.28319, z: 0, ease: "elastic.out",});   
    tlc6.to(document.getElementById("colorid"), {duration:0.5, text: "CYAN", ease:"none"},"-=3");
    setTimeout(() => {model.getObjectByName("body").material.emissive.set( 0x333333 ); model.getObjectByName("body").material.color.set( 0x00FFFF )},200); //cyan    
  });
  const color7 = document.getElementById( 'color7' );
  color7.addEventListener ("click", function() {
    let tlc7 = gsap.timeline({});
    tlc7.fromTo(group.rotation,{x: 0, y: 0, z: 0}, {duration: 3, x: 0, y: 6.28319, z: 0, ease: "elastic.out",});   
    tlc7.to(document.getElementById("colorid"), {duration:0.5, text: "ROSE GOLD", ease:"none"},"-=3");
    setTimeout(() => {model.getObjectByName("body").material.emissive.set( 0x333333 ); model.getObjectByName("body").material.color.set( 0xe0bfb8 )},200); //rose gold
  });

  // 3D Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false;
  controls.enableZoom = false;
  controls.minDistance = 55;
  controls.enableDamping = true;
  controls.maxDistance = 850;
  controls.autoRotate = false;
  controls.update();

  // Event listener for window resizing
  window.addEventListener("resize", onWindowResize);

  // intro animation
  gsap.fromTo(
    container,
    { opacity: 0 },
    { duration: 1, opacity: 1, ease: "power2.inOut" }
  );
  gsap.fromTo(
    camera.position,
    { x: 0, y: -70, z: 100 },
    { duration: 3, x: 0, y: 15, z: 200, ease: "power2.inOut" }
  );
  gsap.fromTo(
    controls.target,
    { x: 0, y: 200, z: 100 },
    { duration: 3, x: 0, y: 15, z: 0, ease: "power2.inOut" }
  );
  gsap.fromTo(
    group.rotation,
    { x: 0, y: 0, z: 0 },
    { duration: 3, x: 0, y: 6.28319, z: 0, ease: "power2.inOut" }
  );
  gsap.fromTo(
    title,
    { y: "-200px" },
    { duration: 3, y: "0", ease: "power2.inOut", delay: 0.5 }
  );
  gsap.fromTo(
    subtitle,
    { y: "-200px" },
    {
      duration: 3,
      y: "0",
      ease: "power2.inOut",
      delay: 0.5,
      onComplete: bounce,
    }
  );

  // Scrolling animations code on GSAP ScrollTrigger framework
  // From Intro to pod scene
  gsap.set(title, { opacity: 1 });
  gsap.set(subtitle, { opacity: 1 });
  gsap.set(camera.position, { x: 0, y: 15, z: 200 });
  gsap.set(controls.target, { x: 0, y: 15, z: 0 });
  gsap.to(controls.target, {
    scrollTrigger: {
      trigger: ".start",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "first",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: -20,
    y: 40,
    z: 0,
    ease: "power2.inOut",
  });
  gsap.to(camera.position, {
    scrollTrigger: {
      trigger: ".start",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "first",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: -20,
    y: 40,
    z: 60,
    ease: "power2.inOut",
  });
  gsap.to(group.rotation, {
    scrollTrigger: {
      trigger: ".start",
      start: "top top",
      end: "+=100%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: 0,
    y: 6,
    z: 0,
    ease: "power2.inOut",
  });
  gsap.to(title, {
    scrollTrigger: {
      trigger: ".start",
      start: "top top",
      end: "+=100%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    opacity: 0,
    ease: "power2.inOut",
  });
  gsap.to(subtitle, {
    scrollTrigger: {
      trigger: ".start",
      start: "top top",
      end: "+=100%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    opacity: 0,
    ease: "power2.inOut",
  });
  gsap.to(podstext, {
    scrollTrigger: {
      trigger: ".start",
      start: "bottom bottom",
      end: "+=50%",
      toggleActions: "play none none reverse",
      scrub:0.2,
    },
    duration: 1,
    x:-20,
    opacity: 1,
    ease: "power2.inOut",
  });
  // From pod scene to led scene
  gsap.set(camera.position, { x: -20, y: 40, z: 60 });
  gsap.set(controls.target, { x: -20, y: 40, z: 0 });
  gsap.set(group.rotation, { x: 0, y: 6, z: 0 });
  gsap.fromTo(
    podstext,
    { opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".pods",
        start: "top top",
        end: "+=50%",
        toggleActions: "play none none reverse",
        scrub: 0.2,
      },
      duration: 1,
      opacity: 0,
      ease: "power2.inOut",
    });
  gsap.to(camera.position, {
    scrollTrigger: {
      trigger: ".pods",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "second",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: 0,
    y: -10,
    z: 60,
    ease: "power2.inOut",
  });
  gsap.to(controls.target, {
    scrollTrigger: {
      trigger: ".pods",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "second",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: 20,
    y: -10,
    z: 0,
    ease: "power2.inOut",
  });
  gsap.to(group.rotation, {
    scrollTrigger: {
      trigger: ".pods",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "second",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: 0,
    y: 0,
    z: 0,
    ease: "power2.inOut",
  });
  gsap.to(ledtext, {
    scrollTrigger: {
      trigger: ".pods",
      start: "800px top",
      end: "+=50%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x:20,
    opacity: 1,
    ease: "power2.inOut",
  });
  // From led scene to chip scene
  gsap.set(camera.position, { x: 0, y: -10, z: 60 });
  gsap.set(controls.target, { x: 20, y: -10, z: 0 });
  gsap.set(group.rotation, { x: 0, y: 0, z: 0 });
  gsap.set(ledtext, { opacity: 1 });
  gsap.set(chiptext, { opacity: 0 });
  gsap.to(camera.position, {
    scrollTrigger: {
      trigger: ".chip",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "second",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: 20,
    y: 0,
    z: 140,
    ease: "power2.inOut",
  });
  gsap.to(controls.target, {
    scrollTrigger: {
      trigger: ".chip",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "second",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: 20,
    y: 0,
    z: 0,
    ease: "power2.inOut",
  });
  gsap.to(group.rotation, {
    scrollTrigger: {
      trigger: ".chip",
      start: "top top",
      end: "+=100%",
      markers: false,
      id: "second",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x: 0,
    y: 6.28319,
    z: 0,
    ease: "power2.inOut",
  });

  gsap.to(ledtext, {
    scrollTrigger: {
      trigger: ".chip",
      start: "top top",
      end: "+=50%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    opacity: 0,
    ease: "power2.inOut",
  });
  gsap.to(chiptext, {
    scrollTrigger: {
      trigger: ".chip",
      start: "600px top",
      end: "+=100%",
      toggleActions: "play none none reverse",
      scrub: 0.2,
    },
    duration: 1,
    x:25,
    opacity: 1,
    ease: "power2.inOut",
  });
    // From Chip scene to orbit control
    const menubutton = document.getElementById("buttonmenu");
    gsap.set(menubutton, { opacity: 0,y:50});
    gsap.set(camera.position, { x: 20, y: 0, z: 140 });
    gsap.set(controls.target, { x: 20, y: 0, z: 0 });
    gsap.set(group.rotation, { x: 0, y: 6.28319, z: 0 });
    gsap.to(camera.position, {
      scrollTrigger: {
        trigger: ".orbit",
        start: "top top",
        end: "+=100%",
        markers: false,
        id: "second",
        toggleActions: "play none none reverse",
        scrub: 0.2,
      },
      duration: 1,
      x: 0,
      y: 0,
      z: 140,
      ease: "power2.inOut",
    });
    gsap.to(chiptext, {
      scrollTrigger: {
        trigger: ".orbit",
        start: "top top",
        end: "+=50%",
        toggleActions: "play none none reverse",
        scrub: 0.2,
      },
      duration: 1,
      x:0,
      opacity: 0,
      ease: "power2.inOut",
    });
    gsap.to(controls.target, {
      scrollTrigger: {
        trigger: ".orbit",
        start: "top top",
        end: "+=100%",
        markers: false,
        id: "second",
        toggleActions: "play none none reverse",
        scrub: 0.2,
        onEnter: startorbit,
        onEnterBack: stoptorbit,
      },
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      ease: "power2.inOut",
    });
    gsap.to(group.rotation, {
      scrollTrigger: {
        trigger: ".orbit",
        start: "top top",
        end: "+=100%",
        markers: false,
        id: "second",
        toggleActions: "play none none reverse",
        scrub: 0.2,
      },
      duration: 1,
      x: 0,
      y: 6.28319,
      z: 0,
      ease: "power2.inOut",
    });
    gsap.to(buttonmenu, {
      scrollTrigger: {
        trigger: ".orbit",
        start: "top top",
        end: "+=100%",
        toggleActions: "play none none reverse",
        scrub:0.2,
      },
      duration: 1,
      opacity: 1,
      y:0,
      ease: "power2.inOut",
    });
  // setting content
  gsap.set(podstext, { opacity: 0 });
  gsap.set(ledtext, { opacity: 0 });

  // functions to control the orbit interaction at the end
  function startorbit() {
    controls.enabled = true;
  }
  function stoptorbit() {
    controls.enabled = false;
  }
  function bounce() {
    var elem = document.querySelector("#subtitle");
    elem.style.animation = "bounce 5s ease-in-out 2s infinite alternate both";
  }
} // end of the init function

// Window resize function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stats.begin();
  render();
  stats.end();
}

// Render loop
function render() {
  renderer.render(scene, camera);
}