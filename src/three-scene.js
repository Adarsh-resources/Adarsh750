import * as THREE from 'three';

export class ThreeScene {
  constructor() {
    this.canvas = document.querySelector('#webgl');
    this.scene = new THREE.Scene();
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
    
    this.init();
  }

  init() {
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createParticles();
    this.createGeometricShapes();
    this.addEventListeners();
    this.animate();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Point lights
    const pointLight1 = new THREE.PointLight(0x6c5ce7, 2, 10);
    pointLight1.position.set(2, 3, 4);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xfd79a8, 2, 10);
    pointLight2.position.set(-2, -3, 4);
    this.scene.add(pointLight2);
  }

  createParticles() {
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorPalette = [
      new THREE.Color(0x6c5ce7),
      new THREE.Color(0xa29bfe),
      new THREE.Color(0xfd79a8),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random colors from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
  }

  createGeometricShapes() {
    this.shapes = [];
    
    // Enhanced material with glow effect
    const createGlowMaterial = (color) => {
      return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.1,
        wireframe: true,
        emissive: color,
        emissiveIntensity: 0.3
      });
    };

    // Torus - larger and more prominent
    const torusGeometry = new THREE.TorusGeometry(2, 0.6, 20, 60);
    const torus = new THREE.Mesh(torusGeometry, createGlowMaterial(0x6c5ce7));
    torus.position.set(5, 1, -4);
    this.shapes.push({ mesh: torus, speed: 0.3, amplitude: 0.5 });
    this.scene.add(torus);

    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const icosahedron = new THREE.Mesh(icoGeometry, createGlowMaterial(0xfd79a8));
    icosahedron.position.set(-5, -1, -3);
    this.shapes.push({ mesh: icosahedron, speed: 0.4, amplitude: 0.6 });
    this.scene.add(icosahedron);

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(1, 0);
    const octahedron = new THREE.Mesh(octaGeometry, createGlowMaterial(0xa29bfe));
    octahedron.position.set(4, -2.5, -5);
    this.shapes.push({ mesh: octahedron, speed: 0.5, amplitude: 0.4 });
    this.scene.add(octahedron);

    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(0.9, 0);
    const dodecahedron = new THREE.Mesh(dodecaGeometry, createGlowMaterial(0x00cec9));
    dodecahedron.position.set(-4, 2.5, -4);
    this.shapes.push({ mesh: dodecahedron, speed: 0.35, amplitude: 0.5 });
    this.scene.add(dodecahedron);

    // TorusKnot - central attraction
    const knotGeometry = new THREE.TorusKnotGeometry(0.8, 0.25, 128, 24);
    const torusKnot = new THREE.Mesh(knotGeometry, createGlowMaterial(0x55efc4));
    torusKnot.position.set(0, 3.5, -6);
    this.shapes.push({ mesh: torusKnot, speed: 0.25, amplitude: 0.7 });
    this.scene.add(torusKnot);

    // Add sphere
    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, createGlowMaterial(0xffeaa7));
    sphere.position.set(-2, -3, -4);
    this.shapes.push({ mesh: sphere, speed: 0.45, amplitude: 0.55 });
    this.scene.add(sphere);
  }

  addEventListeners() {
    // Resize
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Mouse move with enhanced tracking
    window.addEventListener('mousemove', (event) => {
      this.targetMouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.targetMouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    });

    // Scroll with enhanced effects
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / maxScroll;
      
      // Rotate particles based on scroll
      if (this.particles) {
        this.particles.rotation.y = scrollProgress * Math.PI * 3;
        this.particles.rotation.z = scrollProgress * Math.PI;
      }
      
      // Move shapes based on scroll
      this.shapes.forEach((shape, index) => {
        shape.mesh.position.z = -4 + scrollProgress * 2 * (index % 2 === 0 ? 1 : -1);
      });
    });
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse following with easing
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;

    // Animate particles with noise-like movement
    if (this.particles) {
      this.particles.rotation.x = elapsedTime * 0.03 + Math.sin(elapsedTime * 0.5) * 0.1;
      this.particles.rotation.y += 0.0015;
      
      // Enhanced mouse influence with lag
      this.particles.rotation.x += this.mouse.y * 0.15;
      this.particles.rotation.y += this.mouse.x * 0.15;
    }

    // Animate shapes with unique patterns
    this.shapes.forEach((shapeData, index) => {
      const { mesh, speed, amplitude } = shapeData;
      
      // Complex rotation
      mesh.rotation.x = elapsedTime * speed + Math.sin(elapsedTime * 0.5) * 0.5;
      mesh.rotation.y = elapsedTime * speed * 0.8 + Math.cos(elapsedTime * 0.3) * 0.5;
      mesh.rotation.z = Math.sin(elapsedTime * speed * 0.5) * 0.3;
      
      // Floating with varied patterns
      const floatY = Math.sin(elapsedTime * speed + index * Math.PI * 0.5) * amplitude * 0.3;
      const floatX = Math.cos(elapsedTime * speed * 0.7 + index) * amplitude * 0.15;
      mesh.position.y += floatY * 0.01;
      mesh.position.x += floatX * 0.005;
      
      // Subtle scale pulsing
      const scale = 1 + Math.sin(elapsedTime * speed * 2) * 0.05;
      mesh.scale.setScalar(scale);
    });

    // Camera movement with smooth follow
    const targetCameraX = this.mouse.x * 0.8;
    const targetCameraY = this.mouse.y * 0.6;
    this.camera.position.x += (targetCameraX - this.camera.position.x) * 0.02;
    this.camera.position.y += (targetCameraY - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, -2);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Next frame
    requestAnimationFrame(() => this.animate());
  }
}
