"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import GUI from "lil-gui";
import gsap from "gsap";
const ThreeScene = () => {

  useEffect(() => {
    // create a Scene
    const scene = new THREE.Scene();

    //set the background color of scene
    // scene.background = new THREE.Color(0x87ceeb); // Light blue background

    // Texture Loader for background image
    const loader = new THREE.TextureLoader();


    //create a matcap that uses on object as material property
    const matcap = loader.load("http://1.bp.blogspot.com/-ri21lsFC8No/UxXskdcgIJI/AAAAAAAAB-k/_i8tZ8B9YPE/s1600/red.jpg")
    matcap.colorSpace = THREE.SRGBColorSpace;


    //create a exture to add on object as material
    const doorcolor = loader.load("https://i.pinimg.com/236x/e3/5d/12/e35d12bd7abbcc875db937d8ce43d58a--environment-maps.jpg")
    doorcolor.colorSpace = THREE.SRGBColorSpace;



    //set the environment of scene 
    // const rgbeloader = new RGBELoader();
    loader.load('https://iso.500px.com/wp-content/uploads/2014/08/500-px-banner.jpg', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      // Set it as the scene environment and background
      scene.background = texture;
      scene.environment = texture;
    });

    // create a Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,  // aspect ratio
      0.1,                                    //min  range
      1000                                   // max ranage 
    );
    camera.position.set(0, 2, 10);               //set camera position

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });    // create a renderer
    renderer.setSize(window.innerWidth, window.innerHeight);     //set render size
    renderer.shadowMap.enabled = true; // Enable shadows to render      
    document.body.appendChild(renderer.domElement);   //apend that to its child

    // create OrbitControls for control the camera
    const controls = new OrbitControls(camera, renderer.domElement);
   
    controls.enableDamping = true; // Enable damping for smooth interactions
    controls.dampingFactor = 0.05;   //smoothness unit

    // Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();        //update camera position according to size of window
    };
    window.addEventListener("resize", handleResize);     // call eventlistener

    // Create a group of geometries
    const group = new THREE.Group();

    // Box
    const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 16);
    const torusMaterial = new THREE.MeshMatcapMaterial({color:"none"});
    torusMaterial.matcap = matcap
     torusMaterial.wireframe=false;

    // boxMaterial.wireframe=true;
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);

    torus.castShadow = true; // Enable shadow casting
    torus.position.set(-4, 0, 0);
    group.add(torus);

    // Circle
    const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const sphereMaterial = new THREE.MeshMatcapMaterial();
    sphereMaterial.map = matcap
    // sphereMaterial.alphaMap=matcap
    // sphereMaterial.transparent=true
    sphereMaterial.wireframe=false;
    // sphereMaterial.roughness=1;
    sphereMaterial.metalness=2.5;

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.receiveShadow = true;
    sphere.position.set(4, 0, 0);
    group.add(sphere);

    // Plane
    const planeGeometry = new THREE.PlaneGeometry(3, 3, 5, 5);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff,wireframe:true});
    // planeMaterial.map = matcap
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true; // Enable shadow reception
    plane.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
    plane.position.set(0, 0, 0)
    group.add(plane);

    scene.add(group);

    // Lighting
    const ambientLight = new THREE.AmbientLight("white", 10); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight("red", 30);     //create a point light
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;               //enable sjadow
    scene.add(pointLight);

//create a gui 
const gui = new GUI();

gui.add(camera.position,"y",0,1000,5)


//gui folder for the sphere geometry
const spherefolder = gui.addFolder("SPHERE")
spherefolder.add(sphere.position,"x",0,10,0.01)
spherefolder.add(sphere.position,"y",0,10,0.01)
spherefolder.addColor(sphereMaterial, 'color').onChange((value) => {
  sphereMaterial.color.set(value); // Update the color dynamically
});
spherefolder.add(sphereMaterial, 'wireframe').name('Toggle Wireframe');
spherefolder.close();


//folder for the plane geometry
const planefolder = gui.addFolder("PLANE")
planefolder.add(plane.position,"x",0,10,0.01)
planefolder.add(plane.position,"y",0,100,0.01)
planefolder.add(planeMaterial,"wireframe").name('Toggle Wireframe')
planefolder.addColor(planeMaterial,'color').onChange((value)=>{
  planeMaterial.color.set(value);
})
planefolder.close();


//gui folder for torus geometry
const torusfolder= gui.addFolder("TORUS");
torusfolder.add(torus.position,"x",0,10,0.01)
torusfolder.add(torus.position,"y",0,10,0.01)
torusfolder.add(torusMaterial,'wireframe').name('Toggle Wireframe')
torusfolder.addColor(torusMaterial,'color').onChange((value)=>{
  torusMaterial.color.set(value);
})
torusfolder.close();







// Add custom styles for the GUI
const style = document.createElement('style');
style.textContent = `
  .lil-gui {
    background-color: #2c3e50 !important; /* Change background color */
    color: #ecf0f1 !important;           /* Change text color */
  }

  .lil-gui .dg .cr.number input[type="text"],
  .lil-gui .cr.color input[type="color"] {
    background-color: #34495e !important; /* Input background color */
    color: #ecf0f1 !important;            /* Input text color */
  }

  .lil-gui .title {
    color: #e74c3c !important; /* Folder title color */
  }

  .lil-gui .close-button {
    color: #e74c3c !important; /* Close button color */
  }
`;
document.head.appendChild(style);
gsap.to(plane.rotation,{duration:2,delay:2,x:15})   //plane rotate animation show after 2s for 2s in x direction

    // Mouse interaction for rotating the group
    let mouseX = 0;                              //let the mouse x position is 0 initialy
    let mouseY = 0;                             //let the mouse y position is 0   initioly
    let targetX = 0;
    let targetY = 0;
    const damping = 0.01; // Controls the smoothness

    const onMouseMove = (event) => {
      const halfWidth = window.innerWidth ;
      const halfHeight = window.innerHeight ;
      mouseX = (event.clientX - halfWidth) / halfWidth;
      mouseY = (event.clientY - halfHeight) / halfHeight;
    };
    window.addEventListener("mousemove", onMouseMove);      // add mouse event listener

    // Animation loop
    const animate = () => {


// Smoothly update the target rotation
targetX += (mouseX - targetX) * damping;
targetY += (mouseY - targetY) * damping;

// Apply rotation
plane.rotation.y = targetX * Math.PI*4; // Rotate horizontally
plane.rotation.x = targetY * Math.PI*4; // Rotate vertically
// camera.position.x = mouseY * Math.PI*2;
// camera.position.y = mouseX * Math.PI*2;
      // group.rotation.y += 0.01; // Continuous rotation  group along y axis
      // plane.rotation.y += 0.05               // rotate the plane along to y axis
      sphere.rotation.x += 0.03               // rotate the sphere object along the x axis
      sphere.rotation.y += 0.03
      torus.rotation.y += 0.03               // rotate the torus object along y axis
      torus.rotation.x += 0.03 
      camera.position.x = Math.sin(mouseX * Math.PI * 2) * 7; //camera change position based on mouse X
      camera.position.z = Math.cos(mouseX * 2 * Math.PI) * 7; // camera change position  based on mouse X
      camera.position.y = Math.cos(mouseY * 2 * Math.PI) * 7; //camera change position based on mouse Y
      controls.update(); // Update controls
      camera.lookAt(group.position) //camera look the group all time 
      renderer.render(scene, camera);    // render the renderer 
      requestAnimationFrame(animate);   //call the animate function all every frame of the device 
    };
    animate();         //call the animate function
  }, []);

  return null;         // return the null 

};
export default ThreeScene;
