import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const canvas = document.querySelector("[data-cosmos-canvas]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !reduceMotion) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    canvas,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  const isCompact = window.innerWidth < 760;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isCompact ? 0.95 : 1.15);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 160);
  camera.position.z = 18;

  const clock = new THREE.Clock();
  const pointer = new THREE.Vector2(0, 0);
  const scroll = { value: 0, target: 0 };

  const nebula = new THREE.Group();
  scene.add(nebula);

  const colors = [0xf2c76f, 0x49bd88, 0xd8b6ff, 0xffffff];
  const particleCount = isCompact ? 300 : 560;
  const positions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const tunnel = i / particleCount;
    const angle = tunnel * Math.PI * 34 + Math.random() * Math.PI * 2;
    const radius = 3.2 + Math.random() * 12 + Math.sin(tunnel * 28) * 1.8;
    const z = -tunnel * 115 + Math.random() * 8;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.68;
    positions[i * 3 + 2] = z;

    const color = new THREE.Color(colors[i % colors.length]);
    color.lerp(new THREE.Color(0x06110e), Math.random() * 0.28);
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

  const particles = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.82,
      size: 0.08,
      transparent: true,
      vertexColors: true
    })
  );
  nebula.add(particles);

  const rings = new THREE.Group();
  scene.add(rings);

  for (let i = 0; i < 5; i += 1) {
    const geometry = new THREE.TorusGeometry(3.2 + i * 0.78, 0.01, 8, 96);
    const material = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: colors[i % colors.length],
      opacity: 0.18 - i * 0.012,
      transparent: true
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.position.z = -i * 5.8;
    ring.rotation.x = Math.PI * 0.5;
    ring.rotation.y = i * 0.12;
    rings.add(ring);
  }

  const gateGeometry = new THREE.IcosahedronGeometry(2.4, 2);
  const gateMaterial = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: 0xf2c76f,
    opacity: 0.18,
    transparent: true,
    wireframe: true
  });
  const gate = new THREE.Mesh(gateGeometry, gateMaterial);
  gate.position.set(6.8, -0.2, -8);
  scene.add(gate);

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nextRatio = Math.min(window.devicePixelRatio || 1, width < 760 ? 0.95 : 1.15);
    renderer.setPixelRatio(nextRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function updateScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scroll.target = window.scrollY / max;
  }

  let lastFrame = 0;

  function animate(frameTime = 0) {
    requestAnimationFrame(animate);
    if (document.hidden || frameTime - lastFrame < 26) return;
    lastFrame = frameTime;

    const elapsed = clock.getElapsedTime();
    scroll.value += (scroll.target - scroll.value) * 0.065;

    nebula.rotation.z = elapsed * 0.055 + scroll.value * 2.2;
    nebula.rotation.x = Math.sin(elapsed * 0.19) * 0.08 + pointer.y * 0.16;
    nebula.rotation.y = Math.cos(elapsed * 0.16) * 0.1 + pointer.x * 0.22;

    particles.position.z = (elapsed * 3.1 + scroll.value * 54) % 18;
    particles.material.size = 0.07 + Math.sin(elapsed * 1.6) * 0.012;

    rings.children.forEach((ring, index) => {
      ring.rotation.z = elapsed * (0.12 + index * 0.025) * (index % 2 ? -1 : 1);
      ring.position.z = -index * 5.8 + ((elapsed * 2.4 + scroll.value * 28) % 5.8);
      ring.scale.setScalar(1 + Math.sin(elapsed * 0.9 + index) * 0.045);
    });

    gate.rotation.x = elapsed * 0.28 + pointer.y * 0.5;
    gate.rotation.y = elapsed * 0.42 + pointer.x * 0.5;
    gate.material.opacity = 0.16 + Math.sin(elapsed * 1.4) * 0.06;

    camera.position.x += (pointer.x * 1.8 - camera.position.x) * 0.035;
    camera.position.y += (-pointer.y * 1.1 - camera.position.y) * 0.035;
    camera.position.z = 17.5 - scroll.value * 6.8;
    camera.lookAt(0, 0, -28);

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / window.innerWidth - 0.5;
    pointer.y = event.clientY / window.innerHeight - 0.5;
  });

  resize();
  updateScroll();
  requestAnimationFrame(animate);
}
